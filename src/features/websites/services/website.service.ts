import { prisma } from "@/lib/prisma";

export async function getWebsitesByUserId(
  userId: string
) {
  // OPTIMIZED: Only select fields needed for display
  return prisma.website.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      domain: true,
      siteKey: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getWebsites() {
  // OPTIMIZED: Only select fields needed for display (and this should probably be authenticated to user)
  return prisma.website.findMany({
    select: {
      id: true,
      name: true,
      domain: true,
      siteKey: true,
      createdAt: true,
      userId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getWebsiteByIdForUser(
  websiteId: string,
  userId: string
) {
  return prisma.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
    select: {
      id: true,
    },
  });
}

export async function createWebsite(data: {
  name: string;
  domain: string;
  userId: string;
  siteKey: string;
}) {
  return prisma.website.create({
    data,
  });
}

export async function deleteWebsite(
  websiteId: string,
  userId: string
) {
  return prisma.website.deleteMany({
    where: {
      id: websiteId,
      userId,
    },
  });
}
