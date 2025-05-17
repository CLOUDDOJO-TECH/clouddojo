"use server"

import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function getUserTestData(userId: string) {
  try {

    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

  // Get user's latest 5 quiz attempts with comprehensive data
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }, // Only completed attempts
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 5, // Get most recent 5 attempts
      include: {
        quiz: {
          include: {
            category: true
          }
        },
        questions: {
          include: {
            question: {
              include: {
                category: true,
                options: true  // Include question options for more detailed analysis
              }
            }
          }
        },
        user: {
          include: {
            onboarding: true
          }
        }
      }
    })

    if (quizAttempts.length === 0) {
      return { success: false, error: "No completed quiz attempts found" }
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
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map(a => a.id))})
        GROUP BY q."categoryId", c.name
      `,

      // Service Performance
      prisma.$queryRaw`
        SELECT 
          q."awsService",
          COUNT(*) as "_count__all",
          COUNT(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect",
          AVG(CASE WHEN qa."isCorrect" = true THEN 1.0 ELSE 0.0 END) * 100 as "accuracyPercentage"
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map(a => a.id))})
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
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map(a => a.id))})
        GROUP BY q."difficultyLevel"
      `
    ])

    // Comprehensive time metrics
    const timeMetrics = {
      totalTime: quizAttempts.reduce((sum, attempt) => sum + attempt.timeSpentSecs, 0),
      averageTimePerQuestion: quizAttempts.reduce((sum, attempt) => 
        sum + (attempt.timeSpentSecs / attempt.questions.length), 0) / quizAttempts.length,
      timeByDifficulty: await prisma.$queryRaw`
        SELECT 
          q."difficultyLevel" as level,
          AVG(qa."timeSpentSecs") as "averageTime"
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        WHERE qa."quizAttemptId" IN (${Prisma.join(quizAttempts.map(a => a.id))})
        GROUP BY q."difficultyLevel"
      `
    }

    // Performance trend calculation
    const performanceTrend = quizAttempts.map(attempt => ({
      testId: attempt.id,
      testName: attempt.quiz.title,
      score: attempt.percentageScore,
      date: attempt.completedAt
    })).reverse() // Oldest to newest

    return {
      success: true,
      data: {
        quizAttempts,
        categoryPerformance: comprehensivePerformance[0],
        servicePerformance: comprehensivePerformance[1],
        difficultyPerformance: comprehensivePerformance[2],
        timeMetrics,
        performanceTrend
      }
    }
  } catch (error) {
    console.error("Comprehensive test data retrieval error:", error)
    return { success: false, error: "Failed to retrieve comprehensive test data" }
  }
} 