"use client";

import { useState } from "react";
import { TimeRangeOption } from "./types";
import { TimeRangeSelector } from "./TimeRangeSelector";
import HowWeRank from "./how-we-rank.modal.";

/**
 * LeaderboardHeader component displays the title and info dialog
 */
export function LeaderboardHeader({
  handleTimeRangeChange,
  timeRange,
}: {
  handleTimeRangeChange: (range: TimeRangeOption) => void;
  timeRange: TimeRangeOption;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex justify-between md:py-6 py-4 items-center mb-6 sm:mb-10">
      <TimeRangeSelector
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />
      <HowWeRank />
    </div>
  );
}

// TODO
/**
 * Helper component for displaying individual ranking factors in the info dialog
 */
