import type { ILogin } from "@nexous-accounting/types";
import { Button, Field, FieldError, FieldLabel, Input } from "@nexous-accounting/ui";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Controller, type SubmitHandler, type UseFormReturn } from "react-hook-form";

interface LoginFormProps {
  form: UseFormReturn<ILogin>;
  onSubmit: SubmitHandler<ILogin>;
}

export function LoginForm({
  form,
  onSubmit,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Email */}
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Email</FieldLabel>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="johndoe@mail.com"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Password</FieldLabel>
            <div className="relative flex items-center">
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="********"
                type={showPassword ? "text" : "password"}
              />
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword
                  ? <EyeOffIcon />
                  : <EyeIcon />
                }
              </Button>
            </div>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Button type="submit">Masuk</Button>
    </form>
  );
};
