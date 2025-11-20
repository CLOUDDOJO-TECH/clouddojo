/**
 * Email Queue Processor Lambda
 *
 * Triggered by SQS messages
 * - Processes email queue
 * - Sends emails via Resend
 * - Logs to database
 * - Handles retries
 */

import type { SQSEvent, SQSRecord } from 'aws-lambda';
import { Resend } from 'resend';
import { getPrismaClient } from '../../shared/utils/prisma-client';
import { deleteMessage } from '../../shared/utils/sqs-client';
import type { EmailQueueMessage } from '../../shared/types/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event: SQSEvent) {
  console.log(`Processing ${event.Records.length} messages from queue`);

  const results = await Promise.allSettled(
    event.Records.map((record) => processMessage(record))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  console.log(`Processed: ${successful} successful, ${failed} failed`);

  return {
    batchItemFailures: results
      .map((result, index) =>
        result.status === 'rejected'
          ? { itemIdentifier: event.Records[index].messageId }
          : null
      )
      .filter(Boolean),
  };
}

async function processMessage(record: SQSRecord) {
  const message: EmailQueueMessage = JSON.parse(record.body);
  const prisma = await getPrismaClient();

  console.log(`Processing email: ${message.emailType} to ${message.data.to}`);

  try {
    // 1. Create email log entry
    const emailLog = await prisma.emailLog.create({
      data: {
        userId: message.userId,
        emailType: message.emailType,
        to: message.data.to,
        from: message.data.from,
        subject: message.data.subject,
        status: 'SENDING',
        retryCount: message.retryCount,
        metadata: message.data.templateData,
      },
    });

    // 2. Render email template
    const emailHtml = await renderTemplate(message.emailType, message.data.templateData);

    if (!emailHtml) {
      throw new Error(`Template not found for ${message.emailType}`);
    }

    // 3. Send via Resend
    const response = await resend.emails.send({
      from: message.data.from,
      to: message.data.to,
      subject: message.data.subject,
      html: emailHtml,
    });

    if (response.error) {
      throw new Error(`Resend error: ${response.error.message}`);
    }

    console.log(`Email sent successfully via Resend: ${response.data?.id}`);

    // 4. Update email log
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'SENT',
        resendId: response.data?.id,
        sentAt: new Date(),
      },
    });

    // 5. Delete message from queue
    await deleteMessage(record.receiptHandle);

    return { success: true, emailId: response.data?.id };
  } catch (error) {
    console.error(`Error sending email:`, error);

    // Update email log with error
    const emailLog = await prisma.emailLog.findFirst({
      where: {
        userId: message.userId,
        emailType: message.emailType,
        to: message.data.to,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (emailLog) {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          failedAt: new Date(),
        },
      });
    }

    // Rethrow to trigger SQS retry
    throw error;
  }
}

/**
 * Render email template based on type
 */
async function renderTemplate(emailType: string, data: Record<string, any>): Promise<string | null> {
  const prisma = await getPrismaClient();

  // Get template from database
  const template = await prisma.emailTemplate.findFirst({
    where: {
      name: emailType,
      isActive: true,
    },
  });

  if (!template) {
    console.warn(`No template found for ${emailType}, using fallback`);
    return getTemplateFromMemory(emailType, data);
  }

  // Dynamically import React Email component
  try {
    const componentModule = await import(`../../../${template.componentPath}`);
    const EmailComponent = componentModule.default;

    // Render React Email component to HTML
    const { render } = await import('@react-email/components');
    const html = render(EmailComponent(data));

    return html;
  } catch (error) {
    console.error(`Error rendering template ${template.componentPath}:`, error);
    return getTemplateFromMemory(emailType, data);
  }
}

/**
 * Fallback: Get template from memory (static imports)
 */
function getTemplateFromMemory(emailType: string, data: Record<string, any>): string | null {
  // For now, use existing email functions from lib/emails/send-email.ts
  // This will be replaced with proper template system

  const templates: Record<string, string> = {
    // ============================================
    // PHASE 1: TRANSACTIONAL EMAILS
    // ============================================
    welcome: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to CloudDojo</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Welcome to CloudDojo, ${data.username}! 🚀</h1>
          <p>We're excited to have you on board!</p>
          <p>Start your cloud certification journey today.</p>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Get Started</a>
        </body>
      </html>
    `,
    quiz_basic: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Quiz Completed</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Great progress, ${data.username}! 🎯</h1>
          <p>You've completed a quiz with a score of ${data.score}%!</p>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Continue Learning</a>
        </body>
      </html>
    `,
    perfect_score: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Perfect Score!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">Perfect Score! You're on fire! 🔥</h1>
          <p>Congratulations ${data.username}! You scored 100% on "${data.quizTitle}"!</p>
          <p>This is an outstanding achievement. Keep up the excellent work!</p>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Take Another Quiz</a>
        </body>
      </html>
    `,
    ai_analysis_notification: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>AI Analysis Ready</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8b5cf6;">Your AI Analysis is Ready! 📊</h1>
          <p>Hi ${data.username},</p>
          <p>Your ${data.certificationName} readiness analysis is now available!</p>
          <p><strong>Readiness Score: ${data.readinessScore}%</strong></p>
          <a href="https://clouddojo.tech/analysis" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Analysis</a>
        </body>
      </html>
    `,

    // ============================================
    // PHASE 1: LIFECYCLE EMAILS
    // ============================================
    inactive_3day: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>We Miss You!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">We miss you! Come back and practice 📚</h1>
          <p>Hi ${data.username},</p>
          <p>It's been a few days since your last visit. Your learning progress is waiting for you!</p>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Continue Learning</a>
        </body>
      </html>
    `,
    inactive_7day: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Progress is Waiting</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Your progress is waiting for you 💪</h1>
          <p>Hi ${data.username},</p>
          <p>Don't lose your momentum! Come back and continue your cloud certification journey.</p>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Resume Learning</a>
        </body>
      </html>
    `,
    inactive_14day: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Last Chance</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Last chance to continue your journey 🎓</h1>
          <p>Hi ${data.username},</p>
          <p>We noticed you haven't been active for 2 weeks. Don't let your progress go to waste!</p>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Come Back</a>
        </body>
      </html>
    `,
    weekly_progress: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Weekly Progress Report</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Your Weekly Progress Report 📈</h1>
          <p>Hi ${data.username},</p>
          <p>Here's your weekly summary:</p>
          <ul>
            <li>Quizzes completed: ${data.quizzesCompleted || 0}</li>
            <li>Average score: ${data.averageScore || 0}%</li>
            <li>XP earned: ${data.xpEarned || 0}</li>
          </ul>
          <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Dashboard</a>
        </body>
      </html>
    `,

    // ============================================
    // PHASE 2: BEHAVIOR-TRIGGERED EMAILS
    // ============================================
    quiz_milestone: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${data.quizCount} Quizzes Completed!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(to bottom, #f3f4f6, #ffffff);">
          <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 40px; border-radius: 12px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">🎯 ${data.quizCount} Quizzes Completed!</h1>
            <p style="font-size: 18px; margin-top: 8px;">You're unstoppable, ${data.username}!</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; margin-top: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">Your Progress Dashboard</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 24px;">
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 28px; font-weight: bold; color: #6366f1;">${data.quizCount}</div>
                <div style="color: #6b7280; margin-top: 4px;">Quizzes Completed</div>
              </div>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${data.averageScore}%</div>
                <div style="color: #6b7280; margin-top: 4px;">Average Score</div>
              </div>
            </div>
            ${data.topCategory ? `<p style="margin-top: 24px; color: #6b7280;">Your top category: <strong style="color: #6366f1;">${data.topCategory}</strong></p>` : ''}
            <p style="margin-top: 24px; color: #6b7280;">Next milestone: <strong>${data.nextMilestone} quizzes</strong></p>
            <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; margin-top: 24px; font-weight: 600;">Continue Learning</a>
          </div>
        </body>
      </html>
    `,
    badge_unlocked: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Badge Unlocked: ${data.badgeName}!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0f172a;">
          <div style="background: linear-gradient(135deg, #eab308, #f59e0b); padding: 40px; border-radius: 12px; text-align: center; color: #0f172a;">
            <div style="font-size: 64px; margin-bottom: 16px;">${data.badgeIcon || '🏆'}</div>
            <h1 style="margin: 0; font-size: 32px;">Badge Unlocked!</h1>
            <p style="font-size: 24px; margin-top: 8px; font-weight: bold;">${data.badgeName}</p>
          </div>
          <div style="background: #1e293b; padding: 32px; border-radius: 12px; margin-top: 24px; color: white;">
            <p style="color: #cbd5e1; font-size: 16px;">${data.badgeDescription}</p>
            <div style="background: #334155; padding: 16px; border-radius: 8px; margin-top: 24px;">
              <p style="margin: 0; color: #94a3b8;">Total Badges Unlocked</p>
              <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: bold; color: #eab308;">${data.totalBadges}</p>
            </div>
            <a href="https://clouddojo.tech/profile" style="display: inline-block; background: linear-gradient(135deg, #eab308, #f59e0b); color: #0f172a; padding: 12px 32px; text-decoration: none; border-radius: 6px; margin-top: 24px; font-weight: 600;">View Profile</a>
          </div>
        </body>
      </html>
    `,
    streak_milestone: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${data.currentStreak}-Day Streak!</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px; border-radius: 12px; text-align: center; color: white;">
            <div style="font-size: 64px; margin-bottom: 16px;">🔥</div>
            <h1 style="margin: 0; font-size: 32px;">${data.currentStreak}-Day Streak!</h1>
            <p style="font-size: 18px; margin-top: 8px;">You're on fire, ${data.username}!</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; margin-top: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">Your Consistency is Paying Off!</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 24px;">
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${data.currentStreak}</div>
                <div style="color: #92400e; margin-top: 4px;">Current Streak</div>
              </div>
              <div style="background: #fee2e2; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${data.longestStreak}</div>
                <div style="color: #991b1b; margin-top: 4px;">Longest Streak</div>
              </div>
            </div>
            <p style="margin-top: 24px; color: #6b7280;">Total XP: <strong style="color: #f59e0b;">${data.totalXP}</strong></p>
            <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; margin-top: 24px; font-weight: 600;">Keep the Streak Going!</a>
          </div>
        </body>
      </html>
    `,
    level_up: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Level Up! Level ${data.newLevel}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; border-radius: 12px; text-align: center; color: white;">
            <div style="width: 100px; height: 100px; background: white; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; color: #6366f1;">${data.newLevel}</div>
            <h1 style="margin: 0; font-size: 32px;">Level Up! ⚡</h1>
            <p style="font-size: 18px; margin-top: 8px;">You're now Level ${data.newLevel}, ${data.username}!</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; margin-top: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">Congratulations!</h2>
            <p style="color: #6b7280;">Total XP: <strong style="color: #6366f1;">${data.totalXP}</strong></p>
            <div style="background: #f3f4f6; height: 8px; border-radius: 4px; margin-top: 16px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #6366f1, #8b5cf6); height: 100%; width: ${Math.min(100, ((data.totalXP % 100) / 100) * 100)}%;"></div>
            </div>
            <p style="margin-top: 8px; font-size: 14px; color: #9ca3af;">${data.xpToNextLevel} XP to Level ${data.newLevel + 1}</p>
            ${data.unlockedFeatures && data.unlockedFeatures.length > 0 ? `
              <div style="margin-top: 24px;">
                <h3 style="color: #1f2937; font-size: 18px;">New Features Unlocked:</h3>
                <ul style="color: #6b7280; margin-top: 8px;">
                  ${data.unlockedFeatures.map((f: string) => `<li>${f}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; margin-top: 24px; font-weight: 600;">View Dashboard</a>
          </div>
        </body>
      </html>
    `,
    feature_adoption: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Unlock ${data.featureName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; border-radius: 12px; text-align: center; color: white;">
            <div style="font-size: 64px; margin-bottom: 16px;">${data.featureIcon || '💡'}</div>
            <h1 style="margin: 0; font-size: 32px;">Unlock ${data.featureName}</h1>
            <p style="font-size: 18px; margin-top: 8px;">You're Missing Out!</p>
          </div>
          <div style="background: white; padding: 32px; border-radius: 12px; margin-top: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937;">${data.featureName}</h2>
            <p style="color: #6b7280; margin-top: 16px;">${data.featureDescription}</p>
            ${data.featureBenefits && data.featureBenefits.length > 0 ? `
              <div style="margin-top: 24px;">
                <h3 style="color: #1f2937; font-size: 18px;">Benefits:</h3>
                <ul style="color: #6b7280; margin-top: 8px;">
                  ${data.featureBenefits.map((b: string) => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            <a href="${data.ctaUrl || 'https://clouddojo.tech/dashboard'}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; margin-top: 24px; font-weight: 600;">Get Started</a>
          </div>
        </body>
      </html>
    `,
  };

  return templates[emailType] || null;
}
