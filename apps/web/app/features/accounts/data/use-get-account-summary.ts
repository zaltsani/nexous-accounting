import { type IGetAccountSummaryQuery } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { getAccountSummary } from "../api/get-account-summary";

export function useGetAccountSummary(id: string, query?: IGetAccountSummaryQuery) {
  return useQuery({
    queryKey: ["account", id, "summary", query],
    queryFn: () => getAccountSummary(id, query),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
