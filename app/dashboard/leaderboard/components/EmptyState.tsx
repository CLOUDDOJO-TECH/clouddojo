"use client";

import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Empty state component displayed when there are no leaderboard entries
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto py-8">
      <div className="rounded-full bg-muted/50 p-4 mb-4">
        <Trophy className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <h2 className="text-lg font-semibold mb-1">No rankings yet</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Complete your first practice test to appear on the leaderboard.
      </p>
      <Button asChild variant="outline" size="sm" className="border-dashed">
        <Link href="/dashboard">Start practicing</Link>
      </Button>
    </div>
  );
}
