import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@nexous-accounting/common";
import { AccountRepository } from "@nexous-accounting/database-core";
import { CreateAccountDto } from "@nexous-accounting/types";

@Injectable()
export class AccountsService {
  constructor(
    private readonly db: PrismaService,
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(data: CreateAccountDto) {
    return this.db.account.create({
      data,
    });
  }

  async getAccountById(id: string) {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }

    return account;
  }
}
