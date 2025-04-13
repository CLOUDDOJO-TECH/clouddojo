import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

// Schema for validating the request body
const TestDataSchema = z.object({
  userId: z.string(),
  testId: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    userAnswer: z.string(),
    correctAnswer: z.string(),
    isCorrect: z.boolean(),
    category: z.string(),
    difficulty: z.string(),
  })),
  score: z.number(),
  totalQuestions: z.number(),
  timeSpent: z.number(), // in seconds
})

type TestData = z.infer<typeof TestDataSchema>

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// System prompt for the AI analysis
const SYSTEM_PROMPT = `You are an expert AWS certification instructor analyzing a student's quiz performance.
Your task is to provide detailed, personalized feedback based on their test results, performance metrics, and learning patterns.
Focus on:
1. Overall performance assessment
2. Strengths and areas for improvement
3. Specific recommendations for AWS services they should study
4. Time management insights
5. Personalized study plan
Be encouraging but honest, and provide actionable advice.`

const formatTestDataForAnalysis = (data: TestData): string => {
  const correctAnswers = data.questions.filter(q => q.isCorrect).length
  const percentageScore = (data.score / data.totalQuestions) * 100
  const averageTimePerQuestion = data.timeSpent / data.totalQuestions

  // Group questions by category
  const categoryPerformance = data.questions.reduce((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = { total: 0, correct: 0 }
    }
    acc[q.category].total++
    if (q.isCorrect) acc[q.category].correct++
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  return `
Test Performance Summary:
- Score: ${data.score}/${data.totalQuestions} (${percentageScore.toFixed(1)}%)
- Time spent: ${Math.floor(data.timeSpent / 60)}m ${data.timeSpent % 60}s
- Average time per question: ${averageTimePerQuestion.toFixed(1)} seconds

Category Breakdown:
${Object.entries(categoryPerformance)
  .map(([category, stats]) => {
    const categoryScore = (stats.correct / stats.total) * 100
    return `- ${category}: ${stats.correct}/${stats.total} (${categoryScore.toFixed(1)}%)`
  })
  .join('\n')}

Incorrect Questions:
${data.questions
  .filter(q => !q.isCorrect)
  .map(q => `- ${q.category} (${q.difficulty}): ${q.question}
  Your answer: ${q.userAnswer}
  Correct answer: ${q.correctAnswer}`)
  .join('\n')}
`
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' }),
      }
    }

    const data = TestDataSchema.parse(JSON.parse(event.body))
    const formattedData = formatTestDataForAnalysis(data)

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: SYSTEM_PROMPT,
        }
      ],
    })

    const result = await chat.sendMessage(formattedData)
    const analysis = result.response.text()

    return {
      statusCode: 200,
      body: JSON.stringify({
        userId: data.userId,
        testId: data.testId,
        analysis,
      }),
    }
  } catch (error) {
    console.error('Error processing request:', error)

    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid request data',
          details: error.errors,
        }),
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    }
  }
} 

