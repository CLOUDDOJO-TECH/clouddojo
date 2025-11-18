import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/demo/questions
 * Fetches sample questions for the demo page (no auth required)
 *
 * Query params:
 * - provider: AWS, Azure, GCP, etc. (optional - defaults to AWS)
 * - limit: number of questions (default: 10, max: 15)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get("provider") || "AWS";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam), 15) : 10;

    // Find public, free quizzes for the selected provider
    const quizzes = await prisma.quiz.findMany({
      where: {
        isPublic: true,
        free: true,
        providers: {
          has: provider,
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
          take: limit,
        },
        category: true,
      },
      take: 1, // Get one quiz
    });

    if (!quizzes || quizzes.length === 0) {
      // Fallback: Get any public quiz if no provider-specific quiz found
      const fallbackQuiz = await prisma.quiz.findFirst({
        where: {
          isPublic: true,
          free: true,
        },
        include: {
          questions: {
            include: {
              options: true,
            },
            take: limit,
          },
          category: true,
        },
      });

      if (!fallbackQuiz) {
        return NextResponse.json(
          {
            success: false,
            error: "No sample questions available at the moment",
          },
          { status: 404 }
        );
      }

      // Return fallback quiz
      return NextResponse.json({
        success: true,
        data: {
          quizTitle: fallbackQuiz.title,
          quizDescription: fallbackQuiz.description,
          provider: fallbackQuiz.providers[0] || "General",
          category: fallbackQuiz.category?.name || "General",
          questions: fallbackQuiz.questions.map((q) => ({
            id: q.id,
            content: q.content,
            isMultiSelect: q.isMultiSelect,
            options: q.options.map((opt) => ({
              id: opt.id,
              content: opt.content,
            })),
            explanation: q.explanation,
            awsService: q.awsService,
            difficultyLevel: q.difficultyLevel,
          })),
        },
      });
    }

    const quiz = quizzes[0];

    // Shuffle questions for variety
    const shuffledQuestions = quiz.questions
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        quizTitle: quiz.title,
        quizDescription: quiz.description,
        provider: provider,
        category: quiz.category?.name || "General",
        questions: shuffledQuestions.map((q) => ({
          id: q.id,
          content: q.content,
          isMultiSelect: q.isMultiSelect,
          options: q.options.map((opt) => ({
            id: opt.id,
            content: opt.content,
          })),
          explanation: q.explanation,
          awsService: q.awsService,
          difficultyLevel: q.difficultyLevel,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching demo questions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sample questions",
      },
      { status: 500 }
    );
  }
}
