"use client";

import { SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { SearchForm } from "@/components/layout/dashboard/search-form";
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

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const user = useUser();
  const pathname = usePathname();

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
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-white/30 bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-[--header-height] w-full items-center justify-between">
        <div className="gap-2 px-4 flex items-center">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
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
          <FeedbackDialog />
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
