/**
 * Gamification tRPC Router
 *
 * Handles all gamification-related operations:
 * - Streaks tracking
 * - Daily activity
 * - XP and levels
 * - Badges and achievements
 * - Leaderboards
 */

import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

/**
 * Calculate XP required for a given level
 * Formula: 100 * (level ^ 1.5)
 */
function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate level from total XP
 */
function calculateLevelFromXP(totalXP: number): { level: number; xpToNextLevel: number } {
  let level = 1;
  let xpForCurrentLevel = 0;

  while (xpForCurrentLevel <= totalXP) {
    level++;
    xpForCurrentLevel = calculateXPForLevel(level);
  }

  level--; // Go back one level
  const xpForThisLevel = calculateXPForLevel(level);
  const xpForNextLevel = calculateXPForLevel(level + 1);
  const xpToNextLevel = xpForNextLevel - (totalXP - xpForThisLevel);

  return { level, xpToNextLevel };
}

/**
 * Check if user has activity for today
 */
function hasTodayActivity(lastActivityAt: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(lastActivityAt);
  lastActivity.setHours(0, 0, 0, 0);

  return today.getTime() === lastActivity.getTime();
}

/**
 * Check if streak should continue
 */
function shouldContinueStreak(lastActivityAt: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const lastActivity = new Date(lastActivityAt);
  lastActivity.setHours(0, 0, 0, 0);

  return yesterday.getTime() === lastActivity.getTime() || hasTodayActivity(lastActivityAt);
}

export const gamificationRouter = router({
  /**
   * Get user's streak information
   */
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    // Get or create streak record
    let streak = await ctx.prisma.userStreak.findUnique({
      where: { userId: ctx.userId },
    });

    if (!streak) {
      // Create initial streak record
      streak = await ctx.prisma.userStreak.create({
        data: {
          userId: ctx.userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityAt: new Date(),
          streakFreezes: 0,
        },
      });
    }

    // Check if streak is still valid
    const isToday = hasTodayActivity(streak.lastActivityAt);
    const shouldContinue = shouldContinueStreak(streak.lastActivityAt);

    return {
      currentStreak: shouldContinue ? streak.currentStreak : 0,
      longestStreak: streak.longestStreak,
      lastActivityAt: streak.lastActivityAt,
      streakFreezes: streak.streakFreezes,
      hasCompletedToday: isToday,
      isAtRisk: !isToday && shouldContinue,
    };
  }),

  /**
   * Get daily activity for heatmap (last 365 days)
   */
  getActivityHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activities = await ctx.prisma.dailyActivity.findMany({
      where: {
        userId: ctx.userId,
        date: {
          gte: oneYearAgo,
        },
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        date: true,
        questionsAnswered: true,
        quizzesTaken: true,
        flashcardsStudied: true,
        minutesSpent: true,
        xpEarned: true,
      },
    });

    // Transform to heatmap format
    return activities.map((activity: any) => ({
      date: activity.date.toISOString().split('T')[0],
      count: activity.questionsAnswered + activity.quizzesTaken + activity.flashcardsStudied,
      questionsAnswered: activity.questionsAnswered,
      quizzesTaken: activity.quizzesTaken,
      flashcardsStudied: activity.flashcardsStudied,
      minutesSpent: activity.minutesSpent,
      xpEarned: activity.xpEarned,
    }));
  }),

  /**
   * Get today's activity and goal progress
   */
  getDailyGoal: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user settings for daily goal
    let settings = await ctx.prisma.userGamificationSettings.findUnique({
      where: { userId: ctx.userId },
    });

    if (!settings) {
      settings = await ctx.prisma.userGamificationSettings.create({
        data: {
          userId: ctx.userId,
          dailyXPGoal: 100,
        },
      });
    }

    // Get today's activity
    const todayActivity = await ctx.prisma.dailyActivity.findUnique({
      where: {
        userId_date: {
          userId: ctx.userId,
          date: today,
        },
      },
    });

    const xpEarned = todayActivity?.xpEarned || 0;
    const dailyGoal = settings.dailyXPGoal;

    return {
      xpEarned,
      dailyGoal,
      progress: Math.min((xpEarned / dailyGoal) * 100, 100),
      isComplete: xpEarned >= dailyGoal,
      questionsAnswered: todayActivity?.questionsAnswered || 0,
      quizzesTaken: todayActivity?.quizzesTaken || 0,
      minutesSpent: todayActivity?.minutesSpent || 0,
    };
  }),

  /**
   * Get user's XP and level information
   */
  getXP: protectedProcedure.query(async ({ ctx }) => {
    let xpRecord = await ctx.prisma.userXP.findUnique({
      where: { userId: ctx.userId },
    });

    if (!xpRecord) {
      xpRecord = await ctx.prisma.userXP.create({
        data: {
          userId: ctx.userId,
          totalXP: 0,
          currentLevel: 1,
          xpToNextLevel: 100,
        },
      });
    }

    return {
      totalXP: xpRecord.totalXP,
      currentLevel: xpRecord.currentLevel,
      xpToNextLevel: xpRecord.xpToNextLevel,
      progressToNextLevel: ((calculateXPForLevel(xpRecord.currentLevel + 1) - xpRecord.xpToNextLevel) / calculateXPForLevel(xpRecord.currentLevel + 1)) * 100,
    };
  }),

  /**
   * Record activity (called after quiz completion, etc.)
   * This updates streaks, daily activity, and awards XP
   */
  recordActivity: protectedProcedure
    .input(
      z.object({
        type: z.enum(['quiz', 'question', 'flashcard', 'login']),
        xpAwarded: z.number(),
        metadata: z.object({
          quizId: z.string().optional(),
          questionsAnswered: z.number().optional(),
          isCorrect: z.boolean().optional(),
          timeTaken: z.number().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Update or create daily activity
      const dailyActivity = await ctx.prisma.dailyActivity.upsert({
        where: {
          userId_date: {
            userId: ctx.userId,
            date: today,
          },
        },
        update: {
          questionsAnswered: {
            increment: input.metadata?.questionsAnswered || (input.type === 'question' ? 1 : 0),
          },
          quizzesTaken: {
            increment: input.type === 'quiz' ? 1 : 0,
          },
          flashcardsStudied: {
            increment: input.type === 'flashcard' ? 1 : 0,
          },
          minutesSpent: {
            increment: Math.floor((input.metadata?.timeTaken || 0) / 60),
          },
          xpEarned: {
            increment: input.xpAwarded,
          },
        },
        create: {
          userId: ctx.userId,
          date: today,
          questionsAnswered: input.metadata?.questionsAnswered || (input.type === 'question' ? 1 : 0),
          quizzesTaken: input.type === 'quiz' ? 1 : 0,
          flashcardsStudied: input.type === 'flashcard' ? 1 : 0,
          minutesSpent: Math.floor((input.metadata?.timeTaken || 0) / 60),
          xpEarned: input.xpAwarded,
        },
      });

      // Update streak
      let streak = await ctx.prisma.userStreak.findUnique({
        where: { userId: ctx.userId },
      });

      if (!streak) {
        streak = await ctx.prisma.userStreak.create({
          data: {
            userId: ctx.userId,
            currentStreak: 1,
            longestStreak: 1,
            lastActivityAt: new Date(),
            streakFreezes: 0,
          },
        });
      } else {
        const isToday = hasTodayActivity(streak.lastActivityAt);
        const shouldContinue = shouldContinueStreak(streak.lastActivityAt);

        if (!isToday) {
          let newStreak = streak.currentStreak;

          if (shouldContinue) {
            // Continue streak
            newStreak = streak.currentStreak + 1;
          } else {
            // Streak broken, reset to 1
            newStreak = 1;
          }

          // Award streak freeze every 7 days (max 2)
          const streakFreezes = newStreak % 7 === 0 && streak.streakFreezes < 2
            ? streak.streakFreezes + 1
            : streak.streakFreezes;

          await ctx.prisma.userStreak.update({
            where: { userId: ctx.userId },
            data: {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, streak.longestStreak),
              lastActivityAt: new Date(),
              streakFreezes,
            },
          });
        }
      }

      // Award XP
      const xpRecord = await ctx.prisma.userXP.upsert({
        where: { userId: ctx.userId },
        create: {
          userId: ctx.userId,
          totalXP: input.xpAwarded,
          currentLevel: 1,
          xpToNextLevel: 100 - input.xpAwarded,
        },
        update: {
          totalXP: {
            increment: input.xpAwarded,
          },
        },
      });

      // Recalculate level
      const { level, xpToNextLevel } = calculateLevelFromXP(xpRecord.totalXP + input.xpAwarded);
      const leveledUp = level > xpRecord.currentLevel;

      if (leveledUp || xpToNextLevel !== xpRecord.xpToNextLevel) {
        await ctx.prisma.userXP.update({
          where: { userId: ctx.userId },
          data: {
            currentLevel: level,
            xpToNextLevel,
          },
        });
      }

      // Record XP transaction
      await ctx.prisma.xPTransaction.create({
        data: {
          userId: ctx.userId,
          amount: input.xpAwarded,
          source: input.type,
          description: `Earned ${input.xpAwarded} XP from ${input.type}`,
          metadata: input.metadata as any,
        },
      });

      return {
        success: true,
        xpAwarded: input.xpAwarded,
        leveledUp,
        newLevel: level,
        streakUpdated: true,
      };
    }),

  /**
   * Use streak freeze
   */
  useStreakFreeze: protectedProcedure.mutation(async ({ ctx }) => {
    const streak = await ctx.prisma.userStreak.findUnique({
      where: { userId: ctx.userId },
    });

    if (!streak) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Streak record not found',
      });
    }

    if (streak.streakFreezes <= 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No streak freezes available',
      });
    }

    // Use a freeze and extend last activity to today
    await ctx.prisma.userStreak.update({
      where: { userId: ctx.userId },
      data: {
        streakFreezes: {
          decrement: 1,
        },
        lastActivityAt: new Date(),
      },
    });

    return {
      success: true,
      freezesRemaining: streak.streakFreezes - 1,
    };
  }),

  /**
   * Get activity stats summary
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalActivities, recentXP, streak] = await Promise.all([
      ctx.prisma.dailyActivity.count({
        where: { userId: ctx.userId },
      }),
      ctx.prisma.xPTransaction.aggregate({
        where: {
          userId: ctx.userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        _sum: {
          amount: true,
        },
      }),
      ctx.prisma.userStreak.findUnique({
        where: { userId: ctx.userId },
      }),
    ]);

    return {
      totalDaysActive: totalActivities,
      xpThisWeek: recentXP._sum.amount || 0,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
    };
  }),
});
