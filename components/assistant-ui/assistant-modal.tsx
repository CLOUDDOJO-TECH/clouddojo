"use client";

import { type FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import { Thread } from "@/components/assistant-ui/thread";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import IconLockOutlineDuo18 from "@/components/icons/lock-outline-duo";
import IconLockOpen2OutlineDuo18 from "@/components/icons/lock-open-outline-duo";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export const AssistantModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isSubscribed, isLoading } = useSubscription();
  const router = useRouter();
  const pathname = usePathname();

  // Close panel on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Notch Button - Fixed to right edge (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed right-0 top-1/2 -translate-y-1/2 z-50",
            "flex items-center justify-center",
            "w-7 h-24 rounded-l-xl",
            "bg-emerald-600 hover:bg-emerald-500",
            "text-white text-[10px] font-semibold",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-200",
            "hover:w-9",
          )}
          aria-label="Ask AI"
        >
          <span className="writing-vertical-rl rotate-180 whitespace-nowrap tracking-wider uppercase">
            Ask AI
          </span>
        </button>
      )}

      {/* Slide-in Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - hidden on mobile since panel is fullscreen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm hidden md:block"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed z-50 bg-background shadow-2xl flex flex-col",
                // Mobile: fullscreen
                "inset-0 rounded-none",
                // Desktop: slide-in panel from right
                "md:inset-auto md:right-0 md:top-4 md:bottom-4 md:w-[520px] md:max-w-[90vw] md:rounded-l-2xl",
              )}
            >
              {/* Mobile: X close button at top */}
              <div className="flex items-center justify-between p-4 md:hidden">
                <span className="text-sm font-semibold text-foreground">
                  Clouddojo AI
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close AI"
                >
                  <XIcon className="size-5 text-muted-foreground" />
                </button>
              </div>

              {/* Desktop: Close Notch Button - attached to left edge of panel */}
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full",
                  "hidden md:flex items-center justify-center",
                  "w-7 h-24 rounded-l-xl",
                  "bg-emerald-600 hover:bg-emerald-500",
                  "text-white text-[10px] font-semibold",
                  "shadow-lg hover:shadow-xl",
                  "transition-all duration-200",
                  "hover:w-9",
                )}
                aria-label="Close AI"
              >
                <span className="writing-vertical-rl rotate-180 whitespace-nowrap tracking-wider uppercase">
                  Close
                </span>
              </button>

              {/* Thread or Paywall */}
              <div className="flex-1 overflow-hidden md:rounded-l-2xl">
                {isSubscribed || isLoading ? (
                  <Thread />
                ) : (
                  <div className="relative flex h-full flex-col">
                    {/* Title */}
                    <div className="hidden md:flex items-center justify-center pt-10">
                      <h2 className="text-4xl md:text-5xl max-w-5xl mx-auto text-center tracking-tight font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 via-neutral-500 to-neutral-400 dark:from-neutral-700 dark:via-neutral-200 dark:to-white">
                        Clouddojo AI
                      </h2>
                    </div>

                    {/* CTA */}
                    <div className="relative flex flex-1 items-center justify-center p-6">
                      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-sm">
                        <div className="h-28 w-28 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center relative">
                          <IconLockOutlineDuo18
                            size="56px"
                            className={`text-muted-foreground absolute transition-all duration-300 ease-in-out ${isHovered ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
                          />
                          <IconLockOpen2OutlineDuo18
                            size="56px"
                            className={`text-muted-foreground absolute transition-all duration-300 ease-in-out ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            Unlock AI Coach
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Get instant answers, personalized study plans, and
                            expert guidance from your AI-powered cloud coach.
                          </p>
                        </div>
                        <Button
                          size="lg"
                          className="!bg-gradient-to-t from-amber-600 to-amber-400 text-white border-amber-700/40 hover:brightness-110"
                          onClick={() => router.push("/dashboard/billing")}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          Upgrade to Premium
                        </Button>
                      </div>

                      {/* Stars background (dark mode only) */}
                      <div className="hidden dark:block pointer-events-none">
                        <ShootingStars starColor="#f59e0b" maxDelay={3000} minDelay={2000} />
                        <StarsBackground starDensity={0.00055} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
