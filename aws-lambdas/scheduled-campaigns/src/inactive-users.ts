/**
 * Inactive User Re-engagement Campaign
 *
 * Triggered by EventBridge daily at 2 PM UTC
 * Sends re-engagement emails to inactive users
 */

import { getPrismaClient } from '../../shared/utils/prisma-client';
import { queueEmail } from '../../shared/utils/sqs-client';
import { wasEmailSentRecently } from '../../shared/utils/redis-client';
import type { EmailQueueMessage } from '../../shared/types/email';

export async function handler() {
  console.log('Starting Inactive User campaign');

  const prisma = await getPrismaClient();

  try {
    const now = Date.now();

    // Define inactivity windows
    const windows = [
      { days: 3, emailType: 'inactive_3day' },
      { days: 7, emailType: 'inactive_7day' },
      { days: 14, emailType: 'inactive_14day' },
    ];

    let totalQueued = 0;

    for (const window of windows) {
      const startDate = new Date(now - window.days * 24 * 60 * 60 * 1000);
      const endDate = new Date(now - (window.days - 1) * 24 * 60 * 60 * 1000);

      // Find users inactive for exactly this window
      const inactiveUsers = await prisma.user.findMany({
        where: {
          updatedAt: {
            gte: startDate,
            lt: endDate,
          },
          emailPreferences: {
            productUpdates: true,
            unsubscribedAll: false,
          },
        },
        include: {
          emailPreferences: true,
          quizAttempts: {
            take: 1,
            orderBy: { completedAt: 'desc' },
          },
        },
        take: 500,
      });

      console.log(`Found ${inactiveUsers.length} users inactive for ${window.days} days`);

      let queued = 0;

      for (const user of inactiveUsers) {
        try {
          // Check if we already sent this email
          const alreadySent = await wasEmailSentRecently(user.userId, window.emailType, 72);
          if (alreadySent) {
            continue;
          }

          // Get last quiz stats
          const lastQuiz = user.quizAttempts[0];

          // Queue email
          const emailMessage: EmailQueueMessage = {
            messageId: `inactive-${window.days}d-${Date.now()}-${user.userId}`,
            emailType: window.emailType,
            userId: user.userId,
            data: {
              to: user.email,
              from: 'hello@clouddojo.tech',
              subject: getSubject(window.days),
              templateData: {
                username: user.firstName,
                daysInactive: window.days,
                lastQuizScore: lastQuiz?.percentageScore,
                lastQuizDate: lastQuiz?.completedAt,
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

      totalQueued += queued;
      console.log(`${window.emailType}: ${queued} emails queued`);
    }

    console.log(`Inactive user campaign completed: ${totalQueued} total emails queued`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        totalQueued,
      }),
    };
  } catch (error) {
    console.error('Error in inactive user campaign:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

function getSubject(days: number): string {
  const subjects: Record<number, string> = {
    3: `We miss you! Come back and practice 📚`,
    7: `Your progress is waiting for you 💪`,
    14: `Last chance to continue your journey 🎓`,
  };

  return subjects[days] || 'Come back to CloudDojo';
}
