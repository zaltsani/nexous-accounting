import { PrismaClient } from "@nexous-accounting/database-core";

export const SAMPLE_TRANSACTIONS = [
  {
    journalCode: "JU",
    date: new Date("2026-01-01"),
    description: "Setoran modal awal pemilik",
    entries: [
      { accountCode: "11101", amount: 10000.0 }, // Kas Utama
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
      { accountCode: "11101", amount: 2500.0 }, // Kas Utama
      { accountCode: "11201", amount: -2500.0 }, // Piutang Usaha
    ],
  },
  {
    journalCode: "JU",
    date: new Date("2026-01-20"),
    description: "Pembelian peralatan kantor secara tunai",
    entries: [
      { accountCode: "12101", amount: 3000.0 }, // Peralatan Kantor
      { accountCode: "11101", amount: -3000.0 }, // Kas Utama
    ],
  },
] as const;

export async function seedTransactions(prisma: PrismaClient) {
  console.log("Seeding sample transactions & updating account balances...");

  for (const tx of SAMPLE_TRANSACTIONS) {
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
          const adjustment = account?.normalBalance === "CREDIT" ? -entry.amount : entry.amount;

          return prisma.account.update({
            where: { code: entry.accountCode },
            data: { balance: { increment: adjustment } },
          });
        }),
      );
    }
  }
}
