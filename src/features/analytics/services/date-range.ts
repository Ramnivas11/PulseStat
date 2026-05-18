export type AnalyticsRange = "24h" | "7d" | "30d" | "90d" | "6mo" | "1y" | "all";

export const RANGE_LABELS: Record<AnalyticsRange, string> = {
  "24h": "Last 24 hours",
  "7d":  "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "6mo": "Last 6 months",
  "1y":  "Last year",
  "all": "All time",
};

const VALID_RANGES = new Set<string>(["24h", "7d", "30d", "90d", "6mo", "1y", "all"]);

export function normalizeAnalyticsRange(value: string | null | undefined): AnalyticsRange {
  if (value && VALID_RANGES.has(value)) return value as AnalyticsRange;
  return "30d";
}

export function getAnalyticsDateRange(range: AnalyticsRange) {
  if (range === "all") return { startDate: undefined, endDate: undefined };

  const now = new Date();

  // End: end of today in UTC
  const endDate = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    23, 59, 59, 999
  ));

  // Start: UTC midnight N days/months ago
  const startDate = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    0, 0, 0, 0
  ));

  switch (range) {
    case "24h":
      startDate.setTime(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      startDate.setUTCDate(startDate.getUTCDate() - 6);
      break;
    case "30d":
      startDate.setUTCDate(startDate.getUTCDate() - 29);
      break;
    case "90d":
      startDate.setUTCDate(startDate.getUTCDate() - 89);
      break;
    case "6mo":
      startDate.setUTCMonth(startDate.getUTCMonth() - 6);
      break;
    case "1y":
      startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);
      break;
  }

  return { startDate, endDate };
}
