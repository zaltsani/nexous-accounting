import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@nexous-accounting/common";
import { CreateTransactionDto } from "@nexous-accounting/types";

@Injectable()
export class TransactionsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateTransactionDto) {
    // Validation Debits = Credits
    const total = data.entries.reduce((sum, entry) => sum + entry.amount, 0);
    if (Math.abs(total) > 0) {
      throw new BadRequestException(
        `Transaction is unbalanced. Sum of entries must be 0, received sum: ${total}`,
      );
    }

    // Create Transaction and Entries
    return this.db.$transaction(async (tx) => {
      return tx.transaction.create({
        data: {
          journalId: data.journalId,
          date: new Date(data.date),
          description: data.description,
          entries: {
            create: data.entries.map((entry) => ({
              accountId: entry.accountId,
              amount: entry.amount,
            })),
          },
        },
        include: {
          entries: true,
        },
      });
    });
  }

  findById(id: string) {
    return this.db.transaction.findFirstOrThrow({ where: { id } });
  }

  async list() {
    const [items, totalCount] = await this.db.$transaction(async (tx) => [
      tx.transaction.findMany({
        include: { entries: true },
      }),
      tx.transaction.count(),
    ]);

    return {
      items,
      page: 0,
      limit: 0,
      totalCount,
    };
  }

  delete(id: string) {
    return this.db.$transaction(async (tx) => {
      await tx.entry.deleteMany({
        where: { transactionId: id },
      });

      return tx.transaction.delete({
        where: { id },
        include: { entries: true },
      });
    });
  }

  // update(id: string, data: UpdateTransactionDto) {
  //   return this.transactionRepository.update(id, data);
  // }
}
