/**
 * Email Orchestrator Lambda
 *
 * Entry point from Next.js app for all email events
 * - Validates email eligibility
 * - Checks user preferences
 * - Queues emails to SQS
 */

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPrismaClient } from '../../shared/utils/prisma-client';
import { wasEmailSentRecently, markEmailAsSent, checkRateLimit } from '../../shared/utils/redis-client';
import { queueEmail } from '../../shared/utils/sqs-client';
import type { EmailEvent, EmailQueueMessage } from '../../shared/types/email';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Email Orchestrator invoked:', JSON.stringify(event, null, 2));

  try {
    // Parse request body
    const emailEvent: EmailEvent = JSON.parse(event.body || '{}');

    if (!emailEvent.eventType || !emailEvent.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: eventType and userId' }),
      };
    }

    // Validate request signature (optional but recommended)
    const signature = event.headers['x-clouddojo-signature'];
    if (!validateSignature(signature, event.body || '')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Process the email event
    const result = await processEmailEvent(emailEvent);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in email orchestrator:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

async function processEmailEvent(emailEvent: EmailEvent) {
  const { eventType, userId, eventData } = emailEvent;

  const prisma = await getPrismaClient();

  // 1. Get user and preferences
  const user = await prisma.user.findUnique({
    where: { userId },
    include: { emailPreferences: true },
  });

  if (!user) {
    console.log(`User not found: ${userId}`);
    return { success: false, reason: 'User not found' };
  }

  // 2. Check if user has email preferences (create if not)
  if (!user.emailPreferences) {
    await prisma.emailPreferences.create({
      data: { userId },
    });
  }

  // 3. Map event to email type
  const emailType = mapEventToEmailType(eventType);
  if (!emailType) {
    console.log(`No email mapping for event: ${eventType}`);
    return { success: false, reason: 'No email mapping for event' };
  }

  // 4. Check user preferences
  if (!shouldSendEmail(user.emailPreferences, emailType)) {
    console.log(`User opted out of ${emailType}`);
    return { success: false, reason: 'User opted out' };
  }

  // 5. Check deduplication (Redis)
  const wasRecentlySent = await wasEmailSentRecently(userId, emailType, 24);
  if (wasRecentlySent) {
    console.log(`Email ${emailType} was sent recently to ${userId}`);
    return { success: false, reason: 'Email sent recently' };
  }

  // 6. Check rate limiting
  const rateLimit = await checkRateLimit(`email:user:${userId}`, 10, 3600); // 10 emails per hour
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for user ${userId}`);
    return { success: false, reason: 'Rate limit exceeded' };
  }

  // 7. Prepare email message
  const emailMessage: EmailQueueMessage = {
    messageId: `${Date.now()}-${userId}-${emailType}`,
    emailType,
    userId,
    data: {
      to: user.email,
      from: getFromAddress(emailType),
      subject: getSubject(emailType, eventData),
      templateData: {
        username: user.firstName,
        ...eventData,
      },
    },
    priority: getPriority(emailType),
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };

  // 8. Queue to SQS
  await queueEmail(emailMessage);

  // 9. Mark as sent in Redis (for deduplication)
  await markEmailAsSent(userId, emailType, 24);

  // 10. Log event to database
  await prisma.emailEvent.create({
    data: {
      eventType,
      userId,
      eventData,
      processed: true,
    },
  });

  console.log(`Email queued successfully: ${emailType} to ${user.email}`);

  return {
    success: true,
    emailType,
    queuedAt: emailMessage.createdAt,
  };
}

/**
 * Map event type to email type
 */
function mapEventToEmailType(eventType: string): string | null {
  const mapping: Record<string, string> = {
    // Phase 1 - Transactional
    'user.created': 'welcome',
    'quiz.completed': 'quiz_basic',
    'quiz.perfect_score': 'perfect_score',
    'ai_analysis.ready': 'ai_analysis_notification',

    // Phase 1 - Lifecycle
    'user.inactive_3d': 'inactive_3day',
    'user.inactive_7d': 'inactive_7day',
    'user.inactive_14d': 'inactive_14day',

    // Phase 2 - Behavior-Triggered
    'quiz.milestone': 'quiz_milestone',
    'badge.unlocked': 'badge_unlocked',
    'streak.milestone': 'streak_milestone',
    'level.up': 'level_up',
    'feature.adoption': 'feature_adoption',
  };

  return mapping[eventType] || null;
}

/**
 * Check if email should be sent based on preferences
 */
function shouldSendEmail(preferences: any, emailType: string): boolean {
  if (!preferences) return true;
  if (preferences.unsubscribedAll) return false;

  const preferenceMapping: Record<string, string> = {
    // Phase 1 - Transactional
    welcome: 'productUpdates',
    quiz_basic: 'productUpdates',
    perfect_score: 'milestoneEmails',
    ai_analysis_notification: 'aiAnalysisNotifs',

    // Phase 1 - Lifecycle
    inactive_3day: 'productUpdates',
    inactive_7day: 'productUpdates',
    inactive_14day: 'productUpdates',
    weekly_progress: 'weeklyProgressReport',

    // Phase 2 - Behavior-Triggered
    quiz_milestone: 'milestoneEmails',
    badge_unlocked: 'milestoneEmails',
    streak_milestone: 'milestoneEmails',
    level_up: 'milestoneEmails',
    feature_adoption: 'featureUpdates',

    // Marketing
    marketing: 'marketingEmails',
  };

  const prefKey = preferenceMapping[emailType];
  return prefKey ? preferences[prefKey] !== false : true;
}

/**
 * Get from address based on email type
 */
function getFromAddress(emailType: string): string {
  const fromMapping: Record<string, string> = {
    welcome: 'welcome@clouddojo.tech',
    ai_analysis_notification: 'analysis@clouddojo.tech',
    marketing: 'hello@clouddojo.tech',
  };

  return fromMapping[emailType] || 'noreply@clouddojo.tech';
}

/**
 * Get subject line based on email type
 */
function getSubject(emailType: string, eventData: any): string {
  const subjects: Record<string, string> = {
    // Phase 1 - Transactional
    welcome: 'Welcome to CloudDojo! 🚀',
    quiz_basic: `Great progress, ${eventData.username}! 🎯`,
    perfect_score: `Perfect Score! You're on fire! 🔥`,
    ai_analysis_notification: `Your AI Analysis is Ready! 📊`,

    // Phase 1 - Lifecycle
    inactive_3day: `We miss you! Come back and practice 📚`,
    inactive_7day: `Your progress is waiting for you 💪`,
    inactive_14day: `Last chance to continue your journey 🎓`,
    weekly_progress: 'Your Weekly Progress Report 📈',

    // Phase 2 - Behavior-Triggered
    quiz_milestone: `${eventData.quizCount} Quizzes Completed! 🎯`,
    badge_unlocked: `Badge Unlocked: ${eventData.badgeName}! 🏆`,
    streak_milestone: `${eventData.currentStreak}-Day Streak! 🔥`,
    level_up: `Level Up! You're now Level ${eventData.newLevel}! ⚡`,
    feature_adoption: `Unlock ${eventData.featureName} - You're Missing Out! 💡`,
  };

  return subjects[emailType] || 'CloudDojo Update';
}

/**
 * Get priority based on email type
 */
function getPriority(emailType: string): 'high' | 'normal' | 'low' {
  const highPriority = ['welcome', 'ai_analysis_notification', 'perfect_score'];
  const lowPriority = ['marketing', 'weekly_progress', 'feature_adoption'];

  if (highPriority.includes(emailType)) return 'high';
  if (lowPriority.includes(emailType)) return 'low';
  return 'normal';
}

/**
 * Validate request signature (security)
 */
function validateSignature(signature: string | undefined, body: string): boolean {
  // TODO: Implement HMAC signature validation
  // For now, check if signature exists
  if (!signature) {
    console.warn('No signature provided - consider adding signature validation');
  }

  // In production, verify HMAC signature:
  // const expectedSignature = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  // return signature === expectedSignature;

  return true; // Temporarily allow all (remove in production)
}
