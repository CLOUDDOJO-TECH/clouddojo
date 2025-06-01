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
          const medalEmoji = index === 0 ? "👑" : index === 1 ? "🥈" : "🥉";
          
          // Simple solid colors for each position
          const cardStyles = [
            // First place - Purple theme
            "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-950 dark:text-purple-50",
            // Second place - Silver theme
            "bg-teal-100 dark:bg-teal-800 border-teal-300 dark:border-teal-600 text-teal-950 dark:text-teal-50",
            // Third place - Bronze theme
            "bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-50"
          ];
          
          // Order should be: 2nd (silver) | 1st (gold) | 3rd (bronze)
          const orderClass = index === 0 
            ? "sm:order-2 sm:col-span-1 sm:translate-y-0 sm:scale-110 sm:z-10" // 1st place in middle
            : index === 1 
            ? "sm:order-1 sm:translate-y-4" // 2nd place on left
            : "sm:order-3 sm:translate-y-4"; // 3rd place on right
          
          return (
            <PodiumCard 
              key={user.userId}
              user={user}
              index={index}
              cardStyle={cardStyles[index]}
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
  cardStyle: string;
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
  cardStyle, 
  orderClass,
  medalEmoji,
  getAvatarFallback
}: PodiumCardProps) {
  return (
    <div className={`relative ${orderClass}`}>
      <div className={`${cardStyle} rounded-xl border p-5 backdrop-blur-sm transition-all hover:translate-y-[-3px] duration-300 h-full shadow-lg ${index === 0 ? 'shadow-purple-300/30 dark:shadow-purple-600/30' : ''}`}>
        {/* Special crown decoration for the winner */}
        {index === 0 && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="text-4xl">👑</div>
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {/* User info with profile image */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar 
                className={`${index === 0 ? 'h-16 w-16 ring-4 ring-purple-300 dark:ring-purple-500' : 'h-14 w-14 ring-2'} ring-white/30 shadow-lg`}
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
                <p className={`text-sm opacity-70`}>
                  {index === 0 ? "Champion" : `Rank #${index + 1}`}
                </p>
              </div>
            </div>
            <span className="text-2xl">{medalEmoji}</span>
          </div>
          
          {/* Ranking score */}
          <div className={`bg-white/20 dark:bg-black/20 rounded-lg p-3 backdrop-blur-sm mb-3 ${index === 0 ? 'border-2 border-purple-300/50 dark:border-purple-400/30' : ''}`}>
            <div className="flex justify-between items-center">
              <p className="font-medium">Ranking Score</p>
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
            
            <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm flex flex-col justify-between col-span-2">
              <p className="text-xs opacity-70">Improvement</p>
              <p className={`font-semibold ${user.improvementFactor > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {user.improvementFactor > 0 ? "+" : ""}{user.improvementFactor.toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Winner badge */}
          {index === 0 && (
            <div className="absolute -right-2 -top-2 bg-amber-300 dark:bg-amber-500 text-amber-950 dark:text-amber-50 rounded-full px-3 py-1 text-xs font-bold transform rotate-12 shadow-lg">
              #1 WINNER
            </div>
          )}
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
    <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm flex flex-col justify-between">
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}