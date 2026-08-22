import { BadRequestException, Injectable } from "@nestjs/common";
import { IEntriesWithoutTransactionId } from "@nexous-accounting/types";
import { PrismaService } from "src/database/prisma.service";
import { TRANSACTION_INCLUDE } from "./transactions.mapper";
import { CreateTransactionDto, UpdateTransactionDto } from "@nexous-accounting/common";

@Injectable()
export class TransactionsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateTransactionDto) {
    const { entries, ...transaction } = data;

    await this.validateEntries(entries);

    return this.db.$transaction(async (tx) => {
      // Update Account Balance
      await Promise.all(
        entries.map((entry) =>
          tx.account.update({
            where: { id: entry.accountId },
            data: { balance: { increment: entry.amount } },
          }),
        ),
      );

      return tx.transaction.create({
        data: {
          ...transaction,
          entries: {
            create: entries,
          },
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

        // Revert previous balances by decrementing existing entry amounts
        await Promise.all(
          existingTransaction.entries.map((entry) =>
            tx.account.update({
              where: { id: entry.accountId },
              data: { balance: { decrement: entry.amount } },
            }),
          ),
        );

        // Delete existing entries
        await tx.entry.deleteMany({
          where: { transactionId: id },
        });

        // Apply new balances by incrementing new entry amounts
        await Promise.all(
          entries.map((entry) =>
            tx.account.update({
              where: { id: entry.accountId },
              data: { balance: { increment: entry.amount } },
            }),
          ),
        );
      }

      // Update the transaction record and recreate entries
      return tx.transaction.update({
        where: { id },
        data: {
          ...transaction,
          entries: {
            create: entries,
          },
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
      // Revert all account balance updates
      await Promise.all(
        existingTransaction.entries.map((entry) =>
          tx.account.update({
            where: { id: entry.accountId },
            data: { balance: { decrement: entry.amount } },
          }),
        ),
      );

      // Delete the main transaction (Cascade with entries)
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
}
