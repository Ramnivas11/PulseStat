import { z } from "zod";
import { UAParser } from "ua-parser-js";

import { prisma } from "@/lib/prisma";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { trackEventSchema } from "@/validations/track-event";
import {
  TrackEventPayload,
  processTrackEvent,
} from "@/features/analytics/services/analytics.service";
import { canTrackEvent } from "@/features/billing/services/billing.service";
import { trackRateLimit, getIp, redis } from "@/lib/rate-limit";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

async function resolveWebsite(siteKey: string) {
  return prisma.website.findUnique({
    where: { siteKey },
    select: { id: true, domain: true },
  });
}

function createTrackEventPayload(
  validated: z.infer<typeof trackEventSchema>,
  websiteId: string
): TrackEventPayload {
  const parser = new UAParser(validated.userAgent);
  const lastActiveAt = validated.lastActiveAt
    ? new Date(validated.lastActiveAt)
    : new Date();

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
    lastActiveAt,
    websiteId,
  };
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req);

    // 1. Payload size guard (prevent large payloads)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 8192) {
      return Response.json(
        { error: "Payload too large" },
        { status: 413, headers: corsHeaders }
      );
    }

    // 2. Rate limiting
    const { success: rateLimitSuccess } = await trackRateLimit.limit(`track_${ip}`);
    if (!rateLimitSuccess) {
      logWarn("Tracking API rate limit exceeded", { ip });
      return Response.json(
        { error: "Too many requests" },
        { status: 429, headers: corsHeaders }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON body" },
        { status: 400, headers: corsHeaders }
      );
    }

    const validated = trackEventSchema.safeParse(body);
    if (!validated.success) {
      logWarn("Track event validation failed", { ip });
      return Response.json(
        { error: "Invalid payload format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Bot filtering
    const userAgent = validated.data.userAgent.toLowerCase();
    const isBot =
      /bot|crawler|spider|crawling|wget|curl|headless|chrome-lighthouse|prerender/i.test(
        userAgent
      );

    if (isBot) {
      logInfo("Bot traffic ignored", { ip });
      return Response.json({ success: true, ignored: true }, { headers: corsHeaders });
    }

    const website = await resolveWebsite(validated.data.siteId);
    if (!website) {
      logWarn("Track request used invalid site key", { ip });
      return Response.json(
        { error: "Invalid configuration" },
        { status: 404, headers: corsHeaders } // ← FIXED: was missing corsHeaders
      );
    }

    // 4. Trusted origin check
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const originHostname = originUrl.hostname.toLowerCase();
        const expectedDomain = website.domain.toLowerCase();
        
        // Allow localhost for testing, but log a warning
        const isLocalhost = originHostname === "localhost" || originHostname === "127.0.0.1";
        const isTrusted =
          isLocalhost ||
          originHostname === expectedDomain ||
          originHostname.endsWith(`.${expectedDomain}`);

        if (!isTrusted) {
          logWarn("Origin domain mismatch - Tracking Blocked", { 
            originHostname, 
            expectedDomain, 
            ip,
            siteId: validated.data.siteId 
          });
          return Response.json(
            { error: "Unauthorized origin" },
            { status: 403, headers: corsHeaders }
          );
        }

        if (isLocalhost) {
          logInfo("Tracking allowed for localhost/testing origin", { originHostname, ip });
        }
      } catch {
        logWarn("Malformed origin header", { origin, ip });
      }
    } else {
      logInfo("No origin/referer header found, proceeding with tracking", { ip });
    }

    // 5. Deduplication (10-second window)
    const dedupKey = `dedup:${website.id}:${validated.data.visitorId}:${validated.data.path}`;
    const isNewEvent = await redis.set(dedupKey, "1", { ex: 10, nx: true });

    if (!isNewEvent) {
      logInfo("Duplicate rapid event ignored", { ip });
      return Response.json({ success: true, ignored: true }, { headers: corsHeaders });
    }

    // 6. Billing limit check
    const permission = await canTrackEvent(website.id);
    if (!permission.allowed) {
      logWarn("Event limit reached — tracking blocked", {
        usage: permission.currentUsage,
        limit: permission.limit,
        plan: permission.plan,
      });
      return Response.json(
        { error: "Monthly event limit reached." },
        { status: 429, headers: corsHeaders }
      );
    }

    const eventPayload = createTrackEventPayload(validated.data, website.id);
    await processTrackEvent(eventPayload);

    logInfo("Track event processed", { path: validated.data.path });

    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    logError(error, { route: "/api/track" });
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
