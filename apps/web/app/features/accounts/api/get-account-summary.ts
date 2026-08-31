import {
  accountSummarySchema,
  createApiResponseSchema,
  type IGetAccountSummaryQuery,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export const getAccountSummary = (accountId: string, query?: IGetAccountSummaryQuery) => {
  const queryString = buildQueryString(query);
  return apiClient.get({
    url: `/api/accounts/${accountId}/summary${queryString}`,
    schema: createApiResponseSchema(accountSummarySchema),
  });
};
