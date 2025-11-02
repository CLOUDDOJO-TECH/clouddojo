"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth_utils";

export interface ProjectTableData {
  id: string;
  title: string;
  projectType: string;
  difficulty: string;
  isPublished: boolean;
  isPremium: boolean;
  estimatedTime: number;
  estimatedCost: number;
  stepsCount: number;
  categoriesCount: number;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllProjects() {
  try {
    await requireAdmin();

    const projects = await prisma.project.findMany({
      include: {
        steps: {
          select: {
            id: true,
          },
        },
        projectCategoryAssignments: {
          select: {
            id: true,
          },
        },
        userProgresses: {
          select: {
            userId: true,
          },
          distinct: ["userId"],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const projectsData: ProjectTableData[] = projects.map((project) => ({
      id: project.id,
      title: project.title,
      projectType: project.projectType,
      difficulty: project.difficulty,
      isPublished: project.isPublished,
      isPremium: project.isPremium,
      estimatedTime: project.estimatedTime,
      estimatedCost: project.estimatedCost,
      stepsCount: project.steps.length,
      categoriesCount: project.projectCategoryAssignments.length,
      userCount: project.userProgresses.length,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return {
      success: true,
      projects: projectsData,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error: "Failed to fetch projects",
      projects: [],
    };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await requireAdmin();

    await prisma.project.delete({
      where: { id: projectId },
    });

    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      error: "Failed to delete project",
    };
  }
}

export async function toggleProjectPublishStatus(projectId: string) {
  try {
    await requireAdmin();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { isPublished: true },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { isPublished: !project.isPublished },
    });

    return {
      success: true,
      message: updatedProject.isPublished
        ? "Project published successfully"
        : "Project unpublished successfully",
      isPublished: updatedProject.isPublished,
    };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return {
      success: false,
      error: "Failed to toggle publish status",
    };
  }
}

export async function bulkDeleteProjects(projectIds: string[]) {
  try {
    await requireAdmin();

    await prisma.project.deleteMany({
      where: {
        id: {
          in: projectIds,
        },
      },
    });

    return {
      success: true,
      message: `${projectIds.length} project(s) deleted successfully`,
    };
  } catch (error) {
    console.error("Error bulk deleting projects:", error);
    return {
      success: false,
      error: "Failed to delete projects",
    };
  }
}

export async function bulkPublishProjects(projectIds: string[]) {
  try {
    await requireAdmin();

    await prisma.project.updateMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      data: {
        isPublished: true,
      },
    });

    return {
      success: true,
      message: `${projectIds.length} project(s) published successfully`,
    };
  } catch (error) {
    console.error("Error bulk publishing projects:", error);
    return {
      success: false,
      error: "Failed to publish projects",
    };
  }
}

export async function bulkUnpublishProjects(projectIds: string[]) {
  try {
    await requireAdmin();

    await prisma.project.updateMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      data: {
        isPublished: false,
      },
    });

    return {
      success: true,
      message: `${projectIds.length} project(s) unpublished successfully`,
    };
  } catch (error) {
    console.error("Error bulk unpublishing projects:", error);
    return {
      success: false,
      error: "Failed to unpublish projects",
    };
  }
}

export async function duplicateProject(projectId: string) {
  try {
    await requireAdmin();

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        steps: true,
        projectCategoryAssignments: {
          include: {
            projectCategory: true,
          },
        },
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Create duplicate project
    const duplicatedProject = await prisma.project.create({
      data: {
        title: `${project.title} (Copy)`,
        description: project.description,
        difficulty: project.difficulty,
        estimatedTime: project.estimatedTime,
        estimatedCost: project.estimatedCost,
        thumbnailUrl: project.thumbnailUrl,
        videoUrl: project.videoUrl,
        prerequisites: project.prerequisites,
        learningObjectives: project.learningObjectives,
        keyTechnologies: project.keyTechnologies,
        isPremium: project.isPremium,
        isPublished: false, // Duplicates start as drafts
        projectType: project.projectType,
        steps: {
          create: project.steps.map((step) => ({
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description,
            instructions: step.instructions,
            expectedOutput: step.expectedOutput,
            validationCriteria: step.validationCriteria,
            mediaUrls: step.mediaUrls,
            estimatedTime: step.estimatedTime,
            stepType: step.stepType,
            isOptional: step.isOptional,
          })),
        },
        projectCategoryAssignments: {
          create: project.projectCategoryAssignments.map((assignment) => ({
            projectCategoryId: assignment.projectCategoryId,
          })),
        },
      },
    });

    return {
      success: true,
      message: "Project duplicated successfully",
      projectId: duplicatedProject.id,
    };
  } catch (error) {
    console.error("Error duplicating project:", error);
    return {
      success: false,
      error: "Failed to duplicate project",
    };
  }
}
