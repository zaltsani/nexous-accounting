import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/features/auth/stores/use-auth";
import { selectTenant } from "../api/select-tenant";
import { href, useNavigate } from "react-router";

export function useSelectTenant() {
  const { selectTenant: selectTenantStore } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["select-tenant"],
    mutationFn: (tenantId: string) => selectTenant(tenantId),
    onSuccess: (res) => {
      selectTenantStore(res.data);
      navigate(href("/"));
      queryClient.removeQueries();
    },
  });
}
