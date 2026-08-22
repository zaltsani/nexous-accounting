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
import { ACCOUNT_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { CreateAccountDto, UpdateAccountDto } from "@nexous-accounting/common";
import { ZodValidationPipe } from "nestjs-zod";

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
  async list() {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.LIST_ACCOUNT, {});
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.GET_ACCOUNT_BY_ID, id);
  }

  @Delete(":id")
  async deleteById(@Param("id") id: string) {
    return this.natsClient.send(ACCOUNT_MESSAGE_PATTERNS.DELETE_ACCOUNT, id);
  }
}
