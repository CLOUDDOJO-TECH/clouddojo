"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function CheckUser() {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            },
            include: {
                onboarding: true
            }
        });

        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }

        let hasCompletedOnboarding = false;
    
        if (user) {
          const onboarding = await prisma.userOnboarding.findUnique({
            where: { userId },
          });
          
          hasCompletedOnboarding = user.hasCompletedOnboarding || false;
        }
            return {
            success: true,
            data: hasCompletedOnboarding,
            exists: !!user
        };

    } catch (error) {
        console.error("Error fetching quiz:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
} 