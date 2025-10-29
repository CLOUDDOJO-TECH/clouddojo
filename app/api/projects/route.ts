import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const projectsQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z
    .enum(["BEGINER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
    .optional(),
  projectType: z
    .enum(["TUTORIAL", "CHALLENGE", "ASSESSMENT", "CAPSTONE"])
    .optional(),
  isPremium: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const {
      category,
      difficulty,
      projectType,
      isPremium,
      search,
      page,
      limit,
    } = projectsQuerySchema.parse(queryData);

    // Build filter conditions
    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = {
        name: {
          contains: category,
          mode: "insensitive",
        },
      };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (isPremium !== undefined) {
      where.isPremium = isPremium;
    }

    if (search) {
      where.OR = [
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

    // Get projects with user progress
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
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
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    // Transform projects to include user progress status
    const transformedProjects = projects.map((project) => {
      const userProgress = project.userProgresses[0]; // User can only have one progress per project

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        categories: project.projectCategoryAssignments.map(
          (assignment) => assignment.projectCategory,
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

    return NextResponse.json({
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
