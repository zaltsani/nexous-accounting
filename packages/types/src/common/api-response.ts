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
