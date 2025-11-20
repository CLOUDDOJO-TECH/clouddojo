/**
 * Weekly Progress Report Campaign
 *
 * Triggered by EventBridge every Sunday at 10 AM UTC
 * Sends weekly progress summary to active users
 */

import { getPrismaClient } from '../../shared/utils/prisma-client';
import { queueEmail } from '../../shared/utils/sqs-client';
import type { EmailQueueMessage } from '../../shared/types/email';

export async function handler() {
  console.log('Starting Weekly Progress Report campaign');

  const prisma = await getPrismaClient();

  try {
    // Get active users (logged in within last 7 days)
    const activeUsers = await prisma.user.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        emailPreferences: {
          weeklyProgressReport: true,
          unsubscribedAll: false,
        },
      },
      include: {
        quizAttempts: {
          where: {
            completedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        xp: true,
        streak: true,
        emailPreferences: true,
      },
      take: 1000, // Process in batches
    });

    console.log(`Found ${activeUsers.length} active users for weekly report`);

    let queued = 0;
    let skipped = 0;

    for (const user of activeUsers) {
      try {
        // Calculate weekly stats
        const weeklyStats = {
          quizzesTaken: user.quizAttempts.length,
          xpEarned: calculateWeeklyXP(user),
          currentStreak: user.streak?.currentStreak || 0,
          longestStreak: user.streak?.longestStreak || 0,
        };

        // Skip if no activity
        if (weeklyStats.quizzesTaken === 0) {
          skipped++;
          continue;
        }

        // Queue email
        const emailMessage: EmailQueueMessage = {
          messageId: `weekly-${Date.now()}-${user.userId}`,
          emailType: 'weekly_progress',
          userId: user.userId,
          data: {
            to: user.email,
            from: 'progress@clouddojo.tech',
            subject: `Your Weekly Progress Report 📈`,
            templateData: {
              username: user.firstName,
              ...weeklyStats,
            },
          },
          priority: 'normal',
          createdAt: new Date().toISOString(),
          retryCount: 0,
        };

        await queueEmail(emailMessage);
        queued++;
      } catch (error) {
        console.error(`Error processing user ${user.userId}:`, error);
      }
    }

    console.log(`Weekly progress campaign completed: ${queued} queued, ${skipped} skipped`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        queued,
        skipped,
        total: activeUsers.length,
      }),
    };
  } catch (error) {
    console.error('Error in weekly progress campaign:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

function calculateWeeklyXP(user: any): number {
  // Get XP earned this week by comparing with last week
  const currentXP = user.xp?.totalXP || 0;

  // Calculate weekly XP based on quiz attempts
  const weeklyQuizXP = user.quizAttempts.length * 20; // Assume 20 XP per quiz

  return weeklyQuizXP;
}

function calculateAverageScore(quizAttempts: any[]): number {
  if (quizAttempts.length === 0) return 0;

  const totalScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
  return Math.round(totalScore / quizAttempts.length);
}

function getTopPerformanceCategory(quizAttempts: any[]): string | undefined {
  if (quizAttempts.length === 0) return undefined;

  // Count quizzes by provider
  const providerCounts: Record<string, { count: number; totalScore: number }> = {};

  quizAttempts.forEach((attempt) => {
    if (attempt.quiz?.providers) {
      attempt.quiz.providers.forEach((provider: string) => {
        if (!providerCounts[provider]) {
          providerCounts[provider] = { count: 0, totalScore: 0 };
        }
        providerCounts[provider].count++;
        providerCounts[provider].totalScore += attempt.score || 0;
      });
    }
  });

  // Find provider with highest average score
  let topProvider: string | undefined;
  let highestAverage = 0;

  Object.entries(providerCounts).forEach(([provider, stats]) => {
    const average = stats.totalScore / stats.count;
    if (average > highestAverage) {
      highestAverage = average;
      topProvider = provider;
    }
  });

  return topProvider;
}
