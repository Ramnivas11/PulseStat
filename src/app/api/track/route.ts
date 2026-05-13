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
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

async function resolveWebsite(siteKey: string) {
  return prisma.website.findUnique({
    where: {
      siteKey,
    },
    select: {
      id: true,
      domain: true,
    },
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

    // 1. Rate Limiting Protection (IP-based)
    const { success: rateLimitSuccess } = await trackRateLimit.limit(`track_${ip}`);
    if (!rateLimitSuccess) {
      logWarn("Tracking API rate limit exceeded", { ip });
      return Response.json({ error: "Too many requests" }, { status: 429, headers: corsHeaders });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: corsHeaders });
      }
    }

    const validated = trackEventSchema.safeParse(body);
    if (!validated.success) {
      logWarn("Track event validation failed", {
        // Only log structural issues, don't echo full payload back to prevent log injection
        ip,
      });

      // Generic error to avoid exposing internals
      return Response.json(
        { error: "Invalid payload format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Bot Filtering (Lightweight regex on User-Agent)
    const userAgent = validated.data.userAgent.toLowerCase();
    const isBot = /bot|crawler|spider|crawling|wget|curl|headless|chrome-lighthouse/i.test(userAgent);
    
    if (isBot) {
      logInfo("Bot traffic ignored", { userAgent: validated.data.userAgent, ip });
      // Return 200 to satisfy the client but silently drop the tracking data
      return Response.json({ success: true, ignored: true }); 
    }

    const website = await resolveWebsite(validated.data.siteId);
    if (!website) {
      logWarn("Track request used invalid site key", {
        siteId: validated.data.siteId,
        ip,
      });

      return Response.json(
        { error: "Invalid configuration" }, // Generic message
        { status: 404 }
      );
    }

    // 3. Trusted Domain Validation
    // Ensures requests are coming from the registered website domain (or its subdomains)
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    if (origin) {
      try {
        const originUrl = new URL(origin);
        const originHostname = originUrl.hostname.toLowerCase();
        const expectedDomain = website.domain.toLowerCase();
        
        // Allow exact matches or subdomains (e.g. www.)
        const isTrusted = originHostname === expectedDomain || originHostname.endsWith(`.${expectedDomain}`);
        
        if (!isTrusted) {
          logWarn("Origin domain mismatch", { originHostname, expectedDomain, ip });
          return Response.json({ error: "Unauthorized origin" }, { status: 403, headers: corsHeaders });
        }
      } catch (_e) {
        // If origin/referer is malformed, we might want to log it
        logWarn("Malformed origin header", { origin, ip });
      }
    }

    // 4. Event Deduplication (Spam / Rapid Refresh protection)
    // Keys expire in 10 seconds. NX ensures we only proceed if the key was freshly set.
    const dedupKey = `dedup:${website.id}:${validated.data.visitorId}:${validated.data.path}`;
    const isNewEvent = await redis.set(dedupKey, "1", { ex: 10, nx: true });
    
    if (!isNewEvent) {
      logInfo("Duplicate rapid event ignored", { 
        visitorId: validated.data.visitorId, 
        path: validated.data.path 
      });
      return Response.json({ success: true, ignored: true }); 
    }

    // 5. Event Limit Enforcement (Billing limits)
    const permission = await canTrackEvent(website.id);

    if (!permission.allowed) {
      logWarn("Event limit reached — tracking blocked", {
        siteId: validated.data.siteId,
        usage: permission.currentUsage,
        limit: permission.limit,
        plan: permission.plan,
      });

      return Response.json(
        {
          error: "Monthly event limit reached.",
        },
        { status: 429 }
      );
    }

    const eventPayload = createTrackEventPayload(
      validated.data,
      website.id
    );

    await processTrackEvent(eventPayload);

    logInfo("Track event processed", {
      siteId: validated.data.siteId,
      path: validated.data.path,
    });

    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    logError(error, { route: "/api/track" });

    // Generic error message, no stack traces exposed
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
