"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import React from "react";

/**
 * Floating chatbot button, visible only to authenticated users.
 * Uses shadcn/ui Button and framer-motion for micro-interactions.
 * Place this at the root of your app (e.g., in layout.tsx or a top-level component).
 */
export function ChatbotButton({ onClick }: { onClick: () => void }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}
    >
      <Button
        size="icon"
        variant="default"
        aria-label="Open AI Chatbot"
        className="shadow-lg rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 text-white hover:scale-105 focus:ring-2 focus:ring-emerald-400"
        asChild={false}
        onClick={onClick}
      >
        <motion.span
          whileHover={{ scale: 1.15, rotate: 8 }}
          whileTap={{ scale: 0.95, rotate: -8 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <MessageCircle className="w-8 h-8" />
        </motion.span>
      </Button>
    </motion.div>
  );
} 