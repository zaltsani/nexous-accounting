import { apiListQueryParamsSchema } from "@nexous-accounting/types";
import { createZodDto } from "nestjs-zod";

export class ApiListQueryParamsDto extends createZodDto(apiListQueryParamsSchema) {}
