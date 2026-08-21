import { Navigate, Outlet, useMatches } from "react-router";
import { hasPermission } from "~/lib/utils/permissions";
import { usePermissions } from "~/providers/permission-provider";

interface RouteHandleProps {
  requiredPermission?: string;
}

export default function PermissionGuard() {
  const { permissions, loading } = usePermissions();
  const matches = useMatches();

  if (loading) {
    return <div className="p-6">Validating access privileges...</div>;
  }

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as RouteHandleProps | undefined;
  
  const requiredPermission = handle?.requiredPermission;

  if (requiredPermission) {
    const isAllowed = hasPermission(permissions || [], requiredPermission);

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}