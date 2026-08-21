import z from "zod";

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string(),
  });

export type ApiResponse<T = any> = z.infer<
  ReturnType<typeof createApiResponseSchema<z.ZodType<T>>>
>;

export const createApiPaginationResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    items: z.array(dataSchema),
    page: z.number(),
    limit: z.number(),
    totalCount: z.number(),
  });

export type ApiPaginationResponse<T = any> = z.infer<
  ReturnType<typeof createApiPaginationResponseSchema<z.ZodType<T>>>
>;

export const createApiErrorSchema = <T extends z.ZodTypeAny = z.ZodTypeAny>(dataSchema?: T) =>
  z.object({
    statusCode: z.number().optional(),
    message: z.string(),
    data: dataSchema ?? (z.unknown() as unknown as T),
  });

export type ApiErrorPayload<T = unknown> = z.infer<
  ReturnType<typeof createApiErrorSchema<z.ZodType<T>>>
>;

export class ApiError<T = unknown> extends Error implements ApiErrorPayload<T> {
  statusCode?: number;
  data: T;

  constructor(message: string, statusCode?: number, data?: T) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data as T;
  }
}
