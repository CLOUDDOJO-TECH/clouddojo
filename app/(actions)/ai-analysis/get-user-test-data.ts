"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getCurrentUserProfile } from "../user/user-actions";
import { TimeByDifficultyRow } from "./types";
import { CategoryPerformanceRow, DifficultyPerformanceRow, ServicePerformanceRow } from "./types";

interface valProps {
  val: "bigint" | "string" | "number";
}
function toNumber(val: valProps) {
  if (typeof val.val === "bigint") return Number(val.val);
  if (typeof val.val === "string" && !isNaN(Number(val.val))) return Number(val.val);
  if (typeof val.val === "number") return val.val;
  return 0;
}

export async function getUserTestData(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // Get user's latest 5 quiz attempts with comprehensive data
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }, // Only completed attempts
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 5, // Get most recent 5 attempts
      include: {
        quiz: {
          include: {
            category: true,
          },
        },
        questions: {
          include: {
            question: {
              include: {
                category: true,
                options: true, // Include question options for more detailed analysis
              },
            },
          },
        },
        user: {
          include: {
            onboarding: true,
          },
        },
      },
    });

    if (quizAttempts.length === 0) {
      if (process.env.NODE_ENV !== "production") {
      }
      return { success: false, error: "No completed quiz attempts found" };
    }

    // Comprehensive performance analysis across all attempts
    const comprehensivePerformance = await prisma.$transaction([
      // Category Performance
      prisma.$queryRaw`
        SELECT 
          q."categoryId",
          c.name as "categoryName",
          COUNT(*) as "_count__all",
          COUNT(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect",
          AVG(CASE WHEN qa."isCorrect" = true THEN 1.0 ELSE 0.0 END) * 100 as "accuracyPercentage"
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        LEFT JOIN "Category" c ON q."categoryId" = c.id
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map((a) => a.id))})
        GROUP BY q."categoryId", c.name
      `,

      // Service Performance (fix field name to awsService)
      prisma.$queryRaw`
        SELECT 
          q."awsService",
          COUNT(*) as "_count__all",
          COUNT(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect",
          AVG(CASE WHEN qa."isCorrect" = true THEN 1.0 ELSE 0.0 END) * 100 as "accuracyPercentage"
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map((a) => a.id))})
        GROUP BY q."awsService"
      `,

      // Difficulty Performance
      prisma.$queryRaw`
        SELECT 
          q."difficultyLevel",
          COUNT(*) as "_count__all",
          COUNT(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect",
          AVG(CASE WHEN qa."isCorrect" = true THEN 1.0 ELSE 0.0 END) * 100 as "accuracyPercentage"
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map((a) => a.id))})
        GROUP BY q."difficultyLevel"
      `,
    ]);

    // Comprehensive time metrics
    const totalQuestions = quizAttempts.reduce((sum, attempt) => sum + (attempt.questions?.length || 0), 0);
    const totalTime = quizAttempts.reduce((sum, attempt) => sum + (attempt.timeSpentSecs || 0), 0);
    const averageTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0;

    const timeByDifficulty = await prisma.$queryRaw`
      SELECT 
        q."difficultyLevel" as level,
        AVG(qa."timeSpentSecs") as "averageTime"
      FROM "QuestionAttempt" qa
      JOIN "Question" q ON qa."questionId" = q.id
      WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map((a) => a.id))})
      GROUP BY q."difficultyLevel"
    `;

    // Convert raw SQL results to numbers
    const convertPerf = (arr: any[]) =>
      arr.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, toNumber({ val: v as any as valProps["val"] })])
        )
      );

    // Performance trend calculation
    const performanceTrend = quizAttempts
      .map((attempt) => ({
        testId: attempt.id,
        testName: attempt.quiz.title,
        score: attempt.percentageScore,
        date: attempt.completedAt,
      }))
      .reverse(); // Oldest to newest

    if (process.env.NODE_ENV !== "production") {
    }

    return {
      success: true,
      data: {
        quizAttempts,
        categoryPerformance: convertPerf(comprehensivePerformance[0] as CategoryPerformanceRow[]),
        servicePerformance: convertPerf(comprehensivePerformance[1] as ServicePerformanceRow[]),
        difficultyPerformance: convertPerf(comprehensivePerformance[2] as DifficultyPerformanceRow[]),
        timeMetrics: {
            totalTime: toNumber({ val: totalTime as any as valProps["val"] }),
          averageTimePerQuestion: toNumber({ val: averageTimePerQuestion as any as valProps["val"] }),
          timeByDifficulty: convertPerf(timeByDifficulty as TimeByDifficultyRow[]),
        },
        performanceTrend,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Comprehensive test data retrieval error:", error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve comprehensive test data",
    };
  }
}
