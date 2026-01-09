/**
 * Inngest Client
 *
 * This is the main Inngest client used throughout the application.
 * It handles background job processing for AI analysis and other async tasks.
 */

import { Inngest } from "inngest";

// Create Inngest client
export const inngest = new Inngest({
  id: "clouddojo",
  name: "CloudDojo",
});

// Event types for type-safety
export type InngestEvents = {
  // Quiz events
  "quiz/completed": {
    data: {
      userId: string;
      quizAttemptId: string;
    };
  };
  "quiz/analyze-category-scores": {
    data: {
      analysisId: string;
      quizData: any;
      tier: string;
    };
  };
  "quiz/analyze-time-efficiency": {
    data: {
      analysisId: string;
      quizData: any;
      tier: string;
    };
  };
  "quiz/analyze-strengths-weaknesses": {
    data: {
      analysisId: string;
      quizData: any;
      tier: string;
    };
  };
  "quiz/analyze-recommendations": {
    data: {
      analysisId: string;
      quizData: any;
      tier: string;
    };
  };
  "quiz/analyze-topic-mastery": {
    data: {
      analysisId: string;
      quizData: any;
      tier: string;
    };
  };
  "quiz/analysis-module-completed": {
    data: {
      analysisId: string;
      module: string;
    };
  };
  "dashboard/update-requested": {
    data: {
      userId: string;
    };
  };
  
  // Email events
  "email/send-welcome": {
    data: {
      userId: string;
      email: string;
      name: string;
    };
  };
  "email/send-password-reset": {
    data: {
      userId: string;
      email: string;
      name: string;
      resetToken: string;
      expiryMinutes: number;
    };
  };
  "email/send-study-reminder": {
    data: {
      userId: string;
      email: string;
      name: string;
      lastCertification: string;
      daysSinceLastStudy: number;
    };
  };
  "email/send-quiz-results": {
    data: {
      userId: string;
      email: string;
      name: string;
      quizData: {
        score: number;
        totalQuestions: number;
        passPercentage: number;
        passed: boolean;
        weakAreas: string[];
        nextSteps: string;
      };
    };
  };
};
