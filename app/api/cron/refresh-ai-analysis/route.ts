import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { analyzeTestData } from "@/app/(actions)/ai-analysis/analyze-test-data"
import { addDays, addHours } from "date-fns"
import { sendAnalysisNotification } from "@/lib/emails/send-email"

export const runtime = "edge"
export const dynamic = "force-dynamic"
export const maxDuration = 300

async function refreshUserAnalysis(userId: string) {
  try {
    // Get user data for email notification
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        email: true,
        firstName: true,
        lastName: true
      }
    })

    if (!user?.email) {
      console.error(`No email found for user ${userId}`)
      return false
    }

    // Generate new analysis
    const analysisResult = await analyzeTestData()
    
    if (!analysisResult.success || !analysisResult.data) {
      console.error(`Failed to generate analysis for user ${userId}:`, analysisResult.error)
      return false
    }

    // Calculate next expiration (7 days from now)
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
        readinessScore: analysisResult.data.certificationReadiness
      })
    } catch (emailError) {
      console.error(`Failed to send email notification to user ${userId}:`, emailError)
      // Don't fail the whole process if email fails
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

    // Get all users with expired or soon-to-expire analysis
    const usersToUpdate = await prisma.user.findMany({
      where: {
        OR: [
          {
            aiAnalysisReports: {
              none: {} // Users with no reports
            }
          },
          {
            aiAnalysisReports: {
              some: {
                expiresAt: {
                  lte: new Date()
                }
              }
            }
          }
        ]
      },
      select: {
        userId: true
      }
    })

    // Process each user
    const results = await Promise.allSettled(
      usersToUpdate.map(user => refreshUserAnalysis(user.userId))
    )

    // Count successes and failures
    const successful = results.filter(r => r.status === "fulfilled" && r.value).length
    const failed = results.filter(r => r.status === "rejected" || (r.status === "fulfilled" && !r.value)).length

    return NextResponse.json({
      success: true,
      message: `Processed ${usersToUpdate.length} users. Success: ${successful}, Failed: ${failed}`,
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