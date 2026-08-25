import {
  createApiPaginationResponseSchema,
  createApiResponseSchema,
  transactionSchema,
  type IGetTransactionListQuery
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export const getTransactionList = (query?: IGetTransactionListQuery) => {
  const queryString = buildQueryString(query);
  return apiClient.get({
    url: `/api/transactions${queryString}`,
    schema: createApiResponseSchema(createApiPaginationResponseSchema(transactionSchema)),
  });
};
