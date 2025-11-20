/**
 * Admin Audience/Segmentation Router
 *
 * Admin-only procedures for managing user segments and audiences:
 * - View system and custom segments with counts
 * - Create custom segments with query builder criteria
 * - Preview segment users before saving
 * - Sync segments to Resend audiences
 * - Auto-segmentation helpers
 */

import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';

/**
 * Segment criteria types for query builder
 */
const criteriaOperatorEnum = z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'in', 'not_in']);

const segmentCriteriaSchema = z.object({
  field: z.string(), // e.g., "plan", "lastActivityAt", "totalQuizzes"
  operator: criteriaOperatorEnum,
  value: z.union([z.string(), z.number(), z.array(z.string())]),
});

const customSegmentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  criteria: z.array(segmentCriteriaSchema).min(1),
  combineWith: z.enum(['AND', 'OR']).default('AND'),
  isActive: z.boolean().default(true),
});

/**
 * System segment definitions
 * These are automatically maintained by background jobs
 */
export const SYSTEM_SEGMENTS = {
  // Plan-based
  PLAN_FREE: { type: 'plan', value: 'free', name: 'Free Users', description: 'Users on free plan' },
  PLAN_PRO: { type: 'plan', value: 'pro', name: 'Pro Users', description: 'Users on pro plan' },
  PLAN_PREMIUM: { type: 'plan', value: 'premium', name: 'Premium Users', description: 'Users on premium plan' },

  // Lifecycle
  LIFECYCLE_NEW: { type: 'lifecycle', value: 'new', name: 'New Users', description: 'Users registered in last 7 days' },
  LIFECYCLE_ACTIVE: { type: 'lifecycle', value: 'active', name: 'Active Users', description: 'Active in last 7 days' },
  LIFECYCLE_INACTIVE: { type: 'lifecycle', value: 'inactive', name: 'Inactive Users', description: 'No activity for 14+ days' },
  LIFECYCLE_CHURNED: { type: 'lifecycle', value: 'churned', name: 'Churned Users', description: 'No activity for 30+ days' },

  // Engagement
  ENGAGEMENT_POWER: { type: 'engagement', value: 'power_users', name: 'Power Users', description: '50+ quizzes completed' },
  ENGAGEMENT_CASUAL: { type: 'engagement', value: 'casual', name: 'Casual Users', description: '1-10 quizzes completed' },
  ENGAGEMENT_STREAK_7: { type: 'engagement', value: 'streak_7', name: '7-Day Streak', description: 'Current streak 7+ days' },

  // Certification Focus
  CERT_AWS: { type: 'certification', value: 'aws_focus', name: 'AWS Focus', description: 'Primarily AWS quizzes' },
  CERT_AZURE: { type: 'certification', value: 'azure_focus', name: 'Azure Focus', description: 'Primarily Azure quizzes' },
  CERT_GCP: { type: 'certification', value: 'gcp_focus', name: 'GCP Focus', description: 'Primarily GCP quizzes' },
} as const;

export const adminAudienceRouter = router({
  /**
   * Get all segments (system + custom) with user counts
   */
  getSegments: adminProcedure
    .input(
      z.object({
        includeInactive: z.boolean().default(false),
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { includeInactive, searchQuery } = input;

      // Get system segment counts
      const systemSegments = await Promise.all(
        Object.entries(SYSTEM_SEGMENTS).map(async ([key, segment]) => {
          const count = await ctx.prisma.userSegment.count({
            where: {
              segmentType: segment.type,
              segmentValue: segment.value,
              removedAt: null,
            },
          });

          return {
            id: key,
            name: segment.name,
            description: segment.description,
            type: 'system' as const,
            segmentType: segment.type,
            segmentValue: segment.value,
            userCount: count,
            isActive: true,
            createdAt: new Date(0), // System segments have no creation date
          };
        })
      );

      // Get custom segments from database
      // Note: We'll store custom segments in a new CustomSegment model
      // For now, let's return just system segments
      const customSegments: any[] = [];

      const allSegments = [...systemSegments, ...customSegments];

      // Filter by search query if provided
      let filteredSegments = allSegments;
      if (searchQuery) {
        filteredSegments = allSegments.filter(
          (seg) =>
            seg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seg.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by active status
      if (!includeInactive) {
        filteredSegments = filteredSegments.filter((seg) => seg.isActive);
      }

      return {
        segments: filteredSegments,
        total: filteredSegments.length,
        systemCount: systemSegments.length,
        customCount: customSegments.length,
      };
    }),

  /**
   * Get users in a specific segment with pagination
   */
  getSegmentUsers: adminProcedure
    .input(
      z.object({
        segmentType: z.string(),
        segmentValue: z.string(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { segmentType, segmentValue, page, limit, searchQuery } = input;
      const skip = (page - 1) * limit;

      // Build where clause for user segments
      const segmentWhere: Prisma.UserSegmentWhereInput = {
        segmentType,
        segmentValue,
        removedAt: null,
      };

      // Build user search if provided
      const userWhere: Prisma.UserWhereInput = {};
      if (searchQuery) {
        userWhere.OR = [
          { email: { contains: searchQuery, mode: 'insensitive' } },
          { firstName: { contains: searchQuery, mode: 'insensitive' } },
          { lastName: { contains: searchQuery, mode: 'insensitive' } },
        ];
      }

      const [userSegments, total] = await Promise.all([
        ctx.prisma.userSegment.findMany({
          where: {
            ...segmentWhere,
            user: userWhere,
          },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                userId: true,
                email: true,
                firstName: true,
                lastName: true,
                plan: true,
                lastActivityAt: true,
                createdAt: true,
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        }),
        ctx.prisma.userSegment.count({
          where: {
            ...segmentWhere,
            user: userWhere,
          },
        }),
      ]);

      return {
        users: userSegments.map((us) => ({
          segmentId: us.id,
          addedAt: us.addedAt,
          ...us.user,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Preview users matching custom segment criteria
   * Returns count and sample users without saving
   */
  previewSegment: adminProcedure
    .input(
      z.object({
        criteria: z.array(segmentCriteriaSchema).min(1),
        combineWith: z.enum(['AND', 'OR']).default('AND'),
        sampleSize: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { criteria, combineWith, sampleSize } = input;

      // Build Prisma where clause from criteria
      const where = buildWhereClauseFromCriteria(criteria, combineWith);

      const [total, sampleUsers] = await Promise.all([
        ctx.prisma.user.count({ where }),
        ctx.prisma.user.findMany({
          where,
          take: sampleSize,
          select: {
            userId: true,
            email: true,
            firstName: true,
            lastName: true,
            plan: true,
            lastActivityAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        matchingUsers: total,
        sampleUsers,
        criteria,
      };
    }),

  /**
   * Create custom segment
   * Note: This requires a CustomSegment model in Prisma schema
   */
  createCustomSegment: adminProcedure
    .input(customSegmentSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, description, criteria, combineWith, isActive } = input;

      // Check if segment name already exists
      // For now, we'll use a simplified approach storing in metadata
      // In production, you should add a CustomSegment model to schema.prisma

      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Custom segments require CustomSegment model in database schema. This will be added in the next iteration.',
      });

      // Future implementation:
      // const segment = await ctx.prisma.customSegment.create({
      //   data: {
      //     name,
      //     description,
      //     criteria,
      //     combineWith,
      //     isActive,
      //     createdBy: ctx.session.user.id,
      //   },
      // });
      //
      // return { success: true, segment };
    }),

  /**
   * Get segment statistics and trends
   */
  getSegmentStats: adminProcedure
    .input(
      z.object({
        segmentType: z.string(),
        segmentValue: z.string(),
        days: z.number().min(7).max(90).default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      const { segmentType, segmentValue, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Current count
      const currentCount = await ctx.prisma.userSegment.count({
        where: {
          segmentType,
          segmentValue,
          removedAt: null,
        },
      });

      // Added in period
      const addedCount = await ctx.prisma.userSegment.count({
        where: {
          segmentType,
          segmentValue,
          addedAt: { gte: startDate },
        },
      });

      // Removed in period
      const removedCount = await ctx.prisma.userSegment.count({
        where: {
          segmentType,
          segmentValue,
          removedAt: { gte: startDate },
        },
      });

      // Growth rate
      const previousCount = currentCount - addedCount + removedCount;
      const growthRate = previousCount > 0
        ? Math.round(((currentCount - previousCount) / previousCount) * 100)
        : 0;

      return {
        currentCount,
        addedCount,
        removedCount,
        growthRate,
        period: `Last ${days} days`,
      };
    }),

  /**
   * Run auto-segmentation for a specific user
   * This would normally be run by a background job for all users
   */
  autoSegmentUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { userId } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { userId },
        include: {
          _count: {
            select: {
              quizAttempts: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const segmentsToAdd: Array<{ type: string; value: string }> = [];

      // Plan-based segmentation
      if (user.plan) {
        segmentsToAdd.push({
          type: 'plan',
          value: user.plan.toLowerCase(),
        });
      }

      // Lifecycle segmentation
      const daysSinceCreated = user.createdAt
        ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      const daysSinceActive = user.lastActivityAt
        ? Math.floor((Date.now() - user.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysSinceCreated <= 7) {
        segmentsToAdd.push({ type: 'lifecycle', value: 'new' });
      } else if (daysSinceActive <= 7) {
        segmentsToAdd.push({ type: 'lifecycle', value: 'active' });
      } else if (daysSinceActive <= 30) {
        segmentsToAdd.push({ type: 'lifecycle', value: 'inactive' });
      } else {
        segmentsToAdd.push({ type: 'lifecycle', value: 'churned' });
      }

      // Engagement segmentation
      const quizCount = user._count.quizAttempts;
      if (quizCount >= 50) {
        segmentsToAdd.push({ type: 'engagement', value: 'power_users' });
      } else if (quizCount <= 10) {
        segmentsToAdd.push({ type: 'engagement', value: 'casual' });
      }

      // Add current streak if >= 7
      if (user.currentStreak && user.currentStreak >= 7) {
        segmentsToAdd.push({ type: 'engagement', value: 'streak_7' });
      }

      // Upsert all segments
      await Promise.all(
        segmentsToAdd.map((segment) =>
          ctx.prisma.userSegment.upsert({
            where: {
              userId_segmentType_segmentValue: {
                userId,
                segmentType: segment.type,
                segmentValue: segment.value,
              },
            },
            create: {
              userId,
              segmentType: segment.type,
              segmentValue: segment.value,
            },
            update: {
              removedAt: null, // Reactivate if was removed
            },
          })
        )
      );

      return {
        success: true,
        segmentsAdded: segmentsToAdd.length,
        segments: segmentsToAdd,
      };
    }),

  /**
   * Remove user from segment
   */
  removeUserFromSegment: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        segmentType: z.string(),
        segmentValue: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, segmentType, segmentValue } = input;

      await ctx.prisma.userSegment.updateMany({
        where: {
          userId,
          segmentType,
          segmentValue,
          removedAt: null,
        },
        data: {
          removedAt: new Date(),
        },
      });

      return { success: true, message: 'User removed from segment' };
    }),

  /**
   * Export segment users as CSV
   */
  exportSegmentUsers: adminProcedure
    .input(
      z.object({
        segmentType: z.string(),
        segmentValue: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { segmentType, segmentValue } = input;

      const userSegments = await ctx.prisma.userSegment.findMany({
        where: {
          segmentType,
          segmentValue,
          removedAt: null,
        },
        include: {
          user: {
            select: {
              userId: true,
              email: true,
              firstName: true,
              lastName: true,
              plan: true,
              lastActivityAt: true,
              createdAt: true,
            },
          },
        },
        orderBy: { addedAt: 'desc' },
        take: 5000, // Limit exports
      });

      // Generate CSV
      const csvRows = [
        ['User ID', 'Email', 'First Name', 'Last Name', 'Plan', 'Last Active', 'Created At', 'Added to Segment'],
      ];

      userSegments.forEach((us) => {
        csvRows.push([
          us.user.userId,
          us.user.email,
          us.user.firstName || '',
          us.user.lastName || '',
          us.user.plan || '',
          us.user.lastActivityAt?.toISOString() || '',
          us.user.createdAt?.toISOString() || '',
          us.addedAt.toISOString(),
        ]);
      });

      const csvContent = csvRows.map((row) => row.map(escapeCSV).join(',')).join('\n');

      return {
        csvContent,
        totalRecords: userSegments.length,
        segmentType,
        segmentValue,
      };
    }),
});

/**
 * Helper: Build Prisma where clause from segment criteria
 */
function buildWhereClauseFromCriteria(
  criteria: Array<{ field: string; operator: string; value: string | number | string[] }>,
  combineWith: 'AND' | 'OR'
): Prisma.UserWhereInput {
  const conditions = criteria.map((criterion) => {
    const { field, operator, value } = criterion;

    switch (operator) {
      case 'equals':
        return { [field]: value };
      case 'not_equals':
        return { [field]: { not: value } };
      case 'greater_than':
        return { [field]: { gt: value } };
      case 'less_than':
        return { [field]: { lt: value } };
      case 'contains':
        return { [field]: { contains: value as string, mode: 'insensitive' as const } };
      case 'in':
        return { [field]: { in: value as string[] } };
      case 'not_in':
        return { [field]: { notIn: value as string[] } };
      default:
        return {};
    }
  });

  if (combineWith === 'AND') {
    return { AND: conditions };
  } else {
    return { OR: conditions };
  }
}

/**
 * Helper: Escape CSV values
 */
function escapeCSV(value: string): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);

  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}
