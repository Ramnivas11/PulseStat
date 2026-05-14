import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  try {
    const websites = await prisma.website.findMany({
      include: {
        _count: {
          select: {
            events: true,
            dailyStats: true,
            pageStats: true,
          },
        },
      },
    });

    console.log('Websites and counts:');
    console.log(JSON.stringify(websites, null, 2));

    const latestEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
    console.log('\nLatest Events:');
    console.log(JSON.stringify(latestEvents, null, 2));
    
    const latestDaily = await prisma.dailyStat.findMany({
      take: 5,
      orderBy: { date: 'desc' },
    });
    console.log('\nLatest Daily Stats:');
    console.log(JSON.stringify(latestDaily, null, 2));

  } catch (error) {
    console.error('Database query failed:', error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
