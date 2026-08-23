import { accountSchema, createApiResponseSchema } from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export const getAccountById = (id: string) => {
  return apiClient.get({
    url: `/api/accounts/${id}`,
    schema: createApiResponseSchema(accountSchema),
  });
};
