import { z } from "zod";
import { UAParser } from "ua-parser-js";

import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { logError, logInfo, logWarn } from "@/lib/logger";
import { trackEventSchema } from "@/validations/track-event";
import {
  TrackEventPayload,
  processTrackEvent,
} from "@/features/analytics/services/analytics.service";
import { canTrackEvent } from "@/features/billing/services/billing.service";
import { getIp, redis, trackRateLimit } from "@/lib/rate-limit";

interface UTMFields {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
}


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getCorsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin");

  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const BOT_PATTERN =
  /bot|crawler|spider|crawling|wget|curl|headless|chrome-lighthouse|prerender|python-requests|httpclient/i;
const MAX_PAYLOAD_BYTES = 8_192;
const DEDUPE_TTL_SECONDS = 8;
const memoryDedupe = new Map<string, number>();

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: getCorsHeaders(req) });
}

async function resolveWebsite(siteKey: string) {
  return prisma.website.findUnique({
    where: { siteKey },
    select: { id: true, domain: true },
  });
}

function normalizeHostname(value: string) {
  try {
    const hostname = value.includes("://")
      ? new URL(value).hostname
      : new URL(`https://${value}`).hostname;
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

  // No origin/referer present — allow the event.
  // sendBeacon requests may omit the Origin header in some browsers.
  if (candidates.length === 0) return true;

  return candidates.some((candidate) => candidate === expected);
}

async function wasRecentlyTracked(
  validated: z.infer<typeof trackEventSchema>
) {
  const key = `track:dedupe:${validated.siteId}:${validated.sessionId}:${validated.path}:${Math.floor(Date.now() / (DEDUPE_TTL_SECONDS * 1000))}`;

  const checkMemoryDedupe = () => {
    const now = Date.now();
    for (const [existingKey, expiresAt] of memoryDedupe) {
      if (expiresAt <= now) memoryDedupe.delete(existingKey);
    }

    if (memoryDedupe.has(key)) return true;
    memoryDedupe.set(key, now + DEDUPE_TTL_SECONDS * 1000);
    return false;
  };

  if (redis) {
    try {
      const inserted = await redis.set(key, "1", {
        nx: true,
        ex: DEDUPE_TTL_SECONDS,
      });
      return inserted !== "OK";
    } catch (error) {
      logWarn("Redis dedupe unavailable; falling back to memory", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return checkMemoryDedupe();
    }
  }

  return checkMemoryDedupe();
}

/**
 * Extract the domain portion from a referrer URL.
 * Returns null if the referrer is empty or can't be parsed.
 */
function extractReferrerDomain(referrer?: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = referrer.includes("://")
      ? new URL(referrer)
      : new URL(`https://${referrer}`);
    return url.hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

/**
 * Extract UTM parameters from a URL path + query string.
 * Always returns a UTMFields object (null for missing params).
 */
function extractUTM(path: string, urlQuery?: string): UTMFields {
  const rawQs = urlQuery ?? (path.includes("?") ? path.split("?")[1] : "");
  const params = new URLSearchParams(rawQs ?? "");
  return {
    utmSource:   params.get("utm_source"),
    utmMedium:   params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent:  params.get("utm_content"),
    utmTerm:     params.get("utm_term"),
  };
}

/**
 * Extract visitor country from platform-injected headers.
 * Works on Cloudflare Workers, Vercel Edge, AWS CloudFront, Fly.io, Railway.
 * Falls back to client-provided value, then null.
 */
function getCountryFromRequest(req: Request, clientCountry?: string): string | null {
  const GEO_HEADERS = [
    "cf-ipcountry",            // Cloudflare
    "x-vercel-ip-country",     // Vercel
    "cloudfront-viewer-country", // AWS CloudFront
    "x-amz-cf-region",         // older CloudFront
    "eo-ipcountry",            // Tencent EdgeOne
    "x-real-ip-country",       // nginx-geoip2
  ];

  for (const header of GEO_HEADERS) {
    const value = req.headers.get(header)?.trim().toUpperCase();
    // Valid ISO 3166-1 alpha-2 country codes are 2 uppercase letters
    if (value && /^[A-Z]{2}$/.test(value) && value !== "XX" && value !== "T1") {
      return value;
    }
  }

  if (clientCountry && clientCountry.trim().length > 0) {
    return clientCountry.trim();
  }

  return null;
}


function createTrackEventPayload(
  validated: z.infer<typeof trackEventSchema>,
  websiteId: string,
  req: Request
): TrackEventPayload {
  const parser = new UAParser(validated.userAgent);
  const lastActiveAt = validated.lastActiveAt
    ? new Date(validated.lastActiveAt)
    : new Date();

  const browser = parser.getBrowser().name?.slice(0, 80) || "Unknown";
  const osName = parser.getOS().name?.slice(0, 80) || null;
  const deviceType = parser.getDevice().type || "desktop";

  // Prefer tracker-provided UTM; fallback to extracting from path
  const utm: UTMFields =
    validated.utmSource
      ? {
          utmSource: validated.utmSource,
          utmMedium:   validated.utmMedium   ?? null,
          utmCampaign: validated.utmCampaign ?? null,
          utmContent:  validated.utmContent  ?? null,
          utmTerm:     validated.utmTerm     ?? null,
        }
      : extractUTM(validated.path, validated.urlQuery);

  const referrerDomain =
    validated.referrer
      ? extractReferrerDomain(validated.referrer)
      : null;

  return {
    visitorId: validated.visitorId,
    sessionId: validated.sessionId,
    visitId: validated.visitId,
    eventType: "pageview",
    eventName: validated.eventName ?? null,
    path: validated.path,
    hostname: validated.hostname ?? null,
    urlQuery: validated.urlQuery ?? null,
    pageTitle: validated.pageTitle ?? null,
    referrer: validated.referrer ?? null,
    referrerDomain,
    browser,
    os: osName,
    device: deviceType,
    country: getCountryFromRequest(req, validated.country),
    language: validated.language ?? null,
    timezone: validated.timezone ?? null,
    screenWidth: validated.screenWidth ?? null,
    screenHeight: validated.screenHeight ?? null,
    ...utm,
    lastActiveAt,
    websiteId,
  };
}

export async function POST(req: Request) {
  const ip = getIp(req);
  const corsHeaders = getCorsHeaders(req);

  try {
    const contentLength = req.headers.get("content-length");
    if (
      contentLength &&
      Number.parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES
    ) {
      return errorResponse("Payload too large", 413, corsHeaders);
    }

    let rateLimitSuccess = true;
    try {
      const result = await trackRateLimit.limit(`track_${ip}`);
      rateLimitSuccess = result.success;
    } catch (error) {
      logWarn("Tracking rate limiter unavailable; allowing request", {
        ip,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
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
      return errorResponse(
        "Origin is not allowed for this site",
        403,
        corsHeaders
      );
    }

    if (await wasRecentlyTracked(validated.data)) {
      return successResponse({ deduped: true }, 202, corsHeaders);
    }

    const permission = await canTrackEvent(website.id);
    if (!permission.allowed) {
      logWarn("Monthly event limit reached", {
        websiteId: website.id,
        plan: permission.plan,
      });
      return errorResponse("Monthly event limit reached", 402, corsHeaders);
    }

    const eventPayload = createTrackEventPayload(validated.data, website.id, req);
    await processTrackEvent(eventPayload);

    return successResponse({ tracked: true }, 202, corsHeaders);
  } catch (error) {
    logError(error, { route: "POST /api/track", ip });
    return errorResponse("Internal server error", 500, corsHeaders);
  }
}
