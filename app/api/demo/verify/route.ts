import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/demo/verify
 * Verifies user's answer for a demo question
 *
 * Body:
 * - questionId: string
 * - selectedOptionIds: string[]
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, selectedOptionIds } = body;

    if (!questionId || !selectedOptionIds || !Array.isArray(selectedOptionIds)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request. questionId and selectedOptionIds are required",
        },
        { status: 400 }
      );
    }

    // Fetch the question with its options
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: "Question not found",
        },
        { status: 404 }
      );
    }

    // Get correct option IDs
    const correctOptionIds = question.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id)
      .sort();

    // Sort user's selected options for comparison
    const sortedSelectedIds = [...selectedOptionIds].sort();

    // Check if answer is correct
    const isCorrect =
      correctOptionIds.length === sortedSelectedIds.length &&
      correctOptionIds.every((id, index) => id === sortedSelectedIds[index]);

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        correctOptionIds,
        explanation: question.explanation,
      },
    });
  } catch (error) {
    console.error("Error verifying answer:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify answer",
      },
      { status: 500 }
    );
  }
}
