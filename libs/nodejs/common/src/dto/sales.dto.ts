import { createZodDto } from "nestjs-zod";
import {
  baseInvoiceSchema,
  baseSalesSettlementSchema,
  createInvoiceSchema,
  createSalesSettlementSchema,
  invoiceSchema,
  salesItemSchema,
} from "@nexous-accounting/types";

export class SalesItemDto extends createZodDto(salesItemSchema) {}

export class BaseInvoiceDto extends createZodDto(baseInvoiceSchema) {}
export class InvoiceDto extends createZodDto(invoiceSchema) {}
export class CreateInvoiceDto extends createZodDto(createInvoiceSchema) {}

export class BaseSalesSettlementDto extends createZodDto(baseSalesSettlementSchema) {}
export class CreateSalesSettlementDto extends createZodDto(createSalesSettlementSchema) {}
