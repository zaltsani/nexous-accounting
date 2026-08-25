import { Injectable } from "@nestjs/common";
import {
  CreateAccountDto,
  GetAccountListQueryDto,
  UpdateAccountDto,
} from "@nexous-accounting/common";
import { Prisma } from "@nexous-accounting/database-core";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class AccountsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateAccountDto) {
    return this.db.account.create({
      data,
    });
  }

  async listAccount(query: GetAccountListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;

    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.AccountOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder }
      : { updatedAt: "desc" };

    const where: Prisma.AccountWhereInput = {};

    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: "insensitive" } },
        { name: { contains: query.search, mode: "insensitive" } },
      ];
    }

    where.type = query.type;

    const [items, totalCount] = await this.db.$transaction(async (tx) => {
      const items = await tx.account.findMany({
        where,
        orderBy,
        skip,
        take,
      });
      const totalCount = await tx.account.count();
      return [items, totalCount];
    });

    return {
      items,
      totalCount,
      page,
      limit,
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
