import z from "zod";

export const apiListQueryParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type IApiListQueryParams = z.infer<typeof apiListQueryParamsSchema>;
