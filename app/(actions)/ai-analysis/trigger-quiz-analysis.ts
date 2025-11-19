/**
 * Trigger Quiz Analysis
 *
 * Server action to initiate AI analysis for a completed quiz.
 * This sends an event to Inngest which handles the analysis asynchronously.
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";

export async function triggerQuizAnalysis(quizAttemptId: string) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Verify the quiz attempt exists and belongs to the user
    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: { id: quizAttemptId },
      select: {
        id: true,
        userId: true,
        completedAt: true,
      },
    });

    if (!quizAttempt) {
      return {
        success: false,
        error: "Quiz attempt not found",
      };
    }

    if (quizAttempt.userId !== userId) {
      return {
        success: false,
        error: "Unauthorized - quiz attempt belongs to another user",
      };
    }

    if (!quizAttempt.completedAt) {
      return {
        success: false,
        error: "Quiz is not yet completed",
      };
    }

    // Check if analysis already exists
    const existingAnalysis = await prisma.quizAnalysis.findUnique({
      where: { quizAttemptId },
      select: { id: true, status: true },
    });

    if (existingAnalysis && existingAnalysis.status === "completed") {
      return {
        success: true,
        alreadyExists: true,
        message: "Analysis already completed",
        analysisId: existingAnalysis.id,
      };
    }

    if (
      existingAnalysis &&
      (existingAnalysis.status === "pending" || existingAnalysis.status === "processing")
    ) {
      return {
        success: true,
        alreadyExists: true,
        message: "Analysis is already in progress",
        analysisId: existingAnalysis.id,
      };
    }

    // Send event to Inngest to trigger analysis
    await inngest.send({
      name: "quiz/completed",
      data: {
        userId,
        quizAttemptId,
      },
    });

    console.log(`[Trigger] Sent quiz/completed event for ${quizAttemptId}`);

    return {
      success: true,
      message: "Analysis started",
      estimatedTime: "30-60 seconds",
    };
  } catch (error) {
    console.error("[Trigger] Error triggering quiz analysis:", error);

    return {
      success: false,
      error: "Failed to trigger analysis",
    };
  }
}
