import { Injectable } from "@nestjs/common";
import { CreateAccountDto, UpdateAccountDto } from "@nexous-accounting/types";
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
    return this.db.account.findMany();
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
