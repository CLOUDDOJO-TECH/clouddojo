/**
 * Inngest Webhook Endpoint
 *
 * This endpoint handles all Inngest function executions.
 * It's called by Inngest's infrastructure to run background jobs.
 */

import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

// Import all Inngest functions (we'll add these as we create them)
// import { analyzeQuizOrchestrator } from "@/inngest/functions/analyze-quiz-orchestrator";
// import { analyzeCategoryScores } from "@/inngest/functions/analyze-category-scores";
// import { analyzeTimeEfficiency } from "@/inngest/functions/analyze-time-efficiency";
// import { analyzeStrengthsWeaknesses } from "@/inngest/functions/analyze-strengths-weaknesses";
// import { analyzeRecommendations } from "@/inngest/functions/analyze-recommendations";
// import { analyzeTopicMastery } from "@/inngest/functions/analyze-topic-mastery";
// import { updateDashboardAnalysis } from "@/inngest/functions/update-dashboard-analysis";

// For now, create a simple test function
const testFunction = inngest.createFunction(
  { id: "test-function" },
  { event: "test/hello" },
  async ({ event }) => {
    console.log("Test function executed:", event.data);
    return { success: true };
  }
);

// Create the serve handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    testFunction,
    // When we create the functions, we'll add them here:
    // analyzeQuizOrchestrator,
    // analyzeCategoryScores,
    // analyzeTimeEfficiency,
    // analyzeStrengthsWeaknesses,
    // analyzeRecommendations,
    // analyzeTopicMastery,
    // updateDashboardAnalysis,
  ],
});
