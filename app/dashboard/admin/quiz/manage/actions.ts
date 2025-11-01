"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export interface QuizListItem {
  id: string;
  title: string;
  description: string | null;
  providers: string[];
  isPublic: boolean;
  free: boolean | null;
  level: string | null;
  duration: number | null;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    questions: number;
    attempts: number;
  };
}

/**
 * Fetch all quizzes with question counts
 */
export async function getAllQuizzes(): Promise<QuizListItem[]> {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw new Error("Failed to fetch quizzes");
  }
}

/**
 * Get a single quiz by ID with all questions and options
 */
export async function getQuizById(quizId: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!quiz) {
      return { success: false, error: "Quiz not found" };
    }

    return { success: true, quiz };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return { success: false, error: "Failed to fetch quiz" };
  }
}

/**
 * Delete a quiz by ID
 */
export async function deleteQuiz(quizId: string) {
  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return { success: true, message: "Quiz deleted successfully" };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return { success: false, error: "Failed to delete quiz" };
  }
}

/**
 * Toggle quiz public/private status
 */
export async function toggleQuizVisibility(quizId: string, isPublic: boolean) {
  try {
    await prisma.quiz.update({
      where: { id: quizId },
      data: { isPublic },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return {
      success: true,
      message: `Quiz ${isPublic ? "published" : "unpublished"} successfully`,
    };
  } catch (error) {
    console.error("Error toggling quiz visibility:", error);
    return { success: false, error: "Failed to update quiz visibility" };
  }
}

/**
 * Toggle quiz free/premium status
 */
export async function toggleQuizAccess(quizId: string, free: boolean) {
  try {
    await prisma.quiz.update({
      where: { id: quizId },
      data: { free },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return {
      success: true,
      message: `Quiz access updated to ${free ? "Free" : "Premium"}`,
    };
  } catch (error) {
    console.error("Error toggling quiz access:", error);
    return { success: false, error: "Failed to update quiz access" };
  }
}

/**
 * Duplicate a quiz
 */
export async function duplicateQuiz(quizId: string) {
  try {
    const originalQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!originalQuiz) {
      return { success: false, error: "Quiz not found" };
    }

    // Create new quiz with questions
    const newQuiz = await prisma.quiz.create({
      data: {
        title: `${originalQuiz.title} (Copy)`,
        description: originalQuiz.description,
        providers: originalQuiz.providers,
        isPublic: false, // Set to private by default
        free: originalQuiz.free,
        level: originalQuiz.level,
        duration: originalQuiz.duration,
        thumbnail: originalQuiz.thumbnail,
        categoryId: originalQuiz.categoryId,
        questions: {
          create: originalQuiz.questions.map((question) => ({
            content: question.content,
            isMultiSelect: question.isMultiSelect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            categoryId: question.categoryId,
            difficultyLevel: question.difficultyLevel,
            awsService: question.awsService,
            options: {
              create: question.options.map((option) => ({
                content: option.content,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return {
      success: true,
      message: "Quiz duplicated successfully",
      quizId: newQuiz.id,
    };
  } catch (error) {
    console.error("Error duplicating quiz:", error);
    return { success: false, error: "Failed to duplicate quiz" };
  }
}

/**
 * Bulk delete quizzes
 */
export async function bulkDeleteQuizzes(quizIds: string[]) {
  try {
    await prisma.quiz.deleteMany({
      where: {
        id: {
          in: quizIds,
        },
      },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return {
      success: true,
      message: `${quizIds.length} quiz(zes) deleted successfully`,
    };
  } catch (error) {
    console.error("Error bulk deleting quizzes:", error);
    return { success: false, error: "Failed to delete quizzes" };
  }
}

/**
 * Bulk update quiz visibility
 */
export async function bulkUpdateVisibility(
  quizIds: string[],
  isPublic: boolean,
) {
  try {
    await prisma.quiz.updateMany({
      where: {
        id: {
          in: quizIds,
        },
      },
      data: { isPublic },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return {
      success: true,
      message: `${quizIds.length} quiz(zes) ${isPublic ? "published" : "unpublished"}`,
    };
  } catch (error) {
    console.error("Error bulk updating visibility:", error);
    return { success: false, error: "Failed to update quiz visibility" };
  }
}

/**
 * Bulk update quiz access
 */
export async function bulkUpdateAccess(quizIds: string[], free: boolean) {
  try {
    await prisma.quiz.updateMany({
      where: {
        id: {
          in: quizIds,
        },
      },
      data: { free },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    return {
      success: true,
      message: `${quizIds.length} quiz(zes) set to ${free ? "Free" : "Premium"}`,
    };
  } catch (error) {
    console.error("Error bulk updating access:", error);
    return { success: false, error: "Failed to update quiz access" };
  }
}

/**
 * Update quiz metadata and questions
 */
export async function updateQuiz(
  quizId: string,
  data: {
    title: string;
    description: string;
    providers: string[];
    isPublic: boolean;
    free: boolean;
    level: string;
    duration: number;
    thumbnail?: string;
    questions: Array<{
      id?: string; // Existing question ID
      content: string;
      isMultiSelect: boolean;
      correctAnswer: string[];
      explanation: string | null;
      options: Array<{
        id?: string; // Existing option ID
        content: string;
        isCorrect: boolean;
      }>;
    }>;
  },
) {
  try {
    // Get existing quiz with questions
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return { success: false, error: "Quiz not found" };
    }

    // Delete all existing questions and their options (cascade will handle options)
    await prisma.question.deleteMany({
      where: { quizId },
    });

    // Update quiz with new questions
    await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: data.title,
        description: data.description,
        providers: data.providers,
        isPublic: data.isPublic,
        free: data.free,
        level: data.level as any,
        duration: data.duration,
        thumbnail: data.thumbnail,
        questions: {
          create: data.questions.map((question) => ({
            content: question.content,
            isMultiSelect: question.isMultiSelect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            options: {
              create: question.options.map((option) => ({
                content: option.content,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/dashboard/admin/quiz/manage");
    revalidatePath(`/dashboard/admin/quiz/edit/${quizId}`);
    revalidatePath(`/dashboard/admin/quiz/preview/${quizId}`);

    return { success: true, message: "Quiz updated successfully" };
  } catch (error) {
    console.error("Error updating quiz:", error);
    return { success: false, error: "Failed to update quiz" };
  }
}
