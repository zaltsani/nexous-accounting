import { createZodDto } from "nestjs-zod";
import z from "zod";
import { baseEntrySchema } from "./entry.js";

export const baseTransactionSchema = z.object({
  journalId: z.string(),
  date: z.string().datetime(),
  description: z.string().nullish(),
});

export const transactionSchema = baseTransactionSchema.extend({
  id: z.string(),
  entries: baseEntrySchema.array().min(2),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createEntrySchema = baseEntrySchema.omit({
  transactionId: true,
});

export const createTransactionSchema = baseTransactionSchema.extend({
  entries: createEntrySchema.array().min(2),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type IBaseTransaction = z.infer<typeof baseTransactionSchema>;
export type ITransaction = z.infer<typeof transactionSchema>;
export type ICreateEntry = z.infer<typeof createEntrySchema>;
export type ICreateTransaction = z.infer<typeof createTransactionSchema>;
export type IUpdateTransaction = z.infer<typeof updateTransactionSchema>;

export class BaseTransactionDto extends createZodDto(baseTransactionSchema) {}
export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}
export class UpdateTransactionDto extends createZodDto(updateTransactionSchema) {}
