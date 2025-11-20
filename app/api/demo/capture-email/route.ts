import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, score, totalQuestions, percentage, provider } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Validate score data
    if (
      typeof score !== "number" ||
      typeof totalQuestions !== "number" ||
      typeof percentage !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid score data" },
        { status: 400 }
      );
    }

    // Create or update demo lead
    const demoLead = await prisma.demoLead.upsert({
      where: { email },
      create: {
        email,
        score,
        totalQuestions,
        percentage,
        provider: provider || null,
      },
      update: {
        score,
        totalQuestions,
        percentage,
        provider: provider || null,
      },
    });

    // TODO: Send welcome email with results
    // await sendDemoResultsEmail(email, score, totalQuestions, percentage);

    return NextResponse.json({
      success: true,
      message: "Email captured successfully",
      leadId: demoLead.id,
    });
  } catch (error) {
    console.error("Demo email capture error:", error);

    // Handle duplicate email error gracefully
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to capture email" },
      { status: 500 }
    );
  }
}
