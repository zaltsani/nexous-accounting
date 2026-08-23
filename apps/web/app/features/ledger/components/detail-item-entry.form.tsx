import type { IAccount } from "@nexous-accounting/types";
import { Button, Field, FieldError } from "@nexous-accounting/ui";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import {
  Controller,
  useFieldArray,
  type FieldArrayWithId,
  type UseFormReturn,
} from "react-hook-form";
import { GenericAsyncCombobox } from "~/components/common/generic-async-combobox";
import { DataTable } from "~/components/data-table/data-table";
import { getAccountById } from "~/features/accounts/api/get-account-by-id";
import { getAccountList } from "~/features/accounts/api/get-account-list";
import type { ILedgerEditor } from "../types/ledger.type";
import { CurrencyInput } from "~/components/common/currency-input";

interface DetailItemEntryFormProps {
  form: UseFormReturn<ILedgerEditor>;
}
export const DetailItemEntryForm = ({ form }: DetailItemEntryFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  console.log({ fields });

  const columns: ColumnDef<FieldArrayWithId<ILedgerEditor, "entries">>[] = [
    {
      id: "accountId",
      header: "Akun",
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`entries.${row.index}.accountId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.error}>
              <div className="relative min-w-30">
                <GenericAsyncCombobox<IAccount>
                  value={field.value}
                  onChange={field.onChange}
                  onItemSelect={(account) => console.log({ account })}
                  queryKey="account"
                  placeholder="Pilih Akun"
                  fetchListFn={getAccountList}
                  fetchByIdFn={getAccountById}
                  getOptionValue={(d) => d.id}
                  getOptionLabel={(d) => `${d.code} - ${d.name}`}
                />
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ),
    },
    {
      id: "debit",
      header: "Debit",
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`entries.${row.index}.debit`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.error}>
              <CurrencyInput {...field} placeholder="50.000" aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ),
    },
    {
      id: "credit",
      header: "Kredit",
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`entries.${row.index}.credit`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.error}>
              <CurrencyInput {...field} placeholder="50.000" aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="sm:text-lg md:text-xl font-semibold">Entri Data</h1>
        <Button onClick={() => append({})}>Tambah Entri</Button>
      </div>
      <DataTable table={table} showToolbar={false} showPagination={false} verticalAlign="top" />
    </div>
  );
};
