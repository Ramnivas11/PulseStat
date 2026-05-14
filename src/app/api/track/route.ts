import { z } from "zod";
import { UAParser } from "ua-parser-js";

import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { trackEventSchema } from "@/validations/track-event";
import { TrackEventPayload, processTrackEvent } from "@/features/analytics/services/analytics.service";
import { canTrackEvent } from "@/features/billing/services/billing.service";
import { getIp, redis, trackRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const BOT_PATTERN = /bot|crawler|spider|crawling|wget|curl|headless|chrome-lighthouse|prerender|python-requests|httpclient/i;
const MAX_PAYLOAD_BYTES = 8_192;
const DEDUPE_TTL_SECONDS = 8;
const memoryDedupe = new Map<string, number>();

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

async function resolveWebsite(siteKey: string) {
  return prisma.website.findUnique({
    where: { siteKey },
    select: { id: true, domain: true },
  });
}

function normalizeHostname(value: string) {
  try {
    const hostname = value.includes("://") ? new URL(value).hostname : new URL(`https://${value}`).hostname;
    return hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return value.toLowerCase().replace(/^www\./, "").replace(/\/$/, "");
  }
}

function requestMatchesWebsite(req: Request, websiteDomain: string) {
  const expected = normalizeHostname(websiteDomain);
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const candidates = [origin, referer]
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizeHostname(value));

  if (candidates.length === 0) return process.env.NODE_ENV !== "production";
  return candidates.some((hostname) => hostname === expected || hostname.endsWith(`.${expected}`));
}

async function wasRecentlyTracked(validated: z.infer<typeof trackEventSchema>) {
  const key = `track:dedupe:${validated.siteId}:${validated.sessionId}:${validated.path}:${Math.floor(Date.now() / (DEDUPE_TTL_SECONDS * 1000))}`;

  if (redis) {
    const inserted = await redis.set(key, "1", { nx: true, ex: DEDUPE_TTL_SECONDS });
    return inserted !== "OK";
  }

  const now = Date.now();
  for (const [existingKey, expiresAt] of memoryDedupe) {
    if (expiresAt <= now) memoryDedupe.delete(existingKey);
  }

  if (memoryDedupe.has(key)) return true;
  memoryDedupe.set(key, now + DEDUPE_TTL_SECONDS * 1000);
  return false;
}

function createTrackEventPayload(validated: z.infer<typeof trackEventSchema>, websiteId: string): TrackEventPayload {
  const parser = new UAParser(validated.userAgent);
  const lastActiveAt = validated.lastActiveAt ? new Date(validated.lastActiveAt) : new Date();
  const browser = parser.getBrowser().name?.slice(0, 80) || "Unknown";
  const deviceType = parser.getDevice().type || "desktop";

  return {
    visitorId: validated.visitorId,
    sessionId: validated.sessionId,
    eventType: "pageview",
    path: validated.path,
    referrer: validated.referrer || null,
    browser,
    device: deviceType,
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
  const ip = getIp(req);

  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && Number.parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return errorResponse("Payload too large", 413, corsHeaders);
    }

    const { success: rateLimitSuccess } = await trackRateLimit.limit(`track_${ip}`);
    if (!rateLimitSuccess) {
      logWarn("Tracking API rate limit exceeded", { ip });
      return errorResponse("Too many requests", 429, corsHeaders);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400, corsHeaders);
    }

    const validated = trackEventSchema.safeParse(body);
    if (!validated.success) {
      logWarn("Track event validation failed", { ip });
      return validationErrorResponse(validated.error, corsHeaders);
    }

    if (BOT_PATTERN.test(validated.data.userAgent)) {
      logInfo("Bot traffic ignored", { ip });
      return successResponse({ ignored: true }, 202, corsHeaders);
    }

    const website = await resolveWebsite(validated.data.siteId);
    if (!website) {
      logWarn("Track request used invalid site key", { ip });
      return errorResponse("Invalid configuration", 404, corsHeaders);
    }

    if (!requestMatchesWebsite(req, website.domain)) {
      logWarn("Track request origin mismatch", { ip, websiteId: website.id });
      return errorResponse("Origin is not allowed for this site", 403, corsHeaders);
    }

    if (await wasRecentlyTracked(validated.data)) {
      return successResponse({ deduped: true }, 202, corsHeaders);
    }

    const permission = await canTrackEvent(website.id);
    if (!permission.allowed) {
      logWarn("Monthly event limit reached", { websiteId: website.id, plan: permission.plan });
      return errorResponse("Monthly event limit reached", 402, corsHeaders);
    }

    const eventPayload = createTrackEventPayload(validated.data, website.id);
    await processTrackEvent(eventPayload);

    return successResponse({ tracked: true }, 202, corsHeaders);
  } catch (error) {
    logError(error, { route: "POST /api/track", ip });
    return errorResponse("Internal server error", 500, corsHeaders);
  }
}
