"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cloudPlatforms = ["AWS", "Azure", "GCP"];

// Map platform names to topic IDs that match the existing filter system
const platformToTopicMap: Record<string, string> = {
  AWS: "aws",
  Azure: "azure",
  GCP: "google",
};

interface MainFiltersProps {
  onPlatformChange: (topics: string[]) => void;
}

export default function MainFilters({ onPlatformChange }: MainFiltersProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    setSelected((prev) => {
      const newSelected = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];

      const topicIds = newSelected
        .map((p) => platformToTopicMap[p])
        .filter(Boolean);
      onPlatformChange(topicIds);

      return newSelected;
    });
  };

  return (
    <div className="flex gap-1.5 overflow-visible">
      {cloudPlatforms.map((platform) => {
        const isSelected = selected.includes(platform);
        return (
          <Button
            key={platform}
            variant="outline"
            size="default"
            onClick={() => togglePlatform(platform)}
            className={cn(
              "gap-1.5 text-xs font-medium",
              isSelected && "border-primary text-primary bg-primary/5 hover:bg-primary/10"
            )}
          >
            {platform}
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, width: 0, opacity: 0 }}
                  animate={{ scale: 1, width: "auto", opacity: 1 }}
                  exit={{ scale: 0, width: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                  }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                    <Check
                      className="w-2.5 h-2.5 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        );
      })}
    </div>
  );
}
