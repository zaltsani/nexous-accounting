import { href, Navigate, Outlet, useNavigation } from "react-router";
import { useAuth } from "~/features/auth/stores/use-auth";
import { PermissionProvider } from "~/providers/permission-provider";
import { AppHeader } from "../app-header";
import { AppSidebar } from "../app-sidebar";
import { LoadingState } from "../loading-state";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

export default function AppLayout() {
  const { user, isHydrated } = useAuth();
  const navigation = useNavigation();

  if (!isHydrated) return;

  if (!user?.role) {
    <Navigate to={href("/login")} replace />
  };

  const isLoading = navigation.state === "loading";

  return (
    <PermissionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-col flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
            {isLoading
              ? <LoadingState />
              : <Outlet />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PermissionProvider>
  )
}