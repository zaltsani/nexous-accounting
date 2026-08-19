import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ACCOUNTING_PATTERNS, CreateAccountDto } from "@nexous-accounting/types";
import { AccountsService } from "./accounts.service";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @MessagePattern(ACCOUNTING_PATTERNS.CREATE_ACCOUNT)
  createAccount(@Payload() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }
}
