// Weaknesses analysis module
// Calls Gemini AI with a focused prompt for weaknesses analysis

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const WEAKNESSES_PROMPT = `
You are a world-class AWS Certification Coach. Determine the user's KEY WEAKNESSES (3-5 areas) from their practice-test data.

Return a JSON array of strings. Requirements:
• Each item must be specific & actionable (e.g., "Needs improvement in Security domain – 63% accuracy").
• Provide between 3 and 5 items.
• Output MUST be valid JSON ONLY (no markdown/code fences, no additional commentary).`;

export async function analyzeWeaknesses(formatted: FormattedTestData, context?: { summary?: any, strengths?: any }) {
  return callGeminiAI(WEAKNESSES_PROMPT, { ...formatted, summary: context?.summary, strengths: context?.strengths });
} 