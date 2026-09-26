import {
  salesTypeSchema,
  SYSTEM_SUB_HEADER_CODES,
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
import {
  CalculatorIcon,
  ClockIcon,
  FileTextIcon,
  HourglassIcon,
  type LucideIcon,
} from "lucide-react";
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
  DEFERRED_SERVICE: {
    title: "Jasa Ditangguhkan",
    description:
      "Pembayaran diterima di awal, namun penyerahan jasa ditahan/dilakukan kemudian dicatat ke Pendapatan Diterima Dimuka (Liabilitas).",
    icon: HourglassIcon,
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
                  if (type === "CREDIT_SALE") return;

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
              date={field.value ?? undefined}
              setDate={(val) => val && field.onChange(val)}
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
                  ? "Akun Piutang Usaha (AR)"
                  : invoiceType === "CASH_SALE"
                    ? "Akun Kas / Bank Penerima"
                    : invoiceType === "DEFERRED_SERVICE"
                      ? "Akun Liabilitas (Pendapatan Diterima Dimuka)"
                      : "Akun Liabilitas Uang Muka Penjualan"}
              </FieldLabel>
              <GenericAsyncCombobox<IAccount>
                value={field.value ?? ""}
                onChange={field.onChange}
                queryKey="account"
                placeholder={
                  invoiceType === "DEFERRED_SERVICE"
                    ? "Pilih Akun Pendapatan Diterima Dimuka"
                    : "Pilih Akun Pendapatan"
                }
                fetchListFn={getAccountList}
                fetchByIdFn={getAccountById}
                params={{
                  parentCode:
                    invoiceType === "CREDIT_SALE"
                      ? SYSTEM_SUB_HEADER_CODES.RECEIVABLE
                      : invoiceType === "CASH_SALE"
                        ? SYSTEM_SUB_HEADER_CODES.CASH_AND_EQUIVALENTS
                        : SYSTEM_SUB_HEADER_CODES.PAYABLE,
                  accountCategory: "child",
                }}
                getOptionValue={(d) => d.id}
                getOptionLabel={(d) => `${d.code} - ${d.name}`}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}

      {/* Down Payment & Deferred Service Settlement Account */}
      {(invoiceType === "DOWN_PAYMENT" || invoiceType === "DEFERRED_SERVICE") && (
        <Field>
          <FieldLabel>
            {invoiceType === "DOWN_PAYMENT"
              ? "Rincian Setoran Uang Muka (DP)"
              : "Rincian Penerimaan Kas / Bank"}
          </FieldLabel>
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
                    placeholder="Pilih Akun Kas / Bank Target"
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
          </div>
        </Field>
      )}
    </form>
  );
};
