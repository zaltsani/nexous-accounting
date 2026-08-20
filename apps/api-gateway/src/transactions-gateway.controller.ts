import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UsePipes,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  CreateTransactionDto,
  TRANSACTION_MESSAGE_PATTERNS,
  UpdateTransactionDto,
} from "@nexous-accounting/types";
import { ZodValidationPipe } from "nestjs-zod";

@Controller("transactions")
@UsePipes(ZodValidationPipe)
export class TransactionsGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.CREATE_TRANSACTION, dto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTransactionDto) {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.UPDATE_TRANSACTION, { id, data: dto });
  }

  @Get()
  async list() {
    return this.natsClient.send(TRANSACTION_MESSAGE_PATTERNS.LIST_TRANSACTION, {});
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
