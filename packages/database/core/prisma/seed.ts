import { PrismaClient } from "@nexous-accounting/database-core";
import { PrismaPg } from "@prisma/adapter-pg";
import { syncSystemData } from "./system-init";
import { seedOperationalAccounts } from "./seeds/accounts.seed";
import { seedTransactions } from "./seeds/transactions.seed";

async function main() {
  console.log("Initialize database seeding pipeline...\n");

  const prisma = new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: process.env.DATABASE_URL as string },
      { schema: "core" },
    ),
  });

  try {
    await syncSystemData(prisma);

    await seedOperationalAccounts(prisma);
    await seedTransactions(prisma);

    console.log("\nAll seed scripts executed successfully.");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
