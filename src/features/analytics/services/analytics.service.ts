import { prisma } from "@/lib/prisma";

export const ACTIVE_VISITOR_WINDOW_SECONDS = 30;

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

export function getEventDay(date: Date) {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}

export async function createRawEvent(data: TrackEventPayload) {
  return prisma.event.create({
    data,
  });
}
export async function getDashboardStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DashboardStats> {
  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  // OPTIMIZED: Single aggregate query with all three fields
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
  websiteId: string
): Promise<TopPage[]> {
  return prisma.pageStat.findMany({
    where: { websiteId },
    orderBy: { views: "desc" },
    take: 10,
    select: {
      path: true,
      views: true,
    },
  });
}

export async function getBrowserStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<BrowserStat[]> {
  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

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
  const normalized = value.toLowerCase();

  if (normalized.includes("mobile")) return "Mobile";
  if (normalized.includes("tablet")) return "Tablet";
  if (normalized.includes("desktop")) return "Desktop";

  return "Other";
}

export async function getDeviceStats(
  websiteId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DeviceStat[]> {
  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

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
  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const stats = await prisma.dailyStat.findMany({
    where: { websiteId, ...(dateFilter ? { date: dateFilter } : {}) },
    orderBy: { date: "asc" },
    select: {
      date: true,
      pageviews: true,
      visitors: true,
      sessions: true,
    },
  });

  return stats.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    pageviews: row.pageviews,
    visitors: row.visitors,
    sessions: row.sessions,
  }));
}

export async function getActiveVisitors(websiteId: string) {
  const activeSince = new Date(
    Date.now() - ACTIVE_VISITOR_WINDOW_SECONDS * 1000
  );

  // OPTIMIZED: Use COUNT(DISTINCT) via raw query instead of groupBy
  // This is more efficient for large event tables and utilizes the index on (websiteId, lastActiveAt)
  const result = await prisma.$queryRawUnsafe<[{ count: number }]>(
    `SELECT COUNT(DISTINCT "visitorId") as count FROM "Event" 
     WHERE "websiteId" = $1 AND "lastActiveAt" >= $2`,
    websiteId,
    activeSince
  );

  return result[0]?.count ?? 0;
}

export async function updatePageStats(websiteId: string, path: string) {
  return prisma.pageStat.upsert({
    where: {
      websiteId_path: {
        websiteId,
        path,
      },
    },
    create: {
      websiteId,
      path,
      views: 1,
    },
    update: {
      views: {
        increment: 1,
      },
    },
  });
}

export async function processTrackEvent(event: TrackEventPayload) {
  const eventDay = getEventDay(event.lastActiveAt);

  return prisma.$transaction(async (tx) => {
    const [dailyVisitor, dailySession] = await Promise.all([
      tx.dailyVisitor.createMany({
        data: {
          websiteId: event.websiteId,
          date: eventDay,
          visitorId: event.visitorId,
        },
        skipDuplicates: true,
      }),
      tx.dailySession.createMany({
        data: {
          websiteId: event.websiteId,
          date: eventDay,
          sessionId: event.sessionId,
        },
        skipDuplicates: true,
      }),
    ]);

    await tx.event.create({
      data: event,
    });

    await tx.dailyStat.upsert({
      where: {
        websiteId_date: {
          websiteId: event.websiteId,
          date: eventDay,
        },
      },
      create: {
        websiteId: event.websiteId,
        date: eventDay,
        pageviews: 1,
        visitors: dailyVisitor.count,
        sessions: dailySession.count,
      },
      update: {
        pageviews: {
          increment: 1,
        },
        visitors: {
          increment: dailyVisitor.count,
        },
        sessions: {
          increment: dailySession.count,
        },
      },
    });

    return tx.pageStat.upsert({
      where: {
        websiteId_path: {
          websiteId: event.websiteId,
          path: event.path,
        },
      },
      create: {
        websiteId: event.websiteId,
        path: event.path,
        views: 1,
      },
      update: {
        views: {
          increment: 1,
        },
      },
    });
  });
}
