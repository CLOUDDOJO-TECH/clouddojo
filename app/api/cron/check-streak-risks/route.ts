import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/emails/send-email";

/**
 * Cron job to detect users at risk of losing their streak
 * Should be called once per day (recommended: 6 PM user's timezone)
 *
 * Vercel Cron: Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-streak-risks",
 *     "schedule": "0 18 * * *"
 *   }]
 * }
 *
 * Or use external cron service (cron-job.org, etc.)
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron authorization (Vercel sends this header)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Find all users with active streaks who haven't completed activity today
    const usersAtRisk = await prisma.userStreak.findMany({
      where: {
        currentStreak: {
          gte: 3, // Only notify users with streak >= 3 days
        },
        lastActivityAt: {
          lt: today, // Last activity was before today
        },
      },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            firstName: true,
            gamificationSettings: {
              select: {
                streakReminders: true,
              },
            },
          },
        },
      },
    });

    const notifications = [];

    for (const userStreak of usersAtRisk) {
      const { user, currentStreak, streakFreezes } = userStreak;

      // Check if user has enabled streak reminders
      const hasRemindersEnabled = user.gamificationSettings?.streakReminders ?? true; // Default true

      if (!hasRemindersEnabled) {
        continue; // Skip users who disabled reminders
      }

      // Check if user has activity for yesterday (still safe)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastActivity = new Date(userStreak.lastActivityAt);
      lastActivity.setHours(0, 0, 0, 0);

      const isYesterday = lastActivity.getTime() === yesterday.getTime();

      if (isYesterday) {
        // User is at risk - send notification
        try {
          await sendEmail({
            to: user.email,
            subject: `🔥 Don't lose your ${currentStreak}-day streak!`,
            template: "streak-risk",
            data: {
              firstName: user.firstName,
              currentStreak,
              streakFreezes,
              dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            },
          });

          notifications.push({
            userId: user.userId,
            email: user.email,
            currentStreak,
            status: "sent",
          });
        } catch (emailError) {
          console.error(`Failed to send streak risk email to ${user.email}:`, emailError);
          notifications.push({
            userId: user.userId,
            email: user.email,
            currentStreak,
            status: "failed",
            error: emailError instanceof Error ? emailError.message : "Unknown error",
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      checked: usersAtRisk.length,
      notificationsSent: notifications.filter((n) => n.status === "sent").length,
      notificationsFailed: notifications.filter((n) => n.status === "failed").length,
      details: notifications,
    });
  } catch (error) {
    console.error("Error checking streak risks:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
