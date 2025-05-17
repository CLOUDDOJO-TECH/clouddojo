"use server"

import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai"
import { formatDuration, intervalToDuration } from "date-fns"
import { getUserTestData } from "./get-user-test-data"
import type { TestData, FormattedTestData } from "./types"

// Helper function to safely convert potential BigInt values to numbers
const toNumber = (value: any): number => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
};

// Format test data for AI analysis
const formatTestDataForAI = (data: TestData): FormattedTestData => {
  const {
    quizAttempts,
    categoryPerformance,
    servicePerformance,
    difficultyPerformance,
    timeMetrics,
    performanceTrend
  } = data

  // Ensure we have at least one attempt
  if (!quizAttempts?.length) {
    throw new Error("No quiz attempts available for analysis")
  }

  // Most recent attempt for primary metrics
  const primaryAttempt = quizAttempts[0]
  const user = primaryAttempt.user

  // User details
  const userData = {
    id: user?.userId || 'unknown',
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
    experience: user?.onboarding?.experience || null,
    preferredCertifications: user?.onboarding?.preferredCertifications || [],
    goals: user?.onboarding?.goals || []
  }

  // Current test details
  const currentTest = {
    id: primaryAttempt.id,
    name: primaryAttempt.quiz.title,
    category: primaryAttempt.quiz.category?.name || null,
    score: primaryAttempt.percentageScore,
    timeSpent: {
      seconds: primaryAttempt.timeSpentSecs,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: primaryAttempt.timeSpentSecs * 1000 })
      )
    },
    questionsTotal: primaryAttempt.questions.length,
    questionsCorrect: primaryAttempt.questions.filter(q => q.isCorrect).length,
    questionsIncorrect: primaryAttempt.questions.filter(q => !q.isCorrect).length,
    startedAt: primaryAttempt.startedAt.toISOString(),
    completedAt: primaryAttempt.completedAt?.toISOString() || null
  }

  // Category Performance
  const categoryPerformanceData = (categoryPerformance || []).map((cat: any) => ({
    category: cat.categoryName || "Unknown Category",
    totalQuestions: toNumber(cat._count__all),
    correctQuestions: toNumber(cat._count_isCorrect),
    accuracy: toNumber(cat.accuracyPercentage)
  })).filter(cat => cat.totalQuestions > 0)

  // Service Performance
  const servicePerformanceData = (servicePerformance || []).map((service: any) => ({
    service: service.awsService || "Unknown Service",
    totalQuestions: toNumber(service._count__all),
    correctQuestions: toNumber(service._count_isCorrect),
    accuracy: toNumber(service.accuracyPercentage)
  })).filter(service => service.totalQuestions > 0)

  // Difficulty Breakdown
  const difficultyBreakdown = (difficultyPerformance || []).map((diff: any) => ({
    level: diff.difficultyLevel || "Unknown",
    totalQuestions: toNumber(diff._count__all),
    correctQuestions: toNumber(diff._count_isCorrect),
    accuracy: toNumber(diff.accuracyPercentage),
    averageTime: timeMetrics.timeByDifficulty.find(
      (t: any) => t.level === diff.difficultyLevel
    )?.averageTime || 0
  })).filter(diff => diff.totalQuestions > 0)

  // Time Analysis
  const timeAnalysis = {
    total: {
      seconds: timeMetrics.totalTime,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: timeMetrics.totalTime * 1000 })
      )
    },
    averagePerQuestion: {
      seconds: timeMetrics.averageTimePerQuestion,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: timeMetrics.averageTimePerQuestion * 1000 })
      )
    },
    byDifficulty: (timeMetrics.timeByDifficulty || []).map((metric: any) => ({
      level: metric.level,
      averageSeconds: toNumber(metric.averageTime),
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: toNumber(metric.averageTime) * 1000 })
      )
    }))
  }

  // Progress History
  const progressHistory = performanceTrend.map((trend, index) => ({
    testId: trend.testId,
    score: trend.score,
    date: trend.date instanceof Date 
      ? trend.date.toISOString() 
      : trend.date,
    improvement: index > 0 
      ? trend.score - performanceTrend[index - 1].score 
      : 0
  }))

  // Question Details - Limit to most recent test only for performance
  const questionDetails = primaryAttempt.questions.map((q) => ({
    id: q.questionId,
    content: q.question.content,
    category: q.question.category?.name || null,
    service: q.question.awsService || null,
    difficulty: q.question.difficultyLevel || "Unknown",
    isCorrect: q.isCorrect,
    timeSpent: {
      seconds: q.timeSpentSecs,
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: q.timeSpentSecs * 1000 })
      )
    },
    userAnswer: q.userAnswer ? q.userAnswer.split(',') : [],
    correctAnswer: q.question.correctAnswer || []
  }))

  return {
    user: userData,
    currentTest,
    categoryPerformance: categoryPerformanceData,
    servicePerformance: servicePerformanceData,
    difficultyBreakdown,
    timeAnalysis,
    progressHistory,
    questionDetails
  }
}

export async function analyzeTestData(userId: string) {
  if (!userId) {
    return { success: false, error: "User not authenticated" }
  }

  try {
    // Add timeout for the entire operation
    const TIMEOUT = 25000; // 25 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }

      // Initialize the Gemini client with reduced tokens and temperature
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite", 
      generationConfig: {
          temperature: 0.1, 
          topP: 0.7,
          topK: 20,
          maxOutputTokens: 4096, // Reduced token count
      },
    })

    // Get and format test data
    const testDataResult = await getUserTestData(userId)
    if (!testDataResult.success || !testDataResult.data) {
      throw new Error(testDataResult.error || "Failed to fetch test data")
    }

    // Convert the data to match the TestData interface
    const testData: TestData = testDataResult.data as TestData
    const formattedData = formatTestDataForAI(testData)

    // Create the prompt for Gemini
    const prompt = `
You are an expert AWS certification analyst with deep knowledge of AWS services, best practices, and certification exams. 
Your task is to analyze the provided AWS practice test results from the user's most recent tests (up to 5) and generate a comprehensive, detailed report in a specific JSON format.

# CONTEXT
The user has completed multiple AWS practice tests, and we need a comprehensive analysis that:
1. Provides insights across all recent tests
2. Identifies consistent performance patterns
3. Highlights areas of improvement and potential challenges
4. Creates a personalized, adaptive study strategy

# TEST DATA
${JSON.stringify(formattedData, null, 2)}

# ANALYSIS REQUIREMENTS
1. Base primary metrics on the most recent test
2. Analyze performance trends across all tests
3. Identify consistent strengths and weaknesses
4. Create a holistic view of the user's certification readiness
5. Develop a targeted, adaptive study plan

# REQUIRED OUTPUT FORMAT
{
  "summary": {
    "score": number, // Overall sum score from all the most recent tests
    "totalQuestions": number, // Total questions from all the analyzed tests
    "correctAnswers": number, // Correct answers from all the analyzed tests
    "incorrectAnswers": number, // Incorrect answers from the most recent test
    "timeSpent": string, // Average time spent on each test(e.g., "1h 45m")
    "testDate": string, // Date of the most recent test (ISO format preferred)
    "improvement": number, // Score improvement compared to the previous test in the history
    "testName": string // List of test names or IDs from the most recent tests
  },
  "categoryScores": Array<{ // Performance breakdown by category for the most recent test
    "name": string, // Category name, MUST NOT be null or "Unknown"
    "score": number, // Score (0-100)
    "questions": number // Number of questions in this category
  }>, // MUST NOT be an empty array if data exists
  "strengths": string[], // List of key strengths identified across all tests. MUST NOT be empty. Must be specific and actionable and must not be less than 3 items.
  // e.g., "Strong in Compute Category with 90% accuracy"
  "weaknesses": string[], // List of key weaknesses identified across all tests. MUST NOT be empty.Must be specific and actionable and must not be less than 3 items.
  // e.g., "Weak in Networking Category with 60% accuracy"
  // e.g., "Needs improvement in Security Category with 70% accuracy"
  "recommendations": string[], // Actionable recommendations based on weaknesses. MUST NOT be empty and must not be less than 4 items.
  "detailedAnalysis": string, // In-depth HTML formatted analysis covering performance trends, category insights, and time management across all provided tests. MUST provide substantial detail. I want this to be a comprehensive analysis of the user's performance, including specific examples and data points. It should not be less than 500 words. also format it in paragraphs and quotes and the rest as you see need be. Address the user as "you" and use a friendly tone. Avoid using "we" or "our".
  "timeDistribution": Array<{ // Time distribution for all tests must not be less than 3 items.
    "category": string, // e.g., "Easy ns", "Compute Category"
    "time": number, // Time spent in seconds
    "count": number // Number of questions in this category
  }>,
  "performanceHistory": Array<{ // Score history from all provided tests (up to 5). must not be empty
    "test": string, // Test name or ID
    "score": number // Score (0-100)
  }>, // MUST reflect the userHistory provided
  "certificationReadiness": number, // Overall readiness score (0-100) based on performance trends and recent scores from all the tests. MUST be a calculated value.
  "topMissedTopics": Array<{ // Top topics missed in all the most recent tests. must not be less than 3 items
    "topic": string, // Topic name. MUST NOT be null or "Unknown".
    "count": number, // Number of questions missed
    "importance": string // e.g., "High", "Medium"
  }>, // MUST NOT be an empty array if weaknesses exist.
  "studyPlan": Array<{ // **MANDATORY**: Personalized study plan based on the analysis.
    "title": string, // e.g., "Week 1: Networking Focus"
    "description": string, // Brief description of the focus
    "resources": string[], // List of specific resources. **MUST include valid, publicly accessible URLs** (e.g., AWS docs, tutorials, blog posts). Do not invent URLs.
    "priority": "High" | "Medium" | "Low" // Priority based on impact
  }> // **MUST NOT be empty.** Provide at least 2-3 plan items.
}

# ANALYSIS APPROACH
- Look for recurring themes across multiple tests
- Identify skill progression and regression
- Consider the entire test history, not just the most recent test
- Provide nuanced, data-driven recommendations

IMPORTANT: Return ONLY the JSON object conforming to the structure above. No additional text or explanations.
`

      // Generate content from Gemini with timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("AI generation timeout")), 20000)
        )
      ]) as GenerateContentResult;

      const response = result.response;

      try {
        let jsonText = response.text();
        const jsonMatch = jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/) || 
                         jsonText.match(/```(?:json)?([\s\S]*?)```/);
      
      if (jsonMatch && jsonMatch[1]) {
        jsonText = jsonMatch[1].trim();
      }
      
      const analysisReport = JSON.parse(jsonText);
      
        clearTimeout(timeoutId);
      return {
        success: true,
        data: analysisReport
      }
    } catch (parseError) {
        throw new Error("Failed to parse AI response");
      }
    } finally {
      clearTimeout(timeoutId);
    }

  } catch (error: any) {
    if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
      return {
        success: false,
        error: "Analysis took too long. Please try again."
      }
    }

    console.error("Error analyzing test data:", error)
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : "An unexpected error occurred"
    }
  }
} 