import { type IApiListQueryParams } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { getAccountEntries } from "../api/get-account-entries";

export function useGetAccountEntries(id: string, query?: IApiListQueryParams) {
  return useQuery({
    queryKey: ["account", id, "entries", query],
    queryFn: () => getAccountEntries(id, query),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
