import z from "zod";

export const baseTransactionSchema = z.object({
  journalCode: z.string(),
  date: z.string().datetime(),
  description: z.string().nullish(),
});

export const baseEntrySchema = z.object({
  transactionId: z.string(),
  accountId: z.string(),
  amount: z.coerce.number(),
});
