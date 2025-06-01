"use client";

/**
 * Loading state component shown while leaderboard data is being fetched
 */
export function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
      <p className="text-muted-foreground">Loading leaderboard data...</p>
    </div>
  );
}