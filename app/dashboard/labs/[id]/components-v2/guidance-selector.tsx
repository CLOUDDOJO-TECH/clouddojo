"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GuidanceSelectorProps {
  onSelect: (mode: string) => void;
  isStarting?: boolean;
}

export function GuidanceSelector({
  onSelect,
  isStarting,
}: GuidanceSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const guidanceOptions = [
    {
      value: "INDEPENDENT",
      label: "Independent",
      description: "Minimum guidance figure it out myselfe",
    },
    {
      value: "SOME_GUIDANCE",
      label: "Some Guidance",
      description: "Hints and tips along the way",
    },
    {
      value: "STEP_BY_STEP",
      label: "Step by Step",
      description: "Detailed Instructions for every step",
    },
  ];

  const handleSelect = (mode: string) => {
    if (!isStarting) {
      setSelectedMode(mode);
      onSelect(mode);
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">
        How would you like to guided throughout the project?
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {guidanceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={isStarting}
            className={`
              p-6 rounded-xl border-2 transition-all text-left relative
              ${
                selectedMode === option.value && isStarting
                  ? "border-primary bg-primary/5"
                  : selectedMode === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
              }
              ${isStarting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {selectedMode === option.value && isStarting && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{option.label}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
