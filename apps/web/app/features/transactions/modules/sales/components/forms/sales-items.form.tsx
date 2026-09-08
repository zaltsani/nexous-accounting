import type { IAccount, IEditorInvoice } from "@nexous-accounting/types";
import { Button, Field, FieldError, Input } from "@nexous-accounting/ui";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import {
  Controller,
  useFieldArray,
  type FieldArrayWithId,
  type UseFormReturn,
} from "react-hook-form";
import { CurrencyInput } from "~/components/common/currency-input";
import { GenericAsyncCombobox } from "~/components/common/generic-async-combobox";
import { NumberInput } from "~/components/common/number-input";
import { DataTable } from "~/components/data-table/data-table";
import { getAccountById } from "~/features/accounts/api/get-account-by-id";
import { getAccountList } from "~/features/accounts/api/get-account-list";

interface SalesItemsFormProps {
  form: UseFormReturn<IEditorInvoice>;
}
export const SalesItemsForm = ({ form }: SalesItemsFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const columns: ColumnDef<FieldArrayWithId<IEditorInvoice, "items">>[] = [
    {
      id: "itemName",
      meta: { className: "min-w-35" },
      header: "Nama Item",
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`items.${row.index}.itemName`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.error}>
              <Input
                {...field}
                placeholder="Contoh: Penjualan Sepatu"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ),
    },
    {
      id: "unitPrice",
      header: "Unit Price",
      meta: { className: "min-w-35" },
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`items.${row.index}.unitPrice`}
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
      id: "quantity",
      header: "Quantity",
      meta: { className: "min-w-35" },
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`items.${row.index}.quantity`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.error}>
              <NumberInput {...field} placeholder="Contoh: 10" aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ),
    },
    {
      id: "revenueAccountId",
      header: "Account Pendapatan",
      cell: ({ row }) => (
        <Controller
          control={form.control}
          name={`items.${row.index}.revenueAccountId`}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <GenericAsyncCombobox<IAccount>
                value={field.value ?? ""}
                onChange={field.onChange}
                queryKey="account"
                placeholder="Pilih Akun Pendapatan"
                fetchListFn={getAccountList}
                fetchByIdFn={getAccountById}
                params={{ type: "REVENUE", accountCategory: "child" }}
                getOptionValue={(d) => d.id}
                getOptionLabel={(d) => `${d.code} - ${d.name}`}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      ),
    },
    {
      id: "action",
      meta: { align: "center", className: "max-w-content" },
      header: "Action",
      cell: ({ row }) => (
        <Button variant="destructive" onClick={() => remove(row.index)}>
          <Trash2Icon />
        </Button>
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
      <DataTable table={table} showToolbar={false} showPagination={false} verticalAlign="top" />
      <Button variant="black" onClick={() => append({} as any)} className="w-full">
        Tambah Item
      </Button>
    </div>
  );
};
