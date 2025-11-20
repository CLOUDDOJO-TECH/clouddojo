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
});
