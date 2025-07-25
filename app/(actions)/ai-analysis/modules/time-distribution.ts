// Time distribution analysis module
// Calls Gemini AI with a focused prompt for time distribution analysis

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const TIME_DISTRIBUTION_PROMPT = `
You are a world-class AWS Certification Coach. Provide a TIME DISTRIBUTION breakdown for the user's **most recent** practice test.

Return a JSON array (minimum 3 items) with the exact shape:
{
  "category": string,  // e.g., difficulty level or AWS domain
  "time": number,      // seconds spent
  "count": number      // # of questions in that category
}

Guidelines:
- Focus on the most significant categories.
- Values must be numeric.
- Output must be valid JSON only – no markdown, code fences, or commentary.`;

export async function analyzeTimeDistribution(formatted: FormattedTestData, context?: { summary?: any }) {
  return callGeminiAI(TIME_DISTRIBUTION_PROMPT, { ...formatted, summary: context?.summary });
} 