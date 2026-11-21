import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth } from "@nestjs/swagger";
import {
  ApiListQueryParamsDto,
  CreateAccountDto,
  GetAccountListQueryDto,
  GetAccountSummaryQueryDto,
  UpdateAccountDto,
} from "@nexous-accounting/common";
import { ACCOUNT_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { ZodValidationPipe } from "nestjs-zod";

@ApiBearerAuth()
@Controller("accounts")
@UsePipes(ZodValidationPipe)
export class AccountsGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  @Post()
  async create(@Body() dto: CreateAccountDto) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.CREATE_ACCOUNT, dto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateAccountDto) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.UPDATE_ACCOUNT, { id, data: dto });
  }

  @Get()
  async list(@Query() query: GetAccountListQueryDto) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.LIST_ACCOUNT, { query });
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_BY_ID, id);
  }

  @Delete(":id")
  async deleteById(@Param("id") id: string) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.DELETE_ACCOUNT, id);
  }

  @Get(":id/entries")
  async getAccountEntries(@Param("id") id: string, @Query() query: ApiListQueryParamsDto) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_ENTRIES, { id, query });
  }

  @Get(":id/summary")
  async getAccountSummary(@Param("id") id: string, @Query() query: GetAccountSummaryQueryDto) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_SUMMARY, { id, query });
  }
}
