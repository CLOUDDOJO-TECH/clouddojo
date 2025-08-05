"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Safari } from "./magicui/safari";
import { GlowingEffect } from "./ui/glowing-effect";
import { cn } from "@/lib/utils";

type PreviewTab = {
  id: string;
  label: string;
  imagePath: string;
};

export const previewTabs: PreviewTab[] = [
  { id: "dashboard", label: "Dashboard", imagePath: "dashboard" },
  { id: "ai-report", label: "AI Analysis", imagePath: "ai-report" },
  { id: "practice", label: "Practice Tests", imagePath: "practice" },
  { id: "leaderboard", label: "Leaderboard", imagePath: "leaderboard" },
];

interface PreviewTabsProps {
  activeTab?: string;
}

export default function PreviewTabs({ activeTab = "dashboard" }: PreviewTabsProps) {
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState(activeTab);
  
  // Update current tab when activeTab prop changes
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);
  
  // Determine which theme folder to use based on the current theme
  const themeFolder = theme === "light" ? "light" : "dark";
  
  // Construct the full image path for the active tab
  const imageSrc = `/previews/${themeFolder}/${previewTabs.find(tab => tab.id === currentTab)?.imagePath}.png`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Preview Area - Only contains the browser preview */}
      <div className="w-full p-0 rounded-3xl relative z-0 mb-[-90px]">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl border p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          style={{
            boxShadow: "0 10px 50px -12px rgba(0, 0, 0, 0.25), 0 -8px 25px -18px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <Safari
              url="clouddojo.tech"
              className="size-full"
              imageSrc={imageSrc}
            />
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}