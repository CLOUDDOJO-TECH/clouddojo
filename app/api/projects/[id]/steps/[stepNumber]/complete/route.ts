import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const completeStepSchema = z.object({
  response: z.string().min(1, 'Response is required'),
  timeSpent: z.number().min(0).default(0),
  hintsUsed: z.number().min(0).default(0),
});

interface RouteParams {
  params: Promise<{
    id: string;
    stepNumber: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: projectId, stepNumber } = await params;
    const stepNum = parseInt(stepNumber, 10);

    if (isNaN(stepNum)) {
      return NextResponse.json(
        { error: 'Invalid step number' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { response, timeSpent, hintsUsed } = completeStepSchema.parse(body);

    // Get project and step information using stepNumber
    const step = await prisma.projectStep.findUnique({
      where: {
        projectId_stepNumber: {
          projectId: projectId,
          stepNumber: stepNum,
        }
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                steps: true
              }
            }
          }
        }
      }
    });

    if (!step) {
      return NextResponse.json(
        { error: 'Step not found' },
        { status: 404 }
      );
    }

    // Get user's progress for this project
    const progress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      }
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Project not started. Please start the project first.' },
        { status: 400 }
      );
    }

    if (progress.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Project already completed' },
        { status: 400 }
      );
    }

    // Basic validation - check response length
    const validationPassed = response.length >= 10; // Minimum 10 characters

    // Check if step response already exists using stepId
    const existingResponse = await prisma.projectStepResponse.findUnique({
      where: {
        progressId_stepId: {
          progressId: progress.id,
          stepId: step.id
        }
      }
    });

    let stepResponse;
    if (existingResponse) {
      // Update existing response
      stepResponse = await prisma.projectStepResponse.update({
        where: {
          progressId_stepId: {
            progressId: progress.id,
            stepId: step.id
          }
        },
        data: {
          response: response,
          timeSpent: timeSpent,
          hintsUsed: hintsUsed,
          validationPassed: validationPassed,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new response
      stepResponse = await prisma.projectStepResponse.create({
        data: {
          progressId: progress.id,
          stepId: step.id,
          response: response,
          timeSpent: timeSpent,
          hintsUsed: hintsUsed,
          validationPassed: validationPassed
        }
      });
    }

    // Update progress - add step to completed steps if not already there
    const updatedCompletedSteps = progress.completedSteps.includes(step.stepNumber)
      ? progress.completedSteps
      : [...progress.completedSteps, step.stepNumber].sort((a, b) => a - b);

    // Check if this is the last step
    const totalSteps = step.project._count.steps;
    const isProjectComplete = updatedCompletedSteps.length === totalSteps;

    // Update project progress
    const updatedProgress = await prisma.projectProgress.update({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      data: {
        completedSteps: updatedCompletedSteps,
        currentStep: isProjectComplete ? step.stepNumber : Math.min(step.stepNumber + 1, totalSteps),
        timeSpent: progress.timeSpent + timeSpent,
        status: isProjectComplete ? 'COMPLETED' : 'IN_PROGRESS',
        ...(isProjectComplete && { completedAt: new Date() }),
        updatedAt: new Date()
      }
    });

    // Award achievements
    const achievements = [];

    // Project completion achievement
    if (isProjectComplete) {
      const completionAchievement = await prisma.projectAchievement.create({
        data: {
          progressId: progress.id,
          type: 'PERFECT_SCORE',
          title: 'Project Complete!',
          description: `Completed ${step.project.title}`,
          iconUrl: '/icons/achievements/project-complete.svg'
        }
      });
      achievements.push(completionAchievement);

      // Check for speed completion (if completed in less than estimated time)
      const totalEstimatedTime = await prisma.projectStep.aggregate({
        where: {
          projectId: projectId
        },
        _sum: {
          estimatedTime: true
        }
      });

      if (updatedProgress.timeSpent < (totalEstimatedTime._sum.estimatedTime || 0)) {
        const speedAchievement = await prisma.projectAchievement.create({
          data: {
            progressId: progress.id,
            type: 'SPEED_COMPLETION',
            title: 'Speed Demon!',
            description: 'Completed project faster than estimated time',
            iconUrl: '/icons/achievements/speed-completion.svg'
          }
        });
        achievements.push(speedAchievement);
      }
    }

    const progressPercentage = Math.round((updatedCompletedSteps.length / totalSteps) * 100);

    return NextResponse.json({
      message: 'Step completed successfully',
      stepResponse: {
        id: stepResponse.id,
        response: stepResponse.response,
        completedAt: stepResponse.completedAt,
        timeSpent: stepResponse.timeSpent,
        hintsUsed: stepResponse.hintsUsed,
        validationPassed: stepResponse.validationPassed
      },
      progress: {
        id: updatedProgress.id,
        status: updatedProgress.status,
        currentStep: updatedProgress.currentStep,
        completedSteps: updatedProgress.completedSteps,
        progressPercentage: progressPercentage,
        timeSpent: updatedProgress.timeSpent,
        isComplete: isProjectComplete,
        completedAt: updatedProgress.completedAt
      },
      achievements: achievements
    });

  } catch (error) {
    console.error('Error completing step:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to complete step' },
      { status: 500 }
    );
  }
}