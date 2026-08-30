import z from "zod";
import { accountNodeSchema } from "./account.js";

export const reportBalanceSheetSchema = z.object({
  asOfDate: z.string(),
  summary: z.object({
    totalAssets: z.number(),
    totalLiabilities: z.number(),
    totalEquities: z.number(),
    totalRevenue: z.number(),
    totalExpense: z.number(),
    netIncome: z.number(),
    isBalanced: z.boolean(),
  }),
  assets: accountNodeSchema.array(),
  liabilities: accountNodeSchema.array(),
  equity: accountNodeSchema.array(),
});

export const getReportBalanceSheetQuerySchema = z.object({
  asOfDate: z.string().optional(),
});

export type IReportBalaceSheet = z.infer<typeof reportBalanceSheetSchema>;
export type IGetReportBalanceSheetQuery = z.infer<typeof getReportBalanceSheetQuerySchema>;
