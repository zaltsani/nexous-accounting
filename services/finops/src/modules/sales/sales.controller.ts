import { Body, Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { CreateInvoiceDto } from "@nexous-accounting/common";
import { SALES_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @MessagePattern(SALES_MESSAGE_PATTERNS.CREATE_SALES_INVOICE)
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.salesService.createInvoice(dto);
  }
}
