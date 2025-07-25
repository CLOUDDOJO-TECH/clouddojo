"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetPracticeTests(){
    try {
        const { userId } = await auth();

        if(!userId){
            throw new Error("User not authenticated");
        }

        const tests = await prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                isPublic: true,
                duration: true,
                free: true,
                level: true,
                category: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        questions: true
                    }
                }
            }
        });

        return {
            success: true,
            data: tests
        }

    } catch (error) {
        if (error instanceof Error) {
            console.log("Error: ", error.stack);
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred"
        }
    }
}
