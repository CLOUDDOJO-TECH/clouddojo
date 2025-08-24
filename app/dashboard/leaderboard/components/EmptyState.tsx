"use client";

import { Trophy } from "lucide-react";

/**
 * Empty state component displayed when there are no leaderboard entries
 */
export function EmptyState() {
  return (
    <div className="flex flex-col justify-start items-center h-[70vh] max-w-md mx-auto text-center">
      <Trophy className="h-24 w-24 text-muted-foreground/40 mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Leaderboard Data</h2>
      <p className="text-muted-foreground">
        There are no entries in the leaderboard yet. Complete some quizzes to
        see your ranking!
      </p>
    </div>
  );
}
