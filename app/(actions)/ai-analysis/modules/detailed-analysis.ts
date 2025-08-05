// Detailed analysis module
// Calls Gemini AI with a focused prompt for detailed HTML analysis

import type { FormattedTestData } from "../types";
import { callGeminiAI } from "../call-gemini";

const DETAILED_ANALYSIS_PROMPT = `
You are a world-class AWS Certification Coach. Draft a COMPREHENSIVE HTML REPORT (≥500 words) that analyses the user's performance trends, strengths, weaknesses, recommendations, readiness and study plan.
In-depth HTML formatted analysis covering performance trends, category insights, and time management across all provided tests. MUST provide substantial detail. I want this to be a comprehensive analysis of the user's performance, including specific examples and data points. It should not be less than 500 words. also format it in paragraphs and quotes and the rest as you see need be. Address the user as "you" and use a friendly tone. Avoid using "we" or "our"

Format:
• Use semantic HTML (e.g., <h2>, <p>, <ul>, <blockquote>) for readability.
• Address the user directly as "you" or with their name.

Output requirements:
• Return **only** a JSON string that contains the HTML (example: "<p>...</p>").
• Do NOT wrap the string in markdown/code fences.
• No additional commentary outside the JSON string.`;

export async function analyzeDetailedAnalysis(
  formatted: FormattedTestData, 
  context?: { 
    summary?: any, 
    strengths?: any, 
    weaknesses?: any, 
    recommendations?: any, 
    studyPlan?: any,
    certificationReadiness?: any,
    topMissedTopics?: any,
    timeDistribution?: any,
    performanceHistory?: any
  }
) {
  return callGeminiAI(DETAILED_ANALYSIS_PROMPT, { ...formatted, ...context });
} 