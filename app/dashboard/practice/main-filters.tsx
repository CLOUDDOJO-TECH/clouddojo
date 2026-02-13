"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const certifications = [
  { id: "all", label: "All", search: "" },
  { id: "saa", label: "Solutions Architect", search: "solutions architect" },
  { id: "clf", label: "Cloud Practitioner", search: "cloud practitioner" },
  { id: "dev", label: "Developer", search: "developer" },
];

interface MainFiltersProps {
  onPlatformChange: (topics: string[]) => void;
}

export default function MainFilters({ onPlatformChange }: MainFiltersProps) {
  const [selected, setSelected] = useState("all");

  const handleSelect = (cert: typeof certifications[number]) => {
    setSelected(cert.id);
    onPlatformChange(cert.search ? [cert.search] : []);
  };

  return (
    <div className="flex gap-1.5 flex-wrap">
      {certifications.map((cert) => {
        const isSelected = selected === cert.id;
        return (
          <Button
            key={cert.id}
            variant="outline"
            size="default"
            onClick={() => handleSelect(cert)}
            className={cn(
              "gap-1.5 text-xs font-medium whitespace-nowrap shrink-0",
              isSelected && "border-primary text-primary bg-primary/5 hover:bg-primary/10"
            )}
          >
            {cert.label}
            <AnimatePresence>
              {isSelected && cert.id !== "all" && (
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
