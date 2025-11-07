"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CompleteProject, CreateProjectResult } from "./validators";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

/**
 * Create a complete project with all steps and categories in a single transaction
 */
export async function createProject(
  data: CompleteProject,
): Promise<CreateProjectResult> {
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

    // Validate inputs
    if (!data.title || data.title.trim() === "") {
      return {
        success: false,
        error: "Project title is required",
      };
    }

    if (!data.steps || data.steps.length === 0) {
      return {
        success: false,
        error: "At least one step is required",
      };
    }

    // Validate step numbers are unique
    const stepNumbers = data.steps.map((step) => step.stepNumber);
    const duplicates = stepNumbers.filter(
      (num, index) => stepNumbers.indexOf(num) !== index,
    );
    if (duplicates.length > 0) {
      return {
        success: false,
        error: `Duplicate step numbers found: ${duplicates.join(", ")}. Each step must have a unique step number.`,
      };
    }

    // Create project with all related data in a transaction
    const project = await prisma.$transaction(async (tx) => {
      // Handle new categories first
      const categoryIdsToAssign = [...data.categoryIds];

      if (data.newCategories && data.newCategories.length > 0) {
        for (const newCat of data.newCategories) {
          const createdCategory = await tx.projectCategory.create({
            data: {
              name: newCat.name,
              slug: newCat.slug,
              description: newCat.description || null,
              imageUrl: newCat.imageUrl || null,
              sortOrder: newCat.sortOrder,
            },
          });
          categoryIdsToAssign.push(createdCategory.id);
        }
      }

      // Create the project
      const createdProject = await tx.project.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          projectType: data.projectType,
          difficulty: data.difficulty,
          estimatedTime: data.estimatedTime,
          estimatedCost: data.estimatedCost,
          thumbnailUrl: data.thumbnailUrl?.trim() || null,
          videoUrl: data.videoUrl?.trim() || null,
          prerequisites: data.prerequisites,
          learningObjectives: data.learningObjectives,
          keyTechnologies: data.keyTechnologies,
          isPremium: data.isPremium,
          isPublished: data.isPublished,
        },
      });

      // Create project steps
      for (const step of data.steps) {
        await tx.projectStep.create({
          data: {
            projectId: createdProject.id,
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description || null,
            instructions: step.instructions,
            expectedOutput: step.expectedOutput || null,
            validationCriteria: step.validationCriteria || [],
            mediaUrls: step.mediaUrls || [],
            estimatedTime: step.estimatedTime,
            stepType: step.stepType,
            isOptional: step.isOptional,
          },
        });
      }

      // Create category assignments
      for (const categoryId of categoryIdsToAssign) {
        await tx.projectCategoryAssignment.create({
          data: {
            projectId: createdProject.id,
            projectCategoryId: categoryId,
          },
        });
      }

      return createdProject;
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/labs");
    revalidatePath("/dashboard/admin/projects");

    return {
      success: true,
      projectId: project.id,
      message: `Project "${project.title}" created successfully with ${data.steps.length} steps!`,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the project",
    };
  }
}

/**
 * Get all project categories
 */
export async function getProjectCategories() {
  try {
    const categories = await prisma.projectCategory.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        sortOrder: true,
      },
    });

    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error("Error fetching project categories:", error);
    return {
      success: false,
      categories: [],
      error: "Failed to fetch categories",
    };
  }
}

/**
 * Zod schema for AI-generated project metadata
 */
const aiProjectMetadataSchema = z.object({
  title: z
    .string()
    .describe("A clear, descriptive title for the project (5-15 words)"),
  description: z
    .string()
    .describe(
      "A comprehensive 100-300 word description in Markdown format. Use headings (###), bold (**text**), and bullet lists. Structure: ### Overview (brief intro), ### Key Features (bullet list), ### What You'll Build (specifics), ### Target Audience (who it's for).",
    ),
  difficulty: z
    .enum(["BEGINER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
    .describe("Estimated difficulty level based on complexity"),
  estimatedTime: z
    .number()
    .describe("Total estimated time in minutes to complete the entire project"),
  estimatedCost: z
    .number()
    .describe("Estimated AWS/cloud cost in cents (0 for free projects)"),
  projectType: z
    .enum(["TUTORIAL", "CHALLENGE", "ASSESSMENT", "CAPSTONE"])
    .describe(
      "TUTORIAL for step-by-step guidance, CHALLENGE for problem-solving, ASSESSMENT for testing knowledge, CAPSTONE for comprehensive projects",
    ),
});

/**
 * Generate project metadata using AI based on a brief outline
 */
export async function generateProjectMetadata(outline: string): Promise<{
  success: boolean;
  metadata?: {
    title: string;
    description: string;
    difficulty: "BEGINER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    estimatedTime: number;
    estimatedCost: number;
    projectType: "TUTORIAL" | "CHALLENGE" | "ASSESSMENT" | "CAPSTONE";
  };
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

    if (!outline || outline.trim().length < 20) {
      return {
        success: false,
        error: "Outline must be at least 20 characters",
      };
    }

    // Call AI to generate structured metadata
    const { object: aiMetadata } = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      schema: aiProjectMetadataSchema,
      prompt: `You are a cloud architecture and DevOps project designer. Analyze the following project outline and generate comprehensive project metadata.

**Project Outline:**
${outline}

**Instructions:**

1. **Title**: Create a clear, action-oriented title (e.g., "Build a Serverless API with AWS Lambda")

2. **Description** (CRITICAL - 100-300 words in Markdown format):
   Write a professional, well-structured description using Markdown:

   ### Overview
   [2-3 sentences introducing the project and its real-world application]

   ### Key Features
   - Feature 1 (specific technical detail)
   - Feature 2 (specific technical detail)
   - Feature 3 (specific technical detail)

   ### What You'll Build
   [Concrete description of the end result/deliverable]

   ### Target Audience
   [Who this project is designed for, required experience level]

   Use bold (**text**) for emphasis and proper Markdown headings (###).

3. **Difficulty**: Assess complexity based on:
   - BEGINER: Basic cloud concepts, simple configurations
   - INTERMEDIATE: Multiple services, some architecture decisions
   - ADVANCED: Complex integrations, performance optimization
   - EXPERT: Enterprise-level architecture, advanced patterns

4. **Estimated Time**: Calculate realistic completion time in minutes

5. **Estimated Cost**: AWS/cloud costs in cents (be realistic, use 0 for free-tier eligible)

6. **Project Type**:
   - TUTORIAL: Step-by-step learning with guidance
   - CHALLENGE: Problem to solve with minimal guidance
   - ASSESSMENT: Test existing knowledge
   - CAPSTONE: Comprehensive, real-world application

Ensure the description is engaging, professional, and uses proper Markdown formatting.`,
    });

    return {
      success: true,
      metadata: {
        title: aiMetadata.title,
        description: aiMetadata.description,
        difficulty: aiMetadata.difficulty,
        estimatedTime: aiMetadata.estimatedTime,
        estimatedCost: aiMetadata.estimatedCost,
        projectType: aiMetadata.projectType,
      },
    };
  } catch (error) {
    console.error("Error generating project metadata:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate metadata",
    };
  }
}

/**
 * Get a project by ID (for editing)
 */
export async function getProjectById(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
        projectCategoryAssignments: {
          include: {
            projectCategory: true,
          },
        },
      },
    });

    return {
      success: true,
      project,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      project: null,
      error: "Failed to fetch project",
    };
  }
}
