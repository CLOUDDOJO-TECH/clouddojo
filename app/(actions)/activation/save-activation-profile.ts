"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { ProfileData } from "@/app/activation/types";

export async function saveActivationProfile(profile: ProfileData, quizAttemptId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to save profile",
      };
    }

    // Create or update user onboarding record
    await prisma.userOnboarding.upsert({
      where: { userId },
      create: {
        userId,
        experience: profile.experience,
        platforms: [profile.platform],
        certifications: [profile.certification],
        role: profile.role,
        focusArea: [], // Will be populated from quiz analysis
      },
      update: {
        experience: profile.experience,
        platforms: [profile.platform],
        certifications: [profile.certification],
        role: profile.role,
      },
    });

    // Mark user as having completed onboarding
    await prisma.user.update({
      where: { userId },
      data: {
        hasCompletedOnboarding: true,
      },
    });

    return {
      success: true,
      data: {
        userId,
        hasCompletedOnboarding: true,
      },
    };
  } catch (error) {
    console.error("Error saving activation profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
}
