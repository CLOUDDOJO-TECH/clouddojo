/**
 * Email Orchestration Service
 *
 * Central service for triggering emails from the Next.js app
 * Calls AWS Lambda orchestrator which handles queuing and preferences
 */

import { prisma } from '@/lib/prisma';

const EMAIL_ORCHESTRATOR_URL = process.env.EMAIL_ORCHESTRATOR_URL || '';
const ORCHESTRATOR_SECRET = process.env.EMAIL_ORCHESTRATOR_SECRET || '';

export interface EmailEvent {
  eventType: string;
  userId: string;
  eventData: Record<string, any>;
}

export interface EmailOrchestrationResult {
  success: boolean;
  reason?: string;
  emailType?: string;
  queuedAt?: string;
}

/**
 * Trigger an email event
 * This calls the AWS Lambda orchestrator which:
 * - Checks user preferences
 * - Validates eligibility
 * - Queues to SQS
 */
export async function triggerEmail(event: EmailEvent): Promise<EmailOrchestrationResult> {
  try {
    // If Lambda URL not configured, fallback to legacy direct send
    if (!EMAIL_ORCHESTRATOR_URL) {
      console.warn('EMAIL_ORCHESTRATOR_URL not configured, email not sent');
      return { success: false, reason: 'Email orchestrator not configured' };
    }

    // Call Lambda orchestrator
    const response = await fetch(EMAIL_ORCHESTRATOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-clouddojo-signature': await generateSignature(event),
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`Lambda orchestrator error: ${response.statusText}`);
    }

    const result: EmailOrchestrationResult = await response.json();
    return result;
  } catch (error) {
    console.error('Error triggering email:', error);
    return {
      success: false,
      reason: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Helper: Trigger welcome email on user signup
 */
export async function triggerWelcomeEmail(userId: string, email: string, username: string) {
  return triggerEmail({
    eventType: 'user.created',
    userId,
    eventData: {
      email,
      username,
    },
  });
}

/**
 * Helper: Trigger quiz completion milestone email
 */
export async function triggerQuizMilestone(
  userId: string,
  quizCount: number,
  score: number,
  certificationName?: string
) {
  return triggerEmail({
    eventType: 'quiz.completed',
    userId,
    eventData: {
      quizCount,
      score,
      certificationName,
    },
  });
}

/**
 * Helper: Trigger perfect score celebration
 */
export async function triggerPerfectScore(userId: string, quizTitle: string) {
  return triggerEmail({
    eventType: 'quiz.perfect_score',
    userId,
    eventData: {
      quizTitle,
    },
  });
}

/**
 * Helper: Trigger AI analysis ready notification
 */
export async function triggerAIAnalysisReady(
  userId: string,
  certificationName: string,
  readinessScore: number
) {
  return triggerEmail({
    eventType: 'ai_analysis.ready',
    userId,
    eventData: {
      certificationName,
      readinessScore,
    },
  });
}

// ============================================
// PHASE 2: BEHAVIOR-TRIGGERED EMAILS
// ============================================

/**
 * Helper: Trigger quiz milestone email (10, 25, 50, 100 quizzes)
 */
export async function triggerQuizMilestoneEmail(
  userId: string,
  quizCount: number,
  totalScore: number,
  averageScore: number,
  nextMilestone: number,
  topCategory?: string
) {
  // Only trigger on milestones
  const milestones = [10, 25, 50, 100];
  if (!milestones.includes(quizCount)) {
    return { success: false, reason: 'Not a milestone quiz count' };
  }

  return triggerEmail({
    eventType: 'quiz.milestone',
    userId,
    eventData: {
      quizCount,
      totalScore,
      averageScore,
      nextMilestone,
      topCategory,
    },
  });
}

/**
 * Helper: Trigger badge unlocked email
 */
export async function triggerBadgeUnlocked(
  userId: string,
  badgeName: string,
  badgeDescription: string,
  badgeIcon: string,
  badgeTier: string,
  totalBadges: number,
  nextBadge?: string
) {
  return triggerEmail({
    eventType: 'badge.unlocked',
    userId,
    eventData: {
      badgeName,
      badgeDescription,
      badgeIcon,
      badgeTier,
      totalBadges,
      nextBadge,
    },
  });
}

/**
 * Helper: Trigger streak milestone email (7, 14, 30, 100 days)
 */
export async function triggerStreakMilestone(
  userId: string,
  currentStreak: number,
  longestStreak: number,
  streakFreezes: number,
  totalXP: number
) {
  // Only trigger on milestones
  const milestones = [7, 14, 30, 100];
  if (!milestones.includes(currentStreak)) {
    return { success: false, reason: 'Not a streak milestone' };
  }

  return triggerEmail({
    eventType: 'streak.milestone',
    userId,
    eventData: {
      currentStreak,
      longestStreak,
      streakFreezes,
      totalXP,
    },
  });
}

/**
 * Helper: Trigger level up email
 */
export async function triggerLevelUp(
  userId: string,
  newLevel: number,
  totalXP: number,
  xpToNextLevel: number,
  unlockedFeatures?: string[]
) {
  return triggerEmail({
    eventType: 'level.up',
    userId,
    eventData: {
      newLevel,
      totalXP,
      xpToNextLevel,
      unlockedFeatures,
    },
  });
}

/**
 * Helper: Trigger feature adoption nudge
 */
export async function triggerFeatureAdoption(
  userId: string,
  featureName: string,
  featureDescription: string,
  featureBenefits: string[],
  featureIcon: string,
  ctaUrl: string
) {
  return triggerEmail({
    eventType: 'feature.adoption',
    userId,
    eventData: {
      featureName,
      featureDescription,
      featureBenefits,
      featureIcon,
      ctaUrl,
    },
  });
}

/**
 * Generate HMAC signature for request authentication
 * Uses HMAC-SHA256 to sign the email event data
 */
async function generateSignature(event: EmailEvent): Promise<string> {
  const crypto = await import('crypto');
  return crypto
    .createHmac('sha256', ORCHESTRATOR_SECRET)
    .update(JSON.stringify(event))
    .digest('hex');
}

/**
 * Log email event to database (for audit trail)
 */
export async function logEmailEvent(event: EmailEvent): Promise<void> {
  try {
    await prisma.emailEvent.create({
      data: {
        eventType: event.eventType,
        userId: event.userId,
        eventData: event.eventData,
        processed: false,
      },
    });
  } catch (error) {
    console.error('Error logging email event:', error);
    // Don't throw - logging failure shouldn't break email flow
  }
}
