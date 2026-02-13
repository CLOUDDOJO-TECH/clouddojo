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

          // Avatar ring colors for differentiation
          const ringColors = [
            "ring-purple-300/60 dark:ring-purple-500/40",
            "ring-teal-300/60 dark:ring-teal-500/40",
            "ring-amber-300/60 dark:ring-amber-500/40",
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
              ringColor={ringColors[index]}
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

interface PodiumCardProps {
  user: LeaderboardEntry;
  index: number;
  ringColor: string;
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
  ringColor,
  orderClass,
  medalEmoji,
  getAvatarFallback
}: PodiumCardProps) {
  return (
    <div className={`relative ${orderClass}`}>
      <div className="bg-sidebar rounded-xl border border-dashed p-5 h-full">
        {/* Content */}
        <div>
          {/* User info with profile image */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                className={`${index === 0 ? 'h-16 w-16 ring-4' : 'h-14 w-14 ring-2'} ${ringColor}`}
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
          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Ranking Score</p>
              <p className={`font-bold ${index === 0 ? 'text-2xl' : 'text-xl'}`}>{user.overallRankingScore.toFixed(1)}</p>
            </div>
          </div>

          {/* Performance stats */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard label="Average" value={`${user.averageScore.toFixed(1)}%`} />
            <StatCard label="Best" value={`${user.bestScore.toFixed(1)}%`} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <StatCard label="Quizzes" value={`${user.totalQuizzes}`} />

            <div className="bg-muted/50 rounded-lg p-2 flex flex-col justify-between col-span-2">
              <p className="text-xs text-muted-foreground">Improvement</p>
              <p className={`font-semibold ${user.improvementFactor > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
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
    <div className="bg-muted/50 rounded-lg p-2 flex flex-col justify-between">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
