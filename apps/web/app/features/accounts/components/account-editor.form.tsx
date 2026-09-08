import {
  ACCOUNT_TYPE_PREFIX_MAP,
  accountTypeLabels,
  accountTypeSchema,
  NON_DELETABLE_ACCOUNT_CODES,
  normalBalanceAccountTypeMap,
  type IAccount,
  type IEditorAccount,
} from "@nexous-accounting/types";
import {
  cn,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nexous-accounting/ui";
import { Controller, type UseFormReturn } from "react-hook-form";
import { GenericAsyncCombobox } from "~/components/common/generic-async-combobox";
import { getAccountList } from "../api/get-account-list";
import { getAccountById } from "../api/get-account-by-id";

interface EditorAccountFormProps {
  form: UseFormReturn<IEditorAccount>;
  data?: IAccount;
  className?: string;
}

export const EditorAccountForm = ({ form, data, className }: EditorAccountFormProps) => {
  const parentAccountId = form.watch("parentId");
  const currentType = form.watch("type");
  const isSystemAccount = data && NON_DELETABLE_ACCOUNT_CODES.has(data.code);

  const getSuggestedPrefix = (): string | null => {
    if (parentAccountId) {
      const parentCode = form.getValues("_parentCode" as any);
      if (parentCode) {
        return parentCode.length >= 5 && !parentCode.endsWith("0")
          ? parentCode
          : parentCode.replace(/0+$/, "");
      }
    }
    if (currentType && ACCOUNT_TYPE_PREFIX_MAP[currentType]) {
      return ACCOUNT_TYPE_PREFIX_MAP[currentType];
    }
    return null;
  };

  const suggestedPrefix = getSuggestedPrefix();

  return (
    <form className={cn("space-y-4", className)}>
      {/* Parent Account */}
      {!isSystemAccount && (
        <Controller
          control={form.control}
          name="parentId"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Akun Induk</FieldLabel>
              <GenericAsyncCombobox<IAccount>
                value={field.value ?? ""}
                onChange={(val) => {
                  field.onChange(val);
                  if (!val) {
                    form.setValue("normalBalance", null as any);
                    form.setValue("type", null as any);
                    form.setValue("_parentCode" as any, null as any);
                  }
                }}
                onItemSelect={(account) => {
                  form.setValue("normalBalance", account.normalBalance);
                  form.setValue("type", account.type);
                  form.setValue("_parentCode" as any, account.code);
                }}
                queryKey="account"
                placeholder="Pilih Akun Induk (Opsional)"
                fetchListFn={getAccountList}
                fetchByIdFn={getAccountById}
                getOptionValue={(d) => d.id}
                getOptionLabel={(d) => `${d.code} - ${d.name}`}
              />
              <FieldDescription>
                Pilih akun utama jika akun ini merupakan bagian dari kelompok tertentu.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}

      {/* Type */}
      {!isSystemAccount && (
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Tipe Akun</FieldLabel>
              <Select
                value={field.value ?? ""}
                onValueChange={(val) => {
                  field.onChange(val);
                  if (val) form.setValue("normalBalance", normalBalanceAccountTypeMap[val]);
                }}
                items={accountTypeLabels}
                modal={false}
                disabled={Boolean(parentAccountId)}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Pilih tipe akun" />
                </SelectTrigger>
                <SelectContent className="z-100">
                  {accountTypeSchema.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {accountTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Menentukan posisi akun dalam Laporan Keuangan.</FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      )}

      {/* Code */}
      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Kode Akun</FieldLabel>
            <Input
              {...field}
              placeholder={
                suggestedPrefix
                  ? `Contoh: ${suggestedPrefix.padEnd(5, "0").slice(0, 4)}1`
                  : "Contoh: 21001"
              }
              aria-invalid={fieldState.invalid}
              disabled={isSystemAccount}
            />
            <FieldDescription>
              {isSystemAccount
                ? "Kode akun tidak bisa diubah karena termasuk akun dari sistem"
                : suggestedPrefix
                  ? `Disarankan menggunakan awalan kode ${suggestedPrefix}`
                  : "Gunakan kode angka unik sebagai pengenal akun."}
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Name */}
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Nama Akun</FieldLabel>
            <Input
              {...field}
              placeholder="Contoh: Gaji Karyawan"
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>
              Masukkan nama akun yang spesifik dan mudah diidentifikasi.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
};
