"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Server action to fetch all project categories with project counts
 * This runs on the server and can directly access the database
 */
export async function getProjectCategories() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const categories = await prisma.projectCategory.findMany({
      include: {
        projects: {
          where: {
            project: {
              isPublished: true,
            },
          },
          select: {
            projectId: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // Transform to include project count
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      projectCount: category.projects.length,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching project categories:", error);
    throw new Error("Failed to fetch project categories");
  }
}

/**
 * Server action to fetch projects by category slug
 */
export async function getProjectsByCategory(
  slug: string,
  options?: {
    search?: string;
    page?: number;
    limit?: number;
  },
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { search, page = 1, limit = 20 } = options || {};

  try {
    // First, verify the category exists
    const category = await prisma.projectCategory.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    // Build where conditions for projects
    const projectWhere: any = {
      isPublished: true,
    };

    // Add search filter if provided
    if (search) {
      projectWhere.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          keyTechnologies: {
            hasSome: [search],
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get projects in this category with user progress
    const [projectAssignments, totalCount] = await Promise.all([
      prisma.projectCategoryAssignment.findMany({
        where: {
          projectCategoryId: category.id,
          project: projectWhere,
        },
        include: {
          project: {
            include: {
              projectCategoryAssignments: {
                include: {
                  projectCategory: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      description: true,
                    },
                  },
                },
              },
              userProgresses: {
                where: {
                  userId: userId,
                },
                select: {
                  id: true,
                  status: true,
                  currentStep: true,
                  completedSteps: true,
                  startedAt: true,
                  completedAt: true,
                  timeSpent: true,
                },
              },
              _count: {
                select: {
                  steps: true,
                  userProgresses: {
                    where: {
                      status: "COMPLETED",
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          project: {
            createdAt: "desc",
          },
        },
        skip,
        take: limit,
      }),
      prisma.projectCategoryAssignment.count({
        where: {
          projectCategoryId: category.id,
          project: projectWhere,
        },
      }),
    ]);

    // Transform projects to include user progress status
    const transformedProjects = projectAssignments.map((assignment) => {
      const project = assignment.project;
      const userProgress = project.userProgresses[0];

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        categories: project.projectCategoryAssignments.map(
          (a) => a.projectCategory,
        ),
        difficulty: project.difficulty,
        estimatedTime: project.estimatedTime,
        estimatedCost: project.estimatedCost,
        thumbnailUrl: project.thumbnailUrl,
        videoUrl: project.videoUrl,
        prerequisites: project.prerequisites,
        learningObjectives: project.learningObjectives,
        keyTechnologies: project.keyTechnologies,
        isPremium: project.isPremium,
        projectType: project.projectType,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        totalSteps: project._count.steps,
        completionCount: project._count.userProgresses,
        userProgress: userProgress
          ? {
              status: userProgress.status,
              currentStep: userProgress.currentStep,
              completedSteps: userProgress.completedSteps,
              progressPercentage: Math.round(
                (userProgress.completedSteps.length / project._count.steps) *
                  100,
              ),
              startedAt: userProgress.startedAt,
              completedAt: userProgress.completedAt,
              timeSpent: userProgress.timeSpent,
            }
          : null,
      };
    });

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
      },
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching projects by category:", error);
    throw new Error("Failed to fetch projects");
  }
}
