"use client";

import { Button } from "@/components/ui/button";
import { TimeRangeOption } from "../types";

interface TimeRangeSelectorProps {
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
}

const timeRanges: { value: TimeRangeOption; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "all", label: "All Time" },
];

/**
 * Component for selecting the time range for leaderboard data
 */
export function TimeRangeSelector({
  timeRange,
  onTimeRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-dashed border-border/60 p-1 gap-1">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={timeRange === range.value ? "default" : "ghost"}
          size="sm"
          className={`rounded-md px-4 text-sm transition-all duration-300 ease-in-out ${
            timeRange !== range.value
              ? "hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
              : ""
          }`}
          onClick={() => onTimeRangeChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
