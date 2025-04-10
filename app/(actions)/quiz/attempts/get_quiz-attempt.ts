"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetuQizAttempt({ attemptId }: { attemptId: string }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    let user = await prisma.user.findUnique({
      where: { userId },
    });

    // if user is not found, we can't create a quiz attempt
    if (!user) {
      return {
        success: false,
        error:
          "User not found in database. Please complete your profile setup first.",
      };
    }
    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: {
        id: attemptId,
      },
      include: {
        questions: {
          include: {
            question: {
              select: {
                content: true,
                explanation: true,
                isMultiSelect: true,
                options: true
              }
            },
          },
        },
        quiz: true,
        category: true,
      },
    });

    return {
      success: true,
      data: quizAttempt,
    };
  } catch (error) {
    console.error("Error saving quiz attempt:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
