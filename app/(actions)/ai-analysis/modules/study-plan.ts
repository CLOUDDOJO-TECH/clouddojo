// Study plan analysis module
// Calls Gemini AI with a focused prompt for study plan generation

import { callGeminiAI } from "../call-gemini";
import type { FormattedTestData } from "../types";

const STUDY_PLAN_PROMPT = `
You are a world-class AWS Certification Coach. Using the prior analyses (summary, strengths, weaknesses & recommendations) craft a PERSONALISED STUDY PLAN.

Return a JSON array where each item has EXACTLY:
{
  "title": string,
  "description": string,
  "resources": string[],   // include real publicly accessible URLs
  "priority": "High" | "Medium" | "Low"
}

Rules:
- Provide at least 2 items.
- The resources array must contain at least one URL per item.
- Output MUST be valid JSON only (no markdown/code fences, no commentary).`;

export async function analyzeStudyPlan(formatted: FormattedTestData, context?: { summary?: any, strengths?: any, weaknesses?: any, recommendations?: any }) {
  return callGeminiAI(STUDY_PLAN_PROMPT, { ...formatted, summary: context?.summary, strengths: context?.strengths, weaknesses: context?.weaknesses, recommendations: context?.recommendations });
} 