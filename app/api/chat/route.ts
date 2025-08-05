import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

type GoogleModelCacheableId =
  | "models/gemini-2.5-pro"
  | "models/gemini-2.5-flash"
  | "models/gemini-2.0-flash"
  | "models/gemini-1.5-flash-001"
  | "models/gemini-1.5-pro-001";

const SYSTEM_PROMPT = `
  You are CloudDojo, an expert AI coach for cloud certification exams (AWS, GCP, Azure, etc.).
  Your mission is to help users understand cloud concepts, answer technical questions, and provide study tips.
  - Be concise, clear, and supportive.
  - If a question is ambiguous, ask clarifying questions.
  - If you don't know, say so honestly.
  - Use code snippets, diagrams, or analogies when helpful.
  - Never give legal, financial, or personal advice.
  `;

const model: GoogleModelCacheableId = "models/gemini-2.5-pro";

export async function POST(req: Request) {

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();
  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: SYSTEM_PROMPT,
    messages,
  });
  return result.toDataStreamResponse();
}
