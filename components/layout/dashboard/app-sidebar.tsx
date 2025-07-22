"use client";

import * as React from "react";

import {
  BookOpen,
  Bot,
  SquareTerminal,
  Map,
  TestTube,
  CableCar,
  Trophy,
  CogIcon, // Added Trophy icon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

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
  SidebarRail,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import UpgradeCard from "@/components/upgrade-card";
import { useSubscription } from "@/hooks/use-subscription";
import SubscriptionCard from "@/app/dashboard/subscibed-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
        title: "Home",
        url: "/dashboard",
        icon: SquareTerminal,
      },
      {
        title: "Practice Tests",
        url: "/dashboard/practice",
        icon: Bot,
      },
      {
        title: "Leaderboard",
        url: "/dashboard/leaderboard", // Updated URL
        icon: Trophy, // Changed icon to Trophy
        isNew: true, // Mark as new
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
      { // Leaderboard item removed from here
        title: "My Cloud Roadmap",
        url: "#",
        icon: Map,
        comingSoon: true,
      },
      {
        title: "Hands-On Labs",
        url: "#",
        icon: TestTube,
        comingSoon: true,
      },
      {
        title: "Peer-to-Peer Connect",
        url: "#",
        icon: CableCar,
        comingSoon: true,
      },
    ],
  },
];

/**
 * Sidebar component for the dashboard layout
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Use our custom subscription hook
  const { isPro, isPremium, planName, isLoading, isError } = useSubscription();
  // console.log(planName)

  // Helper function to check if a URL is active
  const isActive = (url: string): boolean => url === pathname;

  return (
    <Sidebar className="bg-sidebar !border-none " {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto"
        >
          <div className="flex aspect-square  items-center justify-center rounded-md overflow-hidden  text-sidebar-primary-foreground">
            <img
              src="/images/main-logo.png"
              width={86}
              height={86}
              alt="clouddojo logo"
            />
          </div>
          <div className="grid flex-1 text-left text-2xl font-semibold leading-tight">
            <span className="truncate font-kaushan ">Clouddojo</span>
          </div>
        </SidebarMenuButton>
        {/* <hr className="border-t border-border mx-2 -mt-px" /> */}
      </SidebarHeader>

      <SidebarContent>
        {NAVIGATION_DATA.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {section.title}
            </SidebarGroupLabel>
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
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
     
        {planName && (
          <SubscriptionCard plan={planName} variant="glass" />

        )}
        {!isLoading && !isError && !isPro && !isPremium && (
          <div className="px-4 mb-4">
            <UpgradeCard />
          </div>
        )}
        <hr className="border-t border-border mx-2 -mt-px" />
        <NavItem item={{title: "Settings", url: "#", icon: CogIcon}} isActive={false} />
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
                className="text-muted-foreground/60 group-hover/menu-soon:text-white"
                size={22}
                aria-hidden="true"
              />
            )}
            <span className="text-muted-foreground/60 group-hover/menu-soon:text-white">
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
        className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
        isActive={isActive}
      >
        <Link href={item.url}>
          {item.icon && (
            <item.icon
              className={isActive ? "text-white" : "group-hover/menu-button:text-white text-muted-foreground group-hover/menu-button-data-[active=true]/menu-button:text-primary"}
              size={22}
              aria-hidden="true"
            />
          )}
          <span
            className={isActive ? "text-white" : ""}
          >
            {item.title}
          </span>
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
