import { BellIcon, BoxesIcon } from "lucide-react";
import { useMatches } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { UserDropdownMenu } from "./user-dropdown-menu";

interface RouteHandleProps {
  title?: string;
  description?: string;
}

export function AppHeader() {
  const isMobile = useIsMobile();
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch?.handle as RouteHandleProps | undefined;

  const title = handle?.title;
  const description = handle?.description;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 border-b sticky top-0 bg-white z-10">
      {isMobile ? (
        <div className="flex w-full items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
            >
              <BoxesIcon size={20} className="size-5" />
            </Button>
            <h1 className="font-semibold">SmartWMS</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
            >
              <BellIcon />
            </Button>
            <SidebarTrigger />
          </div>
        </div>
      ) : (
        <div className="flex justify-between w-full items-center gap-2 px-6 py-3">
          <div className="grid items-center">
            <h1 className="font-semibold">{title}</h1>
            <h2 className="text-xs">{description}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              <BellIcon />
            </Button>
            <Separator orientation="vertical" className="h-8 my-auto" />
            <UserDropdownMenu />
          </div>
        </div>
      )}
    </header>
  )
}