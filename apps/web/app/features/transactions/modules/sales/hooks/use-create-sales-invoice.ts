import type { IEditorInvoice } from "@nexous-accounting/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalesInvoice } from "../api/create-sales-invoice";

export function useCreateSalesInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["sales", "invoice"],
    mutationFn: (data: IEditorInvoice) => createSalesInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (err) => {
      console.error({ err });
    },
  });
}
