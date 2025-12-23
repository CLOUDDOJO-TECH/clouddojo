"use client";

import { useRouter } from "next/navigation";
import { Flame, X } from "lucide-react";
import { trpc } from "@/src/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * Alert banner shown on dashboard when user's streak is at risk
 * Displays if:
 * - User has a current streak >= 3 days
 * - User hasn't completed any activity today
 * - Last activity was yesterday (still within grace period)
 */
export function StreakRiskAlert() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const { data: streak, isLoading } = trpc.gamification.getStreak.useQuery();

  // Don't show if loading, dismissed, or no risk
  if (isLoading || dismissed || !streak) return null;

  const { currentStreak, isAtRisk, hasCompletedToday, streakFreezes } = streak;

  // Only show if user is at risk and hasn't completed today
  if (!isAtRisk || hasCompletedToday || currentStreak < 3) return null;

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleTakeQuiz = () => {
    router.push("/dashboard/practice");
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-orange-500/20 bg-linear-to-r from-orange-500/10 to-red-500/10 p-4">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-full p-1 text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        {/* Fire icon */}
        <div className="shrink-0 rounded-full bg-orange-500/20 p-2">
          <Flame className="h-6 w-6 text-orange-500" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold text-foreground">
              🔥 Don't lose your {currentStreak}-day streak!
            </h3>
            <p className="text-sm text-foreground/70">
              You haven't practiced today yet. Complete just one quiz to keep
              your streak alive.
            </p>
          </div>

          {/* Streak freezes */}
          {streakFreezes > 0 && (
            <div className="rounded-md bg-blue-500/10 border border-blue-500/20 px-3 py-2 text-xs text-blue-600 dark:text-blue-400">
              ❄️ You have {streakFreezes} streak freeze
              {streakFreezes !== 1 ? "s" : ""} available as backup
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleTakeQuiz}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Flame className="h-4 w-4" />
              Take a Quick Quiz
            </Button>
            <span className="text-xs text-foreground/60">
              Takes only 5 minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
