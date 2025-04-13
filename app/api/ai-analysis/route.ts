import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call AWS Lambda function
    const response = await fetch(process.env.AWS_LAMBDA_AI_ANALYSIS_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AWS_LAMBDA_API_KEY}`,
      },
      body: JSON.stringify({
        userId,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to analyze test data")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in AI analysis:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze test data" },
      { status: 500 }
    )
  }
} 