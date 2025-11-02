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
import { ChatbotButton } from "@/components/ui/ChatbotButton";
import { ChatbotWindow } from "@/components/ui/ChatbotWindow";
import { ChatbotProvider } from "@/components/ui/ChatbotProvider";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // State to control chat window visibility
  const [chatOpen, setChatOpen] = React.useState(false);
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <TooltipProvider>
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="relative z-50">
          <AssistantModal />
        </div>
        <div className="[--header-height:calc(theme(spacing.14))]">
          {/* Chatbot UI is rendered above all dashboard content */}
          {/* <ChatbotButton onClick={() => setChatOpen(true)} />
        <ChatbotWindow open={chatOpen} onOpenChange={setChatOpen} /> */}
          <SidebarProvider className="flex flex-col ">
            <div className="flex flex-1">
              <AppSidebar className="" />
              <SidebarInset className="bg-sidebar !border-none overflow-hidden group/sidebar-inset">
                <SiteHeader />
                <div className="h-full bg-background md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
                  {children}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </AssistantRuntimeProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
