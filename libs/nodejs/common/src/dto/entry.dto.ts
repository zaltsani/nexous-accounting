import {
  entriesSchema,
  entriesWithoutTransactionIdSchema,
  entrySchema,
  entryWithoutTransactionIdSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class EntryDto extends createZodDto(entrySchema) {}
export class EntriesDto extends createZodDto(entriesSchema) {}
export class EntryWithoutTransactionIdDto extends createZodDto(entryWithoutTransactionIdSchema) {}
export class EntriesWithoutTransactionIdDto extends createZodDto(
  entriesWithoutTransactionIdSchema,
) {}
