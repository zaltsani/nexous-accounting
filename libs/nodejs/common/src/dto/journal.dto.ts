import {
  baseJournalSchema,
  createJournalSchema,
  journalSchema,
  updateJournalSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class BaseJournalDto extends createZodDto(baseJournalSchema) {}
export class JournalDto extends createZodDto(journalSchema) {}
export class CreateJournalDto extends createZodDto(createJournalSchema) {}
export class UpdateJournalDto extends createZodDto(updateJournalSchema) {}
