import { PrismaClient } from "@nexous-accounting/database-core";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  console.log("Seeding initial data");

  const prisma = new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: process.env.DATABASE_URL as string },
      { schema: "finops" },
    ),
  });

  console.log("Seeding completed successfully.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
