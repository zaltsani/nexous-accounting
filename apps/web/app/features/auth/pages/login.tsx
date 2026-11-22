import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type ILogin } from "@nexous-accounting/types";
import { useForm } from "react-hook-form";
import { href, useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";
import { LoginForm } from "../components/login-form";
import { useLogin } from "../hooks/use-login";

export function meta() {
  return [{ title: "Login" }, { name: "description", content: "Sign in to your account." }];
}

export default function () {
  const navigate = useNavigate();

  const form = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const handleSubmit = (values: ILogin) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        navigate(href("/"));
        toast.add({
          description: res.message || "Berhasil masuk ke sistem",
        });
      },
      onError: (err: unknown) => {
        toast.add({
          type: "error",
          description: err instanceof Error && err.message,
        });
      },
    });
  };

  return (
    <div className="grid gap-8 py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-4 md:gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold">Masuk</h1>
        <p className="text-sm text-accent-foreground tracking-tight">
          Masuk menggunakan akun anda untuk melanjutkan.
        </p>
      </div>
      <LoginForm form={form} onSubmit={handleSubmit} />
    </div>
  );
}
