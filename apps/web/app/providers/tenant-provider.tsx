import { useEffect } from "react";
import { href, Outlet, useNavigate } from "react-router";
import { useAuth } from "~/features/auth/stores/use-auth";

export default function TenantProvider() {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  console.log({ tenant })

  useEffect(() => {
    if (!tenant) {
      navigate(href("/select-tenant"))
    }
  }, [tenant])

  return <Outlet />
}