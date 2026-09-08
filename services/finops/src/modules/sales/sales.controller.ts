import { Body, Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateInvoiceDto, GetSalesInvoiceListQueryDto } from "@nexous-accounting/common";
import { SALES_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @MessagePattern(SALES_MESSAGE_PATTERNS.CREATE_SALES_INVOICE)
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.salesService.createInvoice(dto);
  }

  @MessagePattern(SALES_MESSAGE_PATTERNS.LIST_SALES_INVOICE)
  async listInvoice(@Payload() payload: { query: GetSalesInvoiceListQueryDto }) {
    return this.salesService.listInvoice(payload.query);
  }
}
