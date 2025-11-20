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

/**
 * Generate HMAC signature for request authentication
 */
async function generateSignature(event: EmailEvent): Promise<string> {
  // TODO: Implement HMAC signature
  // For now, return a simple hash
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
