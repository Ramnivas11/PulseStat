import { z } from "zod";
import { UAParser } from "ua-parser-js";

import { prisma } from "@/lib/prisma";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { trackEventSchema } from "@/lib/validations/track-event";
import {
  TrackEventPayload,
  processTrackEvent,
} from "@/services/analytics.service";

export const runtime = "nodejs";

async function resolveWebsiteId(siteKey: string) {
  const website = await prisma.website.findUnique({
    where: {
      siteKey,
    },
    select: {
      id: true,
    },
  });

  return website?.id ?? null;
}

function createTrackEventPayload(
  validated: z.infer<typeof trackEventSchema>,
  websiteId: string
): TrackEventPayload {
  const parser = new UAParser(validated.userAgent);

  return {
    visitorId: validated.visitorId,
    sessionId: validated.sessionId,
    eventType: "pageview",
    path: validated.path,
    referrer: validated.referrer || null,
    browser: parser.getBrowser().name || "Unknown",
    device: parser.getDevice().type || "desktop",
    country: validated.country || "Unknown",
    language: validated.language || null,
    timezone: validated.timezone || null,
    screenWidth: validated.screenWidth ?? null,
    screenHeight: validated.screenHeight ?? null,
    websiteId,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = trackEventSchema.safeParse(body);
    if (!validated.success) {
      logWarn("Track event validation failed", {
        errors: validated.error.flatten(),
      });

      return Response.json(
        { error: validated.error.flatten() },
        { status: 400 }
      );
    }

    const websiteId = await resolveWebsiteId(validated.data.siteId);
    if (!websiteId) {
      logWarn("Track request used invalid site key", {
        siteId: validated.data.siteId,
      });

      return Response.json(
        { error: "Invalid site ID" },
        { status: 404 }
      );
    }

    const eventPayload = createTrackEventPayload(
      validated.data,
      websiteId
    );

    await processTrackEvent(eventPayload);

    logInfo("Track event processed", {
      siteId: validated.data.siteId,
      path: validated.data.path,
    });

    return Response.json({ success: true });
  } catch (error) {
    logError(error, { route: "/api/track" });

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}