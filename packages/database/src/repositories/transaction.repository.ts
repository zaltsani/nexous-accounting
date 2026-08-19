import { ICreateAccount, ICreateTransaction } from "@nexous-accounting/types";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async create(data: ICreateTransaction) {
    const { entries, ...transaction } = data;
    return this.prisma.transaction.create({
      data: {
        ...transaction,
        entries: {
          create: entries.map((entry) => ({
            ...entry,
            amount: new Prisma.Decimal(entry.amount),
          })),
        },
      },
    });
  }

  update(id: string, data: ICreateAccount) {
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }
}
