import {
  createApiResponseSchema,
  transactionSchema,
  type ICreateTransaction,
} from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export const createTransaction = (data: ICreateTransaction) => {
  return apiClient.post({
    url: "/api/transactions",
    data,
    schema: createApiResponseSchema(transactionSchema),
  });
};
