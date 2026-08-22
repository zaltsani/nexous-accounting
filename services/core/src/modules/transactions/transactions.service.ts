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

    return this.db.transaction.create({
      data: {
        ...transaction,
        entries: {
          create: entries,
        },
      },
      include: TRANSACTION_INCLUDE,
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

    await this.db.transaction.findFirstOrThrow({
      where: { id },
    });

    return this.db.$transaction(async (tx) => {
      if (entries && entries.length > 0) {
        await this.validateEntries(entries);
        await tx.entry.deleteMany({
          where: { transactionId: id },
        });
      }

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
    return this.db.transaction.delete({
      where: { id },
      include: TRANSACTION_INCLUDE,
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
