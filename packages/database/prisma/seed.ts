import { NormalBalance, PrismaClient } from "@nexous-accounting/database";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  console.log("Seeding initial ledger data...");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
      options: "-c search_path=core",
    }),
  });

  // Seed Journals
  const JOURNALS = [
    {
      code: "GJ",
      name: "General Journal",
    },
    {
      code: "SJ",
      name: "Sales Journal",
    },
  ];

  const journalMap = new Map<string, string>();

  await Promise.all(
    JOURNALS.map(async (journal) => {
      const record = await prisma.journal.upsert({
        where: { code: journal.code },
        update: { name: journal.name },
        create: {
          code: journal.code,
          name: journal.name,
        },
      });
      journalMap.set(record.code, record.id);
    }),
  );

  // Seed Root Accounts
  const ROOT_ACCOUNTS = [
    { code: "1000", name: "Assets", normalBalance: NormalBalance.DEBIT },
    { code: "2000", name: "Liabilities", normalBalance: NormalBalance.CREDIT },
    { code: "3000", name: "Equity", normalBalance: NormalBalance.CREDIT },
    { code: "4000", name: "Revenue", normalBalance: NormalBalance.CREDIT },
    { code: "5000", name: "Expenses", normalBalance: NormalBalance.DEBIT },
  ];

  const accountMap = new Map<string, string>();

  for (const acc of ROOT_ACCOUNTS) {
    const record = await prisma.account.upsert({
      where: { code: acc.code },
      update: { name: acc.name, normalBalance: acc.normalBalance },
      create: {
        code: acc.code,
        name: acc.name,
        normalBalance: acc.normalBalance,
      },
    });
    accountMap.set(record.code, record.id);
  }

  // Seed Child Accounts
  const CHILD_ACCOUNTS = [
    {
      code: "1010",
      parentCode: "1000",
      name: "Cash and Cash Equivalents",
      normalBalance: NormalBalance.DEBIT,
    },
    {
      code: "1020",
      parentCode: "1000",
      name: "Accounts Receivable",
      normalBalance: NormalBalance.DEBIT,
    },
    {
      code: "2010",
      parentCode: "2000",
      name: "Accounts Payable",
      normalBalance: NormalBalance.CREDIT,
    },
    {
      code: "3010",
      parentCode: "3000",
      name: "Owner's Capital",
      normalBalance: NormalBalance.CREDIT,
    },
    {
      code: "4010",
      parentCode: "4000",
      name: "Sales Revenue",
      normalBalance: NormalBalance.CREDIT,
    },
    { code: "5010", parentCode: "5000", name: "Rent Expense", normalBalance: NormalBalance.DEBIT },
  ];

  for (const acc of CHILD_ACCOUNTS) {
    const parentId = accountMap.get(acc.parentCode);
    const record = await prisma.account.upsert({
      where: { code: acc.code },
      update: { name: acc.name, normalBalance: acc.normalBalance, parentId },
      create: {
        code: acc.code,
        name: acc.name,
        normalBalance: acc.normalBalance,
        parentId,
      },
    });
    accountMap.set(record.code, record.id);
  }

  // Seed Initial Balanced Transactions
  const TRANSACTIONS = [
    {
      journalCode: "GJ",
      date: new Date("2026-01-01"),
      description: "Initial capital investment",
      entries: [
        { accountCode: "1010", amount: 10000.0 }, // Cash Debit (+)
        { accountCode: "3010", amount: -10000.0 }, // Owner's Capital Credit (-)
      ],
    },
    {
      journalCode: "SJ",
      date: new Date("2026-01-15"),
      description: "Consulting services billed to client",
      entries: [
        { accountCode: "1010", amount: 2500.0 }, // Cash Debit (+)
        { accountCode: "1020", amount: 1500.0 }, // Accounts Receivable Debit (+)
        { accountCode: "4010", amount: -4000.0 }, // Sales Revenue Credit (-)
      ],
    },
  ];

  for (const tx of TRANSACTIONS) {
    const journalId = journalMap.get(tx.journalCode);
    if (!journalId) continue;

    await prisma.transaction.create({
      data: {
        journalId,
        date: tx.date,
        description: tx.description,
        entries: {
          create: tx.entries.map((e) => ({
            accountId: accountMap.get(e.accountCode)!,
            amount: e.amount,
          })),
        },
      },
    });
  }

  console.log("Seeding completed successfully.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
