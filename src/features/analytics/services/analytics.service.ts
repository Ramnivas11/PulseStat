import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  pageviews: number;
  visitors: number;
  sessions: number;
}

export interface TopPage {
  path: string;
  views: number;
}

export interface BrowserStat {
  browser: string;
  count: number;
}

export interface DeviceStat {
  device: string;
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
  eventType: string;
  path: string;
  referrer: string | null;
  browser: string;
  device: string;
  country: string | null;
  language: string | null;
  timezone: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  lastActiveAt: Date;
  websiteId: string;
}

export async function getDashboardStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DashboardStats> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const result = await prisma.dailyStat.aggregate({
    where: { websiteId, ...(dateFilter ? { date: dateFilter } : {}) },
    _sum: { pageviews: true, visitors: true, sessions: true },
  });

  return {
    pageviews: result._sum.pageviews ?? 0,
    visitors: result._sum.visitors ?? 0,
    sessions: result._sum.sessions ?? 0,
  };
}

export async function getTopPages(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<TopPage[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  // If no date filter, we can use the optimized PageStat table
  if (!dateFilter) {
    return prisma.pageStat.findMany({
      where: { websiteId },
      orderBy: { views: "desc" },
      take: 10,
      select: { path: true, views: true },
    });
  }

  // If date filter is present, we must query individual events
  const results = await prisma.event.groupBy({
    by: ["path"],
    where: { websiteId, createdAt: dateFilter },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  return results.map((item) => ({
    path: item.path,
    views: item._count.id,
  }));
}

export async function getBrowserStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<BrowserStat[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const results = await prisma.event.groupBy({
    by: ["browser"],
    where: { websiteId, ...(dateFilter ? { createdAt: dateFilter } : {}) },
    _count: { id: true },
    orderBy: [{ _count: { id: "desc" } }],
    take: 10,
  });

  return results.map((item) => ({
    browser: item.browser || "Unknown",
    count: item._count.id,
  }));
}

function normalizeDevice(value: string | null) {
  if (!value) return "Unknown";
  const n = value.toLowerCase();
  if (n.includes("mobile")) return "Mobile";
  if (n.includes("tablet")) return "Tablet";
  if (n.includes("desktop") || n === "desktop") return "Desktop";
  return "Desktop"; // ua-parser returns empty string for desktop
}

export async function getDeviceStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DeviceStat[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const results = await prisma.event.groupBy({
    by: ["device"],
    where: { websiteId, ...(dateFilter ? { createdAt: dateFilter } : {}) },
    _count: { id: true },
    orderBy: [{ _count: { id: "desc" } }],
  });

  const totals = results.reduce<Record<string, number>>((acc, item) => {
    const device = normalizeDevice(item.device);
    acc[device] = (acc[device] ?? 0) + item._count.id;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getDailyStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DailyStatPoint[]> {
  const dateFilter =
    startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const stats = await prisma.dailyStat.findMany({
    where: { websiteId, ...(dateFilter ? { date: dateFilter } : {}) },
    orderBy: { date: "asc" },
    select: { date: true, pageviews: true, visitors: true, sessions: true },
  });

  const statsMap = new Map(
    stats.map((s) => [s.date.toISOString().slice(0, 10), s])
  );

  // If no date range provided, just return existing stats
  if (!startDate || !endDate) {
    return stats.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      pageviews: row.pageviews,
      visitors: row.visitors,
      sessions: row.sessions,
    }));
  }

  // Fill in gaps
  const results: DailyStatPoint[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10);
    const existing = statsMap.get(dateStr);

    if (existing) {
      results.push({
        date: dateStr,
        pageviews: existing.pageviews,
        visitors: existing.visitors,
        sessions: existing.sessions,
      });
    } else {
      results.push({
        date: dateStr,
        pageviews: 0,
        visitors: 0,
        sessions: 0,
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return results;
}

export async function getActiveVisitors(websiteId: string) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const activeSessions = await prisma.event.groupBy({
    by: ["sessionId"],
    where: {
      websiteId,
      createdAt: { gte: fiveMinutesAgo },
    },
  });

  return activeSessions.length;
}

/**
 * Process a tracked page-view event.
 *
 * Correctly increments unique visitor and session counts per calendar day
 * by checking whether this visitorId / sessionId already has a record today
 * BEFORE creating the new event (within the same transaction).
 */
export async function processTrackEvent(event: TrackEventPayload) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return prisma.$transaction(async (tx) => {
    // Determine uniqueness BEFORE inserting the new event
    const [existingVisitor, existingSession] = await Promise.all([
      tx.event.findFirst({
        where: {
          websiteId: event.websiteId,
          visitorId: event.visitorId,
          createdAt: { gte: today },
        },
        select: { id: true },
      }),
      tx.event.findFirst({
        where: {
          websiteId: event.websiteId,
          sessionId: event.sessionId,
          createdAt: { gte: today },
        },
        select: { id: true },
      }),
    ]);

    const isNewVisitor = !existingVisitor;
    const isNewSession = !existingSession;

    // Insert raw event
    await tx.event.create({ data: event });

    // Update daily aggregate correctly
    await tx.dailyStat.upsert({
      where: { websiteId_date: { websiteId: event.websiteId, date: today } },
      create: {
        websiteId: event.websiteId,
        date: today,
        pageviews: 1,
        visitors: isNewVisitor ? 1 : 0,
        sessions: isNewSession ? 1 : 0,
      },
      update: {
        pageviews: { increment: 1 },
        ...(isNewVisitor && { visitors: { increment: 1 } }),
        ...(isNewSession && { sessions: { increment: 1 } }),
      },
    });

    // Update per-page aggregates
    return tx.pageStat.upsert({
      where: { websiteId_path: { websiteId: event.websiteId, path: event.path } },
      create: { websiteId: event.websiteId, path: event.path, views: 1 },
      update: { views: { increment: 1 } },
    });
  });
}
