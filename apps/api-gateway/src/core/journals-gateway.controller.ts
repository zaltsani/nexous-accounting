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
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateJournalDto, UpdateJournalDto } from "@nexous-accounting/common";
import { JOURNAL_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { ZodValidationPipe } from "nestjs-zod";

@ApiBearerAuth()
@Controller("journals")
@UsePipes(ZodValidationPipe)
export class JournalsGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  @Post()
  async create(@Body() dto: CreateJournalDto) {
    return this.natsClient.send(JOURNAL_MESSAGE_PATTERNS.CREATE_JOURNAL, dto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateJournalDto) {
    return this.natsClient.send(JOURNAL_MESSAGE_PATTERNS.UPDATE_JOURNAL, { id, data: dto });
  }

  @Get()
  async list() {
    return this.natsClient.send(JOURNAL_MESSAGE_PATTERNS.LIST_JOURNAL, {});
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.natsClient.send(JOURNAL_MESSAGE_PATTERNS.GET_JOURNAL, id);
  }

  @Delete(":id")
  async deleteById(@Param("id") id: string) {
    return this.natsClient.send(JOURNAL_MESSAGE_PATTERNS.DELETE_JOURNAL, id);
  }
}
