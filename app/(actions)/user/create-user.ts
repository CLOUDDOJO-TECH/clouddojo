"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type CreateUserProps = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
}
export async function CreateUser({ userId, email, firstName, lastName}: CreateUserProps) {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await prisma.user.create({
            data: {
                userId,
                email,
                firstName,
                lastName
            }
        });

        return {
            success: true,
            isCreated: !!user
        }

    } catch (error) {
        console.error("Error fetching quiz:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
} 