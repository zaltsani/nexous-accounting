import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { QueryProvider } from "./query-provider";
import AuthProvider from "./auth-provider";

export default function AppProvider() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [navigate]);

  return (
    <QueryProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryProvider>
  );
}
