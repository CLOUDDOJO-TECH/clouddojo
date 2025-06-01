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
          where: dateFilter, // Apply the date filter to quiz attempts
        },
      },
    });

    // Fetch all users from Clerk to get their profile images
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList();
    const clerkUserMap = new Map();
    
    // Create a map of Clerk user data by user ID for easy lookup
    // Access the data property which contains the array of users
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
        
        // Calculate average score across all attempts
        const totalScore = sortedAttempts.reduce(
          (sum, attempt) => sum + attempt.percentageScore, 
          0
        );
        const averageScore = totalScore / sortedAttempts.length;
        
        // Find the best score
        const bestScore = Math.max(
          ...sortedAttempts.map(attempt => attempt.percentageScore)
        );
        
        // Calculate improvement factor (compare last 3 vs first 3 attempts)
        let improvementFactor = 0;
        if (sortedAttempts.length >= 6) {
          const firstThree = sortedAttempts.slice(0, 3);
          const lastThree = sortedAttempts.slice(-3);
          
          const avgFirst = firstThree.reduce((sum, attempt) => sum + attempt.percentageScore, 0) / 3;
          const avgLast = lastThree.reduce((sum, attempt) => sum + attempt.percentageScore, 0) / 3;
          
          improvementFactor = avgLast - avgFirst;
        } else if (sortedAttempts.length >= 2) {
          // If fewer than 6 attempts, just compare first and last
          improvementFactor = sortedAttempts[sortedAttempts.length - 1].percentageScore - 
                             sortedAttempts[0].percentageScore;
        }
        
        // Calculate consistency (standard deviation - lower is more consistent)
        const mean = averageScore;
        const variance = sortedAttempts.reduce(
          (sum, attempt) => sum + Math.pow(attempt.percentageScore - mean, 2),
          0
        ) / sortedAttempts.length;
        const stdDev = Math.sqrt(variance);
        // Invert and normalize for a 0-100 score where higher is more consistent
        const consistencyScore = 100 / (1 + stdDev);
        
        // Total time spent on quizzes (in seconds)
        const totalTimeSpent = sortedAttempts.reduce(
          (sum, attempt) => sum + attempt.timeSpentSecs,
          0
        );

        // Calculate overall ranking score (weighted combination of factors)
        const overallRankingScore = (
          averageScore * 0.4 +         // 40% weight on average score
          bestScore * 0.2 +            // 20% weight on best score
          (improvementFactor * 2) +    // Bonus for improvement
          consistencyScore * 0.1 +     // 10% weight on consistency
          Math.min(sortedAttempts.length * 2, 20) + // Up to 20 points for attempt count
          Math.min(totalTimeSpent / 3600, 10)   // Up to 10 points for time investment
        );
        
        return {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          averageScore,
          bestScore,
          improvementFactor,
          consistencyScore,
          totalQuizzes: sortedAttempts.length,
          totalTimeSpent,
          overallRankingScore,
          profileImageUrl: clerkUserMap.get(user.userId)?.profileImageUrl, // Get profile image URL from Clerk data
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
