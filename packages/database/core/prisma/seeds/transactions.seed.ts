import { PrismaClient } from "@nexous-accounting/database-core";
import { TransactionsService } from "../../../../../services/core/src/modules/transactions/transactions.service";

export const SAMPLE_TRANSACTIONS = [
  {
    journalCode: "JU",
    date: new Date("2026-01-01"),
    description: "Setoran modal awal pemilik",
    entries: [
      { accountCode: "11101", amount: 10000.0 }, // Kas Utama
      { accountCode: "31101", amount: -10000.0 }, // Modal Pemilik (Fixed: was 30101)
    ],
  },
  {
    journalCode: "JP",
    date: new Date("2026-01-05"),
    description: "Penjualan barang/jasa secara kredit",
    entries: [
      { accountCode: "11201", amount: 4000.0 }, // Piutang Usaha
      { accountCode: "41101", amount: -4000.0 }, // Pendapatan Penjualan (Fixed: was 40101)
    ],
  },
  {
    journalCode: "JB",
    date: new Date("2026-01-10"),
    description: "Beban pokok penjualan terutang",
    entries: [
      { accountCode: "51101", amount: 1200.0 }, // Harga Pokok Penjualan (Fixed: was 50101)
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

  const transactionsService = new TransactionsService(prisma as any);

  const accountCodes = Array.from(
    new Set(SAMPLE_TRANSACTIONS.flatMap((tx) => tx.entries.map((e) => e.accountCode))),
  );

  const accounts = await prisma.account.findMany({
    where: { code: { in: accountCodes } },
    select: { id: true, code: true },
  });

  const accountIdMap = new Map(accounts.map((a) => [a.code, a.id]));

  for (const tx of SAMPLE_TRANSACTIONS) {
    const existingTx = await prisma.transaction.findFirst({
      where: {
        journalCode: tx.journalCode,
        date: tx.date,
        description: tx.description,
      },
    });

    if (!existingTx) {
      const entries = tx.entries.map((entry) => {
        const accountId = accountIdMap.get(entry.accountCode);
        if (!accountId) {
          throw new Error(
            `Account code '${entry.accountCode}' not found during transaction seeding. Ensure seedAccounts has executed first.`,
          );
        }
        return {
          accountId,
          amount: entry.amount,
        };
      });

      await transactionsService.create({
        journalCode: tx.journalCode,
        date: tx.date.toISOString(),
        description: tx.description,
        entries,
      });
    }
  }

  console.log("Sample transactions seeded successfully!");
}
