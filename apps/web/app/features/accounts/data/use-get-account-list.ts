import {
  accountSchema,
  createApiPaginationResponseSchema,
  createApiResponseSchema,
  type IGetAccountListQuery,
} from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/libs/api/client";
import { buildQueryString } from "~/libs/utils/build-query-string";

export function useGetAccountList(params?: IGetAccountListQuery) {
  const queryString = buildQueryString(params);
  return useQuery({
    queryKey: ["account", params],
    queryFn: () =>
      apiClient.get({
        url: `/api/accounts${queryString}`,
        schema: createApiResponseSchema(createApiPaginationResponseSchema(accountSchema)),
      }),
    select: (res) => res?.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
