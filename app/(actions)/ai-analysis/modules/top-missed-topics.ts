// Top missed topics analysis module
// Calls Gemini AI with a focused prompt for identifying top missed topics

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const TOP_MISSED_TOPICS_PROMPT = `
You are a world-class AWS Certification Coach. Identify the TOP MISSED TOPICS across the user's recent practice tests.

Return a JSON array (minimum 3 items) where each element is:
{
  "topic": string,      // Topic name (never null/Unknown)
  "count": number,      // Questions missed
  "importance": "High" | "Medium" | "Low"
}

Rules:
- Focus on the most critical knowledge gaps.
- Array must not be empty.
- Output ONLY the JSON array (no markdown, code fences, or extra text).`;

export async function analyzeTopMissedTopics(formatted: FormattedTestData, context?: { summary?: any, weaknesses?: any }) {
  return callGeminiAI(TOP_MISSED_TOPICS_PROMPT, { ...formatted, summary: context?.summary, weaknesses: context?.weaknesses });
} 