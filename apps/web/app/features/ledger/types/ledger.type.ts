import { baseEntrySchema, createTransactionSchema } from "@nexous-accounting/types";
import z from "zod";

export const ledgerEntrySchema = z.object({
  accountId: baseEntrySchema.shape.accountId,
  debit: z.number().nullish(),
  credit: z.number().nullish(),
});

export const ledgerEditorSchema = createTransactionSchema
  .omit({
    journalCode: true,
  })
  .extend({
    entries: ledgerEntrySchema
      .extend({
        accountId: z.string().nullish(),
      })
      .array(),
  })
  .superRefine((data, ctx) => {
    // Filter out completely empty rows (common in UI form grids)
    const filtered = data.entries
      .map((entry, originalIndex) => ({
        ...entry,
        originalIndex,
      }))
      .filter((d) => d.accountId || d.credit || d.debit);

    // Minimum Entries Validation
    if (filtered.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 2,
        origin: "array",
        inclusive: true,
        exact: false,
        message: "Entri tidak boleh kurang dari 2",
        path: ["entries"],
      });
    }

    let totalDebit = 0;
    let totalCredit = 0;

    filtered.forEach((entry) => {
      const debit = entry.debit ?? 0;
      const credit = entry.credit ?? 0;
      const pathIndex = entry.originalIndex;

      // Validate row has accountId
      if (!entry.accountId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Akun harus dipilih.",
          path: ["entries", pathIndex, "accountId"],
        });
      }

      // Validation: Debit OR Credit only (cannot have both or neither)
      if (debit > 0 && credit > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hanya salah satu dari debit dan kredit yang bisa diinput.",
          path: ["entries", pathIndex, "credit"],
        });
      } else if (debit === 0 && credit === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Masukkan nominal debit atau kredit.",
          path: ["entries", pathIndex, "debit"],
        });
      }

      // Convert decimal to integer (cents) during summation to eliminate JS float precision bugs
      totalDebit += Math.round(debit * 100);
      totalCredit += Math.round(credit * 100);
    });

    // Balance Check (Total Debits must equal Total Credits)
    if (totalDebit !== totalCredit) {
      const totalDebitFormatted = (totalDebit / 100).toLocaleString("id-ID");
      const totalCreditFormatted = (totalCredit / 100).toLocaleString("id-ID");

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total debit (${totalDebitFormatted}) dan kredit (${totalCreditFormatted}) tidak seimbang.`,
        path: ["entries"],
      });
    }
  });

export type ILedgerEntry = z.infer<typeof ledgerEntrySchema>;
export type ILedgerEditor = z.infer<typeof ledgerEditorSchema>;
