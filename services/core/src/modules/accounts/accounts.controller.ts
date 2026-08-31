import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  ApiListQueryParamsDto,
  CreateAccountDto,
  GetAccountListQueryDto,
  GetAccountSummaryQueryDto,
  UpdateAccountDto,
} from "@nexous-accounting/common";
import { ACCOUNT_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { AccountsService } from "./accounts.service";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.CREATE_ACCOUNT)
  createAccount(@Payload() dto: CreateAccountDto) {
    return this.accountsService.create(dto);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.UPDATE_ACCOUNT)
  updateAccount(@Payload() payload: { id: string; data: UpdateAccountDto }) {
    return this.accountsService.updateAccount(payload.id, payload.data);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.LIST_ACCOUNT)
  listAccount(@Payload() payload: { query: GetAccountListQueryDto }) {
    return this.accountsService.listAccount(payload.query);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_BY_ID)
  getAccountById(@Payload() id: string) {
    return this.accountsService.getAccountById(id);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_BY_CODE)
  getAccountByCode(@Payload() code: string) {
    return this.accountsService.getAccountByCode(code);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.DELETE_ACCOUNT)
  deleteAccount(@Payload() id: string) {
    return this.accountsService.deleteAccount(id);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_ENTRIES)
  getAccountEntries(@Payload("id") id: string, @Payload("query") query: ApiListQueryParamsDto) {
    return this.accountsService.getAccountEntries(id, query);
  }

  @MessagePattern(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_SUMMARY)
  getAccountSummary(@Payload("id") id: string, @Payload("query") query: GetAccountSummaryQueryDto) {
    return this.accountsService.getAccountSummaryAndTrend(id, query);
  }
}
