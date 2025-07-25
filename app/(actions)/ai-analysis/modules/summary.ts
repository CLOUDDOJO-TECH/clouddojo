// Summary analysis module
// Calls Gemini AI with a focused prompt for summary generation

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const SUMMARY_PROMPT = `
You are a world-class AWS Certification Coach with deep expertise in exam analytics.
Provide a concise statistical SUMMARY of the user's **most recent** practice test.

Return a VALID JSON object with EXACTLY these properties (no extras):
{
  "testName": string,
  "overallScore": number,
  "totalQuestions": number,
  "correctAnswers": number,
  "incorrectAnswers": number,
  "timeSpent": string,   // human-friendly (e.g. "1h 25m")
  "testDate": string,    // ISO-8601
  "improvement": number  // delta vs previous attempt
}

Output rules:
- The response MUST be valid JSON (no markdown, no code fences).
- Do **NOT** include explanations or any additional text.`;

export async function analyzeSummary(formatted: FormattedTestData) {
  return callGeminiAI(SUMMARY_PROMPT, formatted);
} 