import { useEffect, type ReactNode } from "react";
import { href, useLocation, useNavigate } from "react-router";
import { useAuth } from "~/features/auth/stores/use-auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      if (pathname.includes("auth")) return;
      navigate(href("/login"));
    }
    if (isAuthenticated && pathname.startsWith("/login")) navigate(href("/"));
  }, [isAuthenticated, isHydrated]);

  return children;
}
