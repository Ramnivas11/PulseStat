import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Export the Redis instance for caching/deduplication logic
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter for tracking events (e.g., 100 requests per minute per IP)
export const trackRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/track",
});

// Rate limiter for authentication APIs (e.g., 10 requests per minute per IP)
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/auth",
});

/**
 * Extracts the client IP from the request headers in a serverless environment.
 */
export function getIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}