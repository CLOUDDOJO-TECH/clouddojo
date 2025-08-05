// Recommendations analysis module
// Calls Gemini AI with a focused prompt for recommendations generation

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const RECOMMENDATIONS_PROMPT = `
You are a world-class AWS Certification Coach. Using the user's SUMMARY, STRENGTHS and WEAKNESSES, craft FOUR (4) precise, actionable RECOMMENDATIONS that will deliver the greatest performance lift.

Return a JSON array of exactly 4 strings.  Each string must be:
• Specific to an AWS domain/topic.
• Immediately actionable (e.g., "Review IAM policy evaluation logic with AWS Docs link").

Output ONLY the JSON array – no markdown, no code fences, no commentary.`;

export async function analyzeRecommendations(formatted: FormattedTestData, context?: { summary?: any, strengths?: any, weaknesses?: any }) {
  return callGeminiAI(RECOMMENDATIONS_PROMPT, { ...formatted, summary: context?.summary, strengths: context?.strengths, weaknesses: context?.weaknesses });
} 