import {
  baseTransactionSchema,
  createTransactionSchema,
  updateTransactionSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class BaseTransactionDto extends createZodDto(baseTransactionSchema) {}
export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}
export class UpdateTransactionDto extends createZodDto(updateTransactionSchema) {}
