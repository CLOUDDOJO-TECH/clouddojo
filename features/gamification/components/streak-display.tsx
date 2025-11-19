"use client";

import { trpc } from "@/src/lib/trpc/react";
import { Flame, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function StreakDisplay() {
  const { data: streak, isLoading } = trpc.gamification.getStreak.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchInterval: 60000, // Refresh every minute
    }
  );

  const useFreezeMutation = trpc.gamification.useStreakFreeze.useMutation({
    onSuccess: () => {
      // Refetch streak data
      window.location.reload();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
      </div>
    );
  }

  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;
  const streakFreezes = streak?.streakFreezes || 0;
  const hasCompletedToday = streak?.hasCompletedToday || false;
  const isAtRisk = streak?.isAtRisk || false;

  // Determine flame color based on streak length
  const getFlameColor = () => {
    if (currentStreak === 0) return "text-foreground/20";
    if (currentStreak < 7) return "text-orange-500";
    if (currentStreak < 30) return "text-orange-600";
    if (currentStreak < 100) return "text-red-500";
    return "text-red-600";
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (hasCompletedToday) return "Streak secured for today! 🎉";
    if (isAtRisk) return "⚠️ Complete an activity to keep your streak!";
    return "Keep it going!";
  };

  return (
    <div className="rounded-lg border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        {/* Streak Counter */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              repeat: currentStreak > 0 ? Infinity : 0,
              repeatDelay: 2,
            }}
          >
            <Flame
              className={`h-12 w-12 ${getFlameColor()}`}
              fill="currentColor"
            />
          </motion.div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                {currentStreak}
              </span>
              <span className="text-lg text-foreground/60">day streak</span>
            </div>
            <p className="mt-1 text-sm text-foreground/60">
              {getStreakMessage()}
            </p>
          </div>
        </div>

        {/* Streak Freezes */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold text-foreground">
              {streakFreezes}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground/60">Streak freezes</p>
          {isAtRisk && streakFreezes > 0 && (
            <button
              onClick={() => useFreezeMutation.mutate()}
              disabled={useFreezeMutation.isLoading}
              className="mt-2 rounded-lg border border-blue-500 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400"
            >
              {useFreezeMutation.isLoading ? "Using..." : "Use Freeze"}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!hasCompletedToday && currentStreak > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-foreground/60">Today's progress</span>
            <span className="font-medium text-foreground">0%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      )}

      {hasCompletedToday && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-foreground/60">Today's progress</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Complete! ✓
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="mt-6 grid grid-cols-4 gap-2 text-center">
        <div
          className={`rounded-lg border p-2 ${
            currentStreak >= 7
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border bg-background/50"
          }`}
        >
          <div className="text-lg font-bold text-foreground">7</div>
          <div className="text-xs text-foreground/60">Week</div>
        </div>

        <div
          className={`rounded-lg border p-2 ${
            currentStreak >= 30
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border bg-background/50"
          }`}
        >
          <div className="text-lg font-bold text-foreground">30</div>
          <div className="text-xs text-foreground/60">Month</div>
        </div>

        <div
          className={`rounded-lg border p-2 ${
            currentStreak >= 100
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border bg-background/50"
          }`}
        >
          <div className="text-lg font-bold text-foreground">100</div>
          <div className="text-xs text-foreground/60">Century</div>
        </div>

        <div
          className={`rounded-lg border p-2 ${
            currentStreak >= 365
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border bg-background/50"
          }`}
        >
          <div className="text-lg font-bold text-foreground">365</div>
          <div className="text-xs text-foreground/60">Year</div>
        </div>
      </div>

      {/* Longest Streak */}
      {longestStreak > currentStreak && (
        <div className="mt-4 rounded-lg border border-border bg-background/50 p-3 text-center">
          <span className="text-sm text-foreground/60">
            Your longest streak: <span className="font-semibold text-foreground">{longestStreak} days</span>
          </span>
        </div>
      )}
    </div>
  );
}
