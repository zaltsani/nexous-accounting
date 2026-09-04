import { type IEditorInvoice } from "@nexous-accounting/types";
import { apiClient } from "~/libs/api/client";

export const createSalesInvoice = (data: IEditorInvoice) => {
  return apiClient.post({
    url: "/api/sales/invoice",
    data,
  });
};
