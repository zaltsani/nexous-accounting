import z from "zod";

export const apiListQueryParamsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type IApiListQueryParams = z.infer<typeof apiListQueryParamsSchema>;
