import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const startProjectSchema = z.object({
  guidanceMode: z.enum(['INDEPENDENT', 'SOME_GUIDANCE', 'STEP_BY_STEP']).default('SOME_GUIDANCE'),
});

interface RouteParams {
  params: Promise<{
    id: string;
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

    const { id } = await params;
    const projectId = id;

    // Parse and validate request body
    const body = await req.json();
    const { guidanceMode } = startProjectSchema.parse(body);

    // Check if project exists and is published
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        isPublished: true
      },
      include: {
        steps: {
          orderBy: {
            stepNumber: 'asc'
          },
          select: {
            stepNumber: true
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
          { error: 'Premium subscription required to start this project' },
          { status: 403 }
        );
      }
    }

    // Check if user already has progress for this project
    const existingProgress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      }
    });

    if (existingProgress) {
      if (existingProgress.status === 'COMPLETED') {
        return NextResponse.json(
          { error: 'Project already completed' },
          { status: 400 }
        );
      }
      
      // If project is already started, just return the existing progress
      return NextResponse.json({
        message: 'Project already in progress',
        progress: {
          id: existingProgress.id,
          status: existingProgress.status,
          currentStep: existingProgress.currentStep,
          completedSteps: existingProgress.completedSteps,
          guidanceMode: existingProgress.guidanceMode,
          startedAt: existingProgress.startedAt,
          timeSpent: existingProgress.timeSpent,
          progressPercentage: Math.round((existingProgress.completedSteps.length / project.steps.length) * 100)
        }
      });
    }

    // Create new project progress
    const newProgress = await prisma.projectProgress.create({
      data: {
        userId: userId,
        projectId: projectId,
        currentStep: project.steps[0]?.stepNumber || 1,
        completedSteps: [],
        guidanceMode: guidanceMode,
        status: 'IN_PROGRESS',
        timeSpent: 0
      }
    });

    // Award "First Project" achievement if this is their first project
    const userProjectCount = await prisma.projectProgress.count({
      where: {
        userId: userId
      }
    });

    if (userProjectCount === 1) {
      await prisma.projectAchievement.create({
        data: {
          progressId: newProgress.id,
          type: 'FIRST_PROJECT',
          title: 'First Steps',
          description: 'Started your first hands-on project!',
          iconUrl: '/icons/achievements/first-project.svg'
        }
      });
    }

    return NextResponse.json({
      message: 'Project started successfully',
      progress: {
        id: newProgress.id,
        status: newProgress.status,
        currentStep: newProgress.currentStep,
        completedSteps: newProgress.completedSteps,
        guidanceMode: newProgress.guidanceMode,
        startedAt: newProgress.startedAt,
        timeSpent: newProgress.timeSpent,
        progressPercentage: 0
      }
    });

  } catch (error) {
    console.error('Error starting project:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to start project' },
      { status: 500 }
    );
  }
}