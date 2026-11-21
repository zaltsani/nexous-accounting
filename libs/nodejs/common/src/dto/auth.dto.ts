import { loginSchema, refreshSchema } from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class LoginDto extends createZodDto(loginSchema) {}
export class RefreshDto extends createZodDto(refreshSchema) {}
