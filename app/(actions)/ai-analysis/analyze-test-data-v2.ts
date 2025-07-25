"use server"

import { runFullAnalysis } from "./orchestrator"

// Define a type for the analysis result
export type AnalysisResult = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function analyzeTestData(userId: string): Promise<AnalysisResult> {
  if (!userId) {
    return { success: false, error: "User not authenticated" }
  }

  try {
    // Add timeout for the entire operation
    const TIMEOUT = 90000; // 90 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      // Use the orchestrator to run the analysis
      const result = await Promise.race([
        runFullAnalysis(userId),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("AI analysis timeout")), 70000)
        )
      ]);

      clearTimeout(timeoutId);
      return result as AnalysisResult;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: "Analysis took too long. Please try again."
        }
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error analyzing test data:", error)
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "An unexpected error occurred"
    }
  }
} 