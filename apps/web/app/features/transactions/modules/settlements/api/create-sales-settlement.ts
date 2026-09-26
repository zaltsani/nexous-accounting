import { type ICreateSalesSettlement } from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export const createSalesSettlement = (data: ICreateSalesSettlement) => {
  return apiClient.post({
    url: "/api/sales/settlement",
    data,
  });
};
