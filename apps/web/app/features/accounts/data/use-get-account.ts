import { accountSchema, createApiResponseSchema } from "@nexous-accounting/types";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/libs/api/client";

export function useGetAccount(id: string) {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () =>
      apiClient.get({
        url: `/api/accounts/${id}`,
        schema: createApiResponseSchema(accountSchema),
      }),
    select: (res) => res.data,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });
}
