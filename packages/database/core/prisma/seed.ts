import { AccountType, NormalBalance, PrismaClient } from "@nexous-accounting/database-core";
import { PrismaPg } from "@prisma/adapter-pg";

// Application Configuration Constants
export const SYSTEM_JOURNALS = [
  { code: "JU", name: "Jurnal Umum" },
  { code: "JP", name: "Jurnal Penjualan" },
  { code: "JB", name: "Jurnal Pembelian" },
  { code: "JK", name: "Jurnal Kas / Pembayaran" },
] as const;

export const DEFAULT_ROOT_ACCOUNTS = [
  { code: "1000", name: "Aset", type: AccountType.ASSET, normalBalance: NormalBalance.DEBIT },
  {
    code: "2000",
    name: "Liabilitas",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  { code: "3000", name: "Ekuitas", type: AccountType.EQUITY, normalBalance: NormalBalance.CREDIT },
  {
    code: "4000",
    name: "Pendapatan",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
  },
  { code: "5000", name: "Beban", type: AccountType.EXPENSE, normalBalance: NormalBalance.DEBIT },
] as const;

export const DEFAULT_CHILD_ACCOUNTS = [
  {
    code: "1010",
    parentCode: "1000",
    name: "Kas",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: "1020",
    parentCode: "1000",
    name: "Piutang Usaha",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: "2010",
    parentCode: "2000",
    name: "Utang Usaha",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: "3010",
    parentCode: "3000",
    name: "Modal Pemilik",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: "4010",
    parentCode: "4000",
    name: "Pendapatan Jasa",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: "5010",
    parentCode: "5000",
    name: "Beban Sewa",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
  },
] as const;

async function main() {
  console.log("Seeding initial ledger configuration & default data...");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
      options: "-c search_path=core",
    }),
  });

  // Seed System Journals
  const journalMap = new Map<string, string>();

  for (const journal of SYSTEM_JOURNALS) {
    const record = await prisma.journal.upsert({
      where: { code: journal.code },
      update: { name: journal.name },
      create: {
        code: journal.code,
        name: journal.name,
      },
    });
    journalMap.set(record.code, record.id);
  }

  // Seed Root Accounts
  const accountMap = new Map<string, string>();

  for (const acc of DEFAULT_ROOT_ACCOUNTS) {
    const record = await prisma.account.upsert({
      where: { code: acc.code },
      update: { name: acc.name, type: acc.type, normalBalance: acc.normalBalance },
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        normalBalance: acc.normalBalance,
      },
    });
    accountMap.set(record.code, record.id);
  }

  // Seed Child Accounts
  for (const acc of DEFAULT_CHILD_ACCOUNTS) {
    const parentId = accountMap.get(acc.parentCode);
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

  // Seed Initial Sample Transactions
  const TRANSACTIONS = [
    {
      journalCode: "JU",
      date: new Date("2026-01-01"),
      description: "Setoran modal awal pemilik",
      entries: [
        { accountCode: "1010", amount: 10000.0 },
        { accountCode: "3010", amount: -10000.0 },
      ],
    },
    {
      journalCode: "JP",
      date: new Date("2026-01-05"),
      description: "Penjualan jasa secara kredit",
      entries: [
        { accountCode: "1020", amount: 4000.0 },
        { accountCode: "4010", amount: -4000.0 },
      ],
    },
    {
      journalCode: "JB",
      date: new Date("2026-01-10"),
      description: "Beban sewa kantor terutang",
      entries: [
        { accountCode: "5010", amount: 1200.0 },
        { accountCode: "2010", amount: -1200.0 },
      ],
    },
    {
      journalCode: "JK",
      date: new Date("2026-01-15"),
      description: "Penerimaan kas dari piutang usaha",
      entries: [
        { accountCode: "1010", amount: 2500.0 },
        { accountCode: "1020", amount: -2500.0 },
      ],
    },
  ];

  for (const tx of TRANSACTIONS) {
    const journalId = journalMap.get(tx.journalCode);
    if (!journalId) continue;

    const existingTx = await prisma.transaction.findFirst({
      where: {
        journalId,
        date: tx.date,
        description: tx.description,
      },
    });

    if (!existingTx) {
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
  }

  console.log("Seeding completed successfully.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
