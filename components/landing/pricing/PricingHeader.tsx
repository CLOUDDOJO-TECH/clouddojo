"use client";

import { cn } from "@/lib/utils";

interface PricingHeaderProps {
  title: string;
  subtitle: string;
  frequencies: string[];
  selectedFrequency: string;
  onFrequencyChange: (frequency: string) => void;
}

export function PricingHeader({
  title,
  subtitle,
  frequencies,
  selectedFrequency,
  onFrequencyChange,
}: PricingHeaderProps) {
  return (
    <div className="mb-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mx-auto max-w-2xl text-muted-foreground">{subtitle}</p>

      {frequencies.length > 1 && (
        <div className="inline-flex items-center gap-2 rounded-full bg-muted p-1">
          {frequencies.map((freq) => (
            <button
              key={freq}
              onClick={() => onFrequencyChange(freq)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedFrequency === freq
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
