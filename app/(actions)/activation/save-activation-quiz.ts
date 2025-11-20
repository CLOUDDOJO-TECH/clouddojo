"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { triggerQuizAnalysis } from "@/app/(actions)/ai-analysis/trigger-quiz-analysis";
import { recordUserActivity } from "@/lib/gamification/record-activity";
import type { ExperienceLevel, CloudPlatform } from "@/app/activation/types";

interface ActivationQuizData {
  questionIds: string[];
  answers: Array<{
    questionId: string;
    selectedOptionIds: string[];
  }>;
  score: number;
  certification: string;
  platform: CloudPlatform;
  experience: ExperienceLevel;
}

export async function saveActivationQuizAttempt(data: ActivationQuizData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to save quiz results",
      };
    }

    // Calculate correct count
    let correctCount = 0;
    for (const answer of data.answers) {
      const question = await prisma.question.findUnique({
        where: { id: answer.questionId },
        include: { options: true },
      });

      if (!question) continue;

      const correctIds = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id)
        .sort();

      const userIds = [...answer.selectedOptionIds].sort();

      const isCorrect =
        correctIds.length === userIds.length &&
        correctIds.every((id, i) => id === userIds[i]);

      if (isCorrect) correctCount++;
    }

    // Find or create a quiz to associate with (use first quiz for platform)
    const quiz = await prisma.quiz.findFirst({
      where: {
        providers: {
          has: data.platform,
        },
        isPublic: true,
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "No quiz found for this platform",
      };
    }

    // Create quiz attempt with activation flag
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        score: data.score,
        mode: "practice",
        startedAt: new Date(),
        completedAt: new Date(),

        // Store activation metadata
        // Note: We'll add these fields to schema if needed, or store in JSON
        // For now, using existing fields
      },
    });

    // Save individual question attempts
    await Promise.all(
      data.answers.map(async (answer) => {
        const question = await prisma.question.findUnique({
          where: { id: answer.questionId },
          include: { options: true },
        });

        if (!question) return;

        const correctIds = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.id)
          .sort();

        const userIds = [...answer.selectedOptionIds].sort();

        const isCorrect =
          correctIds.length === userIds.length &&
          correctIds.every((id, i) => id === userIds[i]);

        await prisma.questionAttempt.create({
          data: {
            quizAttemptId: quizAttempt.id,
            questionId: answer.questionId,
            selectedOptionIds: answer.selectedOptionIds,
            isCorrect,
          },
        });
      })
    );

    // Trigger AI analysis for this quiz attempt
    try {
      await triggerQuizAnalysis(quizAttempt.id);
    } catch (analysisError) {
      console.error("Failed to trigger AI analysis for activation quiz:", analysisError);
      // Don't fail the whole operation if analysis fails
    }

    // Record gamification activity (activation quiz counts for streaks/XP)
    try {
      const baseXP = 10;
      const bonusXP = Math.floor((data.score / 100) * 20);
      const totalXP = baseXP + bonusXP;

      await recordUserActivity({
        userId,
        type: "quiz",
        xpAwarded: totalXP,
        metadata: {
          quizId: quiz.id,
          questionsAnswered: data.questionIds.length,
        },
      });
    } catch (gamificationError) {
      console.error("Failed to record gamification activity for activation quiz:", gamificationError);
      // Don't fail the whole operation if gamification fails
    }

    return {
      success: true,
      data: {
        attemptId: quizAttempt.id,
        score: data.score,
        correctCount,
        totalQuestions: data.questionIds.length,
      },
    };
  } catch (error) {
    console.error("Error saving activation quiz:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save quiz results",
    };
  }
}
