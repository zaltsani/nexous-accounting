import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateInvoiceDto, GetSalesInvoiceListQueryDto } from "@nexous-accounting/common";
import { SALES_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { SalesQueryService } from "../services/sales-query.service";
import { SalesInvoiceService } from "../services/sales-invoice.service";

@Controller("sales/invoices")
export class SalesInvoiceController {
  constructor(
    private readonly invoiceService: SalesInvoiceService,
    private readonly salesQueryService: SalesQueryService,
  ) {}

  @MessagePattern(SALES_MESSAGE_PATTERNS.CREATE_SALES_INVOICE)
  async createInvoice(@Payload() dto: CreateInvoiceDto) {
    return await this.invoiceService.createInvoice(dto);
  }

  @MessagePattern(SALES_MESSAGE_PATTERNS.LIST_SALES_INVOICE)
  async listInvoices(@Payload() payload: { query: GetSalesInvoiceListQueryDto }) {
    return await this.salesQueryService.listInvoice(payload.query);
  }
}
