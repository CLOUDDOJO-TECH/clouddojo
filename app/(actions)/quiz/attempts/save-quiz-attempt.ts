"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { QuizWithRelations } from "../../../dashboard/practice/types";
import { triggerQuizAnalysis } from "@/app/(actions)/ai-analysis/trigger-quiz-analysis";
import { recordUserActivity } from "@/lib/gamification/record-activity";

interface SaveQuizAttemptParams {
  quiz: QuizWithRelations;
  answers: Record<string, string[]>;
  timeTaken: number;
  score: number;
}

export async function SaveQuizAttempt({ quiz, answers, timeTaken, score }: SaveQuizAttemptParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    let user = await prisma.user.findUnique({
      where: { userId }
    });


    // if user is not found, we can't create a quiz attempt
    if (!user) {
      return {
        success: false,
        error: "User not found in database. Please complete your profile setup first."
      };
    }

    // Calculate percentage score
    const percentageScore = Math.round((score / quiz.questions.length) * 100);

    // Create the quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        totalScore: score,
        percentageScore,
        timeSpentSecs: timeTaken,
        completedAt: new Date(),
        questions: {
          create: quiz.questions.map(question => {
            const userAnswer = answers[question.id] || [];
            const isCorrect = 
              userAnswer.length === question.correctAnswer.length &&
              userAnswer.every(ans => question.correctAnswer.includes(ans));

            return {
              questionId: question.id,
              userAnswer: userAnswer.join(','),
              isCorrect,
              timeSpentSecs: Math.floor(timeTaken / quiz.questions.length), // Approximate time per question
              difficultyLevel: question.difficultyLevel || 'BEGINER',
              categoryId: question.categoryId,
              awsService: question.awsService
            };
          })
        }
      }
    });

    // Update UserProgress
    // First check if a record already exists
    const existingProgress = await prisma.userProgress.findFirst({
      where: {
        userId,
        quizId: quiz.id
      }
    });

    if (existingProgress) {
      // Update existing progress
      await prisma.userProgress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          score: Math.max(existingProgress.score, score), // Keep highest score
          completedAt: new Date(),
          timeTaken: timeTaken, 
          attempts: {
            increment: 1
          }
        }
      });
    } else {
      // Create new progress record
      await prisma.userProgress.create({
        data: {
          userId,
          quizId: quiz.id,
          score,
          completedAt: new Date(),
          timeTaken: timeTaken,
          attempts: 1
        }
      });
    }

    // Trigger AI analysis in background (non-blocking)
    try {
      await triggerQuizAnalysis(quizAttempt.id);
    } catch (analysisError) {
      // Don't fail quiz save if analysis trigger fails
      console.error("Failed to trigger AI analysis:", analysisError);
    }

    // Record gamification activity (streaks, XP, daily goals)
    try {
      // Calculate XP based on performance
      const baseXP = 10; // Base XP per quiz
      const bonusXP = Math.floor((percentageScore / 100) * 20); // Up to 20 bonus XP for perfect score
      const totalXP = baseXP + bonusXP;

      await recordUserActivity({
        userId,
        type: "quiz",
        xpAwarded: totalXP,
        metadata: {
          quizId: quiz.id,
          questionsAnswered: quiz.questions.length,
          timeTaken,
        },
      });
    } catch (gamificationError) {
      // Don't fail quiz save if gamification fails
      console.error("Failed to record gamification activity:", gamificationError);
    }

    return {
      success: true,
      data: quizAttempt
    };
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
} 