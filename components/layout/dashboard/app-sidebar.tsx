"use client";

import * as React from "react";

import {
  Map,
  ChevronRight,
  CircleHelp,
  ArrowUpCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import IconDarkLightFill18 from "@/components/icons/dark-light-fill";
import IconGauge3Outline18 from "@/components/icons/gauge-outline";
import {
  AdminIcon,
  HomeIcon,
  LeaderboardIcon,
  PracticeTestIcon,
  SettingsIcon,
  HandsOnLabsIcon,
  FlashcardsIcon,
  PeerConnectIcon,
  ChangelogIcon,
  DashboardIcon,
  ManageQuizzesIcon,
  ManageProjectsIcon,
  CreateProjectIcon,
} from "./sidebar-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import UpgradeCard from "@/components/upgrade-card";
import { useSubscription } from "@/hooks/use-subscription";
import SubscriptionCard from "@/app/dashboard/subscibed-card";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUser";
import { useCommandMenuStore } from "@/store/use-command-menu-store";
import { Search } from "lucide-react";

// Define types for the navigation items
type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  comingSoon?: boolean;
  isNew?: boolean; // Add property to mark new features
};

type NavSection = {
  title: string;
  url: string;
  items: NavItem[];
};

// Navigation data extracted to a constant for better maintainability
const NAVIGATION_DATA: NavSection[] = [
  {
    title: "Sections",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: (props: any) => <IconGauge3Outline18 size="18px" {...props} />,
      },
      {
        title: "Practice Tests",
        url: "/dashboard/practice",
        icon: PracticeTestIcon,
      },
      {
        title: "Leaderboard",
        url: "/dashboard/leaderboard",
        icon: LeaderboardIcon,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: SettingsIcon,
      },
      // {
      //   title: "Hands-On Labs",
      //   url: "/dashboard/labs",
      //   icon: HandsOnLabsIcon,
      // },
    ],
  },
  {
    title: "Coming Soon",
    url: "#",
    items: [
      {
        title: "Flashcards",
        url: "#",
        icon: FlashcardsIcon,
        comingSoon: true,
      },
      {
        title: "Hands-On Projects",
        url: "#",
        icon: HandsOnLabsIcon,
        comingSoon: true,
      },
      {
        // Leaderboard item removed from here
        title: "My Cloud Roadmap",
        url: "#",
        icon: Map,
        comingSoon: true,
      },
      {
        title: "Peer-to-Peer Connect",
        url: "#",
        icon: PeerConnectIcon,
        comingSoon: true,
      },
    ],
  },
];

// Admin navigation sub-items
const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: DashboardIcon,
  },
  {
    title: "Manage Quizzes",
    url: "/dashboard/admin/quiz/manage",
    icon: ManageQuizzesIcon,
  },
  {
    title: "Manage Projects",
    url: "/dashboard/admin/projects/manage",
    icon: ManageProjectsIcon,
  },
  {
    title: "Create Project",
    url: "/dashboard/admin/projects/create",
    icon: CreateProjectIcon,
  },
];

/**
 * Sidebar component for the dashboard layout
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const { setIsOpen: setCommandMenuOpen } = useCommandMenuStore();

  // Use our custom subscription hook
  const { isSubscribed, planName, isLoading, isError } = useSubscription();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { role: userRole } = useCurrentUserRole();

  // Helper function to check if a URL is active
  const isActive = (url: string): boolean => url === pathname;

  return (
    <Sidebar className="bg-sidebar !border-none " {...props}>
      <SidebarHeader>
        <div className="flex items-center pt-2 px-2 justify-between overflow-hidden text-sidebar-primary-foreground">
          <img
            src="/assets/cldj_logo.svg"
            width={120}
            height={120}
            alt="clouddojo logo"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground dark:hover:text-white hover:bg-sidebar-accent transition-colors"
            >
              <Search size={16} />
            </button>
            <SidebarTrigger className="h-8 w-8 text-amber-500 hover:text-amber-400 hover:bg-sidebar-accent transition-colors" />
          </div>
        </div>
        {/*<div className="grid flex-1 text-left text-2xl font-semibold leading-tight">
            <span className="truncate font-kaushan ">Clouddojo</span>
          </div>*/}
      </SidebarHeader>

      <SidebarContent>
        {NAVIGATION_DATA.map((section) => (
          <SidebarGroup key={section.title}>
            {section.title === "Coming Soon" ? (
              <Collapsible defaultOpen className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="uppercase text-muted-foreground/60 cursor-pointer">
                    {section.title}
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent className="px-2">
                    <SidebarMenu>
                      {section.items.map((item) => (
                        <NavItem
                          key={item.title}
                          item={item}
                          isActive={isActive(item.url)}
                        />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
            <>
            {section.title !== "Sections" && (
              <SidebarGroupLabel className="uppercase text-muted-foreground/60">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {section.items.map((item) => (
                  <NavItem
                    key={item.title}
                    item={item}
                    isActive={isActive(item.url)}
                  />
                ))}
                {/* Add Admin section after Hands-On Labs in Sections group */}
                {section.title === "Sections" &&
                  (userRole === "ADMIN" || userRole === "SUPERADMIN") && (
                    <Collapsible
                      defaultOpen={pathname.startsWith("/dashboard/admin")}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip="Admin"
                            className="group/admin-button font-medium gap-3 h-9"
                          >
                            <AdminIcon className="text-muted-foreground dark:group-hover/admin-button:text-white group-hover/admin-button:text-foreground" />
                            <span>Admin</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {ADMIN_NAV_ITEMS.map((item) => (
                              <SidebarMenuSubItem key={item.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(item.url)}
                                >
                                  <Link href={item.url}>
                                    <item.icon size={18} />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )}
              </SidebarMenu>
            </SidebarGroupContent>
            </>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 pb-2">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center h-9 w-9 rounded-full border border-foreground/20 dark:border-border/60 bg-background dark:bg-transparent text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
              >
                <CircleHelp size={18} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-[240px] p-0">
              <div className="px-5 py-3">
                <p className="text-xs text-muted-foreground">What&apos;s new</p>
              </div>
              <div className="relative px-5 pb-4">
                {/* Continuous dashed line */}
                <div className="absolute left-[1.55rem] top-[0.55rem] bottom-[2.05rem] border-l border-dashed border-muted-foreground/30" />
                {/* Item 1 */}
                <div className="relative cursor-pointer flex items-start gap-3 py-2 hover:bg-gray-400/20 rounded-[5px] px-1 -mx-1">
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-coolGray-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Practice tests are live</span>
                </div>
                {/* Item 2 */}
                <div className="relative cursor-pointer flex items-start gap-3 py-2 hover:bg-gray-400/20 rounded-[5px] px-1 -mx-1">
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-coolGray-500 shrink-0 mt-0.5" />
                  <span className="text-sm">AI-powered study plans</span>
                </div>
                {/* Changelog link */}
                <button
                  className="relative flex items-start gap-3 py-2 hover:bg-gray-400/20 rounded-[5px] px-1 -mx-1 w-full"
                >
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-coolGray-500 shrink-0 mt-0.5" />
                  <span className="text-sm flex items-center gap-1.5">
                    Full changelog
                    <ChangelogIcon className="text-muted-foreground" />
                  </span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-2 h-9 px-4 rounded-full border border-foreground/20 dark:border-border/60 bg-background dark:bg-transparent text-sm text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
          >
            <ArrowUpCircle size={16} />
            <span>{isSubscribed && planName ? `${planName} plan` : "Free plan"}</span>
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center h-9 w-9 shrink-0 rounded-full border border-foreground/20 dark:border-border/60 bg-background dark:bg-transparent text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <IconDarkLightFill18 size="16px" className="dark:-scale-x-100 transition-transform" />
            </button>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

/**
 * Individual navigation item component
 */
function NavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  if (item.comingSoon) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="group/menu-soon font-medium gap-3 h-9 rounded-md flex flex-row"
          disabled
        >
          <span className="flex items-center gap-3 ">
            {item.icon && (
              <item.icon
                className="text-muted-foreground/60 dark:group-hover/menu-soon:text-white group-hover/menu-soon:text-foreground"
                size={18}
                aria-hidden="true"
              />
            )}
            <span className="text-muted-foreground/60 group-hover/menu-soon:text-white text-[13px]">
              {item.title}
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary data-[active=true]:to-primary/80 [&>svg]:size-auto"
        isActive={isActive}
      >
        <Link href={item.url}>
          {item.icon && (
            <item.icon
              className={
                isActive
                  ? "text-white"
                  : "dark:group-hover/menu-button:text-white group-hover/menu-button:text-foreground text-muted-foreground"
              }
              size={18}
              aria-hidden="true"
            />
          )}
          <span className={`text-[13px] ${isActive ? "text-white" : ""}`}>{item.title}</span>
          {item.isNew && (
            <div className="relative">
              <Badge variant="new" className="ml-2 transform -rotate-12">
                NEW
              </Badge>
            </div>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
