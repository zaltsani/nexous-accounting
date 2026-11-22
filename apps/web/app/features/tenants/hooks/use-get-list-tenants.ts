import { useQuery } from "@tanstack/react-query";
import { getListTenants } from "../api/get-list-tenants";

export function useGetTenantList() {
  return useQuery({
    queryKey: ["tenant"],
    queryFn: getListTenants,
    select: (res) => res?.data,
  });
}
