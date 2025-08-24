// Shared types for the leaderboard components

/**
 * Represents a user entry in the leaderboard with performance metrics
 */
export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  averageScore: number; // Average of all attempts
  bestScore: number; // Best single score
  improvementFactor: number; // How much they've improved
  consistencyScore: number; // How consistent their performance is
  totalQuizzes: number; // Total number of attempts
  totalTimeSpent: number; // Total time spent on quizzes
  overallRankingScore: number; // Combined ranking metric
  profileImageUrl?: string; // Profile image URL from Clerk
}

/**
 * Available time range options for the leaderboard
 */
export type TimeRangeOption = "all" | "weekly" | "monthly";

/**
 * Props shared across multiple leaderboard components
 */
export interface LeaderboardProps {
  leaderboardData: LeaderboardEntry[];
  timeRange: TimeRangeOption;
  searchTerm?: string;
}
