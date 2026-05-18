import { z } from "zod";

const optionalCleanString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

export const trackEventSchema = z.object({
  siteId: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^site_[A-Za-z0-9_-]+$/, "Invalid site key format"),

  visitorId: z.string().uuid("Invalid visitor ID"),

  sessionId: z.string().uuid("Invalid session ID"),

  // Optional visit ID for bounce detection
  visitId: z.string().uuid().optional(),

  path: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .startsWith("/", "Path must start with /")
    .regex(/^[^\u0000-\u001f\u007f<>]*$/, "Path contains invalid characters"),

  hostname: optionalCleanString(100),

  urlQuery: optionalCleanString(2000),

  pageTitle: optionalCleanString(500),

  referrer: optionalCleanString(2000),

  // Custom event name (null = pageview)
  eventName: optionalCleanString(50),

  userAgent: z.string().trim().min(1).max(512),

  language: optionalCleanString(20),

  timezone: optionalCleanString(100),

  screenWidth: z.number().int().positive().max(10000).optional(),

  screenHeight: z.number().int().positive().max(10000).optional(),

  country: optionalCleanString(50),

  // UTM attribution params
  utmSource: optionalCleanString(255),
  utmMedium: optionalCleanString(255),
  utmCampaign: optionalCleanString(255),
  utmContent: optionalCleanString(255),
  utmTerm: optionalCleanString(255),

  timestamp: z.string().datetime().max(100),

  lastActiveAt: z.string().datetime().optional(),
});
