import {
  getReportBalanceSheetQuerySchema,
  reportBalanceSheetSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class ReportBalanceSheetDto extends createZodDto(reportBalanceSheetSchema) {}
export class GetReportBalanceSheetQueryDto extends createZodDto(getReportBalanceSheetQuerySchema) {}
