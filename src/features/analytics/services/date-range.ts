export type AnalyticsRange = "all" | "7d" | "30d";

export function normalizeAnalyticsRange(value: string | null | undefined): AnalyticsRange {
  return value === "7d" || value === "30d" ? value : "all";
}

export function getAnalyticsDateRange(range: AnalyticsRange) {
  if (range === "all") return { startDate: undefined, endDate: undefined };

  const days = range === "7d" ? 6 : 29;
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - days);
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  return { startDate, endDate };
}
