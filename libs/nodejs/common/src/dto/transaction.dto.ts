import {
  baseTransactionSchema,
  createTransactionDtoSchema,
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionListQuerySchema,
  transactionSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class BaseTransactionDto extends createZodDto(baseTransactionSchema) {}
export class TransactionDto extends createZodDto(transactionSchema) {}
export class CreateTransactionDto extends createZodDto(createTransactionDtoSchema) {}
export class UpdateTransactionDto extends createZodDto(updateTransactionSchema) {}
export class GetTransactionListQueryDto extends createZodDto(getTransactionListQuerySchema) {}
