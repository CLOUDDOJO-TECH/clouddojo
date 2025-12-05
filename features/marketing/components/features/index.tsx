"use client";
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { CONTENT, TABS } from "./constants";
import { VisualMockup } from "./visual-mockup";
import { Button } from "@/components/ui/button";

export const FeatureSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>("tests");
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handleTabChange = (newTabId: string) => {
    if (newTabId === activeTabId) return;

    const currentIndex = TABS.findIndex((t) => t.id === activeTabId);
    const newIndex = TABS.findIndex((t) => t.id === newTabId);

    setDirection(newIndex > currentIndex ? "right" : "left");
    setActiveTabId(newTabId);
  };

  const activeContent = CONTENT[activeTabId];
  const animationClass =
    direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left";

  const activeTab = TABS.find((t) => t.id === activeTabId);

  // Get theme colors for active tab
  const getActiveColors = () => {
    switch (activeTabId) {
      case "tests":
        return { button: "bg-emerald-600", line: "bg-emerald-500" };
      case "projects":
        return { button: "bg-cyan-600", line: "bg-cyan-500" };
      case "ai_feedback":
        return { button: "bg-pink-600", line: "bg-pink-500" };
      case "leaderboard":
        return { button: "bg-indigo-600", line: "bg-indigo-500" };
      default:
        return { button: "bg-emerald-600", line: "bg-emerald-500" };
    }
  };

  const { button: buttonColor, line: lineColor } = getActiveColors();

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-main">
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <h1 className="text-balance text-3xl font-semibold md:text-5xl lg:text-6xl tracking-tight leading-tight">
          Experience the new wave
          <br className="hidden sm:block" />
          of cloud education.
        </h1>
      </div>

      {/* Main Container */}
      <div className="bg-card backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] border shadow-lg overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row border-b bg-muted/30">
          {TABS.map((tab) => {
            const isActive = activeTabId === tab.id;
            const Icon = tab.icon;

            // Get hover colors based on tab
            const getHoverColors = () => {
              switch (tab.id) {
                case "tests":
                  return {
                    bg: "hover:bg-emerald-500/5",
                    iconBg: "group-hover:bg-emerald-500/20",
                    iconText: "group-hover:text-emerald-500",
                  };
                case "projects":
                  return {
                    bg: "hover:bg-cyan-500/5",
                    iconBg: "group-hover:bg-cyan-500/20",
                    iconText: "group-hover:text-cyan-500",
                  };
                case "ai_feedback":
                  return {
                    bg: "hover:bg-pink-500/5",
                    iconBg: "group-hover:bg-pink-500/20",
                    iconText: "group-hover:text-pink-500",
                  };
                case "leaderboard":
                  return {
                    bg: "hover:bg-indigo-500/5",
                    iconBg: "group-hover:bg-indigo-500/20",
                    iconText: "group-hover:text-indigo-500",
                  };
                default:
                  return {
                    bg: "hover:bg-emerald-500/5",
                    iconBg: "group-hover:bg-emerald-500/20",
                    iconText: "group-hover:text-emerald-500",
                  };
              }
            };

            const hoverColors = getHoverColors();

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex-1 flex items-center gap-3 py-3 px-4 md:py-4 md:px-5 text-sm font-medium transition-all duration-200 relative outline-none group text-left cursor-pointer
                  ${isActive ? "text-foreground bg-background/50" : `text-muted-foreground hover:text-foreground ${hoverColors.bg}`}
                `}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[2px] md:w-auto md:left-0 md:right-0 md:top-auto md:bottom-0 md:h-[2px] z-10 ${lineColor}`}
                  />
                )}

                {/* Icon Box */}
                <div
                  className={`
                    w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                    ${
                      isActive
                        ? `${tab.iconBg} ${tab.iconColor}`
                        : `bg-muted/30 text-muted-foreground ${hoverColors.iconBg} ${hoverColors.iconText}`
                    }
                  `}
                >
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                </div>

                <span className="text-sm md:text-base truncate">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[550px]">
          {/* Left: Text Content */}
          <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center relative z-10 bg-muted/20 order-2 lg:order-1">
            <div key={activeTabId} className={`${animationClass}`}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 tracking-tight">
                {activeContent.title}
              </h2>

              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10">
                <p>{activeContent.description}</p>
                {activeContent.description2 && (
                  <p>{activeContent.description2}</p>
                )}
              </div>

              <div>
                <Button
                  size="lg"
                  className={`group rounded-xl ${buttonColor} hover:opacity-90 text-white w-full sm:w-auto`}
                >
                  {activeContent.buttonText}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Visual Content */}
          <div className="p-8 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-l relative overflow-hidden order-1 lg:order-2 min-h-[350px] lg:min-h-auto bg-muted/10">
            {/* Background glow behind mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Container for mockup with consistent padding and height */}
            <div
              className={`w-full h-full relative z-10 flex items-center justify-center ${animationClass}`}
              key={activeTabId + "-visual"}
            >
              <VisualMockup type={activeContent.visualType} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
