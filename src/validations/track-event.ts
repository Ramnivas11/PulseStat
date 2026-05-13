import { z } from "zod";

export const trackEventSchema = z.object({
  siteId: z.string().max(100),

  visitorId: z.string().max(100),

  sessionId: z.string().max(100),

  path: z.string().max(2000),

  referrer: z.string().max(2000).optional(),

  userAgent: z.string().max(500),

  language: z.string().max(50).optional(),

  timezone: z.string().max(100).optional(),

  screenWidth: z.number().int().positive().max(10000).optional(),

  screenHeight: z.number().int().positive().max(10000).optional(),

  country: z.string().max(50).optional(),

  timestamp: z.string().max(100),

  lastActiveAt: z.iso.datetime().optional(),
});
