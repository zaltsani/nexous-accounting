import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  CreateInvoiceDto,
  GetSalesInvoiceListQueryDto,
  GetSalesSettlementListQueryDto,
} from "@nexous-accounting/common";
import { SALES_MESSAGE_PATTERNS } from "@nexous-accounting/types";

@Controller("sales")
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

  @Get("invoice")
  async listInvoice(@Query() query: GetSalesInvoiceListQueryDto) {
    return this.natsClient.send(SALES_MESSAGE_PATTERNS.LIST_SALES_INVOICE, { query });
  }

  @Get("settlement")
  async listSettlement(@Query() query: GetSalesSettlementListQueryDto) {
    return this.natsClient.send(SALES_MESSAGE_PATTERNS.LIST_SALES_SETTLEMENT, { query });
  }
}
