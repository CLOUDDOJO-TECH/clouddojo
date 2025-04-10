"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetQuizById(quizId: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const quiz = await prisma.quiz.findUnique({
            where: {
                id: quizId
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                },
                category: true
            }
        });

        if (!quiz) {
            throw new Error(`Quiz with id ${quizId} not found`);
        }

        // Process questions to add correctAnswer array
        const processedQuiz = {
            ...quiz,
            questions: quiz.questions.map(question => {
                // Find all correct options
                const correctOptions = question.options
                    .filter(option => option.isCorrect)
                    .map(option => option.id);
                
                // Add correctAnswer array to question
                return {
                    ...question,
                    correctAnswer: correctOptions
                };
            })
        };

        return {
            success: true,
            data: processedQuiz
        };

    } catch (error) {
        console.error("Error fetching quiz:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
} 