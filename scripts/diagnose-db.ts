import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

interface RawQueryResult {
  [key: string]: unknown;
}

async function main() {
  console.log("🔍 DIAGNOSIS: Inspecting Database State...\n");

  try {
    // 1. Check migration history
    console.log("📋 Prisma Migration History:");
    const migrations = await prisma.$queryRawUnsafe<RawQueryResult[]>(
      `SELECT * FROM "_prisma_migrations" ORDER BY started_at DESC;`
    );
    console.table(migrations);

    // 2. Check for existing tables
    console.log("\n📊 Existing Tables:");
    const tables = await prisma.$queryRawUnsafe<RawQueryResult[]>(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name;`
    );
    console.table(tables);

    // 3. Check DailyVisitor and DailySession tables
    console.log("\n🔎 Checking DailyVisitor table:");
    try {
      const dailyVisitorExists = await prisma.$queryRawUnsafe<RawQueryResult[]>(
        `SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'DailyVisitor'
        ORDER BY ordinal_position;`
      );
      console.table(dailyVisitorExists);
    } catch (e) {
      console.log("DailyVisitor table doesn't exist or error accessing it");
    }

    console.log("\n🔎 Checking DailySession table:");
    try {
      const dailySessionExists = await prisma.$queryRawUnsafe<RawQueryResult[]>(
        `SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'DailySession'
        ORDER BY ordinal_position;`
      );
      console.table(dailySessionExists);
    } catch (e) {
      console.log("DailySession table doesn't exist or error accessing it");
    }

    // 4. Check constraints
    console.log("\n🔐 Foreign Key Constraints:");
    const pgConstraints = await prisma.$queryRawUnsafe<RawQueryResult[]>(
      `SELECT constraint_name, table_name 
       FROM information_schema.table_constraints 
       WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public'
       ORDER BY table_name;`
    );
    console.table(pgConstraints);

    // 5. Check indexes
    console.log("\n📑 Indexes:");
    const indexes = await prisma.$queryRawUnsafe<RawQueryResult[]>(
      `SELECT 
        indexname,
        tablename,
        indexdef
       FROM pg_indexes
       WHERE schemaname = 'public'
       ORDER BY tablename, indexname;`
    );
    console.table(indexes);

    // 6. Check Event table structure
    console.log("\n📋 Event Table Structure:");
    const eventStructure = await prisma.$queryRawUnsafe<RawQueryResult[]>(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns 
       WHERE table_name = 'Event'
       ORDER BY ordinal_position;`
    );
    console.table(eventStructure);

    // 7. Check Website table structure
    console.log("\n📋 Website Table Structure:");
    const websiteStructure = await prisma.$queryRawUnsafe<RawQueryResult[]>(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns 
       WHERE table_name = 'Website'
       ORDER BY ordinal_position;`
    );
    console.table(websiteStructure);

  } catch (error) {
    console.error("❌ Error during diagnosis:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
