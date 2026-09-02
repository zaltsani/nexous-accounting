import {
  accountSchema,
  createApiResponseSchema,
  type ICreateAccount,
} from "@nexous-accounting/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/libs/api/client";

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["account"],
    mutationFn: (data: ICreateAccount) =>
      apiClient.post({
        url: "/api/accounts",
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
