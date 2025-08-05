"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  OnboardingData,
  onboardingDataSchema,
} from "@/app/onboarding/types/onboarding";

/**
 * Save onboarding data to the database
 */
export async function saveOnboardingData(data: OnboardingData) {
  try {
    // Verify authentication
    const session = await auth();
    const userId = session.userId;
    const user = await currentUser();

    if (!userId || !user) {
      return { error: "Unauthorized", success: false };
    }

    // Validate input data
    const validatedData = onboardingDataSchema.parse(data);

    // Check if the user exists in our database
    const dbUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!dbUser) {
      return { error: "User not found", success: false };
    }

    // Update or create onboarding data
    await prisma.userOnboarding.upsert({
      where: { userId },
      update: { ...validatedData, completedAt: new Date() },
      create: { userId, ...validatedData, completedAt: new Date() },
    });

    // Update the user's hasCompletedOnboarding flag
    await prisma.user.update({
      where: { userId },
      data: { hasCompletedOnboarding: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Error processing onboarding data:", error);
    return { error: "Failed to save onboarding data", success: false };
  }
}

/**
 * Get onboarding data and status for the current user
 */
export async function getOnboardingData() {
  try {
    // Verify authentication
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return { error: "Unauthorized", success: false };
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!dbUser) {
      return { error: "User not found", success: false };
    }

    // Get onboarding data
    const onboarding = await prisma.userOnboarding.findUnique({
      where: { userId },
    });

    return {
      success: true,
      hasCompletedOnboarding: dbUser.hasCompletedOnboarding,
      onboardingData: onboarding,
    };
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    return { error: "Failed to fetch onboarding data", success: false };
  }
}

/**
 * Check if a user has completed onboarding
 */
export async function checkOnboardingStatus() {
  try {
    // Verify authentication
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return {
        error: "Unauthorized",
        success: false,
        exists: false,
        hasCompletedOnboarding: false,
      };
    }

    // Check if user exists in our database
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    // Check if onboarding has been completed
    let hasCompletedOnboarding = false;

    if (user) {
      hasCompletedOnboarding = user.hasCompletedOnboarding || false;
    }

    return {
      success: true,
      exists: !!user,
      hasCompletedOnboarding,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return {
      error: "Failed to check onboarding status",
      success: false,
      exists: false,
      hasCompletedOnboarding: false,
    };
  }
}
