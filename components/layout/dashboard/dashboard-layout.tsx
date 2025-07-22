"use client";

import React from "react";
import { Inter } from "next/font/google";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

const inter = Inter({ subsets: ["latin"] });

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col ">
        <div className="flex flex-1">
          <AppSidebar className="" />
          <SidebarInset className="bg-sidebar !border-none overflow-hidden group/sidebar-inset">
            <SiteHeader />
            <div className="flex  h-full bg-background md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
