import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = id;

    // Get project with all related data
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        isPublished: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        steps: {
          orderBy: {
            stepNumber: 'asc'
          },
          select: {
            id: true,
            stepNumber: true,
            title: true,
            description: true,
            instructions: true,
            expectedOutput: true,
            validationCriteria: true,
            mediaUrls: true,
            estimatedTime: true,
            stepType: true,
            isOptional: true
          }
        },
        userProgresses: {
          where: {
            userId: userId
          },
          include: {
            stepResponses: {
              include: {
                step: {
                  select: {
                    stepNumber: true
                  }
                }
              }
            },
            achievements: true
          }
        },
        _count: {
          select: {
            userProgresses: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user has access to premium content
    if (project.isPremium) {
      // Here you would check user's subscription status
      // For now, we'll include this check as a placeholder
      const userSubscriptions = await prisma.lsUserSubscription.findMany({
        where: {
          userId: userId,
          status: {
            in: ['active', 'on_trial']
          }
        }
      });

      if (userSubscriptions.length === 0) {
        return NextResponse.json(
          { error: 'Premium subscription required to access this project' },
          { status: 403 }
        );
      }
    }

    const userProgress = project.userProgresses[0]; // User can only have one progress per project

    // Transform the response
    const response = {
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
      totalSteps: project.steps.length,
      completionCount: project._count.userProgresses,
      steps: project.steps,
      userProgress: userProgress ? {
        id: userProgress.id,
        status: userProgress.status,
        currentStep: userProgress.currentStep,
        completedSteps: userProgress.completedSteps,
        guidanceMode: userProgress.guidanceMode,
        progressPercentage: Math.round((userProgress.completedSteps.length / project.steps.length) * 100),
        startedAt: userProgress.startedAt,
        completedAt: userProgress.completedAt,
        timeSpent: userProgress.timeSpent,
        stepResponses: userProgress.stepResponses.reduce((acc, response) => {
          acc[response.step.stepNumber] = {
            id: response.id,
            response: response.response,
            completedAt: response.completedAt,
            timeSpent: response.timeSpent,
            hintsUsed: response.hintsUsed,
            validationPassed: response.validationPassed
          };
          return acc;
        }, {} as Record<number, any>),
        achievements: userProgress.achievements
      } : null
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
}