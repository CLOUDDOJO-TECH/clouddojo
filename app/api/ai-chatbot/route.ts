"use server"
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// System prompt for the AI coach
const SYSTEM_PROMPT = `
You are CloudDojo, an expert AI coach for cloud certification exams (AWS, GCP, Azure, etc.).
Your mission is to help users understand cloud concepts, answer technical questions, and provide study tips.
- Be concise, clear, and supportive.
- If a question is ambiguous, ask clarifying questions.
- If you don't know, say so honestly.
- Use code snippets, diagrams, or analogies when helpful.
- Never give legal, financial, or personal advice.
`;

export async function POST(request: NextRequest) {
  try {
    // Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse user message and history from request body
    const { message, history } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

    // Prepare the full conversation context
    const fullHistory = [
        ...(Array.isArray(history) ? history : []),
        { role: "user", parts: [{ text: message }] }
      ];

    // Create a streaming response
    const streamingResponse = await model.generateContentStream({
      contents: fullHistory
    });

    // Create a TransformStream to handle streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        for await (const chunk of streamingResponse.stream) {
          const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && typeof text === 'string') {
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      }
    });

    // Return the streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
      }
    });

  } catch (error) {
    console.error("AI Chatbot error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}

/**
 * This API route is used by the AI chatbot frontend. It:
 * - Requires Clerk authentication (user must be logged in)
 * - Accepts a POST body: { message: string, history?: array }
 * - Uses Gemini's streaming API to progressively send the AI's response
 * - Prepends a system prompt to give Gemini a backstory and role
 * - Returns the AI's response as a streaming response
 * - Never exposes the API key to the client
 */ 