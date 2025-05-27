"use client";

import { Search, SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

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
import { useSidebar } from "@/components/ui/sidebar";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { UserButton, useUser } from "@clerk/nextjs";
import FeedbackDialog from "./feedback-dialog";
import { useFeedbackStore } from "@/store/use-feedback-store";
import { useCommandMenuStore } from "@/store/use-command-menu-store";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const user = useUser();
  const pathname = usePathname();
  const { isOpen: feedbackOpen, setIsOpen: setFeedbackOpen } = useFeedbackStore();
  const { setIsOpen: setCommandMenuOpen } = useCommandMenuStore();

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);

    // Handle the dashboard root
    if (paths.length === 1 && paths[0] === "dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="text-emerald-500">
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="text-emerald-500">
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
    <header className="flex sticky top-0 z-50 w-full items-center border-b dark:bg-sidebar-accent bg-white/30 bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-[--header-height] w-full items-center justify-between">
        <div className="gap-2 px-4 flex items-center">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon className="h-24 w-24" />
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 h-4 data-[orientation=verticall]:h-4"
          />
          <Breadcrumb className="hidden sm:block">
            {generateBreadcrumbs()}
          </Breadcrumb>
        </div>
        <div className="gap-4 px-4 flex items-center mr-6">
          <Button 
            variant="outline" 
            size="sm"
            className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
            onClick={() => setCommandMenuOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline-flex">Quick traverse...</span>
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>J
            </kbd>
          </Button>
          <CommandMenu />
          <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
          {user.isLoaded && (
            <div suppressHydrationWarning>
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
