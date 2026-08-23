import type { ICreateTransaction } from "@nexous-accounting/types";
import type { ILedgerEditor } from "../types/ledger.type";

export const entriesMapperToTransactionData = (data: ILedgerEditor): ICreateTransaction => {
  return {
    ...data,
    journalCode: "GL",
    entries: data.entries.map((entry) => {
      const debit = entry.debit ?? 0;
      const credit = entry.credit ?? 0;

      const amount = debit > 0 ? debit : -credit;

      return {
        accountId: entry.accountId!,
        amount,
      };
    }),
  };
};
