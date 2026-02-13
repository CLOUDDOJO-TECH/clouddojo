import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sub } from "date-fns"; // Import date-fns sub function for date calculations
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    // Get the timeRange query parameter
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'all';

    // Calculate date range based on the timeRange parameter
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case 'daily':
        // Last 24 hours
        dateFilter = {
          startedAt: {
            gte: sub(now, { hours: 24 })
          }
        };
        break;
      case 'weekly':
        // Last 7 days
        dateFilter = {
          startedAt: {
            gte: sub(now, { days: 7 })
          }
        };
        break;
      case 'monthly':
        // Last 30 days
        dateFilter = {
          startedAt: {
            gte: sub(now, { days: 30 })
          }
        };
        break;
      case 'all':
      default:
        // No date filter, get all attempts
        dateFilter = {};
        break;
    }

    const users = await prisma.user.findMany({
      include: {
        quizAttempts: {
          where: dateFilter,
        },
      },
    });

    // Fetch all users from Clerk to get their profile images
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList();
    const clerkUserMap = new Map();
    
    // Create a map of Clerk user data by user ID for easy lookup
    clerkUsers.data.forEach(user => {
      clerkUserMap.set(user.id, {
        profileImageUrl: user.imageUrl,
        // Add any other Clerk user data we might want to use
      });
    });

    // Define the type for leaderboard entries with enhanced metrics
    type LeaderboardEntry = {
      userId: string;
      firstName: string;
      lastName: string;
      averageScore: number;        // Average of all attempts
      bestScore: number;           // Best single score
      improvementFactor: number;   // How much they've improved
      consistencyScore: number;    // How consistent their performance is
      totalQuizzes: number;        // Total number of attempts
      totalTimeSpent: number;      // Total time spent on quizzes
      overallRankingScore: number; // Combined ranking metric
      createdAt?: Date;            // Optional for sorting
      updatedAt?: Date;            // Optional for sorting
      profileImageUrl?: string;    // Optional profile image URL
    };

    const leaderboard = users
      .map((user) => {
        if (user.quizAttempts.length === 0) {
          return null; // Skip users with no attempts
        }

        // Sort attempts by date to analyze improvement
        const sortedAttempts = [...user.quizAttempts].sort(
          (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        );

        const totalQuizzes = sortedAttempts.length;

        // ── Average Score (0-100) ──
        const averageScore = sortedAttempts.reduce(
          (sum, attempt) => sum + attempt.percentageScore, 0
        ) / totalQuizzes;

        // ── Best Score (kept for display, not used in ranking) ──
        const bestScore = Math.max(
          ...sortedAttempts.map(attempt => attempt.percentageScore)
        );

        // ── Activity Score (0-100) ──
        // Log-scaled so there's always a reward for more quizzes,
        // but diminishing returns prevent pure grinding.
        // 1 quiz → ~14, 5 → ~36, 10 → ~48, 25 → ~67, 50 → ~82, 100 → ~96
        const activityScore = Math.min(
          100,
          (Math.log2(totalQuizzes + 1) / Math.log2(101)) * 100
        );

        // ── Improvement Factor (raw, for display) ──
        let improvementFactor = 0;
        if (totalQuizzes >= 6) {
          const firstThree = sortedAttempts.slice(0, 3);
          const lastThree = sortedAttempts.slice(-3);
          const avgFirst = firstThree.reduce((sum, a) => sum + a.percentageScore, 0) / 3;
          const avgLast = lastThree.reduce((sum, a) => sum + a.percentageScore, 0) / 3;
          improvementFactor = avgLast - avgFirst;
        } else if (totalQuizzes >= 2) {
          improvementFactor =
            sortedAttempts[totalQuizzes - 1].percentageScore -
            sortedAttempts[0].percentageScore;
        }

        // ── Improvement Score (0-100, clamped) ──
        // Maps raw improvement (-100..+100) into a 0-100 scale.
        // 0 improvement → 50, +50 → 100, -50 → 0
        const improvementScore = Math.max(0, Math.min(100, 50 + improvementFactor));

        // ── Consistency Score (0-100) ──
        // Uses coefficient of variation (stdDev / mean) for a scale-independent measure.
        // Perfect consistency → 100, highly erratic → closer to 0.
        let consistencyScore = 100; // Default for single-attempt users
        if (totalQuizzes >= 2 && averageScore > 0) {
          const variance = sortedAttempts.reduce(
            (sum, attempt) => sum + Math.pow(attempt.percentageScore - averageScore, 2), 0
          ) / totalQuizzes;
          const coeffOfVariation = Math.sqrt(variance) / averageScore;
          // CV of 0 → 100, CV of 0.5 → 0
          consistencyScore = Math.max(0, Math.min(100, (1 - coeffOfVariation * 2) * 100));
        }

        // ── Recent Activity Score (0-100) ──
        // Rewards users who are actively practicing, not just historical totals.
        // Looks at how many quizzes were taken in the last 14 days relative to total.
        const twoWeeksAgo = sub(now, { days: 14 });
        const recentAttempts = sortedAttempts.filter(
          (a) => new Date(a.startedAt) >= twoWeeksAgo
        ).length;
        // Combine recency ratio with recent volume (log-scaled)
        const recencyRatio = totalQuizzes > 0 ? recentAttempts / totalQuizzes : 0;
        const recentVolume = Math.min(100, (Math.log2(recentAttempts + 1) / Math.log2(31)) * 100);
        const recentActivityScore = recencyRatio * 40 + recentVolume * 0.6;

        // Total time spent (kept for data, not used in ranking)
        const totalTimeSpent = sortedAttempts.reduce(
          (sum, attempt) => sum + attempt.timeSpentSecs, 0
        );

        // ── Overall Ranking Score ──
        // Weighted combination, all inputs normalized to 0-100
        const overallRankingScore =
          averageScore      * 0.30 +  // 30% — Skill
          activityScore     * 0.30 +  // 30% — Dedication (quiz volume)
          improvementScore  * 0.15 +  // 15% — Growth trajectory
          consistencyScore  * 0.10 +  // 10% — Reliable performance
          recentActivityScore * 0.15; // 15% — Recent engagement

        return {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          averageScore,
          bestScore,
          improvementFactor,
          consistencyScore,
          totalQuizzes,
          totalTimeSpent,
          overallRankingScore,
          profileImageUrl: clerkUserMap.get(user.userId)?.profileImageUrl,
        };
      })
      .filter(Boolean) as LeaderboardEntry[]; // Remove users with no attempts

    // Sort the leaderboard based on the overall ranking score
    leaderboard.sort((a, b) => b.overallRankingScore - a.overallRankingScore);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
