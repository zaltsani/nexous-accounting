import { type IGetSalesInvoiceListQuery } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { getSalesInvoiceList } from "../api/get-sales-invoice-list";

export function useGetSalesInvoiceList(params?: IGetSalesInvoiceListQuery) {
  return useQuery({
    queryKey: ["sales", "invoice", params],
    queryFn: () => getSalesInvoiceList(params),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
