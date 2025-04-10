/**
 * AWS Practice Test AI Report Data Format
 * 
 * This schema defines the structure of data returned by the AI
 * for rendering a premium AWS practice test analysis report.
 */

const awsReportSchema = {
    /**
     * Metadata about the report and user
     */
    metadata: {
      reportId: "string", // Unique identifier for the report
      generatedAt: "string", // ISO timestamp of when the report was generated
      userId: "string", // Unique identifier for the user
      userName: "string", // Name of the user
      testName: "string", // Name of the practice test
      testId: "string", // Unique identifier for the test
      testType: "string", // Type of test (e.g., "Solutions Architect Associate")
      testVersion: "string", // Version of the test
      aiVersion: "string" // Version of the AI that generated the report
    },
  
    /**
     * Overview section with summary metrics
     */
    overview: {
      overallScore: {
        value: "number", // Overall score as a percentage (0-100)
        interpretation: "string", // Interpretation of the score (e.g., "Excellent", "Good", "Needs Improvement")
        passingThreshold: "number", // Passing threshold for the test (e.g., 70)
        isPassing: "boolean" // Whether the score is passing
      },
      testSummary: {
        totalQuestions: "number", // Total number of questions in the test
        answeredQuestions: "number", // Number of questions answered
        correctAnswers: "number", // Number of correct answers
        incorrectAnswers: "number", // Number of incorrect answers
        skippedQuestions: "number", // Number of skipped questions
        timeTaken: {
          seconds: "number", // Total time taken in seconds
          formatted: "string" // Formatted time (e.g., "1h 45m")
        },
        averageTimePerQuestion: {
          seconds: "number", // Average time per question in seconds
          formatted: "string" // Formatted time (e.g., "1m 30s")
        },
        attempts: "number" // Number of attempts on this test
      },
      certificationReadiness: {
        readinessScore: "number", // Readiness score as a percentage (0-100)
        estimatedStudyTime: {
          hours: "number", // Estimated study time needed in hours
          formatted: "string" // Formatted time (e.g., "20-30 hours")
        },
        readinessLevel: "string", // Readiness level (e.g., "Ready", "Almost Ready", "Needs Practice", "Not Ready")
        confidenceScore: "number" // AI confidence in the readiness assessment (0-100)
      },
      improvementFromLastTest: {
        percentage: "number", // Improvement percentage from last test (can be negative)
        lastTestScore: "number", // Score from the last test
        trend: "string" // Trend direction ("improving", "declining", "stable")
      },
      keyMetrics: [
        {
          name: "string", // Name of the metric (e.g., "Accuracy")
          value: "number", // Value of the metric
          unit: "string", // Unit of the metric (e.g., "%", "min")
          description: "string", // Description of the metric
          trend: "string", // Trend direction ("up", "down", "stable")
          changeValue: "number" // Change value from previous test
        }
      ],
      summaryHtml: "string" // HTML string with a concise summary of the performance
    },
  
    /**
     * Performance breakdown by AWS service category
     */
    performanceBreakdown: {
      serviceCategories: [
        {
          name: "string", // Name of the service category (e.g., "Compute")
          score: "number", // Score for this category as a percentage (0-100)
          correctAnswers: "number", // Number of correct answers in this category
          totalQuestions: "number", // Total number of questions in this category
          importance: "string", // Importance of this category for the certification ("high", "medium", "low")
          strengths: ["string"], // Array of strengths in this category
          weaknesses: ["string"], // Array of weaknesses in this category
          timeSpent: {
            seconds: "number", // Time spent on this category in seconds
            formatted: "string" // Formatted time (e.g., "15m")
          },
          services: [
            {
              name: "string", // Name of the specific service (e.g., "EC2")
              score: "number", // Score for this service as a percentage (0-100)
              correctAnswers: "number", // Number of correct answers for this service
              totalQuestions: "number", // Total number of questions for this service
              isStrength: "boolean", // Whether this service is a strength
              topics: [
                {
                  name: "string", // Name of the topic (e.g., "Instance Types")
                  score: "number", // Score for this topic as a percentage (0-100)
                  correctAnswers: "number", // Number of correct answers for this topic
                  totalQuestions: "number", // Total number of questions for this topic
                  isStrength: "boolean" // Whether this topic is a strength
                }
              ]
            }
          ],
          recommendedResources: [
            {
              title: "string", // Title of the resource
              url: "string", // URL of the resource
              type: "string", // Type of resource (e.g., "documentation", "video", "tutorial")
              description: "string" // Description of the resource
            }
          ]
        }
      ],
      topStrengths: [
        {
          category: "string", // Category of the strength
          service: "string", // Service related to the strength
          description: "string", // Description of the strength
          score: "number", // Score related to this strength
          confidenceLevel: "string" // AI confidence in this assessment ("high", "medium", "low")
        }
      ],
      topWeaknesses: [
        {
          category: "string", // Category of the weakness
          service: "string", // Service related to the weakness
          description: "string", // Description of the weakness
          score: "number", // Score related to this weakness
          impact: "string", // Impact on certification ("high", "medium", "low")
          recommendedActions: ["string"] // Array of recommended actions
        }
      ],
      visualData: {
        categoryScores: {
          labels: ["string"], // Array of category names
          data: ["number"], // Array of scores for each category
          colors: ["string"] // Array of colors for each category
        },
        serviceBreakdown: {
          labels: ["string"], // Array of service names
          data: ["number"], // Array of scores for each service
          colors: ["string"] // Array of colors for each service
        },
        strengthsWeaknesses: {
          strengths: ["string"], // Array of strength descriptions
          weaknesses: ["string"], // Array of weakness descriptions
          strengthScores: ["number"], // Array of scores for strengths
          weaknessScores: ["number"] // Array of scores for weaknesses
        }
      }
    },
  
    /**
     * Detailed question-level analysis
     */
    questionAnalysis: {
      questions: [
        {
          id: "string", // Unique identifier for the question
          index: "number", // Index of the question in the test
          questionHtml: "string", // HTML content of the question
          options: [
            {
              id: "string", // Unique identifier for the option
              text: "string", // Text of the option
              isCorrect: "boolean", // Whether this option is correct
              isSelected: "boolean", // Whether this option was selected by the user
              explanation: "string" // Explanation for why this option is correct/incorrect
            }
          ],
          userAnswer: {
            selectedOptionIds: ["string"], // Array of selected option IDs
            isCorrect: "boolean", // Whether the user's answer is correct
            isPartiallyCorrect: "boolean", // Whether the user's answer is partially correct
            score: "number" // Score for this question (0-100)
          },
          correctAnswer: {
            optionIds: ["string"], // Array of correct option IDs
            explanationHtml: "string" // HTML explanation of the correct answer
          },
          metadata: {
            difficulty: "string", // Difficulty level ("easy", "medium", "hard")
            category: "string", // AWS service category
            service: "string", // Specific AWS service
            topics: ["string"], // Array of topics covered by the question
            timeSpent: {
              seconds: "number", // Time spent on this question in seconds
              formatted: "string" // Formatted time (e.g., "45s")
            },
            averageTime: {
              seconds: "number", // Average time spent by other users in seconds
              formatted: "string" // Formatted time (e.g., "30s")
            },
            isMarkedForReview: "boolean" // Whether the user marked this question for review
          },
          aiAnalysis: {
            conceptualGaps: ["string"], // Array of conceptual gaps identified
            misunderstandings: ["string"], // Array of misunderstandings identified
            recommendedStudyAreas: ["string"], // Array of recommended study areas
            similarQuestionIds: ["string"] // Array of similar question IDs
          }
        }
      ],
      questionStats: {
        correctVsIncorrect: {
          correct: "number", // Number of correct answers
          incorrect: "number", // Number of incorrect answers
          skipped: "number" // Number of skipped questions
        },
        difficultyBreakdown: {
          easy: {
            total: "number", // Total number of easy questions
            correct: "number", // Number of correct easy questions
            incorrect: "number", // Number of incorrect easy questions
            accuracy: "number" // Accuracy percentage for easy questions
          },
          medium: {
            total: "number", // Total number of medium questions
            correct: "number", // Number of correct medium questions
            incorrect: "number", // Number of incorrect medium questions
            accuracy: "number" // Accuracy percentage for medium questions
          },
          hard: {
            total: "number", // Total number of hard questions
            correct: "number", // Number of correct hard questions
            incorrect: "number", // Number of incorrect hard questions
            accuracy: "number" // Accuracy percentage for hard questions
          }
        },
        timeDistribution: {
          fastestQuestion: {
            id: "string", // ID of the fastest answered question
            timeSeconds: "number", // Time spent in seconds
            isCorrect: "boolean" // Whether the answer was correct
          },
          slowestQuestion: {
            id: "string", // ID of the slowest answered question
            timeSeconds: "number", // Time spent in seconds
            isCorrect: "boolean" // Whether the answer was correct
          },
          averageTimePerQuestion: "number", // Average time per question in seconds
          timeByDifficulty: {
            easy: "number", // Average time for easy questions in seconds
            medium: "number", // Average time for medium questions in seconds
            hard: "number" // Average time for hard questions in seconds
          }
        },
        mostMissedTopics: [
          {
            topic: "string", // Name of the topic
            missedQuestions: "number", // Number of missed questions
            totalQuestions: "number", // Total number of questions on this topic
            accuracy: "number", // Accuracy percentage for this topic
            questionIds: ["string"] // Array of question IDs related to this topic
          }
        ]
      }
    },
  
    /**
     * Personalized recommendations for improvement
     */
    recommendations: {
      summary: "string", // Summary of recommendations
      prioritizedAreas: [
        {
          area: "string", // Area to focus on (e.g., "VPC Networking")
          priority: "string", // Priority level ("high", "medium", "low")
          reason: "string", // Reason for this priority
          impact: "string", // Impact on certification success
          currentScore: "number", // Current score in this area
          targetScore: "number", // Target score to achieve
          improvementPotential: "number" // Potential improvement in overall score
        }
      ],
      studyPlan: {
        estimatedTimeToReady: {
          hours: "number", // Estimated hours needed
          formatted: "string" // Formatted time (e.g., "20-30 hours")
        },
        recommendedPace: {
          hoursPerWeek: "number", // Recommended hours per week
          weeksToCompletion: "number" // Estimated weeks to completion
        },
        phases: [
          {
            name: "string", // Name of the phase (e.g., "Week 1: Networking Focus")
            description: "string", // Description of the phase
            focusAreas: ["string"], // Array of focus areas
            estimatedHours: "number", // Estimated hours for this phase
            resources: [
              {
                title: "string", // Title of the resource
                url: "string", // URL of the resource
                type: "string", // Type of resource (e.g., "documentation", "video", "tutorial")
                description: "string", // Description of the resource
                estimatedTimeToComplete: {
                  minutes: "number", // Estimated minutes to complete
                  formatted: "string" // Formatted time (e.g., "45 min")
                }
              }
            ],
            practiceExercises: [
              {
                title: "string", // Title of the exercise
                description: "string", // Description of the exercise
                difficulty: "string", // Difficulty level ("easy", "medium", "hard")
                estimatedTimeToComplete: {
                  minutes: "number", // Estimated minutes to complete
                  formatted: "string" // Formatted time (e.g., "30 min")
                }
              }
            ]
          }
        ]
      },
      learningResources: {
        documentation: [
          {
            title: "string", // Title of the documentation
            url: "string", // URL of the documentation
            description: "string", // Description of the documentation
            relevance: "string" // Relevance to the user's needs ("high", "medium", "low")
          }
        ],
        tutorials: [
          {
            title: "string", // Title of the tutorial
            url: "string", // URL of the tutorial
            description: "string", // Description of the tutorial
            difficulty: "string", // Difficulty level ("beginner", "intermediate", "advanced")
            estimatedTimeToComplete: {
              minutes: "number", // Estimated minutes to complete
              formatted: "string" // Formatted time (e.g., "60 min")
            }
          }
        ],
        videos: [
          {
            title: "string", // Title of the video
            url: "string", // URL of the video
            description: "string", // Description of the video
            duration: {
              minutes: "number", // Duration in minutes
              formatted: "string" // Formatted duration (e.g., "15 min")
            }
          }
        ],
        practiceTests: [
          {
            title: "string", // Title of the practice test
            url: "string", // URL of the practice test
            description: "string", // Description of the practice test
            difficulty: "string", // Difficulty level ("easy", "medium", "hard")
            estimatedTimeToComplete: {
              minutes: "number", // Estimated minutes to complete
              formatted: "string" // Formatted time (e.g., "120 min")
            }
          }
        ]
      },
      customizedAdvice: "string" // HTML string with customized advice based on performance
    },
  
    /**
     * Progress tracking over time
     */
    progressTracking: {
      testHistory: [
        {
          testId: "string", // Unique identifier for the test
          testName: "string", // Name of the test
          date: "string", // Date of the test (ISO format)
          score: "number", // Overall score as a percentage
          timeTaken: {
            seconds: "number", // Time taken in seconds
            formatted: "string" // Formatted time (e.g., "1h 30m")
          },
          improvement: "number" // Improvement from previous test (percentage points)
        }
      ],
      scoresByCategory: [
        {
          category: "string", // Name of the category
          scores: [
            {
              testId: "string", // ID of the test
              score: "number" // Score for this category in this test
            }
          ],
          trend: "string" // Trend direction ("improving", "declining", "stable")
        }
      ],
      weakestAreasProgress: [
        {
          area: "string", // Name of the area
          initialScore: "number", // Initial score in this area
          currentScore: "number", // Current score in this area
          improvement: "number", // Improvement in percentage points
          trend: "string" // Trend direction ("improving", "declining", "stable")
        }
      ],
      certificationReadinessHistory: [
        {
          date: "string", // Date of the assessment (ISO format)
          readinessScore: "number", // Readiness score as a percentage
          estimatedStudyTimeRemaining: {
            hours: "number", // Estimated hours remaining
            formatted: "string" // Formatted time (e.g., "15-20 hours")
          }
        }
      ],
      visualData: {
        overallScoreProgress: {
          labels: ["string"], // Array of test dates/names
          data: ["number"] // Array of scores
        },
        categoryScoreProgress: {
          labels: ["string"], // Array of test dates/names
          categories: ["string"], // Array of category names
          datasets: [
            {
              category: "string", // Name of the category
              data: ["number"] // Array of scores for this category
            }
          ]
        },
        timePerTestProgress: {
          labels: ["string"], // Array of test dates/names
          data: ["number"] // Array of times in minutes
        }
      }
    },
  
    /**
     * Comparative analysis (optional)
     */
    comparativeAnalysis: {
      peerComparison: {
        overallScore: {
          userScore: "number", // User's overall score
          averageScore: "number", // Average score of peers
          percentile: "number", // User's percentile ranking
          topPerformerScore: "number" // Score of top performers
        },
        categoryComparison: [
          {
            category: "string", // Name of the category
            userScore: "number", // User's score in this category
            averageScore: "number", // Average score in this category
            percentile: "number" // User's percentile in this category
          }
        ],
        timeComparison: {
          userTime: {
            seconds: "number", // User's time in seconds
            formatted: "string" // Formatted time (e.g., "1h 45m")
          },
          averageTime: {
            seconds: "number", // Average time in seconds
            formatted: "string" // Formatted time (e.g., "2h")
          },
          fastestTime: {
            seconds: "number", // Fastest time in seconds
            formatted: "string" // Formatted time (e.g., "1h 15m")
          }
        }
      },
      leaderboard: {
        userRank: "number", // User's rank on the leaderboard
        totalUsers: "number", // Total number of users
        topPerformers: [
          {
            rank: "number", // Rank on the leaderboard
            anonymizedName: "string", // Anonymized name
            score: "number", // Score as a percentage
            timeTaken: {
              seconds: "number", // Time taken in seconds
              formatted: "string" // Formatted time (e.g., "1h 30m")
            }
          }
        ]
      }
    },
  
    /**
     * Export options
     */
    exportOptions: {
      formats: ["string"], // Array of available export formats (e.g., "pdf", "csv", "json")
      pdfTemplate: "string", // Template to use for PDF export
      includeOptions: {
        questionDetails: "boolean", // Whether to include question details
        recommendations: "boolean", // Whether to include recommendations
        comparativeAnalysis: "boolean" // Whether to include comparative analysis
      }
    }
  };
  
  // Example data following the schema
  