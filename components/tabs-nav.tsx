"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { previewTabs } from "./preview-tabs";

interface TabsNavProps {
  onTabChange: (tabId: string) => void;
  activeTab?: string;
}

export default function TabsNav({ onTabChange, activeTab = "dashboard" }: TabsNavProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    onTabChange(tabId);
  };

  useEffect(() => {
    if (activeTab !== currentTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  return (
    <div className={cn("flex py-2 space-x-1 px-3 rounded-full  shadow-md",
      "bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-white/30 dark:border-gray-400/30 shadow-lg",
    )}>
      {previewTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            "px-2 md:px-4 text-xs md:text-sm py-1.5 font-medium rounded-full transition-all",
            currentTab === tab.id 
              ? "bg-emerald-600 text-white shadow-sm" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}