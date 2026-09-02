import { AccountType, NormalBalance, PrismaClient } from "@nexous-accounting/database-core";

export const ACCOUNTS_SEED_DATA = [
  // Detail Accounts under 11000 (Aset Lancar)
  {
    code: "11101",
    parentCode: "11000",
    name: "Kas Utama",
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

  // Detail Accounts under 12000 (Aset Tidak Lancar)
  {
    code: "12101",
    parentCode: "12000",
    name: "Peralatan Kantor",
    type: AccountType.ASSET,
    normalBalance: NormalBalance.DEBIT,
  },

  // Detail Accounts under 21000 & 22000 (Liabilitas)
  {
    code: "21101",
    parentCode: "21000",
    name: "Utang Usaha",
    type: AccountType.LIABILITY,
    normalBalance: NormalBalance.CREDIT,
  },
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

export async function seedOperationalAccounts(prisma: PrismaClient) {
  console.log("Seeding operational accounts...");

  for (const acc of ACCOUNTS_SEED_DATA) {
    const parent = await prisma.account.findUnique({ where: { code: acc.parentCode } });

    await prisma.account.upsert({
      where: { code: acc.code },
      update: {
        name: acc.name,
        type: acc.type,
        normalBalance: acc.normalBalance,
        parentId: parent?.id,
      },
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        normalBalance: acc.normalBalance,
        parentId: parent?.id ?? null,
      },
    });
  }
}
