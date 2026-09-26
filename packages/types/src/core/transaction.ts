import z from "zod";
import { apiListQueryParamsSchema } from "../common/api-list-query-params.js";
import { baseEntrySchema, baseTransactionSchema } from "./base-schemas.js";
import { entrySchema } from "./entry.js";
import { baseJournalSchema } from "./journal.js";

export const transactionSchema = baseTransactionSchema.extend({
  id: z.string(),
  entries: entrySchema.array().min(2),
  journal: baseJournalSchema.nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createEntrySchema = baseEntrySchema.omit({
  transactionId: true,
});

export const createTransactionSchema = baseTransactionSchema.extend({
  date: z.string().datetime(),
  entries: createEntrySchema.array().min(2),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const createTransactionDtoSchema = createTransactionSchema.extend({
  date: z.string(),
});

export const getTransactionListQuerySchema = apiListQueryParamsSchema.extend({
  journalCode: z.string().optional(),
  accountId: z.string().optional(),
  accountCode: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type IBaseTransaction = z.infer<typeof baseTransactionSchema>;
export type ITransaction = z.infer<typeof transactionSchema>;
export type ICreateEntry = z.infer<typeof createEntrySchema>;
export type ICreateTransaction = z.infer<typeof createTransactionSchema>;
export type IUpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type IGetTransactionListQuery = z.infer<typeof getTransactionListQuerySchema>;
