"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"

/**
 * Fetch performance statistics for the current user
 * This includes quiz attempts, average scores, etc.
 */
export async function fetchUserPerformanceStats() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: "Unauthorized", success: false, stats: null }
    }
    
    // Get user's quiz attempts with question count
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: "asc" },
      include: {
        quiz: {
          select: {
            title: true,
            id: true
          }
        },
        _count: {
          select: { questions: true }
        }
      }
    })
    
    if (attempts.length === 0) {
      return { 
        success: true, 
        hasAttempts: false,
        stats: {
          totalAttempts: 0,
          averageScore: 0,
          passRate: 0,
          avgSpeed: 0,
          scoreTrend: 0,
          speedTrend: 0,
          passRateTrend: 0,
          recentScores: [],
          scoreHistory: []
        }
      }
    }
    
    // Calculate statistics
    const totalAttempts = attempts.length
    const scores = attempts.map(attempt => attempt.percentageScore)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalAttempts

    // Pass rate: % of attempts scoring >= 70
    const passingAttempts = scores.filter(s => s >= 70).length
    const passRate = Math.round((passingAttempts / totalAttempts) * 100)

    // Avg speed: average seconds per question across all attempts
    const speeds = attempts.map(a => {
      const qCount = a._count.questions || 1
      return a.timeSpentSecs / qCount
    })
    const avgSpeed = Math.round(speeds.reduce((sum, s) => sum + s, 0) / speeds.length)

    // Trend deltas: compare last 3 vs previous 3
    const recent3 = scores.slice(-3)
    const prev3 = scores.slice(-6, -3)
    const recentAvg = recent3.reduce((s, v) => s + v, 0) / recent3.length
    const prevAvg = prev3.length > 0
      ? prev3.reduce((s, v) => s + v, 0) / prev3.length
      : recentAvg
    const scoreTrend = Math.round(recentAvg - prevAvg)

    // Speed trend
    const recentSpeeds3 = speeds.slice(-3)
    const prevSpeeds3 = speeds.slice(-6, -3)
    const recentSpeedAvg = Math.round(recentSpeeds3.reduce((s, v) => s + v, 0) / recentSpeeds3.length)
    const prevSpeedAvg = prevSpeeds3.length > 0
      ? Math.round(prevSpeeds3.reduce((s, v) => s + v, 0) / prevSpeeds3.length)
      : recentSpeedAvg
    const speedTrend = recentSpeedAvg - prevSpeedAvg

    // Pass rate trend
    const recent3Pass = recent3.filter(s => s >= 70).length / recent3.length
    const prev3Pass = prev3.length > 0
      ? prev3.filter(s => s >= 70).length / prev3.length
      : recent3Pass
    const passRateTrend = Math.round((recent3Pass - prev3Pass) * 100)

    // Get recent scores (last 5 attempts)
    const recentAttempts = attempts.slice(-5).reverse()
    const recentScores = recentAttempts.map(attempt => ({
      id: attempt.id,
      quizId: attempt.quizId,
      quizTitle: attempt.quiz.title,
      score: attempt.percentageScore,
      date: attempt.completedAt || attempt.startedAt,
      formattedDate: formatDistanceToNow(new Date(attempt.completedAt || attempt.startedAt), { addSuffix: true })
    }))

    // Prepare score history for chart (with time per question)
    const scoreHistory = attempts.map(attempt => {
      const questionCount = attempt._count.questions || 1
      const timePerQuestion = Math.round(attempt.timeSpentSecs / questionCount)
      return {
        date: (attempt.completedAt || attempt.startedAt).toISOString().split('T')[0],
        score: attempt.percentageScore,
        timePerQuestion,
      }
    })

    return {
      success: true,
      hasAttempts: true,
      stats: {
        totalAttempts,
        averageScore,
        passRate,
        avgSpeed,
        scoreTrend,
        speedTrend,
        passRateTrend,
        recentScores,
        scoreHistory
      }
    }
  } catch (error) {
    console.error("Error fetching performance stats:", error)
    return { error: "Failed to fetch data", success: false, stats: null }
  }
}

/**
 * Fetch the user's recent activity
 * This includes quiz attempts, completed quizzes, etc.
 */
export async function fetchUserActivity() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: "Unauthorized", success: false, activity: null }
    }
    
    // Get user's recent activity
    const recentActivity = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: {
        quiz: {
          select: {
            title: true,
            id: true,
            category: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
      }
    })
    

    const formattedActivity = recentActivity.map(activity => {
      const categoryData = activity.quiz.category;
      
      
      return {
        id: activity.id,
        quizId: activity.quizId,
        quizTitle: activity.quiz.title,
        category: categoryData ? {
          name: categoryData.name,
          id: categoryData.id,
          description: categoryData.description || "No description available"
        } : {
          name: "uncategorized",
          id: "uncategorized",
          description: "No category assigned"
        },
        score: activity.percentageScore,
        duration: activity.timeSpentSecs,
        completedAt: activity.completedAt || activity.startedAt,
        formattedDate: formatDistanceToNow(new Date(activity.completedAt || activity.startedAt), { addSuffix: true })
      }
    })
    
    return {
      success: true,
      hasActivity: formattedActivity.length > 0,
      activity: formattedActivity
    }
  } catch (error) {
    console.error("Error fetching user activity:", error)
    return { error: "Failed to fetch activity", success: false, activity: null }
  }
}

/**
 * Fetch weak areas based on question-level accuracy
 * Groups by awsService, computes accuracy, returns the weakest ones
 */
export async function fetchWeakAreas() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { error: "Unauthorized", success: false, weakAreas: null }
    }

    const questionAttempts = await prisma.questionAttempt.findMany({
      where: {
        quizAttempt: { userId },
      },
      select: {
        isCorrect: true,
        awsService: true,
      },
    })

    if (questionAttempts.length === 0) {
      return { success: true, weakAreas: [] }
    }

    // Group by awsService
    const serviceMap: Record<string, { total: number; correct: number }> = {}
    for (const qa of questionAttempts) {
      const service = qa.awsService || "General"
      if (!serviceMap[service]) serviceMap[service] = { total: 0, correct: 0 }
      serviceMap[service].total++
      if (qa.isCorrect) serviceMap[service].correct++
    }

    // Compute accuracy and sort by weakest first
    const weakAreas = Object.entries(serviceMap)
      .map(([service, { total, correct }]) => ({
        service,
        accuracy: Math.round((correct / total) * 100),
        total,
        correct,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)

    return { success: true, weakAreas }
  } catch (error) {
    console.error("Error fetching weak areas:", error)
    return { error: "Failed to fetch weak areas", success: false, weakAreas: null }
  }
}

/**
 * Fetch all available quiz categories
 */
export async function fetchQuizCategories() {
  try {
    // Get all quizzes with their categories
    const quizzes = await prisma.quiz.findMany({
      select: {
        categoryId: true
      }
    })
    
    // Count occurrences of each category
    const categoryCounts = quizzes.reduce<Record<string, number>>((acc, quiz) => {
      const categoryId = quiz.categoryId || "uncategorized"
      acc[categoryId] = (acc[categoryId] || 0) + 1
      return acc
    }, {})
    
    // Convert to array format
    const categories = Object.entries(categoryCounts).map(([id, count]) => ({
      id,
      count
    }))
    
    return {
      success: true,
      categories
    }
  } catch (error) {
    console.error("Error fetching quiz categories:", error)
    return { error: "Failed to fetch categories", success: false, categories: [] }
  }
} 