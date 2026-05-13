import { prisma } from "@/lib/prisma";

export async function getWebsitesByUserId(
  userId: string
) {
  return prisma.website.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getWebsites() {
  return prisma.website.findMany({
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
