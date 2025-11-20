/**
 * Quiz Data Helpers
 *
 * Functions to fetch and format quiz data for analysis
 */

import { prisma } from "@/lib/prisma";

/**
 * Get quiz attempt data with all related information
 */
export async function getQuizAttemptData(quizAttemptId: string) {
  const quizAttempt = await prisma.quizAttempt.findUnique({
    where: { id: quizAttemptId },
    include: {
      quiz: {
        include: {
          category: true,
        },
      },
      questions: {
        include: {
          question: {
            include: {
              category: true,
              options: true,
            },
          },
        },
      },
      user: {
        include: {
          onboarding: true,
        },
      },
    },
  });

  if (!quizAttempt) {
    throw new Error(`Quiz attempt not found: ${quizAttemptId}`);
  }

  return quizAttempt;
}

/**
 * Format quiz data for AI analysis
 */
export function formatQuizDataForAI(quizAttempt: any) {
  return {
    quiz: {
      id: quizAttempt.quiz.id,
      name: quizAttempt.quiz.title,
      description: quizAttempt.quiz.description,
      category: quizAttempt.quiz.category?.name || "General",
    },
    user: {
      id: quizAttempt.user.userId,
      name: quizAttempt.user.firstName,
      experience: quizAttempt.user.onboarding?.experience || null,
      certifications: quizAttempt.user.onboarding?.certifications || [],
      focusArea: quizAttempt.user.onboarding?.focusArea || [],
    },
    attempt: {
      id: quizAttempt.id,
      totalScore: quizAttempt.totalScore,
      percentageScore: quizAttempt.percentageScore,
      timeSpentSecs: quizAttempt.timeSpentSecs,
      startedAt: quizAttempt.startedAt,
      completedAt: quizAttempt.completedAt,
    },
    questions: quizAttempt.questions.map((q: any) => ({
      id: q.question.id,
      text: q.question.content,
      category: q.question.category?.name || "General",
      difficulty: q.question.difficultyLevel || "BEGINNER",
      awsService: q.question.awsService || null,
      correctAnswer: q.question.correctAnswer,
      userAnswer: q.userAnswer,
      isCorrect: q.isCorrect,
      explanation: q.question.explanation || null,
      timeSpentSecs: q.timeSpentSecs || 0,
      options: q.question.options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    })),
  };
}
