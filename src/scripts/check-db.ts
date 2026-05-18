import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const websites = await prisma.website.findMany({
    include: { _count: { select: { events: true, dailyStats: true, pageStats: true } } },
  });
  console.log("Websites:", JSON.stringify(websites, null, 2));

  const latestEvents = await prisma.event.findMany({ take: 5, orderBy: { createdAt: "desc" } });
  console.log("Latest Events:", JSON.stringify(latestEvents, null, 2));

  const latestDaily = await prisma.dailyStat.findMany({ take: 5, orderBy: { date: "desc" } });
  console.log("Latest Daily Stats:", JSON.stringify(latestDaily, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
