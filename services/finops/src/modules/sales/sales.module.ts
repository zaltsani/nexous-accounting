import { Module } from "@nestjs/common";
import { SalesInvoiceController } from "./controllers/sales-invoice.controller";
import { SalesSettlementController } from "./controllers/sales-settlement.controller";
import { SalesQueryService } from "./services/sales-query.service";
import { SalesInvoiceService } from "./services/sales-invoice.service";
import { SalesLedgerService } from "./services/sales-ledger.service";
import { SalesSettlementService } from "./services/sales-settlement.service";

@Module({
  controllers: [SalesInvoiceController, SalesSettlementController],
  providers: [SalesInvoiceService, SalesQueryService, SalesSettlementService, SalesLedgerService],
})
export class SalesModule {}
