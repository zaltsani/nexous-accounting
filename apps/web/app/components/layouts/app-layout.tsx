import { SidebarInset, SidebarProvider } from "@nexous/ui";
import { Outlet, useNavigation } from "react-router";
import { AppHeader } from "../common/app-header";
import { AppSidebar } from "../common/app-sidebar";
import { LoadingState } from "../common/loading-state";

export default function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
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
  )
}