"use client";

import { type FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

import { Thread } from "@/components/assistant-ui/thread";
import { cn } from "@/lib/utils";

export const AssistantModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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

              {/* Thread */}
              <div className="flex-1 overflow-hidden md:rounded-l-2xl">
                <Thread />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
