import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GetSalesSettlementListQueryDto } from "@nexous-accounting/common";
import { SALES_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { SalesQueryService } from "../services/sales-query.service";
import { SalesSettlementService } from "../services/sales-settlement.service";

@Controller()
export class SalesSettlementController {
  constructor(
    private readonly settlementService: SalesSettlementService,
    private readonly salesQueryService: SalesQueryService,
  ) {}

  @MessagePattern(SALES_MESSAGE_PATTERNS.CREATE_SALES_SETTLEMENT)
  async settleInvoice(@Payload() dto) {
    return await this.settlementService.settleInvoice(dto.invoiceId, dto);
  }

  @MessagePattern(SALES_MESSAGE_PATTERNS.LIST_SALES_SETTLEMENT)
  async listSettlements(@Payload() payload: { query: GetSalesSettlementListQueryDto }) {
    return await this.salesQueryService.listSettlement(payload.query);
  }
}
