/**
 * Admin Email Router
 *
 * Admin-only procedures for managing the email system:
 * - Email history viewer with advanced filters
 * - Email analytics and metrics
 * - Template management
 * - Campaign management
 * - Bulk operations
 * - CSV export
 */

import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';

const emailStatusEnum = z.enum([
  'QUEUED',
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
  'monthly_certification_readiness',
]);

export const adminEmailRouter = router({
  /**
   * Get email logs with advanced filtering
   * Supports: status, email type, date range, user search, pagination
   */
  getEmailLogs: adminProcedure
    .input(
      z.object({
        // Filters
        status: emailStatusEnum.optional(),
        emailType: emailTypeEnum.optional(),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
        userSearch: z.string().optional(),

        // Pagination
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const { status, emailType, fromDate, toDate, userSearch, page, limit } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (status) where.status = status;
      if (emailType) where.emailType = emailType;
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = fromDate;
        if (toDate) where.createdAt.lte = toDate;
      }

      // User search
      if (userSearch) {
        where.OR = [
          { to: { contains: userSearch, mode: 'insensitive' } },
          { user: { firstName: { contains: userSearch, mode: 'insensitive' } } },
          { user: { lastName: { contains: userSearch, mode: 'insensitive' } } },
        ];
      }

      const [logs, total] = await Promise.all([
        ctx.prisma.emailLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
        ctx.prisma.emailLog.count({ where }),
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Get email analytics/metrics
   * Returns overall stats and breakdowns
   */
  getEmailAnalytics: adminProcedure
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

      // Overall metrics
      const [
        totalSent,
        delivered,
        opened,
        clicked,
        bounced,
        failed,
        statusBreakdown,
        typeBreakdown,
      ] = await Promise.all([
        ctx.prisma.emailLog.count({ where: { ...where, status: { in: ['SENT', 'DELIVERED', 'OPENED', 'CLICKED'] } } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: { in: ['DELIVERED', 'OPENED', 'CLICKED'] } } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: { in: ['OPENED', 'CLICKED'] } } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'CLICKED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'BOUNCED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'FAILED' } }),
        ctx.prisma.emailLog.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        ctx.prisma.emailLog.groupBy({
          by: ['emailType'],
          where,
          _count: true,
        }),
      ]);

      return {
        overview: {
          totalSent,
          deliveryRate: totalSent > 0 ? Math.round((delivered / totalSent) * 100) : 0,
          openRate: totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0,
          clickRate: totalSent > 0 ? Math.round((clicked / totalSent) * 100) : 0,
          bounceRate: totalSent > 0 ? Math.round((bounced / totalSent) * 100) : 0,
          failureRate: totalSent > 0 ? Math.round((failed / totalSent) * 100) : 0,
        },
        statusBreakdown: statusBreakdown.map((s) => ({
          status: s.status,
          count: s._count,
        })),
        typeBreakdown: typeBreakdown.map((t) => ({
          emailType: t.emailType,
          count: t._count,
        })),
      };
    }),

  /**
   * Get template performance metrics
   * Shows how each email type is performing
   */
  getTemplatePerformance: adminProcedure
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

      const templates = await ctx.prisma.emailLog.groupBy({
        by: ['emailType'],
        where,
        _count: true,
      });

      const performanceData = await Promise.all(
        templates.map(async (template) => {
          const [sent, opened, clicked] = await Promise.all([
            ctx.prisma.emailLog.count({
              where: { ...where, emailType: template.emailType, status: { in: ['SENT', 'DELIVERED', 'OPENED', 'CLICKED'] } },
            }),
            ctx.prisma.emailLog.count({
              where: { ...where, emailType: template.emailType, status: { in: ['OPENED', 'CLICKED'] } },
            }),
            ctx.prisma.emailLog.count({
              where: { ...where, emailType: template.emailType, status: 'CLICKED' },
            }),
          ]);

          return {
            emailType: template.emailType,
            totalSent: sent,
            openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
            clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
          };
        })
      );

      return performanceData;
    }),

  /**
   * Get detailed email log by ID
   */
  getEmailLogDetails: adminProcedure
    .input(z.object({ emailLogId: z.string() }))
    .query(async ({ input, ctx }) => {
      const log = await ctx.prisma.emailLog.findUnique({
        where: { id: input.emailLogId },
        include: {
          user: {
            select: {
              userId: true,
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

      return log;
    }),

  /**
   * Preview email template
   * Returns HTML for preview modal
   */
  previewEmail: adminProcedure
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
        // Preview with custom data
        type = emailType;
        emailData = templateData;
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either emailLogId or (emailType + templateData) required',
        });
      }

      const htmlContent = getFallbackTemplate(type, emailData);
      return {
        htmlContent,
        emailType: type,
        subject: getSubjectForEmailType(type, emailData),
      };
    }),

  /**
   * Resend a failed email
   */
  resendEmail: adminProcedure
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

      if (log.status !== 'FAILED' && log.status !== 'BOUNCED') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Can only resend failed or bounced emails',
        });
      }

      // Update status to queued for retry
      await ctx.prisma.emailLog.update({
        where: { id: input.emailLogId },
        data: {
          status: 'QUEUED',
          errorMessage: null,
          retryCount: log.retryCount + 1,
        },
      });

      return { success: true, message: 'Email queued for resending' };
    }),

  /**
   * Bulk resend failed/bounced emails
   */
  bulkResendEmails: adminProcedure
    .input(
      z.object({
        emailLogIds: z.array(z.string()).min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.emailLog.updateMany({
        where: {
          id: { in: input.emailLogIds },
          status: { in: ['FAILED', 'BOUNCED'] },
        },
        data: {
          status: 'QUEUED',
          errorMessage: null,
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
  bulkDeleteEmailLogs: adminProcedure
    .input(
      z.object({
        emailLogIds: z.array(z.string()).min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.emailLog.deleteMany({
        where: { id: { in: input.emailLogIds } },
      });

      return {
        success: true,
        message: `${result.count} email logs deleted`,
        count: result.count,
      };
    }),

  /**
   * Export email logs as CSV
   */
  exportEmailLogs: adminProcedure
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
        take: 1000, // Limit exports to 1000 records
      });

      // Generate CSV
      const csvRows = [
        ['ID', 'Email Type', 'Status', 'Recipient', 'User Name', 'Subject', 'Sent At', 'Opened At', 'Clicked At', 'Created At'],
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

/**
 * Helper: Get fallback HTML template
 */
function getFallbackTemplate(emailType: string, data: Record<string, any>): string {
  const templates: Record<string, string> = {
    welcome: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Welcome to CloudDojo, ${data.username || 'User'}!</h1>
          <p>We're excited to have you on board!</p>
          <a href="https://clouddojo.tech/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a>
        </body>
      </html>
    `,
    // Add more templates as needed
  };

  return templates[emailType] || `<p>Email type: ${emailType}</p><pre>${JSON.stringify(data, null, 2)}</pre>`;
}

/**
 * Helper: Get subject line for email type
 */
function getSubjectForEmailType(emailType: string, data: Record<string, any>): string {
  const subjects: Record<string, string> = {
    welcome: `Welcome to CloudDojo, ${data.username}!`,
    quiz_milestone: `🎯 ${data.quizCount} Quizzes Completed!`,
    perfect_score: `🔥 Perfect Score on "${data.quizTitle}"!`,
    badge_unlocked: `🏆 Badge Unlocked: ${data.badgeName}`,
    streak_milestone: `🔥 ${data.currentStreak}-Day Streak!`,
    level_up: `⚡ Level Up! You're now Level ${data.newLevel}`,
    feature_adoption: `💡 Unlock ${data.featureName}`,
    weekly_progress: `📈 Your Weekly Progress Report`,
    monthly_certification_readiness: `📊 Your ${data.certificationName} Readiness Report`,
  };

  return subjects[emailType] || `CloudDojo Email: ${emailType}`;
}
