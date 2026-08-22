import { Injectable } from "@nestjs/common";
import { CreateAccountDto, UpdateAccountDto } from "@nexous-accounting/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AccountsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateAccountDto) {
    return this.db.account.create({
      data,
    });
  }

  async listAccount() {
    const [items, totalCount] = await this.db.$transaction(async (tx) => {
      const items = await tx.account.findMany();
      const totalCount = await tx.account.count();
      return [items, totalCount];
    });

    return {
      items,
      totalCount,
      page: 1,
      limit: 10,
    };
  }

  async getAccountById(id: string) {
    return this.db.account.findUniqueOrThrow({
      where: { id },
    });
  }

  async getAccountByCode(code: string) {
    return this.db.account.findUniqueOrThrow({
      where: { code },
    });
  }

  async updateAccount(id: string, data: UpdateAccountDto) {
    return this.db.account.update({
      where: { id },
      data,
    });
  }

  async deleteAccount(id: string) {
    return this.db.account.delete({
      where: { id },
    });
  }
}
