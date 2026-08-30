import {
  createApiResponseSchema,
  reportBalanceSheetSchema,
  type IGetReportBalanceSheetQuery,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export const getBalanceSheet = (query?: IGetReportBalanceSheetQuery) => {
  const queryString = buildQueryString(query);
  return apiClient.get({
    url: `/api/reports/balance-sheet${queryString}`,
    schema: createApiResponseSchema(reportBalanceSheetSchema),
  });
};
