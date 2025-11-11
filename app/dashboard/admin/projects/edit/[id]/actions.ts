"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CompleteProject } from "../../create/validators";

export interface UpdateProjectResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update an existing project with all steps and categories
 */
export async function updateProject(
  projectId: string,
  data: CompleteProject,
): Promise<UpdateProjectResult> {
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
        error: "At least one project step is required",
      };
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Update project with all related data in a transaction
    await prisma.$transaction(
      async (tx) => {
        // Update main project
        await tx.project.update({
          where: { id: projectId },
          data: {
            title: data.title,
            description: data.description,
            projectType: data.projectType,
            difficulty: data.difficulty,
            estimatedTime: data.estimatedTime,
            estimatedCost: data.estimatedCost,
            isPremium: data.isPremium,
            prerequisites: data.prerequisites,
            learningObjectives: data.learningObjectives,
          },
        });

        // Delete existing steps
        await tx.projectStep.deleteMany({
          where: { projectId },
        });

        // Create new steps
        await tx.projectStep.createMany({
          data: data.steps.map((step, index) => ({
            projectId,
            title: step.title,
            description: step.description || "",
            order: index + 1,
          })),
        });

        // Delete existing category assignments
        await tx.projectCategoryAssignment.deleteMany({
          where: { projectId },
        });

        // Create new category assignments
        if (data.categoryIds && data.categoryIds.length > 0) {
          await tx.projectCategoryAssignment.createMany({
            data: data.categoryIds.map((categoryId) => ({
              projectId,
              categoryId,
            })),
          });
        }
      },
      {
        maxWait: 10000, // Maximum time to wait for a transaction to start (10 seconds)
        timeout: 20000, // Maximum time for the transaction to complete (20 seconds)
      },
    );

    // Revalidate paths
    revalidatePath("/dashboard/admin/projects/manage");
    revalidatePath(`/dashboard/admin/projects/edit/${projectId}`);
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      message: "Project updated successfully!",
    };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating the project",
    };
  }
}
