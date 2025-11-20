/**
 * Email tRPC Router
 *
 * API for managing email preferences, viewing email history, etc.
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { triggerEmail } from '@/lib/emails/services/orchestrator';

export const emailRouter = router({
  /**
   * Get user's email preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const preferences = await ctx.prisma.emailPreferences.findUnique({
      where: { userId: ctx.userId },
    });

    // Create default preferences if not exist
    if (!preferences) {
      return await ctx.prisma.emailPreferences.create({
        data: { userId: ctx.userId },
      });
    }

    return preferences;
  }),

  /**
   * Update user's email preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        marketingEmails: z.boolean().optional(),
        productUpdates: z.boolean().optional(),
        weeklyProgressReport: z.boolean().optional(),
        aiAnalysisNotifs: z.boolean().optional(),
        milestoneEmails: z.boolean().optional(),
        featureUpdates: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.emailPreferences.upsert({
        where: { userId: ctx.userId },
        update: input,
        create: {
          userId: ctx.userId,
          ...input,
        },
      });
    }),

  /**
   * Unsubscribe from all emails
   */
  unsubscribeAll: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.emailPreferences.upsert({
      where: { userId: ctx.userId },
      update: {
        unsubscribedAll: true,
        unsubscribedAt: new Date(),
      },
      create: {
        userId: ctx.userId,
        unsubscribedAll: true,
        unsubscribedAt: new Date(),
      },
    });
  }),

  /**
   * Resubscribe to emails
   */
  resubscribe: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.emailPreferences.update({
      where: { userId: ctx.userId },
      data: {
        unsubscribedAll: false,
        unsubscribedAt: null,
      },
    });
  }),

  /**
   * Get user's email history
   */
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const [logs, total] = await Promise.all([
        ctx.prisma.emailLog.findMany({
          where: { userId: ctx.userId },
          orderBy: { createdAt: 'desc' },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.emailLog.count({
          where: { userId: ctx.userId },
        }),
      ]);

      return {
        logs,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  /**
   * Get email stats for user
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const logs = await ctx.prisma.emailLog.findMany({
      where: { userId: ctx.userId },
      select: {
        status: true,
        emailType: true,
        openedAt: true,
        clickedAt: true,
      },
    });

    const stats = {
      total: logs.length,
      sent: logs.filter((l) => l.status === 'SENT' || l.status === 'DELIVERED').length,
      opened: logs.filter((l) => l.openedAt !== null).length,
      clicked: logs.filter((l) => l.clickedAt !== null).length,
      failed: logs.filter((l) => l.status === 'FAILED' || l.status === 'BOUNCED').length,
      openRate:
        logs.length > 0
          ? (logs.filter((l) => l.openedAt !== null).length / logs.length) * 100
          : 0,
      clickRate:
        logs.length > 0
          ? (logs.filter((l) => l.clickedAt !== null).length / logs.length) * 100
          : 0,
    };

    return stats;
  }),

  /**
   * Trigger a test email (for testing)
   */
  sendTestEmail: protectedProcedure
    .input(
      z.object({
        emailType: z.enum(['welcome', 'quiz_milestone', 'ai_analysis']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { userId: ctx.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const result = await triggerEmail({
        eventType: input.emailType === 'welcome' ? 'user.created' : 'quiz.completed',
        userId: ctx.userId,
        eventData: {
          username: user.firstName,
          email: user.email,
          quizCount: 5,
          score: 85,
        },
      });

      return result;
    }),
});
