import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";
import { logout } from "../api/logout";
import { useAuth } from "../stores/use-auth";

export function useLogout() {
  const { logout: logoutStore } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Backend cookie clear failed", error);
    } finally {
      navigate("/login", { replace: true });
      logoutStore();

      queryClient.clear();

      toast.add({
        description: "Berhasil keluar dari sistem",
      });
    }
  };

  return handleLogout;
}
