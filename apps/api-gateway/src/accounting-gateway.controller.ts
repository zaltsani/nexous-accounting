import { Controller, Post, Body, Inject, UsePipes } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ZodValidationPipe } from "nestjs-zod";
import { ACCOUNTING_PATTERNS, CreateAccountDto, CreateJournalDto } from "@nexous-accounting/types";
import { firstValueFrom } from "rxjs";

@Controller("accounting")
@UsePipes(ZodValidationPipe)
export class AccountingGatewayController {
  constructor(@Inject("CORE_ACCOUNTING_SERVICE") private readonly coreClient: ClientProxy) {}

  @Post("accounts")
  async createAccount(@Body() dto: CreateAccountDto) {
    return await firstValueFrom(this.coreClient.send(ACCOUNTING_PATTERNS.CREATE_ACCOUNT, dto));
  }

  @Post("journals")
  async createJournal(@Body() dto: CreateJournalDto) {
    return await firstValueFrom(this.coreClient.send(ACCOUNTING_PATTERNS.CREATE_JOURNAL, dto));
  }
}
