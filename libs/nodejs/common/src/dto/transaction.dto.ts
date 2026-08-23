import {
  baseTransactionSchema,
  createTransactionDtoSchema,
  createTransactionSchema,
  updateTransactionSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class BaseTransactionDto extends createZodDto(baseTransactionSchema) {}
export class CreateTransactionDto extends createZodDto(createTransactionDtoSchema) {}
export class UpdateTransactionDto extends createZodDto(updateTransactionSchema) {}
