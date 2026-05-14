import { z } from "zod";

const optionalCleanString = (max: number) =>
  z.string().trim().max(max).optional().transform((value) => value || undefined);

export const trackEventSchema = z.object({
  siteId: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^site_[a-f0-9-]+$/, "Invalid site key format"),

  visitorId: z.string().uuid("Invalid visitor ID"),

  sessionId: z.string().uuid("Invalid session ID"),

  path: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .startsWith("/", "Path must start with /")
    .regex(/^[^\u0000-\u001f\u007f<>]*$/, "Path contains invalid characters"),

  referrer: optionalCleanString(2000),

  userAgent: z.string().trim().min(1).max(512),

  language: optionalCleanString(20),

  timezone: optionalCleanString(100),

  screenWidth: z.number().int().positive().max(10000).optional(),

  screenHeight: z.number().int().positive().max(10000).optional(),

  country: optionalCleanString(50),

  timestamp: z.string().datetime().max(100),

  lastActiveAt: z.string().datetime().optional(),
});
