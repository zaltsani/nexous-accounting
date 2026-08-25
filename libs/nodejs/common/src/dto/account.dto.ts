import {
  accountSchema,
  createAccountSchema,
  getAccountListQuerySchema,
  updateAccountSchema,
} from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class AccountDto extends createZodDto(accountSchema) {}
export class CreateAccountDto extends createZodDto(createAccountSchema) {}
export class UpdateAccountDto extends createZodDto(updateAccountSchema) {}
export class GetAccountListQueryDto extends createZodDto(getAccountListQuerySchema) {}
