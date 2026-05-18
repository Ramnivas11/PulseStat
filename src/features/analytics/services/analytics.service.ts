import { prisma } from "@/lib/prisma";
// Prisma types are available after `prisma generate` (runs via postinstall)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaTransactionClient = any;
type DailyStatRow = { date: Date; pageviews: number; visitors: number; sessions: number };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardStats {
  pageviews: number;
  visitors: number;
  sessions: number;
  bounces: number;
  bounceRate: number;
  avgDuration?: number; // avg session duration in seconds (optional, computed separately)
}

export interface TopPage {
  path: string;
  views: number;
}

export interface MetricItem {
  label: string;
  count: number;
}

export interface DailyStatPoint {
  date: string;
  pageviews: number;
  visitors: number;
  sessions: number;
}

export interface TrackEventPayload {
  visitorId: string;
  sessionId: string;
  visitId?: string;
  eventType: string;
  eventName: string | null;
  path: string;
  hostname: string | null;
  urlQuery: string | null;
  pageTitle: string | null;
  referrer: string | null;
  referrerDomain: string | null;
  browser: string;
  os: string | null;
  device: string;
  country: string | null;
  language: string | null;
  timezone: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  lastActiveAt: Date;
  websiteId: string;
}

// ---------------------------------------------------------------------------
// Dashboard summary stats
// ---------------------------------------------------------------------------

export async function getDashboardStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DashboardStats> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const result = await prisma.dailyStat.aggregate({
    where: { websiteId, ...(dateFilter ? { date: dateFilter } : {}) },
    _sum: { pageviews: true, visitors: true, sessions: true, bounces: true },
  });

  const pageviews = result._sum.pageviews ?? 0;
  const visitors = result._sum.visitors ?? 0;
  const sessions = result._sum.sessions ?? 0;
  const bounces = result._sum.bounces ?? 0;
  const bounceRate = sessions > 0 ? Math.round((bounces / sessions) * 100) : 0;

  return { pageviews, visitors, sessions, bounces, bounceRate };
}

// ---------------------------------------------------------------------------
// Time-series data
// ---------------------------------------------------------------------------

export async function getDailyStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DailyStatPoint[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const rows = await prisma.dailyStat.findMany({
    where: { websiteId, ...(dateFilter ? { date: dateFilter } : {}) },
    orderBy: { date: "asc" },
    select: { date: true, pageviews: true, visitors: true, sessions: true },
  });

  const statsMap = new Map<string, DailyStatRow>(
    rows.map((r: DailyStatRow) => [r.date.toISOString().slice(0, 10), r])
  );

  if (!startDate || !endDate) {
    return rows.map((r: DailyStatRow) => ({
      date: r.date.toISOString().slice(0, 10),
      pageviews: r.pageviews,
      visitors: r.visitors,
      sessions: r.sessions,
    }));
  }

  const results: DailyStatPoint[] = [];
  const cur = new Date(startDate);
  cur.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (cur <= end) {
    const dateStr = cur.toISOString().slice(0, 10);
    const existing = statsMap.get(dateStr);
    results.push(
      existing
        ? { date: dateStr, pageviews: existing.pageviews, visitors: existing.visitors, sessions: existing.sessions }
        : { date: dateStr, pageviews: 0, visitors: 0, sessions: 0 }
    );
    cur.setDate(cur.getDate() + 1);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Top pages
// ---------------------------------------------------------------------------

export async function getTopPages(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<TopPage[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  if (!dateFilter) {
    return prisma.pageStat.findMany({
      where: { websiteId },
      orderBy: { views: "desc" },
      take: 10,
      select: { path: true, views: true },
    });
  }

  const rows = await prisma.event.groupBy({
    by: ["path"],
    where: { websiteId, createdAt: dateFilter },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  return rows.map((r: { path: string; _count: { id: number } }) => ({ path: r.path, views: r._count.id }));
}

// ---------------------------------------------------------------------------
// Generic metric breakdown (Umami "metrics" pattern)
// ---------------------------------------------------------------------------

export type MetricField =
  | "browser"
  | "device"
  | "os"
  | "country"
  | "language"
  | "referrerDomain"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "hostname";

export async function getMetrics(
  websiteId: string,
  field: MetricField,
  startDate?: Date,
  endDate?: Date,
  limit = 10
): Promise<MetricItem[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const where: Record<string, unknown> = {
    websiteId,
    ...(dateFilter ? { createdAt: dateFilter } : {}),
    NOT: { [field]: null },
  };

  // groupBy requires the field key to be in the `by` array; use dynamic cast
  const rows = await (prisma.event.groupBy as (args: unknown) => Promise<Array<Record<string, unknown>>>)({
    by: [field],
    where,
    _count: { id: true },
    orderBy: [{ _count: { id: "desc" } }],
    take: limit,
  });

  return rows.map((row) => ({
    label: String(row[field] ?? "Unknown"),
    count: (row["_count"] as { id: number }).id,
  }));
}

// Convenience wrappers

export async function getBrowserStats(websiteId: string, startDate?: Date, endDate?: Date) {
  const items = await getMetrics(websiteId, "browser", startDate, endDate);
  return items.map((i) => ({ browser: i.label || "Unknown", count: i.count }));
}

export async function getOSStats(websiteId: string, startDate?: Date, endDate?: Date) {
  return getMetrics(websiteId, "os", startDate, endDate);
}

export async function getCountryStats(websiteId: string, startDate?: Date, endDate?: Date) {
  return getMetrics(websiteId, "country", startDate, endDate);
}

export async function getReferrerStats(websiteId: string, startDate?: Date, endDate?: Date) {
  return getMetrics(websiteId, "referrerDomain", startDate, endDate);
}

export async function getLanguageStats(websiteId: string, startDate?: Date, endDate?: Date) {
  return getMetrics(websiteId, "language", startDate, endDate);
}

export async function getUTMStats(
  websiteId: string,
  utm: "utmSource" | "utmMedium" | "utmCampaign",
  startDate?: Date,
  endDate?: Date
) {
  return getMetrics(websiteId, utm, startDate, endDate);
}

function normalizeDevice(value: string | null): string {
  if (!value) return "Desktop";
  const n = value.toLowerCase();
  if (n.includes("mobile")) return "Mobile";
  if (n.includes("tablet")) return "Tablet";
  return "Desktop";
}

export async function getDeviceStats(websiteId: string, startDate?: Date, endDate?: Date) {
  const items = await getMetrics(websiteId, "device", startDate, endDate, 20);
  const totals: Record<string, number> = {};
  for (const item of items) {
    const device = normalizeDevice(item.label);
    totals[device] = (totals[device] ?? 0) + item.count;
  }
  return Object.entries(totals)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Active visitors
// ---------------------------------------------------------------------------

export async function getActiveVisitors(websiteId: string): Promise<number> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const rows = await prisma.event.groupBy({
    by: ["sessionId"],
    where: {
      websiteId,
      OR: [
        { lastActiveAt: { gte: fiveMinutesAgo } },
        { lastActiveAt: null, createdAt: { gte: fiveMinutesAgo } },
      ],
    },
  });
  return rows.length;
}

// ---------------------------------------------------------------------------
// Realtime feed (Umami-style: last 30 min)
// ---------------------------------------------------------------------------

export interface RealtimeEvent {
  sessionId: string;
  path: string;
  referrerDomain: string | null;
  country: string | null;
  eventName: string | null;
  createdAt: string;
}

export interface RealtimeSummary {
  activeVisitors: number;
  recentEvents: RealtimeEvent[];
  topPaths: { path: string; count: number }[];
  topReferrers: { domain: string; count: number }[];
  topCountries: { country: string; count: number }[];
  totals: { pageviews: number; visitors: number };
}

export async function getRealtimeData(websiteId: string): Promise<RealtimeSummary> {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const [events, activeSessions] = await Promise.all([
    prisma.event.findMany({
      where: { websiteId, createdAt: { gte: thirtyMinutesAgo } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        sessionId: true, path: true, referrerDomain: true,
        country: true, eventName: true, createdAt: true,
      },
    }),
    prisma.event.groupBy({
      by: ["sessionId"],
      where: {
        websiteId,
        OR: [
          { lastActiveAt: { gte: fiveMinutesAgo } },
          { lastActiveAt: null, createdAt: { gte: fiveMinutesAgo } },
        ],
      },
    }),
  ]);

  const pathCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const uniqueSessions = new Set<string>();

  for (const ev of events) {
    uniqueSessions.add(ev.sessionId);
    pathCounts[ev.path] = (pathCounts[ev.path] ?? 0) + 1;
    if (ev.referrerDomain) referrerCounts[ev.referrerDomain] = (referrerCounts[ev.referrerDomain] ?? 0) + 1;
    if (ev.country) countryCounts[ev.country] = (countryCounts[ev.country] ?? 0) + 1;
  }

  const sort = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]);

  return {
    activeVisitors: activeSessions.length,
    recentEvents: events.map((e: {
      sessionId: string; path: string; referrerDomain: string | null;
      country: string | null; eventName: string | null; createdAt: Date;
    }) => ({ ...e, createdAt: e.createdAt.toISOString() })),
    topPaths: sort(pathCounts).slice(0, 10).map(([path, count]) => ({ path, count })),
    topReferrers: sort(referrerCounts).slice(0, 10).map(([domain, count]) => ({ domain, count })),
    topCountries: sort(countryCounts).slice(0, 10).map(([country, count]) => ({ country, count })),
    totals: { pageviews: events.length, visitors: uniqueSessions.size },
  };
}

// ---------------------------------------------------------------------------
// Event ingestion
// ---------------------------------------------------------------------------

export async function processTrackEvent(event: TrackEventPayload): Promise<void> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.$transaction(async (tx: PrismaTransactionClient) => {
    const [existingVisitor, existingSession] = await Promise.all([
      tx.event.findFirst({
        where: { websiteId: event.websiteId, visitorId: event.visitorId, createdAt: { gte: today } },
        select: { id: true },
      }),
      tx.event.findFirst({
        where: { websiteId: event.websiteId, sessionId: event.sessionId, createdAt: { gte: today } },
        select: { id: true },
      }),
    ]);

    const isNewVisitor = !existingVisitor;
    const isNewSession = !existingSession;

    // A session stops being a bounce the moment it records its 2nd event
    const wasSingleEventSession =
      !isNewSession &&
      (await tx.event.count({
        where: { websiteId: event.websiteId, sessionId: event.sessionId, createdAt: { gte: today } },
      })) === 1;

    await tx.event.create({ data: event });

    await tx.dailyStat.upsert({
      where: { websiteId_date: { websiteId: event.websiteId, date: today } },
      create: {
        websiteId: event.websiteId,
        date: today,
        pageviews: 1,
        visitors: isNewVisitor ? 1 : 0,
        sessions: isNewSession ? 1 : 0,
        bounces: isNewSession ? 1 : 0,
      },
      update: {
        pageviews: { increment: 1 },
        ...(isNewVisitor && { visitors: { increment: 1 } }),
        ...(isNewSession && { sessions: { increment: 1 }, bounces: { increment: 1 } }),
        ...(wasSingleEventSession && { bounces: { decrement: 1 } }),
      },
    });

    await tx.pageStat.upsert({
      where: { websiteId_path: { websiteId: event.websiteId, path: event.path } },
      create: { websiteId: event.websiteId, path: event.path, views: 1 },
      update: { views: { increment: 1 } },
    });
  });
}

// ---------------------------------------------------------------------------
// Average session duration (Umami: totaltime)
// ---------------------------------------------------------------------------

/**
 * Computes average session duration in seconds.
 * Uses the span between first and last event per session (same approach as Umami's totaltime).
 * Sessions with only one event (bounces) contribute 0 seconds.
 */
export async function getAvgSessionDuration(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  // Get all sessions with their min/max event time
  const sessions = await (prisma.event.groupBy as (args: unknown) => Promise<Array<Record<string, unknown>>>)({
    by: ["sessionId"],
    where: { websiteId, ...(dateFilter ? { createdAt: dateFilter } : {}) },
    _min: { createdAt: true },
    _max: { createdAt: true },
  });

  if (sessions.length === 0) return 0;

  let totalSeconds = 0;
  for (const s of sessions) {
    const minTime = (s["_min"] as { createdAt: Date | null }).createdAt;
    const maxTime = (s["_max"] as { createdAt: Date | null }).createdAt;
    if (minTime && maxTime) {
      totalSeconds += (maxTime.getTime() - minTime.getTime()) / 1000;
    }
  }

  return Math.round(totalSeconds / sessions.length);
}


// ---------------------------------------------------------------------------
// Custom events breakdown (Umami: Events panel)
// ---------------------------------------------------------------------------

export async function getCustomEvents(
  websiteId: string,
  startDate?: Date,
  endDate?: Date,
  limit = 20
): Promise<MetricItem[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const rows = await (prisma.event.groupBy as (args: unknown) => Promise<Array<Record<string, unknown>>>)({
    by: ["eventName"],
    where: {
      websiteId,
      ...(dateFilter ? { createdAt: dateFilter } : {}),
      NOT: { eventName: null },
    },
    _count: { id: true },
    orderBy: [{ _count: { id: "desc" } }],
    take: limit,
  });

  return rows.map((row) => ({
    label: String(row["eventName"] ?? ""),
    count: (row["_count"] as { id: number }).id,
  }));
}
