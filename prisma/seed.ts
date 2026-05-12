import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "demo@pulsestat.com",
      password: "hashedpassword",
      name: "Demo User",

      websites: {
        create: [
          {
            name: "PulseStat Demo",
            domain: "demo.pulsestat.com",
            siteKey: "site_demo_123",
          },
        ],
      },
    },
  });

  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });