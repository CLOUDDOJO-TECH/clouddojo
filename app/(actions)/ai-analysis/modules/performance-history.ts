// Performance history analysis module
// Calls Gemini AI with a focused prompt for performance history analysis

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const PERFORMANCE_HISTORY_PROMPT = `
You are a world-class AWS Certification Coach. Produce a chronological PERFORMANCE HISTORY of the user's practice tests (oldest ➔ newest).

Return a JSON array where each element is:
{
  "test": string,  // Name or ID
  "score": number  // 0-100 percentage
}

The array must include every available attempt (up to 5).
Output ONLY the JSON array – no markdown fences, no commentary.`;

export async function analyzePerformanceHistory(formatted: FormattedTestData, context?: { summary?: any }) {
  return callGeminiAI(PERFORMANCE_HISTORY_PROMPT, { ...formatted, summary: context?.summary });
} 