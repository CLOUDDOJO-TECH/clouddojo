/**
 * Get User Subscription Tier
 *
 * Determines whether a user is on free, premium, or pro tier
 */

import { prisma } from "@/lib/prisma";

export type UserTier = "free" | "premium" | "pro";

/**
 * Get user's subscription tier
 */
export async function getUserSubscriptionTier(userId: string): Promise<UserTier> {
  try {
    // Check for active subscription
    const subscription = await prisma.lsUserSubscription.findFirst({
      where: {
        userId,
        status: {
          in: ["active", "on_trial"], // Active or trial subscriptions
        },
      },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!subscription) {
      return "free";
    }

    // Determine tier based on plan name
    const planName = subscription.subscriptionPlan.name.toLowerCase();

    if (planName.includes("pro")) {
      return "pro";
    }

    if (planName.includes("premium")) {
      return "premium";
    }

    // Default to premium if they have any active subscription
    return "premium";
  } catch (error) {
    console.error("Error getting user tier:", error);
    return "free"; // Default to free on error
  }
}

/**
 * Check if user has premium access (premium or pro tier)
 */
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  const tier = await getUserSubscriptionTier(userId);
  return tier !== "free";
}
