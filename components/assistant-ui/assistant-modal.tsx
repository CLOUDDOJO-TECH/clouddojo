"use client";

import { type FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-4 bottom-4 z-50 w-[420px] max-w-[90vw] bg-background rounded-l-2xl shadow-2xl flex"
            >
              {/* Close Notch Button - attached to left edge of panel */}
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full",
                  "flex items-center justify-center",
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
              <div className="h-full w-full overflow-hidden rounded-l-2xl">
                <Thread />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
