/**
 * Feature Adoption Nudges Campaign
 *
 * Triggered by EventBridge daily at 11 AM UTC
 * Sends feature adoption emails to users who haven't used key features
 */

import { getPrismaClient } from '../../shared/utils/prisma-client';
import { queueEmail } from '../../shared/utils/sqs-client';
import { wasEmailSentRecently } from '../../shared/utils/redis-client';
import type { EmailQueueMessage } from '../../shared/types/email';

// Define features to track
const FEATURES = [
  {
    id: 'ai-analysis',
    name: 'AI Certification Analysis',
    icon: '🤖',
    description: 'Get personalized insights and readiness scores',
    benefits: [
      'Identify your strengths and weaknesses',
      'Get personalized study recommendations',
      'Track your certification readiness',
    ],
    checkFunction: async (prisma: any, userId: string) => {
      const analysis = await prisma.certificationAnalysis.findFirst({
        where: { userId },
      });
      return !analysis; // Return true if feature NOT used
    },
    minQuizzesRequired: 5,
  },
  {
    id: 'projects',
    name: 'Hands-on Projects',
    icon: '🚀',
    description: 'Build real-world AWS projects to solidify your skills',
    benefits: [
      'Apply what you learned in real scenarios',
      'Build your portfolio',
      'Gain practical experience',
    ],
    checkFunction: async (prisma: any, userId: string) => {
      const projects = await prisma.projectProgress.findFirst({
        where: { userId },
      });
      return !projects;
    },
    minQuizzesRequired: 10,
  },
  {
    id: 'daily-streak',
    name: 'Daily Streak Challenge',
    icon: '🔥',
    description: 'Build consistency with daily practice',
    benefits: [
      'Stay motivated with streak rewards',
      'Build a sustainable study habit',
      'Unlock exclusive streak badges',
    ],
    checkFunction: async (prisma: any, userId: string) => {
      const streak = await prisma.userStreak.findFirst({
        where: { userId, currentStreak: { gte: 7 } },
      });
      return !streak; // Not on 7+ day streak
    },
    minQuizzesRequired: 3,
  },
  {
    id: 'flashcards',
    name: 'Smart Flashcards',
    icon: '🎴',
    description: 'Reinforce your learning with spaced repetition',
    benefits: [
      'Remember key concepts better',
      'Review efficiently with spaced repetition',
      'Study on the go',
    ],
    checkFunction: async (prisma: any, userId: string) => {
      // For now, check if user has ever used flashcards
      // TODO: Implement flashcard tracking
      return true; // Assume not used for now
    },
    minQuizzesRequired: 5,
  },
];

export async function handler() {
  console.log('Starting Feature Adoption Nudges campaign');

  const prisma = await getPrismaClient();

  try {
    // Get users who have taken at least 3 quizzes but not used all features
    const activeUsers = await prisma.user.findMany({
      where: {
        quizAttempts: {
          some: {
            completedAt: {
              gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Active in last 14 days
            },
          },
        },
        emailPreferences: {
          featureUpdates: true,
          unsubscribedAll: false,
        },
      },
      include: {
        quizAttempts: {
          select: {
            id: true,
          },
        },
        emailPreferences: true,
      },
      take: 500, // Process in batches
    });

    console.log(`Found ${activeUsers.length} users for feature nudges`);

    let totalQueued = 0;

    for (const user of activeUsers) {
      try {
        const quizCount = user.quizAttempts.length;

        // Check each feature
        for (const feature of FEATURES) {
          // Skip if user hasn't reached minimum quizzes for this feature
          if (quizCount < feature.minQuizzesRequired) {
            continue;
          }

          // Check if user hasn't used this feature
          const hasNotUsed = await feature.checkFunction(prisma, user.userId);
          if (!hasNotUsed) {
            continue; // User already uses this feature
          }

          // Check if we already sent this nudge recently (within 7 days)
          const alreadySent = await wasEmailSentRecently(
            user.userId,
            `feature_${feature.id}`,
            168 // 7 days in hours
          );
          if (alreadySent) {
            continue;
          }

          // Queue feature adoption email
          const emailMessage: EmailQueueMessage = {
            messageId: `feature-${feature.id}-${Date.now()}-${user.userId}`,
            emailType: 'feature_adoption',
            userId: user.userId,
            data: {
              to: user.email,
              from: 'features@clouddojo.tech',
              subject: `Unlock ${feature.name} - You're Missing Out! 💡`,
              templateData: {
                username: user.firstName,
                featureName: feature.name,
                featureIcon: feature.icon,
                featureDescription: feature.description,
                featureBenefits: feature.benefits,
                ctaUrl: `https://clouddojo.tech/dashboard?feature=${feature.id}`,
                quizzesTaken: quizCount,
              },
            },
            priority: 'low',
            createdAt: new Date().toISOString(),
            retryCount: 0,
          };

          await queueEmail(emailMessage);
          totalQueued++;

          // Only send one feature nudge per user per run
          break;
        }
      } catch (error) {
        console.error(`Error processing user ${user.userId}:`, error);
      }
    }

    console.log(`Feature adoption campaign completed: ${totalQueued} emails queued`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        totalQueued,
      }),
    };
  } catch (error) {
    console.error('Error in feature adoption campaign:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}
