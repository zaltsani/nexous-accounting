import { buildQueryString } from "~/libs/utils/build-query-string";
import {
  accountSchema,
  createApiPaginationResponseSchema,
  createApiResponseSchema,
  type IApiListQueryParams,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export const getAccountList = (params?: IApiListQueryParams) => {
  const queryString = buildQueryString(params);
  return apiClient.get({
    url: `/api/accounts${queryString}`,
    schema: createApiResponseSchema(createApiPaginationResponseSchema(accountSchema)),
  });
};
