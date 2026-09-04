import {
  salesTypeSchema,
  type IAccount,
  type IEditorInvoice,
  type ISalesType,
} from "@nexous-accounting/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  DatePicker,
  Field,
  FieldError,
  FieldLabel,
  Input,
} from "@nexous-accounting/ui";
import { CalculatorIcon, ClockIcon, FileTextIcon, type LucideIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { CurrencyInput } from "~/components/common/currency-input";
import { GenericAsyncCombobox } from "~/components/common/generic-async-combobox";
import { getAccountById } from "~/features/accounts/api/get-account-by-id";
import { getAccountList } from "~/features/accounts/api/get-account-list";

interface ISalesTypeLabel {
  title: string;
  description: string;
  icon: LucideIcon;
}

const SalesTypeLabels: Record<ISalesType, ISalesTypeLabel> = {
  CREDIT_SALE: {
    title: "Kredit",
    description: "Dicatat ke Piutang Usaha (AR). Pembayaran diterima pada tanggal jatuh tempo.",
    icon: ClockIcon,
  },
  CASH_SALE: {
    title: "Tunai / Langsung",
    description: "Pembayaran diterima secara langsung. Langsung dicatat ke akun Kas/Bank.",
    icon: CalculatorIcon,
  },
  DOWN_PAYMENT: {
    title: "Uang Muka (DP)",
    description: "Penerimaan pembayaran di muka atau deposit sebelum barang/jasa diserahkan.",
    icon: FileTextIcon,
  },
};

interface InvoiceOverviewFormProps {
  form: UseFormReturn<IEditorInvoice>;
}

export const InvoiceOverviewForm = ({ form }: InvoiceOverviewFormProps) => {
  const invoiceType = form.watch("type");

  return (
    <form className="grid gap-3">
      {/* Type */}
      <Controller
        control={form.control}
        name="type"
        render={({ field, fieldState }) => {
          return (
            <Field>
              <FieldLabel>Tipe Penjualan</FieldLabel>
              <div className="grid md:grid-cols-3 gap-3">
                {salesTypeSchema.options.map((type) => {
                  const item = SalesTypeLabels[type];
                  const Icon = item.icon;
                  const isSelected = field.value === type;

                  return (
                    <Card
                      key={type}
                      onClick={() => field.onChange(type)}
                      className={cn(
                        "cursor-pointer ease-in-out duration-300 border",
                        isSelected && "bg-primary/10 border-primary",
                      )}
                    >
                      <CardHeader className="flex items-center gap-3">
                        <Icon />
                        <CardTitle>{SalesTypeLabels[type].title}</CardTitle>
                      </CardHeader>
                      <CardContent>{SalesTypeLabels[type].description}</CardContent>
                    </Card>
                  );
                })}
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          );
        }}
      />

      {/* Invoice Number */}
      <Controller
        control={form.control}
        name="invoiceNumber"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Invoice Number</FieldLabel>
            <Input
              {...field}
              placeholder="Contoh: INV-2026/08/001"
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Issue Date */}
      <Controller
        control={form.control}
        name="issueDate"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Issue Date</FieldLabel>
            <DatePicker
              date={field.value ? new Date(field.value) : undefined}
              setDate={(val) => val && field.onChange(val.toISOString())}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Customer Name */}
      <Controller
        control={form.control}
        name="customerName"
        render={({ field, fieldState }) => (
          <Field aria-invalid={fieldState.invalid}>
            <FieldLabel>Nama Customer</FieldLabel>
            <Input
              {...field}
              placeholder="Contoh: Matsunaga Shohei"
              aria-invalid={fieldState.invalid}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Accounting & Settlement Configuration */}
      {invoiceType && (
        <Controller
          control={form.control}
          name={"accountId"}
          render={({ field, fieldState }) => (
            <Field aria-invalid={fieldState.invalid}>
              <FieldLabel required>
                {invoiceType === "CREDIT_SALE"
                  ? "Accounts Receivable (AR) Account"
                  : invoiceType === "CASH_SALE"
                    ? "Destination Cash / Bank Account"
                    : "Accounts Receivable / Deposit Liability Account"}
              </FieldLabel>
              <GenericAsyncCombobox<IAccount>
                value={field.value ?? ""}
                onChange={field.onChange}
                queryKey="account"
                placeholder="Pilih Akun Pendapatan"
                fetchListFn={getAccountList}
                fetchByIdFn={getAccountById}
                params={{
                  type:
                    invoiceType === "CREDIT_SALE" || invoiceType === "CASH_SALE"
                      ? "ASSET"
                      : "LIABILITY",
                }}
                getOptionValue={(d) => d.id}
                getOptionLabel={(d) => `${d.code} - ${d.name}`}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}

      {/* Down Payment */}
      {invoiceType === "DOWN_PAYMENT" && (
        <Field>
          <FieldLabel>Down Payment</FieldLabel>
          <div className="grid sm:grid-cols-2 gap-3">
            <Controller
              control={form.control}
              name="downPaymentAmount"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <CurrencyInput {...field} placeholder="5.000.000" />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="settlementAccountId"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <GenericAsyncCombobox<IAccount>
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    queryKey="account"
                    placeholder="Pilih Akun Pendapatan"
                    fetchListFn={getAccountList}
                    fetchByIdFn={getAccountById}
                    params={{
                      type: "ASSET",
                    }}
                    getOptionValue={(d) => d.id}
                    getOptionLabel={(d) => `${d.code} - ${d.name}`}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </Field>
      )}

      {/* Action Status */}
      {/* <Controller
        control={form.control}
        name="action"
        render={({ field, fieldState }) => (
          <Field
            aria-invalid={fieldState.invalid}
            orientation={isMobile ? "vertical" : "horizontal"}
            className="w-fit gap-3 sm:gap-4"
          >
            <FieldLabel>Invoice Status</FieldLabel>
            <div className="flex items-center gap-1 p-1 border rounded-md">
              {invoiceActionStatusSchema.options.map((status) => {
                const item = InvoiceActionStatusLabels[status];
                const Icon = item.icon;
                const isSelected = field.value === status;

                return (
                  <Button
                    key={status}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => field.onChange(status)}
                  >
                    <Icon />
                    {item.title}
                  </Button>
                );
              })}
            </div>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      /> */}
    </form>
  );
};
