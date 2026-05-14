import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimiterLike {
  limit(identifier: string): Promise<LimitResult>;
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

class InMemorySlidingWindow implements RateLimiterLike {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
    private readonly prefix: string
  ) {}

  async limit(identifier: string): Promise<LimitResult> {
    const now = Date.now();
    const key = `${this.prefix}:${identifier}`;
    const cutoff = now - this.windowMs;
    const recentHits = (this.hits.get(key) ?? []).filter((hit) => hit > cutoff);
    const success = recentHits.length < this.maxRequests;

    if (success) {
      recentHits.push(now);
    }

    if (recentHits.length === 0) {
      this.hits.delete(key);
    } else {
      this.hits.set(key, recentHits);
    }

    return {
      success,
      limit: this.maxRequests,
      remaining: Math.max(0, this.maxRequests - recentHits.length),
      reset: now + this.windowMs,
    };
  }
}

function createRateLimiter(maxRequests: number, window: `${number} ${"s" | "m" | "h"}`, prefix: string): RateLimiterLike {
  if (!redis) {
    const [, unit] = window.split(" ") as [string, "s" | "m" | "h"];
    const amount = Number.parseInt(window, 10);
    const multiplier = unit === "h" ? 3_600_000 : unit === "m" ? 60_000 : 1_000;
    return new InMemorySlidingWindow(maxRequests, amount * multiplier, prefix);
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, window),
    analytics: true,
    prefix,
  });
}

export const trackRateLimit = createRateLimiter(120, "1 m", "@pulsestat/ratelimit/track");
export const authRateLimit = createRateLimiter(10, "1 m", "@pulsestat/ratelimit/auth");

export function getIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
