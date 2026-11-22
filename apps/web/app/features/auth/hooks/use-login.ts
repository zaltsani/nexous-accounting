import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/login";
import { useAuth } from "../stores/use-auth";
import type { ILogin } from "@nexous-accounting/types";

export function useLogin() {
  const { login: loginStore } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: ILogin) => login(data),
    onSuccess: (res) => {
      loginStore(res.data);
      queryClient.removeQueries();
    },
  });
}
