import { type IGetTransactionListQuery } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { getTransactionList } from "~/api/transactions/get-transaction-list";

export function useGetTransactionList(params?: IGetTransactionListQuery) {
  return useQuery({
    queryKey: ["transaction", params],
    queryFn: () => getTransactionList({
      ...params,
      journalCode: "JU",
    }),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
