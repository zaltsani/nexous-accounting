import { createZodDto } from "nestjs-zod";
import z from "zod";

export const baseEntrySchema = z.object({
  transactionId: z.string(),
  accountId: z.string(),
  amount: z.number(),
});

export const entrySchema = baseEntrySchema;
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

export class EntryDto extends createZodDto(entrySchema) {}
export class EntriesDto extends createZodDto(entriesSchema) {}
export class EntryWithoutTransactionIdDto extends createZodDto(entryWithoutTransactionIdSchema) {}
export class EntriesWithoutTransactionIdDto extends createZodDto(
  entriesWithoutTransactionIdSchema,
) {}
