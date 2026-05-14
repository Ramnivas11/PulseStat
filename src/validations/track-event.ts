import { z } from "zod";

export const trackEventSchema = z.object({
  siteId: z
    .string()
    .min(1)
    .max(120)
    .regex(/^site_[a-f0-9-]+$/, "Invalid site key format"),

  visitorId: z
    .string()
    .uuid("Invalid visitor ID"),

  sessionId: z
    .string()
    .uuid("Invalid session ID"),

  path: z
    .string()
    .min(1)
    .max(2000)
    .startsWith("/", "Path must start with /"),

  referrer: z.string().max(2000).optional(),

  userAgent: z.string().min(1).max(512),

  language: z.string().max(20).optional(),

  timezone: z.string().max(100).optional(),

  screenWidth: z.number().int().positive().max(10000).optional(),

  screenHeight: z.number().int().positive().max(10000).optional(),

  country: z.string().max(50).optional(),

  timestamp: z.string().max(100),

  lastActiveAt: z.string().datetime().optional(),
});
