import z from "zod";
import { baseAccountSchema } from "./account.js";
import { baseEntrySchema, baseTransactionSchema } from "./base-schemas.js";

export const entrySchema = baseEntrySchema.extend({
  account: baseAccountSchema.optional(),
  transaction: baseTransactionSchema.optional(),
});
export const entriesSchema = baseEntrySchema.array();
export const entryWithoutTransactionIdSchema = baseEntrySchema.omit({
  transactionId: true,
});
export const entriesWithoutTransactionIdSchema = entryWithoutTransactionIdSchema.array();

export type IBaseEntry = z.infer<typeof baseEntrySchema>;
export type IEntry = z.infer<typeof entrySchema>;
export type IEntries = z.infer<typeof entriesSchema>;
export type IEntryWithoutTransactionId = z.infer<typeof entryWithoutTransactionIdSchema>;
export type IEntriesWithoutTransactionId = z.infer<typeof entriesWithoutTransactionIdSchema>;
