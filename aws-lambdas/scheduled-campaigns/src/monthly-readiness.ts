/**
 * Monthly Certification Readiness Campaign
 *
 * Triggered by EventBridge on 1st of each month at 9 AM UTC
 * Sends certification readiness analysis to active users
 */

import { getPrismaClient } from '../../shared/utils/prisma-client';
import { queueEmail } from '../../shared/utils/sqs-client';
import type { EmailQueueMessage } from '../../shared/types/email';

export async function handler() {
  console.log('Starting Monthly Certification Readiness campaign');

  const prisma = await getPrismaClient();

  try {
    // Get users who have taken quizzes in the last 30 days
    const activeUsers = await prisma.user.findMany({
      where: {
        quizAttempts: {
          some: {
            completedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        emailPreferences: {
          aiAnalysisNotifs: true,
          unsubscribedAll: false,
        },
      },
      include: {
        quizAttempts: {
          where: {
            completedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          include: {
            quiz: {
              select: {
                providers: true,
                title: true,
              },
            },
          },
        },
        xp: true,
        emailPreferences: true,
      },
      take: 1000, // Process in batches
    });

    console.log(`Found ${activeUsers.length} users for monthly readiness report`);

    let queued = 0;
    let skipped = 0;

    for (const user of activeUsers) {
      try {
        // Group quizzes by provider/certification
        const quizzesByProvider: Record<string, any[]> = {};
        user.quizAttempts.forEach((attempt) => {
          attempt.quiz.providers.forEach((provider: string) => {
            if (!quizzesByProvider[provider]) {
              quizzesByProvider[provider] = [];
            }
            quizzesByProvider[provider].push(attempt);
          });
        });

        // Find the provider with most activity
        const providers = Object.keys(quizzesByProvider);
        if (providers.length === 0) {
          skipped++;
          continue;
        }

        const topProvider = providers.reduce((a, b) =>
          quizzesByProvider[a].length > quizzesByProvider[b].length ? a : b
        );

        const providerQuizzes = quizzesByProvider[topProvider];

        // Calculate readiness score
        const totalScore = providerQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
        const averageScore = totalScore / providerQuizzes.length;
        const readinessScore = Math.min(100, Math.round(averageScore * 1.2)); // Boost slightly

        // Determine strengths and weaknesses
        const strengths = [];
        const weaknesses = [];

        if (averageScore >= 80) {
          strengths.push('Strong fundamentals');
          strengths.push('Consistent high performance');
        } else if (averageScore >= 60) {
          strengths.push('Good foundation');
          weaknesses.push('Room for improvement in advanced topics');
        } else {
          weaknesses.push('Need more practice on fundamentals');
          weaknesses.push('Focus on core concepts');
        }

        // Calculate study hours needed
        const studyHours = Math.max(10, Math.round((100 - readinessScore) / 2));

        // Queue email
        const emailMessage: EmailQueueMessage = {
          messageId: `monthly-readiness-${Date.now()}-${user.userId}`,
          emailType: 'monthly_certification_readiness',
          userId: user.userId,
          data: {
            to: user.email,
            from: 'insights@clouddojo.tech',
            subject: `Your ${topProvider} Certification Readiness Report 📊`,
            templateData: {
              username: user.firstName,
              certificationName: topProvider,
              readinessScore,
              quizzesTaken: providerQuizzes.length,
              averageScore: Math.round(averageScore),
              strengths,
              weaknesses,
              studyHours,
              totalXP: user.xp?.totalXP || 0,
              level: user.xp?.level || 1,
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

    console.log(`Monthly readiness campaign completed: ${queued} queued, ${skipped} skipped`);

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
    console.error('Error in monthly readiness campaign:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}
