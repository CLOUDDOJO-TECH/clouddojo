// Category scores analysis module
// Calls Gemini AI with a focused prompt for category scores analysis

import type { FormattedTestData } from "../types";
import { callGeminiAI } from "../call-gemini";

const CATEGORY_SCORES_PROMPT = `
You are a world-class AWS Certification Coach. Analyse the user's test performance and produce a CATEGORY-LEVEL score breakdown for the **most recent** test only.

Return a JSON array where each element contains **exactly**:
{
  "name": string,   // Category name (never null or "Unknown")
  "score": number,  // 0-100 percentage
  "questions": number
}

Guidelines:
- Include all categories present; the array must not be empty.
- Values must be accurate and numeric (no strings for numbers).
- Output MUST be valid JSON with no markdown fences or additional commentary.`;

export async function analyzeCategoryScores(formatted: FormattedTestData, context?: { summary?: any }) {
  return callGeminiAI(CATEGORY_SCORES_PROMPT, { ...formatted, summary: context?.summary });
} 