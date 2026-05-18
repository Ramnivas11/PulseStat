import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// seed.ts runs via tsx after prisma generate, so @prisma/client is available
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("demo1234!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@pulsestat.com" },
    update: {},
    create: {
      email: "demo@pulsestat.com",
      password: hashedPassword,
      name: "Demo User",
      websites: {
        create: [
          {
            name: "PulseStat Demo",
            domain: "demo.pulsestat.com",
            siteKey: "site_00000000-0000-0000-0000-000000000001",
          },
        ],
      },
    },
  });

  console.log(`Seeded demo user: ${user.email}`);
  console.log("Login: demo@pulsestat.com / demo1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
