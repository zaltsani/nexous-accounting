import {
  accountTypeLabels,
  accountTypeSchema,
  normalBalanceAccountTypeMap,
  type ICreateAccount,
} from "@nexous-accounting/types";
import {
  cn,
  Field,
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

interface CreateAccountFormProps {
  form: UseFormReturn<ICreateAccount>;
  className?: string;
}

export const CreateAccountForm = ({ form, className }: CreateAccountFormProps) => {
  return (
    <form className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Type */}
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
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Code */}
      <Controller
        control={form.control}
        name="code"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Kode Akun</FieldLabel>
            <Input {...field} placeholder="e.g. 1001" />
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
            <Input {...field} placeholder="e.g. Gaji Karyawan" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
};
