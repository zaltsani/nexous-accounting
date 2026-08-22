import {
  Button,
  cn,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useIsMobile,
  useSidebar
} from "@nexous/ui";
import {
  BellIcon,
  BoxesIcon,
  PlusIcon,
  SquareArrowLeftIcon,
  SquareArrowRightIcon,
  XIcon
} from "lucide-react";
import * as React from "react";
import { Link, useLocation } from "react-router";
import { SidebarData } from "~/libs/constants/sidebar";
// import { UserMobileMenu } from "./user-mobile-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobile = useIsMobile();

  // const [search, setSearch] = React.useState<string>("");

  // const data = React.useMemo(() => {
  //   return SidebarData.map((group) => {
  //     const filteredItems = group.items.filter((item) => {
  //       const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());

  //       return matchesSearch;
  //     });

  //     return {
  //       ...group,
  //       items: filteredItems,
  //     };
  //   }).filter((group) => group.items.length > 0);
  // }, [search]);

  const data = SidebarData;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="relative border-b h-16 bg-white">
        <div className="flex justify-between items-center h-full">
          <div className="peer/menu-button group/menu-button flex w-full h-full items-center gap-2 overflow-hidden rounded-md text-left text-sm ">
            <div
              className="group/icon-box relative flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:rounded-md transition-all duration-300 cursor-pointer"
              onClick={isCollapsed ? toggleSidebar : undefined}
            >
              <BoxesIcon className="size-5 transition-opacity group-hover/icon-box:group-data-[collapsible=icon]:opacity-0" />
              <SquareArrowRightIcon className="absolute size-4 opacity-0 transition-opacity group-hover/icon-box:group-data-[collapsible=icon]:opacity-100 text-primary-foreground" />
            </div>
            <span className="text-base truncate transition-all duration-300 ease-in-out opacity-100 max-w-[150px] group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 font-semibold">
              Nexous
            </span>
          </div>

          {!isMobile ? (
            <button
              className="group-has-data-[collapsible=icon]/sidebar-wrapper:hidden h-5 w-5 text-primary hover:text-primary/80 cursor-pointer"
              onClick={toggleSidebar}
            >
              <SquareArrowLeftIcon className="size-5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline">
                <BellIcon />
              </Button>
              <Button size="icon" variant="outline" onClick={toggleSidebar}>
                <XIcon />
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {isCollapsed ? (
                  <SidebarMenuButton tooltip="Cari Fitur" onClick={toggleSidebar}>
                    <SearchIcon className="size-4" />
                    <span>Cari Fitur</span>
                  </SidebarMenuButton>
                ) : (
                  <div className="relative w-full flex items-center">
                    <SearchIcon className="absolute left-4 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Cari Fitur"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        {data.map((item, index) => (
          <SidebarGroup key={index} className="pt-0">
            {item.title && (
              <>
                <Separator />
                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              </>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((item, index) => {
                  const showCreateAction = item.createUrl && !isCollapsed;
                  const isChildActive = pathname !== "/"
                    ? pathname.startsWith(item.url) && item.url !== "/"
                    : item.url === "/";

                  return (
                    <SidebarMenuItem key={index} className="relative group/btn">
                      <SidebarMenuButton
                        isActive={isChildActive}
                        render={<Link to={item.url} />}
                        className={cn(
                          "font-semibold text-sm pr-10 transition-all duration-300",
                          "group-hover/btn:bg-primary group-hover/btn:text-primary-foreground",
                        )}
                        tooltip={item.title}
                        onClick={() => setOpenMobile(false)}
                      >
                        {item.icon && (
                          <item.icon className="size-4 transition-transform duration-200" />
                        )}
                        <span>{item.title}</span>
                      </SidebarMenuButton>

                      {showCreateAction && (
                        <Button
                          render={<Link to={item.createUrl ?? "#"} />}
                          variant="outline"
                          size="icon-xs"
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 z-10 active:not-aria-[haspopup]:-translate-y-1/2",
                            "text-primary hover:text-primary transition-all",
                            isChildActive ? "border-none" : "group-hover/btn:border-none",
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMobile(false);
                          }}
                        >
                          <PlusIcon className="size-4" />
                          <span className="sr-only">Create {item.title}</span>
                        </Button>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* {isMobile && (
          <div className="mt-auto">
            <UserMobileMenu />
          </div>
        )} */}
      </SidebarContent>
    </Sidebar>
  );
}
