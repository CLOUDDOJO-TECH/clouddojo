import { getUserTestData } from "./get-user-test-data";
import { formatTestDataForAI } from "./format-test-data";
import { analyzeSummary } from "./modules/summary";
import { analyzeStrengths } from "./modules/strengths";
import { analyzeWeaknesses } from "./modules/weaknesses";
import { analyzeRecommendations } from "./modules/recommendations";
import { analyzeStudyPlan } from "./modules/study-plan";
import { analyzeDetailedAnalysis } from "./modules/detailed-analysis";
import { analyzeCategoryScores } from "./modules/category-scores";
import { analyzeTimeDistribution } from "./modules/time-distribution";
import { analyzePerformanceHistory } from "./modules/performance-history";
import { analyzeTopMissedTopics } from "./modules/top-missed-topics";
import { analyzeCertificationReadiness } from "./modules/certification-readiness";
import type { TestData, FormattedTestData } from "./types";

export async function runFullAnalysis(userId: string) {
  // Step 1: Fetch and format user test data
  const testDataResult = await getUserTestData(userId);
  if (!testDataResult.success || !testDataResult.data) {
    return { success: false, error: testDataResult.error || "Failed to fetch test data" };
  }
  
  try {
    const formatted = formatTestDataForAI(testDataResult.data as unknown as TestData);

    // ---------- MODULE EXECUTION ----------
    const summary = await analyzeSummary(formatted);

    const [categoryScores, strengths, performanceHistory, timeDistribution] = await Promise.all([
      analyzeCategoryScores(formatted, { summary }),
      analyzeStrengths(formatted, { summary }),
      analyzePerformanceHistory(formatted, { summary }),
      analyzeTimeDistribution(formatted, { summary })
    ]);

    const weaknesses = await analyzeWeaknesses(formatted, { summary, strengths });

    const [recommendations, topMissedTopics] = await Promise.all([
      analyzeRecommendations(formatted, { summary, strengths, weaknesses }),
      analyzeTopMissedTopics(formatted, { summary, weaknesses })
    ]);

    const certificationReadiness = await analyzeCertificationReadiness(formatted, { summary, strengths, weaknesses, topMissedTopics });

    const [studyPlan, detailedAnalysis] = await Promise.all([
      analyzeStudyPlan(formatted, { summary, strengths, weaknesses, recommendations }),
      analyzeDetailedAnalysis(formatted, { summary, strengths, weaknesses, recommendations, certificationReadiness, topMissedTopics, timeDistribution, performanceHistory })
    ]);

    // ---------- ASSEMBLE ARRAY ----------
    const resultArray = [
      { module: "summary", data: summary },
      { module: "categoryScores", data: categoryScores },
      { module: "strengths", data: strengths },
      { module: "weaknesses", data: weaknesses },
      { module: "recommendations", data: recommendations },
      { module: "timeDistribution", data: timeDistribution },
      { module: "performanceHistory", data: performanceHistory },
      { module: "certificationReadiness", data: certificationReadiness },
      { module: "topMissedTopics", data: topMissedTopics },
      { module: "studyPlan", data: studyPlan },
      { module: "detailedAnalysis", data: detailedAnalysis }
    ];

    console.log(resultArray)

    return { success: true, data: resultArray };
  } catch (error) {
    console.error("Error in AI analysis orchestration:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error during analysis orchestration" };
  }
} 