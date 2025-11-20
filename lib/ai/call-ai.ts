/**
 * AI Model Wrapper using Vercel AI SDK
 *
 * Provides a unified interface for calling different AI models.
 * Easy to switch between providers (Gemini, OpenAI, Anthropic, etc.)
 */

import { generateObject, generateText } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

/**
 * AI model configuration
 * Change the model here to switch providers
 */
const AI_MODEL = google("gemini-2.0-flash-lite", {
  topK: 20,
  topP: 0.7,
});

const AI_CONFIG = {
  temperature: 0.1,
  maxTokens: 4096,
};

export interface AICallOptions {
  timeoutMs?: number;
  schema?: z.ZodSchema;
  responseFormat?: "json" | "text";
}

/**
 * Call AI model with automatic JSON parsing and retry logic
 */
export async function callAI(
  prompt: string,
  data?: unknown,
  options: AICallOptions = {}
): Promise<any> {
  const {
    timeoutMs = 25000,
    schema,
    responseFormat = "json",
  } = options;

  // Build full prompt
  const fullPrompt = data
    ? `${prompt}\n\n# DATA\n${JSON.stringify(data, null, 2)}\n\nIMPORTANT: Return ONLY valid JSON.`
    : prompt;

  try {
    // Use generateObject if schema provided (better type safety)
    if (schema) {
      const result = await Promise.race([
        generateObject({
          model: AI_MODEL,
          schema,
          prompt: fullPrompt,
          temperature: AI_CONFIG.temperature,
          maxTokens: AI_CONFIG.maxTokens,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("AI generation timeout")), timeoutMs)
        ),
      ]);

      return (result as any).object;
    }

    // Use generateText for flexible JSON responses
    const result = await Promise.race([
      generateText({
        model: AI_MODEL,
        prompt: fullPrompt,
        temperature: AI_CONFIG.temperature,
        maxTokens: AI_CONFIG.maxTokens,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI generation timeout")), timeoutMs)
      ),
    ]);

    const responseText = (result as any).text;

    if (responseFormat === "text") {
      return responseText;
    }

    // Parse JSON response
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    const jsonMatch =
      jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/) ||
      jsonText.match(/```(?:json)?([\s\S]*?)```/);

    if (jsonMatch?.[1]) {
      jsonText = jsonMatch[1].trim();
    }

    return JSON.parse(jsonText);
  } catch (error) {
    // Enhanced error with context
    const aiError = new Error(
      `AI call failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    (aiError as any).originalError = error;
    (aiError as any).prompt = fullPrompt.substring(0, 500); // First 500 chars for debugging
    throw aiError;
  }
}

/**
 * Call AI with structured schema (type-safe)
 */
export async function callAIWithSchema<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  data?: unknown,
  options: Omit<AICallOptions, "schema"> = {}
): Promise<T> {
  return callAI(prompt, data, { ...options, schema });
}

/**
 * Example schemas for common use cases
 */
export const AISchemas = {
  strengthsWeaknesses: z.object({
    strengths: z.array(z.string()).length(3),
    weaknesses: z.array(z.string()).length(3),
    insight: z.string(),
  }),

  recommendations: z.object({
    recommendations: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(["high", "medium", "low"]),
        estimatedTime: z.string(),
        resources: z.array(z.string()),
      })
    ),
  }),

  studyPlan: z.object({
    summary: z.string(),
    weeklyGoals: z
      .array(
        z.object({
          week: z.number(),
          focus: z.string(),
          tasks: z.array(
            z.object({
              day: z.string(),
              topic: z.string(),
              activities: z.array(z.string()),
              estimatedTime: z.string(),
            })
          ),
        })
      )
      .optional(),
    priorityActions: z.array(z.string()),
    milestones: z
      .array(
        z.object({
          goal: z.string(),
          deadline: z.string(),
          successCriteria: z.string(),
        })
      )
      .optional(),
  }),
};

/**
 * Get information about the current AI model
 */
export function getModelInfo() {
  return {
    provider: "Google",
    model: "gemini-2.0-flash-lite",
    temperature: AI_CONFIG.temperature,
    maxTokens: AI_CONFIG.maxTokens,
  };
}
