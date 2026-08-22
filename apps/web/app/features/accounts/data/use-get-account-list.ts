import {
  accountSchema,
  createApiPaginationResponseSchema,
  createApiResponseSchema,
} from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/libs/api/client";

export function useGetAccountList(params?: any) {
  return useQuery({
    queryKey: ["account", params],
    queryFn: () =>
      apiClient.get({
        url: `/api/accounts`,
        schema: createApiResponseSchema(createApiPaginationResponseSchema(accountSchema)),
      }),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
