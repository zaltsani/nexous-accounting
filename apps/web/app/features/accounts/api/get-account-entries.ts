import {
  createApiPaginationResponseSchema,
  createApiResponseSchema,
  entrySchema,
  type IApiListQueryParams,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export const getAccountEntries = (accountId: string, query?: IApiListQueryParams) => {
  const queryString = buildQueryString(query);
  return apiClient.get({
    url: `/api/accounts/${accountId}/entries${queryString}`,
    schema: createApiResponseSchema(createApiPaginationResponseSchema(entrySchema)),
  });
};
