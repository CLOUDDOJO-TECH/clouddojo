/**
 * Gamification Router
 *
 * Handles all gamification-related operations:
 * - XP tracking and level progression
 * - Streak management
 * - Badge unlocking
 * - Daily activities
 * - Leaderboard
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  triggerBadgeUnlocked,
  triggerStreakMilestone,
  triggerLevelUp,
} from '@/lib/emails/services/orchestrator';

export const gamificationRouter = router({
  /**
   * Get user's XP and level
   */
  getXP: protectedProcedure.query(async ({ ctx }) => {
    const userXP = await ctx.prisma.userXP.findUnique({
      where: { userId: ctx.userId },
    });

    if (!userXP) {
      // Create default XP record if it doesn't exist
      const newXP = await ctx.prisma.userXP.create({
        data: {
          userId: ctx.userId,
          totalXP: 0,
          level: 1,
        },
      });
      return newXP;
    }

    return userXP;
  }),

  /**
   * Get user's streak
   */
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const streak = await ctx.prisma.userStreak.findUnique({
      where: { userId: ctx.userId },
    });

    if (!streak) {
      // Create default streak record if it doesn't exist
      const newStreak = await ctx.prisma.userStreak.create({
        data: {
          userId: ctx.userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: new Date(),
        },
      });
      return newStreak;
    }

    return streak;
  }),

  /**
   * Get user's badges
   */
  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const badges = await ctx.prisma.userBadge.findMany({
      where: { userId: ctx.userId },
      orderBy: { unlockedAt: 'desc' },
    });

    return badges;
  }),

  /**
   * Award XP to user
   * Checks for level up and triggers email if applicable
   */
  awardXP: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1).max(10000),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get current XP
      let userXP = await ctx.prisma.userXP.findUnique({
        where: { userId: ctx.userId },
      });

      if (!userXP) {
        userXP = await ctx.prisma.userXP.create({
          data: {
            userId: ctx.userId,
            totalXP: 0,
            level: 1,
          },
        });
      }

      const oldLevel = userXP.level;
      const newTotalXP = userXP.totalXP + input.amount;

      // Calculate new level (100 XP per level for now)
      const newLevel = Math.floor(newTotalXP / 100) + 1;
      const xpToNextLevel = (newLevel * 100) - newTotalXP;

      // Update XP
      const updatedXP = await ctx.prisma.userXP.update({
        where: { userId: ctx.userId },
        data: {
          totalXP: newTotalXP,
          level: newLevel,
        },
      });

      // Create XP transaction
      await ctx.prisma.xPTransaction.create({
        data: {
          userId: ctx.userId,
          amount: input.amount,
          reason: input.reason,
          timestamp: new Date(),
        },
      });

      // Check for level up
      if (newLevel > oldLevel) {
        // Trigger level up email
        await triggerLevelUp(
          ctx.userId,
          newLevel,
          newTotalXP,
          xpToNextLevel,
          [] // TODO: Add unlocked features based on level
        ).catch((error) => {
          console.error('Failed to trigger level up email:', error);
        });
      }

      return {
        ...updatedXP,
        xpToNextLevel,
        leveledUp: newLevel > oldLevel,
        previousLevel: oldLevel,
      };
    }),

  /**
   * Update daily streak
   * Checks for streak milestones and triggers email if applicable
   */
  updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let streak = await ctx.prisma.userStreak.findUnique({
      where: { userId: ctx.userId },
    });

    if (!streak) {
      streak = await ctx.prisma.userStreak.create({
        data: {
          userId: ctx.userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: today,
        },
      });
    }

    const lastActivity = new Date(streak.lastActivityDate);
    const lastActivityDay = new Date(
      lastActivity.getFullYear(),
      lastActivity.getMonth(),
      lastActivity.getDate()
    );

    // Calculate days difference
    const daysDiff = Math.floor(
      (today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newCurrentStreak = streak.currentStreak;
    let newLongestStreak = streak.longestStreak;

    if (daysDiff === 0) {
      // Same day, no change
      return {
        ...streak,
        streakUpdated: false,
        message: 'Already logged activity today',
      };
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newCurrentStreak += 1;
      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
    } else {
      // Streak broken
      newCurrentStreak = 1;
    }

    // Update streak
    const updatedStreak = await ctx.prisma.userStreak.update({
      where: { userId: ctx.userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      },
    });

    // Get user XP for email
    const userXP = await ctx.prisma.userXP.findUnique({
      where: { userId: ctx.userId },
    });

    // Trigger streak milestone email if applicable
    await triggerStreakMilestone(
      ctx.userId,
      newCurrentStreak,
      newLongestStreak,
      0, // TODO: Add streak freezes when implemented
      userXP?.totalXP || 0
    ).catch((error) => {
      console.error('Failed to trigger streak milestone email:', error);
    });

    return {
      ...updatedStreak,
      streakUpdated: true,
      streakIncreased: daysDiff === 1,
      streakBroken: daysDiff > 1,
    };
  }),

  /**
   * Unlock a badge for a user
   * Triggers badge unlocked email
   */
  unlockBadge: protectedProcedure
    .input(
      z.object({
        badgeId: z.string(),
        badgeName: z.string(),
        badgeDescription: z.string(),
        badgeIcon: z.string(),
        badgeTier: z.enum(['bronze', 'silver', 'gold', 'platinum']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if badge already unlocked
      const existing = await ctx.prisma.userBadge.findFirst({
        where: {
          userId: ctx.userId,
          badgeId: input.badgeId,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Badge already unlocked',
        });
      }

      // Unlock badge
      const badge = await ctx.prisma.userBadge.create({
        data: {
          userId: ctx.userId,
          badgeId: input.badgeId,
          badgeName: input.badgeName,
          unlockedAt: new Date(),
        },
      });

      // Get total badge count
      const totalBadges = await ctx.prisma.userBadge.count({
        where: { userId: ctx.userId },
      });

      // Trigger badge unlocked email
      await triggerBadgeUnlocked(
        ctx.userId,
        input.badgeName,
        input.badgeDescription,
        input.badgeIcon,
        input.badgeTier,
        totalBadges,
        undefined // TODO: Suggest next badge
      ).catch((error) => {
        console.error('Failed to trigger badge unlocked email:', error);
      });

      return {
        ...badge,
        totalBadges,
      };
    }),

  /**
   * Get user's daily activities
   */
  getDailyActivities: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(30).default(7),
      })
    )
    .query(async ({ input, ctx }) => {
      const activities = await ctx.prisma.dailyActivity.findMany({
        where: { userId: ctx.userId },
        orderBy: { date: 'desc' },
        take: input.limit,
      });

      return activities;
    }),

  /**
   * Get leaderboard
   */
  getLeaderboard: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        period: z.enum(['daily', 'weekly', 'monthly', 'all-time']).default('all-time'),
      })
    )
    .query(async ({ ctx, input }) => {
      // For now, just return top XP earners
      // TODO: Filter by period when leaderboard periods are implemented
      const topUsers = await ctx.prisma.userXP.findMany({
        orderBy: { totalXP: 'desc' },
        take: input.limit,
        include: {
          user: {
            select: {
              userId: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return topUsers.map((u, index) => ({
        rank: index + 1,
        userId: u.userId,
        firstName: u.user.firstName,
        lastName: u.user.lastName,
        totalXP: u.totalXP,
        level: u.level,
      }));
    }),
});
