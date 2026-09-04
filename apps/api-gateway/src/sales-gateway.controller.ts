import { Body, Controller, Inject, Post, UsePipes } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateInvoiceDto } from "@nexous-accounting/common";
import { SALES_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { ZodValidationPipe } from "nestjs-zod";

@Controller("sales")
@UsePipes(ZodValidationPipe)
export class SalesGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  @Post("invoice")
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.natsClient.send(SALES_MESSAGE_PATTERNS.CREATE_SALES_INVOICE, dto);
  }

  @Post("settlement")
  async createSettlement(@Body() dto: CreateInvoiceDto) {
    return this.natsClient.send(SALES_MESSAGE_PATTERNS.CREATE_SALES_INVOICE, dto);
  }
}
