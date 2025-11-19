"use client";

import { trpc } from "@/src/lib/trpc/react";
import { Target, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function DailyGoalCard() {
  const { data: dailyGoal, isLoading } = trpc.gamification.getDailyGoal.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const { data: xpData } = trpc.gamification.getXP.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-background p-6">
        <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
      </div>
    );
  }

  const xpEarned = dailyGoal?.xpEarned || 0;
  const goal = dailyGoal?.dailyGoal || 100;
  const progress = dailyGoal?.progress || 0;
  const isComplete = dailyGoal?.isComplete || false;
  const questionsAnswered = dailyGoal?.questionsAnswered || 0;
  const quizzesTaken = dailyGoal?.quizzesTaken || 0;
  const minutesSpent = dailyGoal?.minutesSpent || 0;

  const getProgressColor = () => {
    if (isComplete) return "bg-emerald-500";
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getMotivationalMessage = () => {
    if (isComplete) return "🎉 Daily goal complete! Amazing work!";
    if (progress >= 75) return "Almost there! Keep pushing!";
    if (progress >= 50) return "You're halfway there!";
    if (progress >= 25) return "Great start! Keep going!";
    return "Start your learning journey today!";
  };

  return (
    <div className="rounded-lg border border-border bg-background p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          ) : (
            <Target className="h-6 w-6 text-foreground/60" />
          )}
          <h3 className="text-lg font-semibold text-foreground">Daily Goal</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{xpEarned}</div>
          <div className="text-sm text-foreground/60">/ {goal} XP</div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="relative mx-auto mb-6 h-48 w-48">
        <svg className="h-full w-full -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-foreground/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 80}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 80 * (1 - progress / 100),
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={
              isComplete
                ? "text-emerald-500"
                : progress >= 75
                  ? "text-green-500"
                  : progress >= 50
                    ? "text-yellow-500"
                    : progress >= 25
                      ? "text-orange-500"
                      : "text-red-500"
            }
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-foreground">
            {Math.round(progress)}%
          </div>
          <div className="text-sm text-foreground/60">Complete</div>
        </div>
      </div>

      {/* Motivational Message */}
      <p className="mb-4 text-center text-sm font-medium text-foreground">
        {getMotivationalMessage()}
      </p>

      {/* Today's Activity Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {questionsAnswered}
          </div>
          <div className="text-xs text-foreground/60">Questions</div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {quizzesTaken}
          </div>
          <div className="text-xs text-foreground/60">Quizzes</div>
        </div>

        <div className="rounded-lg border border-border bg-background/50 p-3">
          <div className="text-xl font-bold text-foreground">{minutesSpent}m</div>
          <div className="text-xs text-foreground/60">Time</div>
        </div>
      </div>

      {/* Level Progress */}
      {xpData && (
        <div className="mb-4 rounded-lg border border-border bg-background/50 p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-foreground/60">Level {xpData.currentLevel}</span>
            <span className="font-medium text-foreground">
              {xpData.totalXP} XP
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${xpData.progressToNextLevel}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-purple-500"
            />
          </div>
          <div className="mt-1 text-xs text-foreground/60">
            {xpData.xpToNextLevel} XP to Level {xpData.currentLevel + 1}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!isComplete && (
        <Link
          href="/quiz-builder"
          className="block w-full rounded-lg border border-border bg-foreground px-4 py-3 text-center font-semibold text-background transition-all hover:bg-foreground/90"
        >
          Start Learning
        </Link>
      )}

      {isComplete && (
        <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-center">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ Goal completed for today!
          </span>
        </div>
      )}
    </div>
  );
}
