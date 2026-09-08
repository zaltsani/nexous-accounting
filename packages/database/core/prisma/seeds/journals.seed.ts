import { PrismaClient } from "@nexous-accounting/database-core";
import { SYSTEM_JOURNALS } from "@nexous-accounting/types";

export async function seedJournals(prisma: PrismaClient) {
  console.log("Seeding journal data...");

  for (const journal of Object.values(SYSTEM_JOURNALS)) {
    await prisma.journal.upsert({
      where: { code: journal.code },
      update: { name: journal.name },
      create: { code: journal.code, name: journal.name },
    });
  }

  console.log("Journal data seeded successfully!");
}
