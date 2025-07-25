// Certification readiness analysis module
// Calls Gemini AI with a focused prompt for certification readiness assessment

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const CERTIFICATION_READINESS_PROMPT = `
You are a world-class AWS Certification Coach. Assess the user's overall READINESS for their target certification based on ALL available data.

Return ONE raw JSON number (integer 0-100) representing readiness
Rules:
- Output must be a bare number (e.g., 78) – no quotes.
- Do NOT include markdown, code fences, or any additional text.`;

export async function analyzeCertificationReadiness(
  formatted: FormattedTestData, 
  context?: { 
    summary?: any, 
    strengths?: any, 
    weaknesses?: any,
    topMissedTopics?: any 
  }
) {
  return callGeminiAI(CERTIFICATION_READINESS_PROMPT, { 
    ...formatted, 
    summary: context?.summary,
    strengths: context?.strengths,
    weaknesses: context?.weaknesses,
    topMissedTopics: context?.topMissedTopics
  });
} 