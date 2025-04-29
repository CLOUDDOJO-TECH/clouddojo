"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  LoaderIcon,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { TeamSwitcher } from "./team-switcher";
import { SearchForm } from "./search-form";
import { RiLogoutBoxLine } from "@remixicon/react";
import { SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import UpgradeCard from "@/components/upgrade-card";
import { Badge } from "@/components/ui/badge";

// Define types for the navigation items
type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  comingSoon?: boolean;
};

type NavSection = {
  title: string;
  url: string;
  items: NavItem[];
};

const data = {
  navMain: [
    {
      title: "Sections",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/dashboard",
          icon: SquareTerminal,
        },
        {
          title: "Practice Tests",
          url: "/dashboard/practice",
          icon: Bot,
        },
      ],
    },
    {
      title: "Coming Soon",
      url: "#",
      items: [
        {
          title: "Flashcards",
          url: "#",
          icon: BookOpen,
          comingSoon: true,
        },
        {
          title: "Leaderboard",
          url: "#",
          icon: Settings2,
          comingSoon: true,
        },
      ],
    },
  ] as NavSection[],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const user = auth()
  const pathname = usePathname();
  const isActive = (url: string) => url === pathname;
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground">
            <img
              src="/team-logo.webp"
              width={36}
              height={36}
              alt="clouddojo logo"
            />
          </div>
          <div className="grid flex-1 text-left text-2xl font-semibold  leading-tight">
            <span className="truncate font-medium">CloudDojo</span>
          </div>
        </SidebarMenuButton>
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.comingSoon ? (
                      <SidebarMenuButton
                        asChild
                        className="group/menu-button font-medium gap-3 h-9 rounded-md flex flex-row"
                        disabled
                      >
                        <span className="flex items-center gap-3">
                          {item.icon && (
                            <item.icon
                              className={isActive(item.url) ? "text-emerald-500" : "text-muted-foreground/60"}
                              size={22}
                              aria-hidden="true"
                            />
                          )}
                          <span className="text-muted-foreground/60">
                            {item.title}
                          </span>
                        </span>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        asChild
                                              className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                        isActive={isActive(item.url)}
                      >
                        <a href={item.url}>
                          {item.icon && (
                            <item.icon
                              className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                              size={22}
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={isActive(item.url) ? "text-emerald-800" : ""}
                          >
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 mb-4">
          <UpgradeCard />
        </div>
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
