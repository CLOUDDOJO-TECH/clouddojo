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
    
    // Get user's quiz attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: "asc" },
      include: {
        quiz: {
          select: {
            title: true,
            id: true
          }
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
          highestScore: 0,
          recentScores: [],
          scoreHistory: []
        }
      }
    }
    
    // Calculate statistics
    const totalAttempts = attempts.length
    const scores = attempts.map(attempt => attempt.percentageScore)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalAttempts
    const highestScore = Math.max(...scores)
    
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
    
    // Prepare score history for chart
    const scoreHistory = attempts.map(attempt => ({
      date: (attempt.completedAt || attempt.startedAt).toISOString().split('T')[0],
      score: attempt.percentageScore
    }))
    
    return {
      success: true,
      hasAttempts: true,
      stats: {
        totalAttempts,
        averageScore,
        highestScore,
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