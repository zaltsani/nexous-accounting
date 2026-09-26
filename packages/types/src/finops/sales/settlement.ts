import z from "zod";
import { apiListQueryParamsSchema } from "../../common/api-list-query-params.js";
import { accountSchema } from "../../core/account.js";

export const baseSalesSettlementSchema = z.object({
  salesInvoiceId: z.string(),
  accountId: z.string(),
  amount: z.coerce.number(),
  settlementDate: z.string().datetime(),
  notes: z.string().nullish(),
});

export const salesSettlementSchema = baseSalesSettlementSchema.extend({
  id: z.string(),
  transactionId: z.string(),

  account: accountSchema,
});

export const createSalesSettlementSchema = baseSalesSettlementSchema.extend({
  amount: z.number(),
});

export const getSettlementListQuerySchema = apiListQueryParamsSchema.extend({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type IBaseSalesSettlement = z.infer<typeof baseSalesSettlementSchema>;
export type ISalesSettlement = z.infer<typeof salesSettlementSchema>;
export type ICreateSalesSettlement = z.infer<typeof createSalesSettlementSchema>;
export type IGetSettlementListQuery = z.infer<typeof getSettlementListQuerySchema>;
