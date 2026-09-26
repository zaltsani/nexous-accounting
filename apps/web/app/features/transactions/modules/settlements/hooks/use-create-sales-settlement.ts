import type { ICreateSalesSettlement } from "@nexous-accounting/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalesSettlement } from "../api/create-sales-settlement";

export function useCreateSalesSettlement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["sales", "settlement"],
    mutationFn: (data: ICreateSalesSettlement) => createSalesSettlement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (err) => {
      console.error({ err });
    },
  });
}
