import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTransactionDto, UpdateTransactionDto } from "@nexous-accounting/common";
import { IEntriesWithoutTransactionId } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { Decimal } from "../../../../../packages/database/core/dist/generated/prisma/internal/prismaNamespace";
import { TRANSACTION_INCLUDE } from "./transactions.mapper";

@Injectable()
export class TransactionsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const { entries, ...transaction } = data;

    await this.validateEntries(entries);

    return this.db.$transaction(async (tx) => {
      // Apply new entry balances
      await this.adjustAccountBalances(tx, entries, "APPLY");

      return tx.transaction.create({
        data: {
          ...transaction,
          entries: { create: entries },
        },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  async listTransaction() {
    return this.db.transaction.findMany({
      include: TRANSACTION_INCLUDE,
    });
  }

  async getTransaction(id: string) {
    return this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: TRANSACTION_INCLUDE,
    });
  }

  async updateTransaction(id: string, data: UpdateTransactionDto) {
    const { entries, ...transaction } = data;

    const existingTransaction = await this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { entries: true },
    });

    return this.db.$transaction(async (tx) => {
      if (entries && entries.length > 0) {
        await this.validateEntries(entries);

        // Revert old balances
        await this.adjustAccountBalances(tx, existingTransaction.entries, "REVERT");

        // Delete old entries
        await tx.entry.deleteMany({
          where: { transactionId: id },
        });

        // Apply new balances
        await this.adjustAccountBalances(tx, entries, "APPLY");
      }

      return tx.transaction.update({
        where: { id },
        data: {
          ...transaction,
          entries: { create: entries },
        },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  async deleteTransaction(id: string) {
    const existingTransaction = await this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { entries: true },
    });

    return this.db.$transaction(async (tx) => {
      // Revert existing entry balances
      await this.adjustAccountBalances(tx, existingTransaction.entries, "REVERT");

      return tx.transaction.delete({
        where: { id },
        include: TRANSACTION_INCLUDE,
      });
    });
  }

  private async validateEntries(entries: IEntriesWithoutTransactionId) {
    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    if (Math.abs(total) > 0) {
      throw new BadRequestException(
        `Transaction is unbalanced. Sum of entries must be 0, received sum: ${total}`,
      );
    }
  }

  private async adjustAccountBalances(
    tx: Parameters<Parameters<typeof this.db.$transaction>[0]>[0],
    entries: Array<{ accountId: string; amount: number | Decimal }>,
    mode: "APPLY" | "REVERT" = "APPLY",
  ) {
    if (!entries || entries.length === 0) return;

    const accountIds = Array.from(new Set(entries.map((e) => e.accountId)));
    const accounts = await tx.account.findMany({
      where: { id: { in: accountIds } },
      select: { id: true, normal_balance: true },
    });

    const accountMap = new Map(accounts.map((a) => [a.id, a.normal_balance]));

    const multiplier = mode === "REVERT" ? -1 : 1;

    await Promise.all(
      entries.map((entry) => {
        const normalBalance = accountMap.get(entry.accountId);

        // Normalize Decimal or number to a standard JS number
        const numericAmount =
          typeof entry.amount === "number" ? entry.amount : entry.amount.toNumber();

        // DEBIT account: +amount increases balance
        // CREDIT account: -amount increases balance
        const applyAdjustment = normalBalance === "CREDIT" ? -numericAmount : numericAmount;

        return tx.account.update({
          where: { id: entry.accountId },
          data: { balance: { increment: applyAdjustment * multiplier } },
        });
      }),
    );
  }
}
