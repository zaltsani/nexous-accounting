import type { IGetSettlementListQuery } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { getSettlementList } from "../api/get-sales-settlement-list";

export function useGetSettlementList(params?: IGetSettlementListQuery) {
  return useQuery({
    queryKey: ["settlement", params],
    queryFn: () => getSettlementList(params),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
