import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ApiBearerAuth } from "@nestjs/swagger";
import { GetReportBalanceSheetQueryDto } from "@nexous-accounting/common";
import { REPORT_MESSAGE_PATTERNS } from "@nexous-accounting/types";

@ApiBearerAuth()
@Controller("reports")
export class ReportsGatewayController {
  constructor(@Inject("NATS_SERVICE") private readonly natsClient: ClientProxy) {}

  @Get("balance-sheet")
  async getById(@Query() query: GetReportBalanceSheetQueryDto) {
    return this.natsClient.send(REPORT_MESSAGE_PATTERNS.GET_BALANCE_SHEET, query);
  }
}
