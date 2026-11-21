import { createUserSchema, userSchema } from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class UserDto extends createZodDto(userSchema) {}
export class CreateUserDto extends createZodDto(createUserSchema) {}
