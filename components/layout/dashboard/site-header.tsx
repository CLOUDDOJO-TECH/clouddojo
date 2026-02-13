"use client";

import { Search, SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import * as Kbd from "@/components/ui/kbd";

import { SearchForm } from "@/components/layout/dashboard/search-form";
import { CommandMenu } from "@/components/layout/dashboard/command-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { UserButton, useUser } from "@clerk/nextjs";
import FeedbackDialog from "./feedback-dialog";
import { useFeedbackStore } from "@/store/use-feedback-store";
import { useCommandMenuStore } from "@/store/use-command-menu-store";
import ThemeSwitcher from "@/components/theme-switcher";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const user = useUser();
  const pathname = usePathname();
  const { isOpen: feedbackOpen, setIsOpen: setFeedbackOpen } =
    useFeedbackStore();
  const { setIsOpen: setCommandMenuOpen } = useCommandMenuStore();

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);

    // Handle the dashboard root
    if (paths.length === 1 && paths[0] === "dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="text-foreground hover:text-foreground/80">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="text-foreground hover:text-foreground/80">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.slice(1).map((path, index) => {
          // Skip showing IDs in the breadcrumb
          if (path.length > 20 || path.match(/^[0-9a-f]{24}$/i)) {
            return null;
          }

          const isLast = index === paths.slice(1).length - 1;
          const href = `/dashboard/${paths.slice(1, index + 2).join("/")}`;
          const displayName =
            path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

          return (
            <BreadcrumbItem key={path}>
              <BreadcrumbSeparator />
              {isLast ? (
                <BreadcrumbPage>{displayName}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    );
  };

  return (
    <div className="">
      <header className="w-full flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 text-foreground before:absolute before:inset-y-3 before:-left-px before:w-px before:z-50">
        <div className="flex h-[--header-height] w-full items-center justify-between">
          <div className="gap-2 px-4 flex items-center">
            <SidebarTrigger className="-ms-2 text-muted-foreground hover:text-foreground" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 data-[orientation=verticall]:h-4"
            />
            <Breadcrumb className="hidden sm:block">
              {generateBreadcrumbs()}
            </Breadcrumb>
          </div>
          <div className="gap-4 flex items-center mr-6">
            <CommandMenu />
            <FeedbackDialog
              open={feedbackOpen}
              onOpenChange={setFeedbackOpen}
            />
            {/*<ThemeSwitcher />*/}
            {user.isLoaded && (
              <div suppressHydrationWarning>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
