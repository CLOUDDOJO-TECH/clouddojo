import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

const SYSTEM_PROMPT = `
  You are CloudDojo, an expert AI coach for cloud certification exams (AWS, GCP, Azure, etc.).
  Your mission is to help users understand cloud concepts, answer technical questions, and provide study tips.
  - Be concise, clear, and supportive.
  - If a question is ambiguous, ask clarifying questions.
  - If you don't know, say so honestly.
  - Use code snippets, diagrams, or analogies when helpful.
  - Never give legal, financial, or personal advice.
  `;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("❌ OpenAI error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stream error",
      },
      { status: 500 },
    );
  }
}
