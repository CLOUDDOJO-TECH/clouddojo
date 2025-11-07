import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId } = await params;

    // First check if project exists and is published
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        isPremium: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project (for premium projects)
    if (project.isPremium) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription || subscription.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Premium subscription required" },
          { status: 403 }
        );
      }
    }

    // Fetch all steps for the project
    const steps = await prisma.projectStep.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        stepNumber: "asc",
      },
      select: {
        id: true,
        stepNumber: true,
        title: true,
        description: true,
        instructions: true,
        estimatedTime: true,
        expectedOutput: true,
        validationCriteria: true,
        mediaUrls: true,
        stepType: true,
        isOptional: true,
      },
    });

    // Get user's progress for this project to determine completed steps
    const progress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
      select: {
        completedSteps: true,
        currentStep: true,
        status: true,
      },
    });

    // Enhance steps with completion status
    const enhancedSteps = steps.map((step) => ({
      ...step,
      isCompleted: progress?.completedSteps.includes(step.stepNumber) || false,
      isCurrent: progress?.currentStep === step.stepNumber || false,
    }));

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
      },
      steps: enhancedSteps,
      progress: progress || {
        completedSteps: [],
        currentStep: 1,
        status: "NOT_STARTED",
      },
    });
  } catch (error) {
    console.error("Error fetching project steps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}