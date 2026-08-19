import { ICreateAccount, IUpdateAccount } from "@nexous-accounting/types";
import { PrismaClient } from "../generated/prisma/client.js";

export class AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async create(data: ICreateAccount) {
    return this.prisma.account.create({ data });
  }

  updateById(id: string, data: IUpdateAccount) {
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }
}
