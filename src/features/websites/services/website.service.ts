import { prisma } from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaTx = any;

export async function getWebsitesByUserId(userId: string) {
  return prisma.website.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, domain: true, siteKey: true, createdAt: true },
  });
}

export async function getWebsiteByIdForUser(websiteId: string, userId: string) {
  return prisma.website.findFirst({
    where: { id: websiteId, userId },
    select: { id: true, name: true, domain: true, siteKey: true },
  });
}

export async function createWebsite(data: {
  name: string;
  domain: string;
  userId: string;
  siteKey: string;
}) {
  return prisma.website.create({ data });
}

export async function deleteWebsite(websiteId: string, userId: string) {
  return prisma.$transaction(async (tx: PrismaTx) => {
    const website = await tx.website.findFirst({
      where: { id: websiteId, userId },
      select: { id: true },
    });

    if (!website) return { count: 0 };

    // Delete in dependency order to respect FK constraints
    await tx.event.deleteMany({ where: { websiteId } });
    await tx.dailyStat.deleteMany({ where: { websiteId } });
    await tx.pageStat.deleteMany({ where: { websiteId } });

    return tx.website.deleteMany({ where: { id: websiteId, userId } });
  });
}
