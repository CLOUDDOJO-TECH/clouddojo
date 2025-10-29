import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const projectsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

/**
 * GET /api/project-categories/[slug]/projects
 * Fetches all projects for a specific category
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = params;

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const { search, page, limit } = projectsQuerySchema.parse(queryData);

    // First, verify the category exists
    const category = await prisma.projectCategory.findUnique({
      where: { slug }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Build where conditions for projects
    const projectWhere: any = {
      isPublished: true
    };

    // Add search filter if provided
    if (search) {
      projectWhere.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          keyTechnologies: {
            hasSome: [search]
          }
        }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get projects in this category with user progress
    const [projectAssignments, totalCount] = await Promise.all([
      prisma.projectCategoryAssignment.findMany({
        where: {
          projectCategoryId: category.id,
          project: projectWhere
        },
        include: {
          project: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  description: true
                }
              },
              userProgresses: {
                where: {
                  userId: userId
                },
                select: {
                  id: true,
                  status: true,
                  currentStep: true,
                  completedSteps: true,
                  startedAt: true,
                  completedAt: true,
                  timeSpent: true
                }
              },
              _count: {
                select: {
                  steps: true,
                  userProgresses: {
                    where: {
                      status: 'COMPLETED'
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          project: {
            createdAt: 'desc'
          }
        },
        skip,
        take: limit
      }),
      prisma.projectCategoryAssignment.count({
        where: {
          projectCategoryId: category.id,
          project: projectWhere
        }
      })
    ]);

    // Transform projects to include user progress status
    const transformedProjects = projectAssignments.map(assignment => {
      const project = assignment.project;
      const userProgress = project.userProgresses[0];

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
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
        userProgress: userProgress ? {
          status: userProgress.status,
          currentStep: userProgress.currentStep,
          completedSteps: userProgress.completedSteps,
          progressPercentage: Math.round((userProgress.completedSteps.length / project._count.steps) * 100),
          startedAt: userProgress.startedAt,
          completedAt: userProgress.completedAt,
          timeSpent: userProgress.timeSpent
        } : null
      };
    });

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl
      },
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching projects by category:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
