import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { streamText, convertToModelMessages } from "ai";
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

const STYLE_INSTRUCTIONS: Record<string, string> = {
  explanatory:
    "Respond with detailed explanations, examples, and analogies. Break down complex topics step by step.",
  concise:
    "Respond as briefly as possible. Use short sentences and bullet points. No unnecessary detail.",
  technical:
    "Respond with deep technical detail. Use precise terminology, reference official docs, and include architecture considerations.",
  eli5: "Explain like I'm 5. Use simple words, everyday analogies, and avoid jargon entirely.",
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, responseStyle } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const styleInstruction =
      STYLE_INSTRUCTIONS[responseStyle as string] ??
      STYLE_INSTRUCTIONS.explanatory;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `${SYSTEM_PROMPT}\n\n${styleInstruction}`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Stream error",
      },
      { status: 500 },
    );
  }
}
