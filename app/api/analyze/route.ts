import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

// Initialize the Google Generative AI client
const initGeminiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("Google Gemini API key is required")
  }
  return new GoogleGenerativeAI(apiKey)
}

/**
 * Creates a detailed prompt for the Gemini API
 */
function createGeminiPrompt(testData: any) {
  return `
You are an expert AWS certification analyst with deep knowledge of AWS services, best practices, and certification exams. Your task is to analyze the provided AWS practice test results and generate a comprehensive, detailed report in a specific JSON format.

# CONTEXT
The user has completed an AWS practice test and needs a professional, in-depth analysis of their performance. This analysis will help them understand their strengths and weaknesses, track their progress, and prepare effectively for the AWS certification exam.

# TEST DATA
${JSON.stringify(testData, null, 2)}

# INSTRUCTIONS
1. Analyze the test data thoroughly, identifying patterns, strengths, weaknesses, and areas for improvement.
2. Generate a comprehensive report following EXACTLY the JSON structure provided below.
3. Ensure all fields have appropriate values based on your analysis.
4. Provide detailed, actionable insights and recommendations.
5. Include HTML formatting for text fields that support it.
6. Ensure all numerical scores are consistent and logical.

# REQUIRED OUTPUT FORMAT
Your response must be a valid JSON object with the following structure. Do not deviate from this structure:

\`\`\`json
{
  "metadata": {
    "reportId": "string",
    "generatedAt": "string (ISO timestamp)",
    "userId": "string",
    "userName": "string",
    "testName": "string",
    "testId": "string",
    "testType": "string",
    "testVersion": "string",
    "aiVersion": "string"
  },
  "overview": {
    "overallScore": {
      "value": "number (0-100)",
      "interpretation": "string",
      "passingThreshold": "number",
      "isPassing": "boolean"
    },
    "testSummary": {
      "totalQuestions": "number",
      "answeredQuestions": "number",
      "correctAnswers": "number",
      "incorrectAnswers": "number",
      "skippedQuestions": "number",
      "timeTaken": {
        "seconds": "number",
        "formatted": "string (e.g., '1h 45m')"
      },
      "averageTimePerQuestion": {
        "seconds": "number",
        "formatted": "string"
      },
      "attempts": "number"
    },
    "certificationReadiness": {
      "readinessScore": "number (0-100)",
      "estimatedStudyTime": {
        "hours": "number",
        "formatted": "string"
      },
      "readinessLevel": "string",
      "confidenceScore": "number"
    },
    "improvementFromLastTest": {
      "percentage": "number",
      "lastTestScore": "number",
      "trend": "string"
    },
    "keyMetrics": [
      {
        "name": "string",
        "value": "number",
        "unit": "string",
        "description": "string",
        "trend": "string",
        "changeValue": "number"
      }
    ],
    "summaryHtml": "string (HTML)"
  },
  "performanceBreakdown": {
    "serviceCategories": [
      {
        "name": "string",
        "score": "number",
        "correctAnswers": "number",
        "totalQuestions": "number",
        "importance": "string",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "timeSpent": {
          "seconds": "number",
          "formatted": "string"
        },
        "services": [
          {
            "name": "string",
            "score": "number",
            "correctAnswers": "number",
            "totalQuestions": "number",
            "isStrength": "boolean",
            "topics": [
              {
                "name": "string",
                "score": "number",
                "correctAnswers": "number",
                "totalQuestions": "number",
                "isStrength": "boolean"
              }
            ]
          }
        ],
        "recommendedResources": [
          {
            "title": "string",
            "url": "string",
            "type": "string",
            "description": "string"
          }
        ]
      }
    ],
    "topStrengths": [
      {
        "category": "string",
        "service": "string",
        "description": "string",
        "score": "number",
        "confidenceLevel": "string"
      }
    ],
    "topWeaknesses": [
      {
        "category": "string",
        "service": "string",
        "description": "string",
        "score": "number",
        "impact": "string",
        "recommendedActions": ["string"]
      }
    ],
    "visualData": {
      "categoryScores": {
        "labels": ["string"],
        "data": ["number"],
        "colors": ["string"]
      },
      "serviceBreakdown": {
        "labels": ["string"],
        "data": ["number"],
        "colors": ["string"]
      },
      "strengthsWeaknesses": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "strengthScores": ["number"],
        "weaknessScores": ["number"]
      }
    }
  },
  "questionAnalysis": {
    "questions": [
      {
        "id": "string",
        "index": "number",
        "questionHtml": "string (HTML)",
        "options": [
          {
            "id": "string",
            "text": "string",
            "isCorrect": "boolean",
            "isSelected": "boolean",
            "explanation": "string"
          }
        ],
        "userAnswer": {
          "selectedOptionIds": ["string"],
          "isCorrect": "boolean",
          "isPartiallyCorrect": "boolean",
          "score": "number"
        },
        "correctAnswer": {
          "optionIds": ["string"],
          "explanationHtml": "string (HTML)"
        },
        "metadata": {
          "difficulty": "string",
          "category": "string",
          "service": "string",
          "topics": ["string"],
          "timeSpent": {
            "seconds": "number",
            "formatted": "string"
          },
          "averageTime": {
            "seconds": "number",
            "formatted": "string"
          },
          "isMarkedForReview": "boolean"
        },
        "aiAnalysis": {
          "conceptualGaps": ["string"],
          "misunderstandings": ["string"],
          "recommendedStudyAreas": ["string"],
          "similarQuestionIds": ["string"]
        }
      }
    ],
    "questionStats": {
      "correctVsIncorrect": {
        "correct": "number",
        "incorrect": "number",
        "skipped": "number"
      },
      "difficultyBreakdown": {
        "easy": {
          "total": "number",
          "correct": "number",
          "incorrect": "number",
          "accuracy": "number"
        },
        "medium": {
          "total": "number",
          "correct": "number",
          "incorrect": "number",
          "accuracy": "number"
        },
        "hard": {
          "total": "number",
          "correct": "number",
          "incorrect": "number",
          "accuracy": "number"
        }
      },
      "timeDistribution": {
        "fastestQuestion": {
          "id": "string",
          "timeSeconds": "number",
          "isCorrect": "boolean"
        },
        "slowestQuestion": {
          "id": "string",
          "timeSeconds": "number",
          "isCorrect": "boolean"
        },
        "averageTimePerQuestion": "number",
        "timeByDifficulty": {
          "easy": "number",
          "medium": "number",
          "hard": "number"
        }
      },
      "mostMissedTopics": [
        {
          "topic": "string",
          "missedQuestions": "number",
          "totalQuestions": "number",
          "accuracy": "number",
          "questionIds": ["string"]
        }
      ]
    }
  },
  "recommendations": {
    "summary": "string",
    "prioritizedAreas": [
      {
        "area": "string",
        "priority": "string",
        "reason": "string",
        "impact": "string",
        "currentScore": "number",
        "targetScore": "number",
        "improvementPotential": "number"
      }
    ],
    "studyPlan": {
      "estimatedTimeToReady": {
        "hours": "number",
        "formatted": "string"
      },
      "recommendedPace": {
        "hoursPerWeek": "number",
        "weeksToCompletion": "number"
      },
      "phases": [
        {
          "name": "string",
          "description": "string",
          "focusAreas": ["string"],
          "estimatedHours": "number",
          "resources": [
            {
              "title": "string",
              "url": "string",
              "type": "string",
              "description": "string",
              "estimatedTimeToComplete": {
                "minutes": "number",
                "formatted": "string"
              }
            }
          ],
          "practiceExercises": [
            {
              "title": "string",
              "description": "string",
              "difficulty": "string",
              "estimatedTimeToComplete": {
                "minutes": "number",
                "formatted": "string"
              }
            }
          ]
        }
      ]
    },
    "learningResources": {
      "documentation": [
        {
          "title": "string",
          "url": "string",
          "description": "string",
          "relevance": "string"
        }
      ],
      "tutorials": [
        {
          "title": "string",
          "url": "string",
          "description": "string",
          "difficulty": "string",
          "estimatedTimeToComplete": {
            "minutes": "number",
            "formatted": "string"
          }
        }
      ],
      "videos": [
        {
          "title": "string",
          "url": "string",
          "description": "string",
          "duration": {
            "minutes": "number",
            "formatted": "string"
          }
        }
      ],
      "practiceTests": [
        {
          "title": "string",
          "url": "string",
          "description": "string",
          "difficulty": "string",
          "estimatedTimeToComplete": {
            "minutes": "number",
            "formatted": "string"
          }
        }
      ]
    },
    "customizedAdvice": "string (HTML)"
  },
  "progressTracking": {
    "testHistory": [
      {
        "testId": "string",
        "testName": "string",
        "date": "string (ISO format)",
        "score": "number",
        "timeTaken": {
          "seconds": "number",
          "formatted": "string"
        },
        "improvement": "number"
      }
    ],
    "scoresByCategory": [
      {
        "category": "string",
        "scores": [
          {
            "testId": "string",
            "score": "number"
          }
        ],
        "trend": "string"
      }
    ],
    "weakestAreasProgress": [
      {
        "area": "string",
        "initialScore": "number",
        "currentScore": "number",
        "improvement": "number",
        "trend": "string"
      }
    ],
    "certificationReadinessHistory": [
      {
        "date": "string (ISO format)",
        "readinessScore": "number",
        "estimatedStudyTimeRemaining": {
          "hours": "number",
          "formatted": "string"
        }
      }
    ],
    "visualData": {
      "overallScoreProgress": {
        "labels": ["string"],
        "data": ["number"]
      },
      "categoryScoreProgress": {
        "labels": ["string"],
        "categories": ["string"],
        "datasets": [
          {
            "category": "string",
            "data": ["number"]
          }
        ]
      },
      "timePerTestProgress": {
        "labels": ["string"],
        "data": ["number"]
      }
    }
  },
  "comparativeAnalysis": {
    "peerComparison": {
      "overallScore": {
        "userScore": "number",
        "averageScore": "number",
        "percentile": "number",
        "topPerformerScore": "number"
      },
      "categoryComparison": [
        {
          "category": "string",
          "userScore": "number",
          "averageScore": "number",
          "percentile": "number"
        }
      ],
      "timeComparison": {
        "userTime": {
          "seconds": "number",
          "formatted": "string"
        },
        "averageTime": {
          "seconds": "number",
          "formatted": "string"
        },
        "fastestTime": {
          "seconds": "number",
          "formatted": "string"
        }
      }
    },
    "leaderboard": {
      "userRank": "number",
      "totalUsers": "number",
      "topPerformers": [
        {
          "rank": "number",
          "anonymizedName": "string",
          "score": "number",
          "timeTaken": {
            "seconds": "number",
            "formatted": "string"
          }
        }
      ]
    }
  },
  "exportOptions": {
    "formats": ["string"],
    "pdfTemplate": "string",
    "includeOptions": {
      "questionDetails": "boolean",
      "recommendations": "boolean",
      "comparativeAnalysis": "boolean"
    }
  }
}
\`\`\`

# ANALYSIS APPROACH
As a professional AWS certification analyst, your analysis should:
1. Be data-driven and objective
2. Identify clear patterns in the user's performance
3. Provide specific, actionable recommendations
4. Prioritize areas for improvement based on their impact on certification success
5. Create a realistic and personalized study plan
6. Highlight both strengths to leverage and weaknesses to address
7. Consider the relative importance of different AWS services in the certification exam

Return ONLY the JSON object without any additional text or explanation.
`
}

/**
 * Validates that the report has the expected structure
 */
function validateReportStructure(report: any) {
  // Basic validation of top-level sections
  const requiredSections = [
    "metadata",
    "overview",
    "performanceBreakdown",
    "questionAnalysis",
    "recommendations",
    "progressTracking",
  ]

  for (const section of requiredSections) {
    if (!report[section]) {
      throw new Error(`Missing required section: ${section}`)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()

    // Validate request
    if (!body || !body.testData) {
      return NextResponse.json({ error: "Test data is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Initialize the Gemini client
    const genAI = initGeminiClient(apiKey)

    // Access the Gemini Pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent, analytical responses
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192, // Ensure we have enough tokens for the detailed response
      },
    })

    // Create the prompt for Gemini
    const prompt = createGeminiPrompt(body.testData)

    // Generate content from Gemini
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse the response to ensure it's valid JSON
    let formattedReport
    try {
      // Extract JSON from the response (in case Gemini adds explanatory text)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text]

      const jsonStr = jsonMatch[1] || text
      formattedReport = JSON.parse(jsonStr)

      // Validate the response has the expected structure
      validateReportStructure(formattedReport)
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError)
      return NextResponse.json({ error: "Invalid response format from Gemini API" }, { status: 500 })
    }

    return NextResponse.json(formattedReport)
  } catch (error) {
    console.error("Error analyzing AWS test with Gemini:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze test data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

