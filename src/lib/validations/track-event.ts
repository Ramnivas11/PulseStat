import { z } from "zod";

export const trackEventSchema = z.object({
  siteId: z.string(),

  visitorId: z.string(),

  sessionId: z.string(),

  path: z.string(),

  referrer: z.string().optional(),

  userAgent: z.string(),

  language: z.string().optional(),

  timezone: z.string().optional(),

  screenWidth: z.number().int().positive().optional(),

  screenHeight: z.number().int().positive().optional(),

  country: z.string().optional(),

  timestamp: z.string(),
});