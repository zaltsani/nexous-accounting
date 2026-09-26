import {
  SYSTEM_SUB_HEADER_CODES,
  type IAccount,
  type ICreateSalesSettlement,
  type IInvoice,
} from "@nexous-accounting/types";
import { DatePicker, Field, FieldError, FieldLabel, Input } from "@nexous-accounting/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { CurrencyInput } from "~/components/common/currency-input";
import { GenericAsyncCombobox } from "~/components/common/generic-async-combobox";
import { getAccountById } from "~/features/accounts/api/get-account-by-id";
import { getAccountList } from "~/features/accounts/api/get-account-list";
import { getSalesInvoiceList } from "../../../sales/api/get-sales-invoice-list";

interface SettlementOverviewFormProps {
  form: UseFormReturn<ICreateSalesSettlement>;
}

export const SettlementForm = ({ form }: SettlementOverviewFormProps) => {
  return (
    <form className="grid gap-3">
      {/* Invoice */}
      <Controller
        control={form.control}
        name="salesInvoiceId"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Invoice</FieldLabel>
            <GenericAsyncCombobox<IInvoice>
              value={field.value ?? ""}
              onChange={field.onChange}
              queryKey="invoice"
              placeholder="Pilih Invoice"
              fetchListFn={getSalesInvoiceList}
              // fetchByIdFn={getSalesInvoiceList}
              params={{
                status: ["UNPAID", "PARTIAL"],
              }}
              getOptionValue={(d) => d.id}
              getOptionLabel={(d) => `${d.invoiceNumber} - ${d.customerName}`}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Settlement Date */}
      <Controller
        control={form.control}
        name="settlementDate"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Tanggal Penerimaan</FieldLabel>
            <DatePicker
              date={field.value ?? undefined}
              setDate={(val) => val && field.onChange(val)}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Akun */}
      <Controller
        control={form.control}
        name="accountId"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Akun Penerimaan</FieldLabel>
            <GenericAsyncCombobox<IAccount>
              value={field.value ?? ""}
              onChange={field.onChange}
              queryKey="account"
              placeholder="Pilih Akun Pendapatan"
              fetchListFn={getAccountList}
              fetchByIdFn={getAccountById}
              params={{
                parentCode: SYSTEM_SUB_HEADER_CODES.CASH_AND_EQUIVALENTS,
                accountCategory: "child",
              }}
              getOptionValue={(d) => d.id}
              getOptionLabel={(d) => `${d.code} - ${d.name}`}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Amount */}
      <Controller
        control={form.control}
        name="amount"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Amount</FieldLabel>
            <CurrencyInput {...field} placeholder="5.000.000" />
          </Field>
        )}
      />

      {/* Notes */}
      <Controller
        control={form.control}
        name="notes"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Catatan</FieldLabel>
            <Input
              {...field}
              value={field.value ?? undefined}
              placeholder="Masukkan catatan ..."
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
};
