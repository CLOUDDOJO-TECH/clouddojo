"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { QuizMetadata, ParsedQuestion } from "./validators";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

interface CreateQuizResult {
  success: boolean;
  quizId?: string;
  error?: string;
  message?: string;
}

/**
 * Create a quiz with all questions in a single transaction
 * This ensures atomic creation - if any question fails, the entire quiz is rolled back
 */
export async function createQuizFromJSON(
  metadata: QuizMetadata,
  questions: ParsedQuestion[],
): Promise<CreateQuizResult> {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized. Please sign in.",
      };
    }

    // Verify user is admin (you can add role check here)
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return {
        success: false,
        error: "Unauthorized. Admin access required.",
      };
    }

    // Validate inputs
    if (!metadata.title || metadata.title.trim() === "") {
      return {
        success: false,
        error: "Quiz title is required",
      };
    }

    if (!questions || questions.length === 0) {
      return {
        success: false,
        error: "At least one valid question is required",
      };
    }

    // Handle category
    let categoryId: string | null = null;

    if (metadata.categoryId) {
      // Use existing category
      categoryId = metadata.categoryId;
    } else if (metadata.categoryName && metadata.categoryName.trim() !== "") {
      // Create new category or find existing one
      const category = await prisma.category.upsert({
        where: { name: metadata.categoryName.trim() },
        update: {},
        create: {
          name: metadata.categoryName.trim(),
          description: `Questions related to ${metadata.categoryName.trim()}`,
        },
      });
      categoryId = category.id;
    }

    // Create quiz with all questions in a transaction
    const quiz = await prisma.$transaction(
      async (tx) => {
        // Create the quiz
        const createdQuiz = await tx.quiz.create({
          data: {
            title: metadata.title.trim(),
            description: metadata.description?.trim() || null,
            providers: metadata.providers || [],
            duration: metadata.duration,
            level: metadata.level,
            free: metadata.free,
            isPublic: metadata.isPublic,
            isNew: metadata.isNew,
            thumbnail: metadata.thumbnail || null,
            categoryId: categoryId,
          },
        });

        // Create all questions with their options
        for (const question of questions) {
          await tx.question.create({
            data: {
              quizId: createdQuiz.id,
              content: question.content,
              isMultiSelect: question.isMultiSelect,
              correctAnswer: question.correctAnswers,
              explanation: question.explanation || "",
              difficultyLevel: question.difficultyLevel || "Medium",
              awsService: question.awsService || null,
              categoryId: categoryId,
              options: {
                create: question.options.map((option) => ({
                  content: option.content,
                  isCorrect: option.isCorrect,
                })),
              },
            },
          });
        }

        return createdQuiz;
      },
      {
        maxWait: 10000, // Maximum time to wait for a transaction to start (10 seconds)
        timeout: 20000, // Maximum time for the transaction to complete (20 seconds)
      },
    );

    // Revalidate relevant paths
    revalidatePath("/dashboard/practice");
    revalidatePath("/dashboard/admin");

    return {
      success: true,
      quizId: quiz.id,
      message: `Quiz "${quiz.title}" created successfully with ${questions.length} questions!`,
    };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the quiz",
    };
  }
}

/**
 * Get all categories for dropdown selection
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Get quiz details for preview after creation
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
        },
        category: true,
      },
    });

    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
}

/**
 * Zod schema for AI-generated quiz metadata
 */
const aiQuizMetadataSchema = z.object({
  title: z.string().describe("A descriptive, engaging title for the quiz"),
  description: z
    .string()
    .describe(
      "A comprehensive 50-125 word description in Markdown format. Use headings (###), bold (**text**), italic (*text*), and bullet lists. Structure: ### Overview (brief intro), ### Focus Areas (bullet list of topics with bold categories), ### Target Audience (who it's for). Be specific about services and concepts covered.",
    ),
  providers: z
    .array(z.string())
    .describe(
      "Array of cloud providers or platforms covered (e.g., ['AWS', 'Kubernetes']). Detect from question content, AWS services, and technologies mentioned. Common values: AWS, Azure, GCP, Kubernetes, Docker, Terraform, Ansible, Jenkins.",
    ),
  duration: z
    .number()
    .describe(
      "Estimated duration in minutes (calculate: 1.5 minutes per question for beginner/intermediate, 2 minutes for advanced/expert)",
    ),
  level: z
    .enum(["BEGINER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
    .describe("Difficulty level based on the question difficulty"),
  categoryName: z
    .string()
    .describe(
      "A suitable category name (e.g., 'AWS Solutions Architect', 'AWS Cloud Practitioner', 'Kubernetes Fundamentals')",
    ),
  free: z
    .boolean()
    .default(true)
    .describe("Whether the quiz is free to access"),
  isPublic: z
    .boolean()
    .default(true)
    .describe("Whether the quiz is publicly visible"),
  isNew: z.boolean().default(true).describe("Whether to show a 'New' badge"),
});

/**
 * Generate quiz metadata using AI based on the questions
 */
export async function generateQuizMetadata(
  questions: ParsedQuestion[],
): Promise<{
  success: boolean;
  metadata?: Partial<QuizMetadata>;
  error?: string;
}> {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized. Please sign in.",
      };
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return {
        success: false,
        error: "Unauthorized. Admin access required.",
      };
    }

    if (!questions || questions.length === 0) {
      return {
        success: false,
        error: "No questions provided",
      };
    }

    // Prepare questions summary for AI (first 10 questions to avoid token limits)
    const questionsSummary = questions.slice(0, 10).map((q, index) => ({
      number: index + 1,
      question: q.content.substring(0, 150), // Limit length
      awsService: q.awsService,
      difficulty: q.difficultyLevel,
    }));

    const totalQuestions = questions.length;
    const multiSelectCount = questions.filter((q) => q.isMultiSelect).length;
    const awsServices = [
      ...new Set(questions.map((q) => q.awsService).filter(Boolean)),
    ];
    const difficulties = [
      ...new Set(questions.map((q) => q.difficultyLevel).filter(Boolean)),
    ];

    // Call AI to generate structured metadata using generateObject
    const { object: aiMetadata } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: aiQuizMetadataSchema,
      prompt: `You are a cloud certification quiz analyzer. Analyze the following quiz questions and generate comprehensive quiz metadata.

**Quiz Statistics:**
- Total questions: ${totalQuestions}
- Multi-select questions: ${multiSelectCount}
- Services/Technologies covered: ${awsServices.join(", ") || "General"}
- Difficulty levels: ${difficulties.join(", ") || "Mixed"}

**Sample Questions:**
${questionsSummary.map((q) => `${q.number}. ${q.question}${q.awsService ? ` (${q.awsService})` : ""}`).join("\n")}

**Instructions:**

1. **Title**: Create a descriptive, engaging title that reflects the quiz content and certification focus

2. **Description** (CRITICAL - 50-125 words in Markdown format):
   Write a professional, well-structured description using Markdown:

   ### Overview
   [2-3 sentences introducing the quiz and its purpose]

   ### Focus Areas
   - **Category 1**: Specific topics (e.g., **Compute**: EC2, Lambda, ECS)
   - **Category 2**: Specific topics (e.g., **Storage**: S3, EBS, EFS)
   - **Category 3**: Specific topics

   ### Target Audience
   [Who this quiz is designed for, certification level, experience needed]

   Use bold (**text**) for emphasis and proper Markdown headings (###).

3. **Providers**: Detect all cloud providers/platforms from questions (AWS, Azure, GCP, Kubernetes, Docker, Terraform, etc.)

4. **Duration**: Calculate based on difficulty (1.5 min/question for beginner/intermediate, 2 min for advanced/expert)

5. **Level**: Determine appropriate difficulty based on question complexity

6. **Category**: Suggest suitable category based on certification or topic area

Do NOT include any thumbnail information.`,
    });

    // Validate and sanitize the metadata
    const metadata: Partial<QuizMetadata> = {
      title: aiMetadata.title,
      description: aiMetadata.description,
      providers: aiMetadata.providers,
      duration: aiMetadata.duration,
      level: aiMetadata.level,
      categoryName: aiMetadata.categoryName,
      free: aiMetadata.free,
      isPublic: aiMetadata.isPublic,
      isNew: aiMetadata.isNew,
    };

    // Validate description word count (50-125 words)
    const wordCount = metadata.description?.trim().split(/\s+/).length || 0;
    if (wordCount < 50 || wordCount > 125) {
      console.warn(
        `AI generated description with ${wordCount} words (expected 50-125)`,
      );
    }

    return {
      success: true,
      metadata,
    };
  } catch (error) {
    console.error("Error generating quiz metadata:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate metadata",
    };
  }
}
