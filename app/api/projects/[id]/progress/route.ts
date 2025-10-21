import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateProgressSchema = z.object({
  currentStep: z.number().min(1).optional(),
  guidanceMode: z.enum(['INDEPENDENT', 'SOME_GUIDANCE', 'STEP_BY_STEP']).optional(),
  timeSpent: z.number().min(0).optional(),
});

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

    // Get user's progress for this project
    const progress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      include: {
        project: {
          select: {
            title: true,
            _count: {
              select: {
                steps: true
              }
            }
          }
        },
        stepResponses: {
          include: {
            step: {
              select: {
                stepNumber: true,
                title: true
              }
            }
          },
          orderBy: {
            step: {
              stepNumber: 'asc'
            }
          }
        },
        achievements: {
          orderBy: {
            earnedAt: 'desc'
          }
        }
      }
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found for this project' },
        { status: 404 }
      );
    }

    const totalSteps = progress.project._count.steps;
    const progressPercentage = Math.round((progress.completedSteps.length / totalSteps) * 100);

    const response = {
      id: progress.id,
      projectId: progress.projectId,
      projectTitle: progress.project.title,
      status: progress.status,
      currentStep: progress.currentStep,
      completedSteps: progress.completedSteps,
      guidanceMode: progress.guidanceMode,
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
      timeSpent: progress.timeSpent,
      totalSteps: totalSteps,
      progressPercentage: progressPercentage,
      stepResponses: progress.stepResponses.map(response => ({
        stepNumber: response.step.stepNumber,
        stepTitle: response.step.title,
        response: response.response,
        completedAt: response.completedAt,
        timeSpent: response.timeSpent,
        hintsUsed: response.hintsUsed,
        validationPassed: response.validationPassed
      })),
      achievements: progress.achievements
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching project progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project progress' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
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

    // Parse and validate request body
    const body = await req.json();
    const updateData = updateProgressSchema.parse(body);

    // Check if progress exists
    const existingProgress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      include: {
        project: {
          select: {
            _count: {
              select: {
                steps: true
              }
            }
          }
        }
      }
    });

    if (!existingProgress) {
      return NextResponse.json(
        { error: 'Progress not found for this project' },
        { status: 404 }
      );
    }

    if (existingProgress.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot update progress for completed project' },
        { status: 400 }
      );
    }

    // Update progress
    const updatedProgress = await prisma.projectProgress.update({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      data: {
        ...(updateData.currentStep && { currentStep: updateData.currentStep }),
        ...(updateData.guidanceMode && { guidanceMode: updateData.guidanceMode }),
        ...(updateData.timeSpent && { timeSpent: updateData.timeSpent }),
        updatedAt: new Date()
      }
    });

    const totalSteps = existingProgress.project._count.steps;
    const progressPercentage = Math.round((updatedProgress.completedSteps.length / totalSteps) * 100);

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: {
        id: updatedProgress.id,
        status: updatedProgress.status,
        currentStep: updatedProgress.currentStep,
        completedSteps: updatedProgress.completedSteps,
        guidanceMode: updatedProgress.guidanceMode,
        timeSpent: updatedProgress.timeSpent,
        progressPercentage: progressPercentage,
        updatedAt: updatedProgress.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating project progress:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update project progress' },
      { status: 500 }
    );
  }
}