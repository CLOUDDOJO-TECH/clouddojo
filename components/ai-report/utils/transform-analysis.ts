import { ReportData } from "../types";

// Map array of { module: string; data: any } to ReportData shape expected by UI
export function transformAnalysisData(raw: Array<{ module: string; data: any }>): ReportData {
  // Helper to find module data
  const get = (name: string) => raw.find((m) => m.module === name)?.data;

  return {
    summary: get("summary"),
    categoryScores: get("categoryScores") || [],
    strengths: get("strengths") || [],
    weaknesses: get("weaknesses") || [],
    recommendations: get("recommendations") || [],
    detailedAnalysis: get("detailedAnalysis")?.html || get("detailedAnalysis") || "",
    timeDistribution: get("timeDistribution") || [],
    performanceHistory: get("performanceHistory") || [],
    certificationReadiness: get("certificationReadiness") ?? 0,
    topMissedTopics: get("topMissedTopics") || [],
    studyPlan: get("studyPlan") || [],
  } as ReportData;
} 