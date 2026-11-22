import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@nexous-accounting/ui";
import { ChevronDown, LogOut, User } from "lucide-react";
import { href, Link } from "react-router";
import { useLogout } from "~/features/auth/hooks/use-logout";
import { useAuth } from "~/features/auth/stores/use-auth";

export function UserDropdownMenu() {
  const { user } = useAuth();
  const handleLogout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {user?.name}
        </span>

        <ChevronDown className="h-4 w-4 text-muted-foreground opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            render={(props) => (
              <Link to={"#"} className="cursor-pointer w-full flex items-center" {...props}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            )}
          />

          <DropdownMenuItem
            render={(props) => (
              <Link to={href("/select-tenant")} className="cursor-pointer w-full flex items-center" {...props}>
                <User className="mr-2 h-4 w-4" />
                <span>Ganti Organizations</span>
              </Link>
            )}
          />

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            variant="destructive"
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}