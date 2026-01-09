/**
 * Inngest Webhook Endpoint
 *
 * This endpoint handles all Inngest function executions.
 * It's called by Inngest's infrastructure to run background jobs.
 */

import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

// Import all Inngest analysis functions
import { analyzeQuizOrchestrator } from "@/inngest/functions/analyze-quiz-orchestrator";
import { analyzeCategoryScores } from "@/inngest/functions/analyze-category-scores";
import { analyzeTimeEfficiency } from "@/inngest/functions/analyze-time-efficiency";
import { analyzeStrengthsWeaknesses } from "@/inngest/functions/analyze-strengths-weaknesses";
import { analyzeRecommendations } from "@/inngest/functions/analyze-recommendations";
import { analyzeTopicMastery } from "@/inngest/functions/analyze-topic-mastery";
import { updateDashboardAnalysis } from "@/inngest/functions/update-dashboard-analysis";

// Import email worker functions
import { emailWorkers } from "@/lib/emails/queue/emailQueue";

// Create the serve handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Main orchestrator
    analyzeQuizOrchestrator,

    // Free tier analyses
    analyzeCategoryScores,
    analyzeTimeEfficiency,

    // Premium tier analyses
    analyzeStrengthsWeaknesses,
    analyzeRecommendations,
    analyzeTopicMastery,

    // Dashboard compilation
    updateDashboardAnalysis,

    // Email workers
    ...emailWorkers,
  ],
});
