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
  websiteId: string;
}

export async function createRawEvent(data: TrackEventPayload) {
  return prisma.event.create({
    data,
  });
}
export async function getDashboardStats(
  websiteId: string
): Promise<DashboardStats> {
  const [pageviewsResult, visitorsResult, sessionsResult] =
    await Promise.all([
      prisma.dailyStat.aggregate({
        where: { websiteId },
        _sum: { pageviews: true },
      }),
      prisma.dailyStat.aggregate({
        where: { websiteId },
        _sum: { visitors: true },
      }),
      prisma.dailyStat.aggregate({
        where: { websiteId },
        _sum: { sessions: true },
      }),
    ]);

  return {
    pageviews: pageviewsResult._sum.pageviews ?? 0,
    visitors: visitorsResult._sum.visitors ?? 0,
    sessions: sessionsResult._sum.sessions ?? 0,
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
  websiteId: string
): Promise<BrowserStat[]> {
  const results = await prisma.event.groupBy({
    by: ["browser"],
    where: { websiteId },
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
  websiteId: string
): Promise<DeviceStat[]> {
  const results = await prisma.event.groupBy({
    by: ["device"],
    where: { websiteId },
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
  websiteId: string
): Promise<DailyStatPoint[]> {
  const stats = await prisma.dailyStat.findMany({
    where: { websiteId },
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

export async function getActiveVisitors(
  websiteId: string
) {
  const fiveMinutesAgo = new Date(
    Date.now() - 5 * 60 * 1000
  );

  const activeSessions = await prisma.event.groupBy({
    by: ["sessionId"],
    where: {
      websiteId,
      createdAt: {
        gte: fiveMinutesAgo,
      },
    },
  });

  return activeSessions.length;
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.$transaction(async (tx) => {
    await tx.event.create({
      data: event,
    });

    await tx.dailyStat.upsert({
      where: {
        websiteId_date: {
          websiteId: event.websiteId,
          date: today,
        },
      },
      create: {
        websiteId: event.websiteId,
        date: today,
        pageviews: 1,
        visitors: 1,
        sessions: 1,
      },
      update: {
        pageviews: {
          increment: 1,
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