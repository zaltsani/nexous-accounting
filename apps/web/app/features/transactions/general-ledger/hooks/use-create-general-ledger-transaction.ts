import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "~/features/transactions/api/transactions/create-transaction";
import type { ILedgerEditor } from "../types/ledger.type";
import { entriesMapperToTransactionData } from "../utils/mapper-to-transaction-editor";

export function useCreateGeneralLedgerTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["general-ledger"],
    mutationFn: (data: ILedgerEditor) => createTransaction(entriesMapperToTransactionData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["general-ledger"] });
    },
    onError: (err) => {
      console.error({ err });
    },
  });
}
