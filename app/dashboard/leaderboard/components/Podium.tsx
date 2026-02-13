"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "../types";

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

/**
 * Component for displaying the top three performers on a podium
 */
export function Podium({ topThree }: PodiumProps) {
  // Helper function to generate avatar fallback text
  const getAvatarFallback = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";
  };

  return (
    <div className="mb-14">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {topThree.map((user, index) => {
          const medalEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";

          // Position-specific accent styles
          const positionStyles = [
            { // 1st — Gold
              ring: "ring-amber-400/70 dark:ring-amber-400/50",
              border: "border-l-amber-400 dark:border-l-amber-500",
              scoreBg: "bg-amber-500/10 dark:bg-amber-400/10",
              scoreText: "text-amber-600 dark:text-amber-400",
            },
            { // 2nd — Silver
              ring: "ring-slate-400/70 dark:ring-slate-300/50",
              border: "border-l-slate-400 dark:border-l-slate-400",
              scoreBg: "bg-slate-500/10 dark:bg-slate-400/10",
              scoreText: "text-slate-600 dark:text-slate-300",
            },
            { // 3rd — Bronze (rose)
              ring: "ring-rose-400/70 dark:ring-rose-400/50",
              border: "border-l-rose-400 dark:border-l-rose-500",
              scoreBg: "bg-rose-500/10 dark:bg-rose-400/10",
              scoreText: "text-rose-600 dark:text-rose-400",
            },
          ];

          // Order should be: 2nd (silver) | 1st (gold) | 3rd (bronze)
          const orderClass = index === 0
            ? "sm:order-2 sm:col-span-1 sm:translate-y-0 sm:scale-110 sm:z-10"
            : index === 1
            ? "sm:order-1 sm:translate-y-4"
            : "sm:order-3 sm:translate-y-4";

          return (
            <PodiumCard
              key={user.userId}
              user={user}
              index={index}
              positionStyle={positionStyles[index]}
              orderClass={orderClass}
              medalEmoji={medalEmoji}
              getAvatarFallback={getAvatarFallback}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PositionStyle {
  ring: string;
  border: string;
  scoreBg: string;
  scoreText: string;
}

interface PodiumCardProps {
  user: LeaderboardEntry;
  index: number;
  positionStyle: PositionStyle;
  orderClass: string;
  medalEmoji: string;
  getAvatarFallback: (firstName?: string, lastName?: string) => string;
}

/**
 * Individual card for a podium position
 */
function PodiumCard({
  user,
  index,
  positionStyle,
  orderClass,
  medalEmoji,
  getAvatarFallback
}: PodiumCardProps) {
  return (
    <div className={`relative ${orderClass}`}>
      <div className={`bg-sidebar rounded-xl border border-dashed border-l-4 ${positionStyle.border} p-5 h-full`}>
        {/* Content */}
        <div>
          {/* User info with profile image */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                className={`${index === 0 ? 'h-16 w-16 ring-4' : 'h-14 w-14 ring-2'} ${positionStyle.ring}`}
              >
                {user.profileImageUrl ? (
                  <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                ) : (
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                )}
                <AvatarFallback>{getAvatarFallback(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className={`font-bold ${index === 0 ? 'text-xl' : 'text-lg'}`}>{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-muted-foreground">
                  Rank #{index + 1}
                </p>
              </div>
            </div>
            <span className="text-2xl">{medalEmoji}</span>
          </div>

          {/* Ranking score */}
          <div className={`${positionStyle.scoreBg} rounded-lg p-3 mb-3`}>
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Ranking Score</p>
              <p className={`font-bold ${index === 0 ? 'text-2xl' : 'text-xl'} ${positionStyle.scoreText}`}>{user.overallRankingScore.toFixed(1)}</p>
            </div>
          </div>

          {/* Performance stats */}
          <div className="grid grid-cols-4 gap-1.5">
            <StatCard label="Avg" value={`${user.averageScore.toFixed(1)}%`} />
            <StatCard label="Best" value={`${user.bestScore.toFixed(1)}%`} />
            <StatCard label="Quizzes" value={`${user.totalQuizzes}`} />
            <div className="bg-muted/50 rounded-md px-2 py-1.5 flex flex-col justify-between">
              <p className="text-[10px] text-muted-foreground leading-tight">Improv.</p>
              <p className={`text-sm font-semibold ${user.improvementFactor > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {user.improvementFactor > 0 ? "+" : ""}{user.improvementFactor.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable stat card component
 */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-md px-2 py-1.5 flex flex-col justify-between">
      <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
