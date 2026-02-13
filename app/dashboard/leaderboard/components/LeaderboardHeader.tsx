"use client";

import { useState } from "react";
import { TimeRangeOption } from "../types";
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
    <div className="space-y-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      <div className="flex justify-between items-center">
        <TimeRangeSelector
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
        <HowWeRank />
      </div>
    </div>
  );
}

// TODO
/**
 * Helper component for displaying individual ranking factors in the info dialog
 */
