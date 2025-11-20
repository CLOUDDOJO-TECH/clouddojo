import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Send event to Inngest (will be debounced by backend to max once per 5min)
    await inngest.send({
      name: "dashboard/update-requested",
      data: { userId },
    });

    return NextResponse.json({
      success: true,
      message: "Dashboard refresh triggered",
    });
  } catch (error) {
    console.error("Dashboard refresh error:", error);
    return NextResponse.json(
      { error: "Failed to trigger refresh" },
      { status: 500 }
    );
  }
}
