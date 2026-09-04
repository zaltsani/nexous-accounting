import z from "zod";

export const baseSalesSettlementSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number(),
  settlementDate: z.string().datetime(),
  notes: z.string().nullable(),
});

export const salesSettlementSchema = baseSalesSettlementSchema.extend({
  id: z.string(),
  salesInvoiceId: z.string(),
  transactionId: z.string(),
  cashBankAccountId: z.string(),
});

export const createSalesSettlementSchema = baseSalesSettlementSchema;

export type IBaseSalesSettlement = z.infer<typeof baseSalesSettlementSchema>;
export type ISalesSettlement = z.infer<typeof salesSettlementSchema>;
export type ICreateSalesSettlement = z.infer<typeof createSalesSettlementSchema>;
