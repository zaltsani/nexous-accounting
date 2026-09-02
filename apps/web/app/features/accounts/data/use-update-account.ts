import {
  accountSchema,
  createApiResponseSchema,
  type IUpdateAccount,
} from "@nexous-accounting/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/libs/api/client";

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["account"],
    mutationFn: ({ id, data }: { id: string; data: IUpdateAccount }) =>
      apiClient.patch({
        url: `/api/accounts/${id}`,
        data,
        schema: createApiResponseSchema(accountSchema),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["report"] });
    },
    onError: (err) => {
      console.error({ err });
    },
  });
}
