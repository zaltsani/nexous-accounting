import { type IGetReportBalanceSheetQuery } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { getBalanceSheet } from "../api/get-balance-sheet";

export function useGetBalanceSheet(query?: IGetReportBalanceSheetQuery) {
  return useQuery({
    queryKey: ["report", "balance-sheet", query],
    queryFn: () => getBalanceSheet(query),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
