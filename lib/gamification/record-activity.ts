/**
 * Shared gamification logic for recording user activity
 * Can be called from both tRPC endpoints and server actions
 */

import prisma from "@/lib/prisma";

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

interface ActivityMetadata {
  quizId?: string;
  questionsAnswered?: number;
  isCorrect?: boolean;
  timeTaken?: number;
}

interface RecordActivityParams {
  userId: string;
  type: "quiz" | "question" | "flashcard" | "login";
  xpAwarded: number;
  metadata?: ActivityMetadata;
}

/**
 * Record user activity and update gamification stats
 * This function updates:
 * - Daily activity (questions answered, quizzes taken, XP earned)
 * - User streak (current streak, longest streak, streak freezes)
 * - User XP (total XP, level, XP to next level)
 * - XP transactions (audit log)
 *
 * @returns Object with success status, XP awarded, level up info, and streak status
 */
export async function recordUserActivity({
  userId,
  type,
  xpAwarded,
  metadata = {},
}: RecordActivityParams): Promise<{
  success: boolean;
  xpAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  streakUpdated: boolean;
  currentStreak: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Update or create daily activity
  await prisma.dailyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      questionsAnswered: {
        increment: metadata.questionsAnswered || (type === "question" ? 1 : 0),
      },
      quizzesTaken: {
        increment: type === "quiz" ? 1 : 0,
      },
      flashcardsStudied: {
        increment: type === "flashcard" ? 1 : 0,
      },
      minutesSpent: {
        increment: Math.floor((metadata.timeTaken || 0) / 60),
      },
      xpEarned: {
        increment: xpAwarded,
      },
    },
    create: {
      userId,
      date: today,
      questionsAnswered: metadata.questionsAnswered || (type === "question" ? 1 : 0),
      quizzesTaken: type === "quiz" ? 1 : 0,
      flashcardsStudied: type === "flashcard" ? 1 : 0,
      minutesSpent: Math.floor((metadata.timeTaken || 0) / 60),
      xpEarned: xpAwarded,
    },
  });

  // 2. Update streak
  let streak = await prisma.userStreak.findUnique({
    where: { userId },
  });

  let currentStreak = 1;

  if (!streak) {
    const newStreak = await prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityAt: new Date(),
        streakFreezes: 0,
      },
    });
    currentStreak = newStreak.currentStreak;
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
      const streakFreezes =
        newStreak % 7 === 0 && streak.streakFreezes < 2 ? streak.streakFreezes + 1 : streak.streakFreezes;

      const updatedStreak = await prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActivityAt: new Date(),
          streakFreezes,
        },
      });
      currentStreak = updatedStreak.currentStreak;
    } else {
      currentStreak = streak.currentStreak;
    }
  }

  // 3. Award XP
  const xpRecord = await prisma.userXP.upsert({
    where: { userId },
    create: {
      userId,
      totalXP: xpAwarded,
      currentLevel: 1,
      xpToNextLevel: 100 - xpAwarded,
    },
    update: {
      totalXP: {
        increment: xpAwarded,
      },
    },
  });

  // 4. Recalculate level
  const { level, xpToNextLevel } = calculateLevelFromXP(xpRecord.totalXP + xpAwarded);
  const leveledUp = level > xpRecord.currentLevel;

  if (leveledUp || xpToNextLevel !== xpRecord.xpToNextLevel) {
    await prisma.userXP.update({
      where: { userId },
      data: {
        currentLevel: level,
        xpToNextLevel,
      },
    });
  }

  // 5. Record XP transaction
  await prisma.xPTransaction.create({
    data: {
      userId,
      amount: xpAwarded,
      source: type,
      description: `Earned ${xpAwarded} XP from ${type}`,
      metadata: metadata as any,
    },
  });

  return {
    success: true,
    xpAwarded,
    leveledUp,
    newLevel: level,
    streakUpdated: true,
    currentStreak,
  };
}
