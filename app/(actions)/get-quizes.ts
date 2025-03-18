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
            include: {
                questions: {
                    include: {
                        options: true
                    }
                },
                category: true,
            }
        })

        console.log("Tests: ", tests);
        return {
            success: true,
            data: tests
        }


    } catch (error) {
        if (error instanceof Error) {
            console.log("Error: ", error.stack);
          }
    }
        
    };
