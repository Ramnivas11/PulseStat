import assert from "node:assert/strict";
import test from "node:test";

import { getEventDay } from "@/features/analytics/services/analytics.service";

test("buckets analytics events by UTC day", () => {
  const day = getEventDay(new Date("2026-06-08T23:59:59.000Z"));

  assert.equal(day.toISOString(), "2026-06-08T00:00:00.000Z");
});
