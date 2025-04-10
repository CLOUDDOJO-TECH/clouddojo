"use server"

import { PrismaClient } from "@prisma/client"
import { addDays, isAfter } from "date-fns"
import { auth } from "@clerk/nextjs/server"
import { analyzeTestData } from "./analyze-test-data"

const prisma = new PrismaClient()

/**
 * Get or create an AI analysis report for the user.
 * By default, uses cached report if available and not expired.
 * Can force a refresh with forceRefresh=true.
 */
export async function getCachedAIAnalysis(forceRefresh = false) {
  try {
    // Get the current user
    const { userId } = await auth()
    if (!userId) {
      return {
        success: false,
        error: "Authentication required",
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
      },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Define when the report should expire - 7 days after generation
    const today = new Date()
    const nextFriday = getNextFriday()

    // Check for an existing, non-expired report if not forcing refresh
    if (!forceRefresh) {
      const existingReport = await prisma.aIAnalysisReport.findFirst({
        where: {
          userId: user.userId,
          expiresAt: {
            gt: today, // Not expired yet
          },
        },
        orderBy: {
          generatedAt: 'desc', // Get the most recent report
        },
      })

      if (existingReport) {
        // Update the last requested timestamp
        await prisma.aIAnalysisReport.update({
          where: {
            id: existingReport.id,
          },
          data: {
            lastRequestedAt: today,
          },
        })

        return {
          success: true,
          data: existingReport.reportData,
          cached: true,
          expiresAt: existingReport.expiresAt,
          generatedAt: existingReport.generatedAt,
        }
      }
    }

    // No valid cached report or force refresh, generate a new one
    const analysisResult = await analyzeTestData()

    if (!analysisResult.success || !analysisResult.data) {
      return {
        success: false,
        error: analysisResult.error || "Failed to analyze test data",
      }
    }

    // Store the new report
    const newReport = await prisma.aIAnalysisReport.create({
      data: {
        userId: user.userId,
        reportData: analysisResult.data,
        expiresAt: nextFriday,
      },
    })

    return {
      success: true,
      data: newReport.reportData,
      cached: false,
      expiresAt: newReport.expiresAt,
      generatedAt: newReport.generatedAt,
    }
  } catch (error) {
    console.error("Error in getCachedAIAnalysis:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Gets the next Friday at 8 AM
 */
function getNextFriday() {
  const today = new Date()
  const day = today.getDay() // 0 is Sunday, 5 is Friday
  const daysUntilFriday = (5 - day + 7) % 7 || 7 // if today is Friday, get next Friday
  
  // Set to next Friday at 8 AM
  const nextFriday = addDays(today, daysUntilFriday)
  nextFriday.setHours(8, 0, 0, 0)
  
  return nextFriday
}

/**
 * For AWS Lambda: Refresh all expired reports
 * Can be triggered by a scheduled Lambda function
 */
export async function refreshAllExpiredReports() {
  try {
    const today = new Date()
    
    // Find all expired reports
    const expiredReports = await prisma.aIAnalysisReport.findMany({
      where: {
        expiresAt: {
          lt: today,
        },
      },
      select: {
        userId: true,
      },
      distinct: ['userId'], // Only get one per user
    })
    
    // Process each user's report
    const results = await Promise.allSettled(
      expiredReports.map(async ({ userId }) => {
        try {
          // Generate a new analysis for this user
          const analysisResult = await analyzeTestData()
          
          if (!analysisResult.success || !analysisResult.data) {
            throw new Error(`Failed to analyze test data for user ${userId}: ${analysisResult.error}`)
          }
          
          // Store the new report
          const nextFriday = getNextFriday()
          await prisma.aIAnalysisReport.create({
            data: {
              userId,
              reportData: analysisResult.data,
              expiresAt: nextFriday,
            },
          })
          
          return { userId, success: true }
        } catch (err) {
          return { userId, success: false, error: err instanceof Error ? err.message : "Unknown error" }
        }
      })
    )
    
    // Count successes and failures
    const successes = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failures = results.length - successes
    
    return {
      success: true,
      message: `Refreshed ${successes} reports, with ${failures} failures out of ${results.length} total`,
      details: results,
    }
  } catch (error) {
    console.error("Error in refreshAllExpiredReports:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
} 