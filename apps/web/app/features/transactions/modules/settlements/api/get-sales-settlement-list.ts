import {
  createApiPaginationResponseSchema,
  createApiResponseSchema,
  salesSettlementSchema,
  type IGetSalesInvoiceListQuery,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export const getSettlementList = (query?: IGetSalesInvoiceListQuery) => {
  const queryString = buildQueryString(query);
  return apiClient.get({
    url: `/api/sales/settlement${queryString}`,
    schema: createApiResponseSchema(createApiPaginationResponseSchema(salesSettlementSchema)),
  });
};
