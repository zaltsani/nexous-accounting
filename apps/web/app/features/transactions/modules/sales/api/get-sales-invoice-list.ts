import {
  createApiPaginationResponseSchema,
  createApiResponseSchema,
  invoiceSchema,
  type IGetSalesInvoiceListQuery,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export const getSalesInvoiceList = (query?: IGetSalesInvoiceListQuery) => {
  const queryString = buildQueryString(query);
  return apiClient.get({
    url: `/api/sales/invoice${queryString}`,
    schema: createApiResponseSchema(createApiPaginationResponseSchema(invoiceSchema)),
  });
};
