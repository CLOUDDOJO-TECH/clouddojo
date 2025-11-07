import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepNumber: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, stepNumber } = await params;
    const stepNum = parseInt(stepNumber, 10);

    if (isNaN(stepNum)) {
      return NextResponse.json(
        { error: "Invalid step number" },
        { status: 400 }
      );
    }

    // Fetch the step
    const step = await prisma.projectStep.findUnique({
      where: {
        projectId_stepNumber: {
          projectId,
          stepNumber: stepNum,
        },
      },
    });

    if (!step) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { isPremium: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // If project is premium, check user subscription
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

    return NextResponse.json(step);
  } catch (error) {
    console.error("Error fetching project step:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
