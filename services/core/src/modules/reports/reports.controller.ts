import { Controller } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { REPORT_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { GetReportBalanceSheetQueryDto } from "@nexous-accounting/common";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @MessagePattern(REPORT_MESSAGE_PATTERNS.GET_BALANCE_SHEET)
  createTransaction(@Payload() query: GetReportBalanceSheetQueryDto) {
    return this.reportsService.getBalanceSheet(query);
  }
}
