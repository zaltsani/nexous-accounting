import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth } from "@nestjs/swagger";
import {
  CreateTransactionDto,
  GetTransactionListQueryDto,
  UpdateTransactionDto,
} from "@nexous-accounting/common";
import { TRANSACTION_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { firstValueFrom } from "rxjs";

@ApiBearerAuth()
@Controller("transactions")
export class TransactionsGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return await firstValueFrom(
      this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.CREATE_TRANSACTION, dto),
    );
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTransactionDto) {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.UPDATE_TRANSACTION, { id, data: dto });
  }

  @Get()
  async list(@Query() query: GetTransactionListQueryDto) {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.LIST_TRANSACTION, { query });
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.GET_TRANSACTION, id);
  }

  @Delete(":id")
  async deleteById(@Param("id") id: string) {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.DELETE_TRANSACTION, id);
  }
}
