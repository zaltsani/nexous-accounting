import { accountSchema, createApiResponseSchema } from "@nexous-accounting/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/libs/api/client";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["account"],
    mutationFn: (id: string) =>
      apiClient.delete({
        url: `/api/accounts/${id}`,
        schema: createApiResponseSchema(accountSchema),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
    onError: (err) => {
      console.error({ err });
    },
  });
}
