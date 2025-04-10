"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { formatTestDataForAI } from "./format-test-data"
import { getUserTestData } from "./get-user-test-data"
import type { TestData } from "./format-test-data"

export async function analyzeTestData() {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key not configured")
    }

    // Initialize the Gemini client
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    // Get and format test data
    const testDataResult = await getUserTestData()
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

    // Generate content from Gemini
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Log the raw response first for debugging
    console.log("Raw AI Response:", text.substring(0, 500) + "...") // First 500 chars for brevity

    // Parse the response
    try {
      // Extract JSON from the response (handle markdown code blocks if present)
      let jsonText = text;
      
      // Check if the response is wrapped in markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/) || 
                        text.match(/```(?:json)?([\s\S]*?)```/);
      
      if (jsonMatch && jsonMatch[1]) {
        jsonText = jsonMatch[1].trim();
        console.log("Extracted JSON from markdown", jsonText.substring(0, 200) + "...");
      }
      
      const analysisReport = JSON.parse(jsonText);
      
      // Log the parsed structure
      console.log("Parsed Report Structure:", Object.keys(analysisReport));
      
      return {
        success: true,
        data: analysisReport
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      // Additional error details for debugging
      console.error("Response text format:", {
        length: text.length,
        startsWithBacktick: text.startsWith('```'),
        startsWithJson: text.startsWith('```json'),
        firstFewChars: text.substring(0, 50)
      });
      
      return {
        success: false,
        error: "Invalid response format from Gemini API"
      }
    }

  } catch (error) {
    console.error("Error analyzing test data:", error)
    
    // Additional debug info
    if (error instanceof Error) {
      console.error("Error stack:", error.stack)
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
} 