"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { QuizWithRelations } from "../../../dashboard/practice/types";

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