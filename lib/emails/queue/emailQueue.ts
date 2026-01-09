/**
 * Email Queue with Inngest
 * 
 * Background email processing with automatic retries and exponential backoff.
 * Uses Inngest instead of BullMQ for serverless-friendly background jobs.
 */

import { inngest } from "@/inngest/client";
import {
  sendWelcomeEmailNew,
  sendPasswordResetEmail,
  sendStudyReminderEmail,
  sendQuizResultsEmail,
} from "../emailService";

// ============================================
// EMAIL QUEUE FUNCTIONS (to trigger background sends)
// ============================================

interface QueueWelcomeEmailParams {
  userId: string;
  email: string;
  name: string;
}

export async function queueWelcomeEmail(params: QueueWelcomeEmailParams) {
  await inngest.send({
    name: "email/send-welcome",
    data: params,
  });
  console.log(`[Email Queue] Queued welcome email for ${params.email}`);
}

interface QueuePasswordResetEmailParams {
  userId: string;
  email: string;
  name: string;
  resetToken: string;
  expiryMinutes: number;
}

export async function queuePasswordResetEmail(params: QueuePasswordResetEmailParams) {
  await inngest.send({
    name: "email/send-password-reset",
    data: params,
  });
  console.log(`[Email Queue] Queued password reset email for ${params.email}`);
}

interface QueueStudyReminderEmailParams {
  userId: string;
  email: string;
  name: string;
  lastCertification: string;
  daysSinceLastStudy: number;
}

export async function queueStudyReminderEmail(params: QueueStudyReminderEmailParams) {
  await inngest.send({
    name: "email/send-study-reminder",
    data: params,
  });
  console.log(`[Email Queue] Queued study reminder email for ${params.email}`);
}

interface QuizData {
  score: number;
  totalQuestions: number;
  passPercentage: number;
  passed: boolean;
  weakAreas: string[];
  nextSteps: string;
}

interface QueueQuizResultsEmailParams {
  userId: string;
  email: string;
  name: string;
  quizData: QuizData;
}

export async function queueQuizResultsEmail(params: QueueQuizResultsEmailParams) {
  await inngest.send({
    name: "email/send-quiz-results",
    data: params,
  });
  console.log(`[Email Queue] Queued quiz results email for ${params.email}`);
}

// ============================================
// INNGEST EMAIL WORKER FUNCTIONS
// ============================================

/**
 * Welcome Email Worker
 * Retries: 3 times with exponential backoff
 */
export const sendWelcomeEmailWorker = inngest.createFunction(
  {
    id: "send-welcome-email",
    name: "Send Welcome Email",
    retries: 3,
  },
  { event: "email/send-welcome" },
  async ({ event, step, attempt }) => {
    const { userId, email, name } = event.data;
    
    console.log(`[Email Worker] Sending welcome email to ${email} (attempt ${attempt + 1}/3)`);
    
    const result = await step.run("send-email", async () => {
      return await sendWelcomeEmailNew({ userId, email, name });
    });

    if (!result.success) {
      console.error(`[Email Worker] Failed to send welcome email to ${email}:`, result.error);
      throw new Error(`Failed to send welcome email: ${result.error}`);
    }

    console.log(`[Email Worker] Successfully sent welcome email to ${email}`);
    return { success: true, email };
  }
);

/**
 * Password Reset Email Worker
 * Retries: 3 times with exponential backoff
 */
export const sendPasswordResetEmailWorker = inngest.createFunction(
  {
    id: "send-password-reset-email",
    name: "Send Password Reset Email",
    retries: 3,
  },
  { event: "email/send-password-reset" },
  async ({ event, step, attempt }) => {
    const { userId, email, name, resetToken, expiryMinutes } = event.data;
    
    console.log(`[Email Worker] Sending password reset email to ${email} (attempt ${attempt + 1}/3)`);
    
    const result = await step.run("send-email", async () => {
      return await sendPasswordResetEmail({ userId, email, name, resetToken, expiryMinutes });
    });

    if (!result.success) {
      console.error(`[Email Worker] Failed to send password reset email to ${email}:`, result.error);
      throw new Error(`Failed to send password reset email: ${result.error}`);
    }

    console.log(`[Email Worker] Successfully sent password reset email to ${email}`);
    return { success: true, email };
  }
);

/**
 * Study Reminder Email Worker
 * Retries: 3 times with exponential backoff
 */
export const sendStudyReminderEmailWorker = inngest.createFunction(
  {
    id: "send-study-reminder-email",
    name: "Send Study Reminder Email",
    retries: 3,
  },
  { event: "email/send-study-reminder" },
  async ({ event, step, attempt }) => {
    const { userId, email, name, lastCertification, daysSinceLastStudy } = event.data;
    
    console.log(`[Email Worker] Sending study reminder email to ${email} (attempt ${attempt + 1}/3)`);
    
    const result = await step.run("send-email", async () => {
      return await sendStudyReminderEmail({ userId, email, name, lastCertification, daysSinceLastStudy });
    });

    if (!result.success) {
      console.error(`[Email Worker] Failed to send study reminder email to ${email}:`, result.error);
      throw new Error(`Failed to send study reminder email: ${result.error}`);
    }

    console.log(`[Email Worker] Successfully sent study reminder email to ${email}`);
    return { success: true, email };
  }
);

/**
 * Quiz Results Email Worker
 * Retries: 3 times with exponential backoff
 */
export const sendQuizResultsEmailWorker = inngest.createFunction(
  {
    id: "send-quiz-results-email",
    name: "Send Quiz Results Email",
    retries: 3,
  },
  { event: "email/send-quiz-results" },
  async ({ event, step, attempt }) => {
    const { userId, email, name, quizData } = event.data;
    
    console.log(`[Email Worker] Sending quiz results email to ${email} (attempt ${attempt + 1}/3)`);
    
    const result = await step.run("send-email", async () => {
      return await sendQuizResultsEmail({ userId, email, name, quizData });
    });

    if (!result.success) {
      console.error(`[Email Worker] Failed to send quiz results email to ${email}:`, result.error);
      throw new Error(`Failed to send quiz results email: ${result.error}`);
    }

    console.log(`[Email Worker] Successfully sent quiz results email to ${email}`);
    return { success: true, email };
  }
);

// Export all workers for Inngest registration
export const emailWorkers = [
  sendWelcomeEmailWorker,
  sendPasswordResetEmailWorker,
  sendStudyReminderEmailWorker,
  sendQuizResultsEmailWorker,
];
