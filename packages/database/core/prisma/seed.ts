import { AccountType, NormalBalance, PrismaClient } from "@nexous-accounting/database-core";
import { PrismaPg } from "@prisma/adapter-pg";

// Application Configuration Constants
export const SYSTEM_JOURNALS = [
  { code: "JU", name: "Jurnal Umum" },
  { code: "JP", name: "Jurnal Penjualan" },
  { code: "JB", name: "Jurnal Pembelian" },
  { code: "JK", name: "Jurnal Kas / Pembayaran" },
] as const;

// Level 1: Root Accounts (Base 10000 - 50000)
export const DEFAULT_ROOT_ACCOUNTS = [
  { code: "10000", name: "Aset", type: AccountType.ASSET, normalBalance: NormalBalance.DEBIT },
  {
    code: "20000",
    name: "Liabilitas",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  { code: "30000", name: "Ekuitas", type: AccountType.EQUITY, normalBalance: NormalBalance.CREDIT },
  {
    code: "40000",
    name: "Pendapatan",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
  },
  { code: "50000", name: "Beban", type: AccountType.EXPENSE, normalBalance: NormalBalance.DEBIT },
] as const;

// Level 2: Sub-Header Accounts (Main Classification)
export const DEFAULT_SUB_HEADER_ACCOUNTS = [
  // Asset Classifications
  {
    code: "11000",
    parentCode: "10000",
    name: "Aset Lancar (Current Assets)",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: "12000",
    parentCode: "10000",
    name: "Aset Tidak Lancar (Non-Current Assets)",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  // Liability Classifications
  {
    code: "21000",
    parentCode: "20000",
    name: "Liabilitas Jangka Pendek (Current Liabilities)",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: "22000",
    parentCode: "20000",
    name: "Liabilitas Jangka Panjang (Long-Term Liabilities)",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
] as const;

// Level 3: Sub-Category Headers (Penentu Detail Kategori seperti Aset Tetap)
export const DEFAULT_CATEGORY_HEADER_ACCOUNTS = [
  {
    code: "12100",
    parentCode: "12000",
    name: "Aset Tetap (Fixed Assets)",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
] as const;

// Level 4: Detail / Posting Accounts (Akun Operasional 5 Digit)
export const DEFAULT_CHILD_ACCOUNTS = [
  // Current Assets (Under 11000)
  {
    code: "11101",
    parentCode: "11000",
    name: "Kas",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  {
    code: "11201",
    parentCode: "11000",
    name: "Piutang Usaha",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  // Non-Current Assets -> Fixed Assets (Under 12100)
  {
    code: "12101",
    parentCode: "12100",
    name: "Peralatan Kantor",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },
  // Current Liabilities (Under 21000)
  {
    code: "21101",
    parentCode: "21000",
    name: "Utang Usaha",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  // Long-Term Liabilities (Under 22000)
  {
    code: "22101",
    parentCode: "22000",
    name: "Utang Bank Jangka Panjang",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
  // Equity, Revenue, Expense
  {
    code: "30101",
    parentCode: "30000",
    name: "Modal Pemilik",
    type: AccountType.EQUITY,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: "40101",
    parentCode: "40000",
    name: "Pendapatan Jasa",
    type: AccountType.REVENUE,
    normalBalance: NormalBalance.CREDIT,
  },
  {
    code: "50101",
    parentCode: "50000",
    name: "Beban Sewa",
    type: AccountType.EXPENSE,
    normalBalance: NormalBalance.DEBIT,
  },
] as const;

async function main() {
  console.log("Seeding initial ledger configuration & default data (SAK Standard COA)...");

  const prisma = new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: process.env.DATABASE_URL as string },
      { schema: "core" },
    ),
  });

  // 1. Seed System Journals
  for (const journal of SYSTEM_JOURNALS) {
    await prisma.journal.upsert({
      where: { code: journal.code },
      update: { name: journal.name },
      create: {
        code: journal.code,
        name: journal.name,
      },
    });
  }

  const accountMap = new Map<string, string>();

  // Helper function untuk upsert akun bertingkat secara konsisten
  async function seedAccounts(
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

  // 2. Seed Accounts secara Berurutan (Root -> Sub-Header L2 -> Category L3 -> Detail L4)
  await seedAccounts(DEFAULT_ROOT_ACCOUNTS);
  await seedAccounts(DEFAULT_SUB_HEADER_ACCOUNTS);
  await seedAccounts(DEFAULT_CATEGORY_HEADER_ACCOUNTS);
  await seedAccounts(DEFAULT_CHILD_ACCOUNTS);

  // 3. Seed Sample Transactions
  const TRANSACTIONS = [
    {
      journalCode: "JU",
      date: new Date("2026-01-01"),
      description: "Setoran modal awal pemilik",
      entries: [
        { accountCode: "11101", amount: 10000.0 }, // Kas
        { accountCode: "30101", amount: -10000.0 }, // Modal Pemilik
      ],
    },
    {
      journalCode: "JP",
      date: new Date("2026-01-05"),
      description: "Penjualan jasa secara kredit",
      entries: [
        { accountCode: "11201", amount: 4000.0 }, // Piutang Usaha
        { accountCode: "40101", amount: -4000.0 }, // Pendapatan Jasa
      ],
    },
    {
      journalCode: "JB",
      date: new Date("2026-01-10"),
      description: "Beban sewa kantor terutang",
      entries: [
        { accountCode: "50101", amount: 1200.0 }, // Beban Sewa
        { accountCode: "21101", amount: -1200.0 }, // Utang Usaha
      ],
    },
    {
      journalCode: "JK",
      date: new Date("2026-01-15"),
      description: "Penerimaan kas dari piutang usaha",
      entries: [
        { accountCode: "11101", amount: 2500.0 }, // Kas
        { accountCode: "11201", amount: -2500.0 }, // Piutang Usaha
      ],
    },
    {
      journalCode: "JU",
      date: new Date("2026-01-20"),
      description: "Pembelian peralatan kantor secara tunai",
      entries: [
        { accountCode: "12101", amount: 3000.0 }, // Peralatan Kantor (Aset Tetap)
        { accountCode: "11101", amount: -3000.0 }, // Kas (Aset Lancar)
      ],
    },
  ];

  for (const tx of TRANSACTIONS) {
    const existingTx = await prisma.transaction.findFirst({
      where: {
        journalCode: tx.journalCode,
        date: tx.date,
        description: tx.description,
      },
    });

    if (!existingTx) {
      const accountCodes = tx.entries.map((e) => e.accountCode);
      const accounts = await prisma.account.findMany({
        where: { code: { in: accountCodes } },
        select: { id: true, code: true, normalBalance: true },
      });

      const accountDetailsMap = new Map(
        accounts.map((a) => [a.code, { id: a.id, normalBalance: a.normalBalance }]),
      );

      await prisma.transaction.create({
        data: {
          journalCode: tx.journalCode,
          date: tx.date,
          description: tx.description,
          entries: {
            create: tx.entries.map((e) => ({
              accountId: accountDetailsMap.get(e.accountCode)!.id,
              amount: e.amount,
            })),
          },
        },
      });

      await Promise.all(
        tx.entries.map((entry) => {
          const account = accountDetailsMap.get(entry.accountCode);
          const normalBalance = account?.normalBalance;

          const adjustment = normalBalance === "CREDIT" ? -entry.amount : entry.amount;

          return prisma.account.update({
            where: { code: entry.accountCode },
            data: { balance: { increment: adjustment } },
          });
        }),
      );
    }
  }

  console.log("Seeding completed successfully.");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
