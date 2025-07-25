// Strengths analysis module
// Calls Gemini AI with a focused prompt for strengths analysis

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const STRENGTHS_PROMPT = `
You are a world-class AWS Certification Coach. Identify the user's TOP STRENGTHS (3-5 items) based on their practice-test data.

Return a JSON array of strings. Each string MUST be:
- Specific (mentioning the domain/category)
- Actionable (includes quantitative insight, e.g. "92% accuracy")

Constraints:
- Provide between 3 and 5 items.
- Output ONLY the JSON array – absolutely no markdown, code fences, or extra commentary.`;

export async function analyzeStrengths(
  formatted: FormattedTestData,
  context?: { summary?: any }
) {
  return callGeminiAI(STRENGTHS_PROMPT, {
    ...formatted,
    summary: context?.summary,
  });
}
