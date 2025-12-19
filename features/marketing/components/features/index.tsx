"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { CONTENT, TABS } from "./constants";
import { VisualMockup } from "./visual-mockup";
import { Button } from "@/components/ui/button";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
} from "motion/react";

export const FeatureSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>("tests");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-rotation logic
  useEffect(() => {
    if (isPaused) return;

    const AUTO_ROTATE_INTERVAL = 3000;
    const PROGRESS_UPDATE_INTERVAL = 30; // Update every 30ms for smooth animation

    // Progress bar animation
    let progressValue = 0;
    progressTimerRef.current = setInterval(() => {
      progressValue += (PROGRESS_UPDATE_INTERVAL / AUTO_ROTATE_INTERVAL) * 100;
      setProgress(progressValue);
    }, PROGRESS_UPDATE_INTERVAL);

    // Auto-rotate to next tab
    autoRotateTimerRef.current = setTimeout(() => {
      const currentIndex = TABS.findIndex((t) => t.id === activeTabId);
      const nextIndex = (currentIndex + 1) % TABS.length;
      handleTabChange(TABS[nextIndex].id);
    }, AUTO_ROTATE_INTERVAL);

    return () => {
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [activeTabId, isPaused]);

  const handleTabChange = (newTabId: string) => {
    if (newTabId === activeTabId) return;

    const currentIndex = TABS.findIndex((t) => t.id === activeTabId);
    const newIndex = TABS.findIndex((t) => t.id === newTabId);

    setDirection(newIndex > currentIndex ? "right" : "left");
    setActiveTabId(newTabId);
    setProgress(0);
  };

  const handleManualTabChange = (newTabId: string) => {
    handleTabChange(newTabId);
    // Pause auto-rotation for 6 seconds after manual interaction
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const activeContent = CONTENT[activeTabId];

  const activeTab = TABS.find((t) => t.id === activeTabId);

  // Get theme colors for active tab
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Swipe gesture handlers
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const SWIPE_THRESHOLD = 50;

    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      const currentIndex = TABS.findIndex((t) => t.id === activeTabId);
      let newIndex: number;

      if (info.offset.x > 0) {
        // Swiped right - go to previous
        newIndex = currentIndex === 0 ? TABS.length - 1 : currentIndex - 1;
      } else {
        // Swiped left - go to next
        newIndex = currentIndex === TABS.length - 1 ? 0 : currentIndex + 1;
      }

      handleManualTabChange(TABS[newIndex].id);
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-main">
      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <h1 className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5">
          Everything you need for
          <br className="hidden sm:block" />
          your cloud journey
        </h1>
      </div>

      {/* Main Container */}
      <div className="bg-card backdrop-blur-xl border shadow-lg overflow-hidden">
        {/* Navigation Tabs - Mobile optimized with icon-only inactive states */}
        <div className="flex flex-row md:flex-row border-b bg-muted/30 overflow-x-auto scrollbar-hide">
          {TABS.map((tab, idx) => {
            const isActive = activeTabId === tab.id;
            const Icon = tab.icon;

            // Get hover colors based on tab
            const getHoverColors = () => {
              switch (tab.id) {
                case "tests":
                  return {
                    bg: "bg-emerald-500/10",
                    iconBg: "group-hover:bg-emerald-500/20",
                    iconText: "group-hover:text-emerald-500",
                  };
                case "projects":
                  return {
                    bg: "bg-cyan-500/10",
                    iconBg: "group-hover:bg-cyan-500/20",
                    iconText: "group-hover:text-cyan-500",
                  };
                case "ai_feedback":
                  return {
                    bg: "bg-pink-500/10",
                    iconBg: "group-hover:bg-pink-500/20",
                    iconText: "group-hover:text-pink-500",
                  };
                case "leaderboard":
                  return {
                    bg: "bg-indigo-500/10",
                    iconBg: "group-hover:bg-indigo-500/20",
                    iconText: "group-hover:text-indigo-500",
                  };
                default:
                  return {
                    bg: "bg-emerald-500/10",
                    iconBg: "group-hover:bg-emerald-500/20",
                    iconText: "group-hover:text-emerald-500",
                  };
              }
            };

            const hoverColors = getHoverColors();

            return (
              <button
                key={tab.id}
                onClick={() => handleManualTabChange(tab.id)}
                className={`
                  relative flex items-center gap-3 py-4 transition-all duration-300 outline-none group cursor-pointer
                  ${
                    isActive
                      ? "px-6 md:px-8 flex-1 text-foreground bg-background/50"
                      : "px-4 md:px-5 md:flex-1 text-muted-foreground hover:text-foreground"
                  }
                  shrink-0 md:shrink
                  min-h-[60px] md:min-h-[64px]
                `}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated hover background */}
                <AnimatePresence>
                  {hoveredIndex === idx && !isActive && (
                    <motion.span
                      className={`absolute inset-0 h-full w-full block ${hoverColors.bg}`}
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Active Indicator Line with animated progress */}
                {isActive && (
                  <>
                    {/* Solid indicator line - vertical on mobile, horizontal on desktop */}
                    <div
                      className={`absolute ${lineColor} left-0 top-0 bottom-0 w-[3px] md:w-full md:left-0 md:right-0 md:top-auto md:bottom-0 md:h-[3px]`}
                      style={{ zIndex: 10 }}
                    />
                    {/* Progress bar - fills from left to right on both mobile and desktop */}
                    <motion.div
                      className="absolute left-0 bottom-0 h-[3px]"
                      style={{
                        backgroundColor:
                          activeTabId === "tests"
                            ? "rgba(16, 185, 129, 0.6)"
                            : activeTabId === "projects"
                              ? "rgba(6, 182, 212, 0.6)"
                              : activeTabId === "ai_feedback"
                                ? "rgba(236, 72, 153, 0.6)"
                                : "rgba(99, 102, 241, 0.6)",
                        zIndex: 20,
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.03, ease: "linear" }}
                    />
                  </>
                )}

                {/* Icon Box */}
                <motion.div
                  layout
                  className={`
                    relative z-10 w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300
                    ${
                      isActive
                        ? `${tab.iconBg} ${tab.iconColor}`
                        : `bg-muted/30 text-muted-foreground ${hoverColors.iconBg} ${hoverColors.iconText}`
                    }
                  `}
                >
                  <Icon size={18} className="md:w-5 md:h-5" />
                </motion.div>

                {/* Label - shown only when active on mobile, always on desktop */}
                <AnimatePresence mode="wait">
                  {(isActive || !isMobile) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="relative z-10 text-sm md:text-base font-medium whitespace-nowrap overflow-hidden"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <motion.div
          className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[550px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Left: Text Content */}
          <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center relative z-10 bg-muted/20 order-2 lg:order-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabId}
                initial={{
                  opacity: 0,
                  x: direction === "right" ? 40 : -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction === "right" ? -40 : 40,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
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
                    className={`group rounded-xl ${buttonColor} hover:opacity-90 text-white w-full sm:w-auto rounded-none cursor-pointer`}
                  >
                    {activeContent.buttonText}
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Visual Content */}
          <div className="p-8 lg:p-12 flex items-center justify-center border-b lg:border-b-0 lg:border-l relative overflow-hidden order-1 lg:order-2 min-h-[350px] lg:min-h-auto bg-muted/10">
            {/* Background glow behind mockup - changes based on active tab */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabId + "-glow"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${
                    activeTabId === "tests"
                      ? "rgba(16, 185, 129, 0.15)"
                      : activeTabId === "projects"
                        ? "rgba(6, 182, 212, 0.15)"
                        : activeTabId === "ai_feedback"
                          ? "rgba(236, 72, 153, 0.15)"
                          : "rgba(99, 102, 241, 0.15)"
                  } 0%, transparent 70%)`,
                }}
              />
            </AnimatePresence>

            {/* Container for mockup with consistent padding and height */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabId + "-visual"}
                className="w-full h-full relative z-10 flex items-center justify-center"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  x: direction === "right" ? 30 : -30,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: direction === "right" ? -30 : 30,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                <VisualMockup type={activeContent.visualType} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
