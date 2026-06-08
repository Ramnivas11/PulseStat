import assert from "node:assert/strict";
import test from "node:test";

import { PLANS } from "@/config/plans";
import { trackEventSchema } from "@/validations/track-event";
import { createWebsiteSchema } from "@/validations/website";

test("tracking validation accepts the SDK payload shape", () => {
  const result = trackEventSchema.safeParse({
    siteId: "site_123",
    visitorId: "visitor_123",
    sessionId: "session_123",
    path: "/pricing",
    referrer: "",
    userAgent: "Mozilla/5.0",
    language: "en-US",
    timezone: "Asia/Calcutta",
    screenWidth: 1440,
    screenHeight: 900,
    country: "Unknown",
    timestamp: "2026-06-08T10:00:00.000Z",
    lastActiveAt: "2026-06-08T10:00:00.000Z",
  });

  assert.equal(result.success, true);
});

test("tracking validation rejects malformed payloads", () => {
  const result = trackEventSchema.safeParse({
    siteId: "site_123",
    visitorId: "visitor_123",
    sessionId: "session_123",
    path: "/pricing",
    userAgent: "Mozilla/5.0",
    timestamp: "not-a-date",
  });

  assert.equal(result.success, false);
});

test("website validation catches missing domain input", () => {
  const result = createWebsiteSchema.safeParse({
    name: "Docs",
    domain: "",
  });

  assert.equal(result.success, false);
});

test("free plan limits remain enforced in configuration", () => {
  assert.equal(PLANS.free.websiteLimit, 1);
  assert.equal(PLANS.free.eventLimit, 10_000);
});
