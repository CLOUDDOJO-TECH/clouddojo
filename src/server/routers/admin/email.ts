/**
 * Admin Email Router
 *
 * Admin-only procedures for managing the email system:
 * - Email history viewer with advanced filters
 * - Email analytics and metrics
 * - Template management
 * - Segment management
 * - Campaign composer
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

// TODO: Add admin role check middleware
// For now, any authenticated user can access
// In production, add: .use(adminMiddleware)

const emailStatusEnum = z.enum([
  'PENDING',
  'SENDING',
  'SENT',
  'DELIVERED',
  'OPENED',
  'CLICKED',
  'BOUNCED',
  'FAILED',
]);

const emailTypeEnum = z.enum([
  'welcome',
  'quiz_basic',
  'quiz_milestone',
  'perfect_score',
  'badge_unlocked',
  'streak_milestone',
  'level_up',
  'feature_adoption',
  'ai_analysis_notification',
  'inactive_3day',
  'inactive_7day',
  'inactive_14day',
  'weekly_progress',
]);

export const adminEmailRouter = router({
  /**
   * Get email logs with advanced filtering
   * Supports: status, email type, date range, user search, pagination
   */
  getEmailLogs: protectedProcedure
    .input(
      z.object({
        // Filters
        status: emailStatusEnum.optional(),
        emailType: emailTypeEnum.optional(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
        userSearch: z.string().optional(), // Search by userId or email

        // Pagination
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),

        // Sorting
        sortBy: z.enum(['createdAt', 'sentAt', 'openedAt', 'status']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        status,
        emailType,
        fromDate,
        toDate,
        userSearch,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      // Build where clause
      const where: any = {};

      if (status) {
        where.status = status;
      }

      if (emailType) {
        where.emailType = emailType;
      }

      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }

      if (userSearch) {
        where.OR = [
          { userId: { contains: userSearch, mode: 'insensitive' } },
          { to: { contains: userSearch, mode: 'insensitive' } },
        ];
      }

      // Get logs with user info
      const [logs, totalCount] = await Promise.all([
        ctx.prisma.emailLog.findMany({
          where,
          include: {
            user: {
              select: {
                userId: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          take: limit,
          skip: offset,
        }),
        ctx.prisma.emailLog.count({ where }),
      ]);

      return {
        logs,
        totalCount,
        hasMore: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  /**
   * Get email analytics and metrics
   */
  getEmailAnalytics: protectedProcedure
    .input(
      z.object({
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { fromDate, toDate } = input;

      const where: any = {};
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }

      // Overall stats
      const [
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        totalBounced,
        totalFailed,
      ] = await Promise.all([
        ctx.prisma.emailLog.count({
          where: { ...where, status: { in: ['SENT', 'DELIVERED', 'OPENED', 'CLICKED'] } },
        }),
        ctx.prisma.emailLog.count({
          where: { ...where, status: { in: ['DELIVERED', 'OPENED', 'CLICKED'] } },
        }),
        ctx.prisma.emailLog.count({ where: { ...where, status: { in: ['OPENED', 'CLICKED'] } } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'CLICKED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'BOUNCED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'FAILED' } }),
      ]);

      // Calculate rates
      const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
      const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
      const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
      const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0;
      const failureRate = totalSent > 0 ? (totalFailed / totalSent) * 100 : 0;

      // Email type breakdown
      const emailTypeStats = await ctx.prisma.emailLog.groupBy({
        by: ['emailType'],
        where,
        _count: { emailType: true },
      });

      // Status distribution
      const statusStats = await ctx.prisma.emailLog.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      });

      // Daily volume (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyVolume = await ctx.prisma.$queryRaw<
        Array<{ date: Date; count: bigint }>
      >`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "EmailLog"
        WHERE created_at >= ${thirtyDaysAgo}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      return {
        overview: {
          totalSent,
          totalDelivered,
          totalOpened,
          totalClicked,
          totalBounced,
          totalFailed,
        },
        rates: {
          deliveryRate: Math.round(deliveryRate * 100) / 100,
          openRate: Math.round(openRate * 100) / 100,
          clickRate: Math.round(clickRate * 100) / 100,
          bounceRate: Math.round(bounceRate * 100) / 100,
          failureRate: Math.round(failureRate * 100) / 100,
        },
        byEmailType: emailTypeStats.map((stat) => ({
          emailType: stat.emailType,
          count: stat._count.emailType,
        })),
        byStatus: statusStats.map((stat) => ({
          status: stat.status,
          count: stat._count.status,
        })),
        dailyVolume: dailyVolume.map((day) => ({
          date: day.date,
          count: Number(day.count),
        })),
      };
    }),

  /**
   * Get template performance metrics
   */
  getTemplatePerformance: protectedProcedure
    .input(
      z.object({
        emailType: emailTypeEnum.optional(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { emailType, fromDate, toDate } = input;

      const where: any = {};
      if (emailType) where.emailType = emailType;
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }

      // Get stats per email type
      const templates = await ctx.prisma.emailLog.groupBy({
        by: ['emailType'],
        where,
        _count: { emailType: true },
      });

      const templatePerformance = await Promise.all(
        templates.map(async (template) => {
          const [sent, delivered, opened, clicked, bounced] = await Promise.all([
            ctx.prisma.emailLog.count({
              where: {
                emailType: template.emailType,
                status: { in: ['SENT', 'DELIVERED', 'OPENED', 'CLICKED'] },
              },
            }),
            ctx.prisma.emailLog.count({
              where: {
                emailType: template.emailType,
                status: { in: ['DELIVERED', 'OPENED', 'CLICKED'] },
              },
            }),
            ctx.prisma.emailLog.count({
              where: {
                emailType: template.emailType,
                status: { in: ['OPENED', 'CLICKED'] },
              },
            }),
            ctx.prisma.emailLog.count({
              where: { emailType: template.emailType, status: 'CLICKED' },
            }),
            ctx.prisma.emailLog.count({
              where: { emailType: template.emailType, status: 'BOUNCED' },
            }),
          ]);

          const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
          const clickRate = opened > 0 ? (clicked / opened) * 100 : 0;

          return {
            emailType: template.emailType,
            totalSent: sent,
            delivered,
            opened,
            clicked,
            bounced,
            openRate: Math.round(openRate * 100) / 100,
            clickRate: Math.round(clickRate * 100) / 100,
          };
        })
      );

      return templatePerformance.sort((a, b) => b.totalSent - a.totalSent);
    }),

  /**
   * Get user segments
   */
  getUserSegments: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input;

      const [segments, totalCount] = await Promise.all([
        ctx.prisma.userSegment.findMany({
          include: {
            user: {
              select: {
                userId: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          take: limit,
          skip: offset,
        }),
        ctx.prisma.userSegment.count(),
      ]);

      // Get segment counts
      const segmentCounts = await ctx.prisma.userSegment.groupBy({
        by: ['segmentName'],
        _count: { segmentName: true },
      });

      return {
        segments,
        totalCount,
        segmentCounts: segmentCounts.map((s) => ({
          segmentName: s.segmentName,
          count: s._count.segmentName,
        })),
        hasMore: offset + limit < totalCount,
      };
    }),

  /**
   * Get email templates
   */
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return templates;
  }),

  /**
   * Update template
   */
  updateTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        subject: z.string().optional(),
        htmlContent: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      const template = await ctx.prisma.emailTemplate.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return template;
    }),

  /**
   * Create campaign
   */
  createCampaign: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        emailType: emailTypeEnum,
        subject: z.string().min(1),
        scheduledFor: z.date().optional(),
        segmentNames: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const campaign = await ctx.prisma.emailCampaign.create({
        data: {
          name: input.name,
          emailType: input.emailType,
          subject: input.subject,
          status: input.scheduledFor ? 'SCHEDULED' : 'DRAFT',
          scheduledFor: input.scheduledFor,
          targetSegments: input.segmentNames || [],
        },
      });

      return campaign;
    }),

  /**
   * Get campaigns
   */
  getCampaigns: protectedProcedure
    .input(
      z.object({
        status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { status, limit, offset } = input;

      const where: any = {};
      if (status) where.status = status;

      const [campaigns, totalCount] = await Promise.all([
        ctx.prisma.emailCampaign.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        ctx.prisma.emailCampaign.count({ where }),
      ]);

      return {
        campaigns,
        totalCount,
        hasMore: offset + limit < totalCount,
      };
    }),

  /**
   * Get single email log details
   */
  getEmailLogDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const log = await ctx.prisma.emailLog.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              userId: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!log) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Email log not found',
        });
      }

      return log;
    }),

  /**
   * Resend failed email
   */
  resendEmail: protectedProcedure
    .input(z.object({ emailLogId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const log = await ctx.prisma.emailLog.findUnique({
        where: { id: input.emailLogId },
      });

      if (!log) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Email log not found',
        });
      }

      // TODO: Trigger email resend via orchestrator
      // For now, just mark as pending
      const updatedLog = await ctx.prisma.emailLog.update({
        where: { id: input.emailLogId },
        data: {
          status: 'PENDING',
          retryCount: (log.retryCount || 0) + 1,
        },
      });

      return {
        success: true,
        message: 'Email queued for resending',
        emailLog: updatedLog,
      };
    }),

  /**
   * Preview email content
   * Returns rendered HTML for preview
   */
  previewEmail: protectedProcedure
    .input(
      z.object({
        emailLogId: z.string().optional(),
        emailType: emailTypeEnum.optional(),
        templateData: z.record(z.any()).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { emailLogId, emailType, templateData } = input;

      let emailData: any = {};
      let type: string;

      if (emailLogId) {
        // Preview existing email
        const log = await ctx.prisma.emailLog.findUnique({
          where: { id: emailLogId },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });

        if (!log) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Email log not found',
          });
        }

        type = log.emailType;
        emailData = {
          ...(log.metadata as any),
          username: log.user?.firstName || 'User',
          email: log.to,
        };
      } else if (emailType && templateData) {
        // Preview new email with custom data
        type = emailType;
        emailData = templateData;
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either emailLogId or emailType+templateData must be provided',
        });
      }

      // Get fallback HTML template (same as queue processor)
      const htmlContent = getFallbackTemplate(type, emailData);

      return {
        htmlContent,
        emailType: type,
        subject: getSubjectForEmailType(type, emailData),
      };
    }),

  /**
   * Bulk resend emails
   */
  bulkResendEmails: protectedProcedure
    .input(
      z.object({
        emailLogIds: z.array(z.string()).min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { emailLogIds } = input;

      // Update all emails to pending
      const result = await ctx.prisma.emailLog.updateMany({
        where: {
          id: { in: emailLogIds },
          status: { in: ['FAILED', 'BOUNCED'] }, // Only resend failed/bounced
        },
        data: {
          status: 'PENDING',
        },
      });

      return {
        success: true,
        message: `${result.count} emails queued for resending`,
        count: result.count,
      };
    }),

  /**
   * Bulk delete email logs
   */
  bulkDeleteEmailLogs: protectedProcedure
    .input(
      z.object({
        emailLogIds: z.array(z.string()).min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { emailLogIds } = input;

      const result = await ctx.prisma.emailLog.deleteMany({
        where: {
          id: { in: emailLogIds },
        },
      });

      return {
        success: true,
        message: `${result.count} email logs deleted`,
        count: result.count,
      };
    }),

  /**
   * Export email logs to CSV
   */
  exportEmailLogs: protectedProcedure
    .input(
      z.object({
        status: emailStatusEnum.optional(),
        emailType: emailTypeEnum.optional(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { status, emailType, fromDate, toDate } = input;

      const where: any = {};
      if (status) where.status = status;
      if (emailType) where.emailType = emailType;
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }

      const logs = await ctx.prisma.emailLog.findMany({
        where,
        include: {
          user: {
            select: {
              userId: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1000, // Limit export to 1000 records
      });

      // Convert to CSV format
      const csvRows = [
        [
          'ID',
          'Email Type',
          'Status',
          'Recipient',
          'User Name',
          'Subject',
          'Sent At',
          'Opened At',
          'Clicked At',
          'Created At',
        ],
      ];

      logs.forEach((log) => {
        csvRows.push([
          log.id,
          log.emailType,
          log.status,
          log.to,
          `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.trim(),
          log.subject || '',
          log.sentAt?.toISOString() || '',
          log.openedAt?.toISOString() || '',
          log.clickedAt?.toISOString() || '',
          log.createdAt.toISOString(),
        ]);
      });

      const csvContent = csvRows.map((row) => row.map(escapeCSV).join(',')).join('\n');

      return {
        csvContent,
        totalRecords: logs.length,
      };
    }),
});

/**
 * Helper: Get fallback HTML template
 */
function getFallbackTemplate(emailType: string, data: Record<string, any>): string {
  // Simplified fallback templates for preview
  const templates: Record<string, string> = {
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6366f1;">Welcome to CloudDojo, ${data.username}! 🚀</h1>
        <p>We're excited to have you on board!</p>
        <a href="https://clouddojo.tech/dashboard" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a>
      </div>
    `,
    quiz_milestone: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 40px; border-radius: 12px; text-align: center; color: white;">
          <h1>🎯 ${data.quizCount} Quizzes Completed!</h1>
          <p style="font-size: 18px;">You're unstoppable, ${data.username}!</p>
        </div>
        <div style="background: white; padding: 32px; margin-top: 24px;">
          <p><strong>Average Score:</strong> ${data.averageScore}%</p>
          <p><strong>Next Milestone:</strong> ${data.nextMilestone} quizzes</p>
        </div>
      </div>
    `,
    badge_unlocked: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; padding: 20px;">
        <div style="background: linear-gradient(135deg, #eab308, #f59e0b); padding: 40px; border-radius: 12px; text-align: center;">
          <div style="font-size: 64px;">${data.badgeIcon || '🏆'}</div>
          <h1 style="color: #0f172a;">Badge Unlocked!</h1>
          <p style="font-size: 24px; font-weight: bold; color: #0f172a;">${data.badgeName}</p>
        </div>
      </div>
    `,
    streak_milestone: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px; border-radius: 12px; text-align: center; color: white;">
          <div style="font-size: 64px;">🔥</div>
          <h1>${data.currentStreak}-Day Streak!</h1>
          <p style="font-size: 18px;">You're on fire, ${data.username}!</p>
        </div>
      </div>
    `,
    level_up: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px; border-radius: 12px; text-align: center; color: white;">
          <div style="width: 100px; height: 100px; background: white; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; color: #6366f1;">${data.newLevel}</div>
          <h1>Level Up! ⚡</h1>
          <p style="font-size: 18px;">You're now Level ${data.newLevel}, ${data.username}!</p>
        </div>
      </div>
    `,
  };

  return templates[emailType] || `<p>Preview not available for ${emailType}</p>`;
}

/**
 * Helper: Get subject line for email type
 */
function getSubjectForEmailType(emailType: string, data: Record<string, any>): string {
  const subjects: Record<string, string> = {
    welcome: 'Welcome to CloudDojo!',
    quiz_milestone: `${data.quizCount} Quizzes Completed! 🎯`,
    badge_unlocked: `Badge Unlocked: ${data.badgeName}! 🏆`,
    streak_milestone: `${data.currentStreak}-Day Streak! 🔥`,
    level_up: `Level Up! You're now Level ${data.newLevel}! ⚡`,
    perfect_score: 'Perfect Score! 🔥',
    feature_adoption: `Unlock ${data.featureName} - You're Missing Out! 💡`,
  };

  return subjects[emailType] || `CloudDojo Email - ${emailType}`;
}

/**
 * Helper: Escape CSV values
 */
function escapeCSV(value: string): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}
