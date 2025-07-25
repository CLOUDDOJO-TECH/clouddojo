"use server"

import { PrismaClient } from "@prisma/client"
import { addDays } from "date-fns"
import { auth } from "@clerk/nextjs/server"
// Import the new modular implementation with its type
import { analyzeTestData } from "./analyze-test-data-v2"
import type { AnalysisResult } from "./analyze-test-data-v2"

// Use singleton pattern for Prisma client to prevent too many connections
import prisma from "@/lib/prisma"

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

    // Define when the report should expire - 3 days after generation
    const today = new Date()
    const nextThreeDays = getNextThreeDays()

    // Check for an existing, non-expired report if not forcing refresh
    if (!forceRefresh) {
      const existingReport = await prisma.aIAnalysisReport.findFirst({
        where: {
          userId: user.userId,
          expiresAt: {
            gt: today, // Not expired yet
          },
          latest: true, // Get the latest report
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

    // No valid cached report or force refresh, generate a new one using the modular implementation
    const analysisResult: AnalysisResult = await analyzeTestData(userId)

    if (!analysisResult.success || !analysisResult.data) {
      return {
        success: false,
        error: analysisResult.error || "Failed to analyze test data",
      }
    }

    try {
      // Mark all previous reports as not latest
      await prisma.aIAnalysisReport.updateMany({
        where: {
          userId: user.userId,
          latest: true,
        },
        data: {
          latest: false,
        },
      })

      // Store the new report
      const newReport = await prisma.aIAnalysisReport.create({
        data: {
          userId: user.userId,
          reportData: analysisResult.data,
          expiresAt: nextThreeDays,
          latest: true,
        },
      })

      return {
        success: true,
        data: newReport.reportData,
        cached: false,
        expiresAt: newReport.expiresAt,
        generatedAt: newReport.generatedAt,
      }
    } catch (dbError) {
      console.error("Database error when storing AI analysis:", dbError)
      // Still return the analysis result even if storing fails
      return {
        success: true,
        data: analysisResult.data,
        cached: false,
        temporary: true, // Flag indicating it wasn't stored
      }
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
 * Gets the date three days from now at 8 AM
 */
function getNextThreeDays() {
  const today = new Date()
  
  // Set to 3 days from now at 8 AM
  const threeDaysFromNow = addDays(today, 3)
  threeDaysFromNow.setHours(8, 0, 0, 0)
  
  return threeDaysFromNow
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
        latest: true,
      },
      select: {
        userId: true,
      },
      distinct: ['userId'], // Only get one per user
    })
    
    // Process each user's report using the modular implementation
    const results = await Promise.allSettled(
      expiredReports.map(async ({ userId }) => {
        try {
          // Generate a new analysis for this user
          const analysisResult: AnalysisResult = await analyzeTestData(userId)
          
          if (!analysisResult.success || !analysisResult.data) {
            throw new Error(`Failed to analyze test data for user ${userId}: ${analysisResult.error}`)
          }
          
          // Mark all previous reports as not latest
          await prisma.aIAnalysisReport.updateMany({
            where: {
              userId,
              latest: true,
            },
            data: {
              latest: false,
            },
          })
          
          // Store the new report
          const nextThreeDays = getNextThreeDays()
          await prisma.aIAnalysisReport.create({
            data: {
              userId,
              reportData: analysisResult.data,
              expiresAt: nextThreeDays,
              latest: true,
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