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

export { getIp } from "./ip-utils";