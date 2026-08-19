import z from "zod";

export const baseEntrySchema = z.object({
  transactionId: z.string(),
  accountId: z.string(),
  amount: z.number(),
});
