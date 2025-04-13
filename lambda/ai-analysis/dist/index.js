"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const generative_ai_1 = require("@google/generative-ai");
const zod_1 = require("zod");
// Schema for validating the request body
const TestDataSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    testId: zod_1.z.string(),
    questions: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        question: zod_1.z.string(),
        userAnswer: zod_1.z.string(),
        correctAnswer: zod_1.z.string(),
        isCorrect: zod_1.z.boolean(),
        category: zod_1.z.string(),
        difficulty: zod_1.z.string(),
    })),
    score: zod_1.z.number(),
    totalQuestions: zod_1.z.number(),
    timeSpent: zod_1.z.number(), // in seconds
});
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
// System prompt for the AI analysis
const SYSTEM_PROMPT = `You are an expert AWS certification instructor analyzing a student's quiz performance.
Your task is to provide detailed, personalized feedback based on their test results, performance metrics, and learning patterns.
Focus on:
1. Overall performance assessment
2. Strengths and areas for improvement
3. Specific recommendations for AWS services they should study
4. Time management insights
5. Personalized study plan
Be encouraging but honest, and provide actionable advice.`;
const formatTestDataForAnalysis = (data) => {
    const correctAnswers = data.questions.filter(q => q.isCorrect).length;
    const percentageScore = (data.score / data.totalQuestions) * 100;
    const averageTimePerQuestion = data.timeSpent / data.totalQuestions;
    // Group questions by category
    const categoryPerformance = data.questions.reduce((acc, q) => {
        if (!acc[q.category]) {
            acc[q.category] = { total: 0, correct: 0 };
        }
        acc[q.category].total++;
        if (q.isCorrect)
            acc[q.category].correct++;
        return acc;
    }, {});
    return `
Test Performance Summary:
- Score: ${data.score}/${data.totalQuestions} (${percentageScore.toFixed(1)}%)
- Time spent: ${Math.floor(data.timeSpent / 60)}m ${data.timeSpent % 60}s
- Average time per question: ${averageTimePerQuestion.toFixed(1)} seconds

Category Breakdown:
${Object.entries(categoryPerformance)
        .map(([category, stats]) => {
        const categoryScore = (stats.correct / stats.total) * 100;
        return `- ${category}: ${stats.correct}/${stats.total} (${categoryScore.toFixed(1)}%)`;
    })
        .join('\n')}

Incorrect Questions:
${data.questions
        .filter(q => !q.isCorrect)
        .map(q => `- ${q.category} (${q.difficulty}): ${q.question}
  Your answer: ${q.userAnswer}
  Correct answer: ${q.correctAnswer}`)
        .join('\n')}
`;
};
const handler = async (event) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Request body is required' }),
            };
        }
        const data = TestDataSchema.parse(JSON.parse(event.body));
        const formattedData = formatTestDataForAnalysis(data);
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: SYSTEM_PROMPT,
                }
            ],
        });
        const result = await chat.sendMessage(formattedData);
        const analysis = result.response.text();
        return {
            statusCode: 200,
            body: JSON.stringify({
                userId: data.userId,
                testId: data.testId,
                analysis,
            }),
        };
    }
    catch (error) {
        console.error('Error processing request:', error);
        if (error instanceof zod_1.z.ZodError) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid request data',
                    details: error.errors,
                }),
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            }),
        };
    }
};
exports.handler = handler;
