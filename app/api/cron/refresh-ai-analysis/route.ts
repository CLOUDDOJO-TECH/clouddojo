import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { analyzeTestData } from "@/app/(actions)/ai-analysis/analyze-test-data"
import { addHours } from "date-fns"
import { sendAnalysisNotification } from "@/lib/emails/send-email"
import { getProcessedUserIds, markUsersAsProcessed } from "@/lib/cron-helpers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 59

// Configuration
const BATCH_SIZE = 5 // Adjust based on your processing time per user
const TIME_BUFFER_MS = 5000 // 5-second buffer before timeout
const jobId = new Date().toISOString().split('T')[0] // Daily job ID

async function refreshUserAnalysis(userId: string) {
  try {
    // Get user data for email notification
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true
      }
    })

    if (!user?.email) {
      console.error(`No email found for user ${userId}`)
      return false
    }

    // Generate new analysis report for the user
    const analysisResult = await analyzeTestData(user.userId)
    
    if (!analysisResult.success || !analysisResult.data) {
      console.error(`Failed to generate analysis for user ${userId}:`, analysisResult.error)
      return false
    }

    // Calculate next expiration (24 hours from now)
    const expiresAt = addHours(new Date(), 24)

    // Update or create the analysis report
    await prisma.aIAnalysisReport.upsert({
      where: {
        userId_latest: {
          userId: userId,
          latest: true
        }
      },
      update: {
        reportData: analysisResult.data,
        expiresAt: expiresAt,
        generatedAt: new Date(),
      },
      create: {
        userId: userId,
        reportData: analysisResult.data,
        expiresAt: expiresAt,
        latest: true,
      }
    })

    // Send email notification with enhanced data
    try {
      await sendAnalysisNotification({
        email: user.email,
        username: user.firstName || 'there',
        readinessScore: analysisResult.data.certificationReadiness,
        certificationName: analysisResult.data.certificationName,
      })
    } catch (emailError) {
      console.error(`Failed to send email notification to user ${userId}:`, emailError)
    }

    return true
  } catch (error) {
    console.error(`Error refreshing analysis for user ${userId}:`, error)
    return false
  }
}

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 })
    }

    const startTime = Date.now()
    console.log(`Starting cron job at ${new Date(startTime).toISOString()}`)

    // Get total count of users needing updates
    const totalUsers = await prisma.user.count({
      where: {
        quizAttempts: {
          some: {}
        },
        OR: [
          { aiAnalysisReports: { none: {} } },
          { aiAnalysisReports: { some: { expiresAt: { lte: new Date() } } } }
        ]
      }
    })

    let processedCount = 0
    let successCount = 0
    let failCount = 0
    let hasMore = true
    const processedIds = await getProcessedUserIds(jobId)

    // Process in batches until time runs out or all users are processed
    while (hasMore && (Date.now() - startTime) < (maxDuration * 1000 - TIME_BUFFER_MS)) {
      const usersBatch = await prisma.user.findMany({
        where: {
          // Only find users that have at least one quiz attempt
          quizAttempts: {
            some: {}
          },
          OR: [
            { aiAnalysisReports: { none: {} } },
            { aiAnalysisReports: { some: { expiresAt: { lte: new Date() } } } }
          ],
          NOT: {
            userId: {
              in: processedIds
            }
          }
        },
        take: BATCH_SIZE,
        select: { userId: true }
      })

      if (usersBatch.length === 0) {
        hasMore = false
        break
      }

      // Process current batch
      const results = await Promise.allSettled(
        usersBatch.map(user => refreshUserAnalysis(user.userId))
      )

      // Update counts
      successCount += results.filter(r => r.status === "fulfilled" && r.value).length
      failCount += results.filter(r => r.status === "rejected" || (r.status === "fulfilled" && !r.value)).length
      processedCount += usersBatch.length

      await markUsersAsProcessed(jobId, usersBatch.map(u => u.userId))

      console.log(`Processed batch: ${processedCount}/${totalUsers} (${Math.round(processedCount/totalUsers*100)}%)`)

      // Check if we're approaching time limit
      if ((Date.now() - startTime) > (maxDuration * 1000 - TIME_BUFFER_MS)) {
        console.log(`Approaching time limit, stopping after current batch`)
        break
      }
    }

    const completionTime = Date.now()
    const durationSeconds = (completionTime - startTime) / 1000

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount}/${totalUsers} users in ${durationSeconds.toFixed(1)}s. Success: ${successCount}, Failed: ${failCount}`,
      completed: processedCount === totalUsers,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error in refresh-ai-analysis cron:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

