import { AccountType, NormalBalance, PrismaClient } from "@nexous-accounting/database-core";
import {
  SYSTEM_JOURNALS,
  SYSTEM_ROOT_ACCOUNTS,
  SYSTEM_SUB_HEADER_ACCOUNTS,
} from "@nexous-accounting/types";

export async function syncSystemData(prisma: PrismaClient) {
  console.log("[SYSTEM INIT] Syncing minimal system journals & root COA structure...");

  // System Journals
  for (const journal of Object.values(SYSTEM_JOURNALS)) {
    await prisma.journal.upsert({
      where: { code: journal.code },
      update: { name: journal.name },
      create: { code: journal.code, name: journal.name },
    });
  }

  // Minimal COA Headers (Root + Sub-Header)
  const accountMap = new Map<string, string>();

  async function syncAccounts(
    accounts: ReadonlyArray<{
      code: string;
      parentCode?: string;
      name: string;
      type: AccountType;
      normalBalance: NormalBalance;
    }>,
  ) {
    for (const acc of accounts) {
      const parentId = acc.parentCode ? accountMap.get(acc.parentCode) : null;
      const record = await prisma.account.upsert({
        where: { code: acc.code },
        update: { name: acc.name, type: acc.type, normalBalance: acc.normalBalance, parentId },
        create: {
          code: acc.code,
          name: acc.name,
          type: acc.type,
          normalBalance: acc.normalBalance,
          parentId,
        },
      });
      accountMap.set(record.code, record.id);
    }
  }

  await syncAccounts(SYSTEM_ROOT_ACCOUNTS);
  await syncAccounts(SYSTEM_SUB_HEADER_ACCOUNTS);

  console.log("[SYSTEM INIT] Minimal system structure synced (9 accounts total).");
}
