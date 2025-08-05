"use server";

import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";

/**
 * A lightweight wrapper around the Google Gemini model that injects
 *   1) a shared model configuration
 *   2) the caller-supplied data (stringified) after the prompt
 *   3) timeout / abort-controller safety-rails
 * and finally returns parsed JSON from the model response.
 *
 * All analysis modules should delegate their AI call to this helper so we keep
 * the configuration in a single place.
 */
export async function callGeminiAI(
  basePrompt: string,
  data: unknown,
  {
    timeoutMs = 20_000,
  }: {
    /** Time (ms) after which the request will be aborted. */
    timeoutMs?: number;
  } = {}
) {
  // Ensure API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  // Build the final prompt – we always attach the JSON-encoded data so the
  // model has full context. We also remind it to return ONLY JSON.
  const fullPrompt = `${basePrompt}\n\n# TEST DATA\n${JSON.stringify(
    data,
    null,
    2
  )}\n\nIMPORTANT: Return ONLY the JSON.`;

  // Set up abort controller for the overall operation
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Initialise client + model with a shared configuration
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.1,
        topP: 0.7,
        topK: 20,
        maxOutputTokens: 4096,
      },
    });

    // Call Gemini with timeout protection
    const result = (await Promise.race([
      model.generateContent(fullPrompt, { signal: controller.signal }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI generation timeout")), timeoutMs)
      ),
    ])) as GenerateContentResult;

    const responseText = result.response.text();

    // The model sometimes wraps JSON in ```json ... ``` blocks – strip them out
    let jsonText = responseText;
    const jsonMatch =
      jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/) ||
      jsonText.match(/```(?:json)?([\s\S]*?)```/);

    if (jsonMatch?.[1]) {
      jsonText = jsonMatch[1].trim();
    }

    return JSON.parse(jsonText);
  } finally {
    clearTimeout(timeoutId);
  }
} 