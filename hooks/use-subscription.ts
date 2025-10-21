"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUserProfile,
  getPlanById,
} from "@/app/(actions)/user/user-actions";

/**
 * Type definitions for subscription data
 */
export type SubscriptionStatus = {
  /** Whether the user has a Pro subscription */
  isPro: boolean;
  /** Whether the user has a Premium subscription */
  isPremium: boolean;
  /** Whether the user has any paid subscription */
  isSubscribed: boolean;
  /** Whether the subscription is cancelled but still active */
  isCancelled: boolean;
  /** Whether the subscription is paused */
  isPaused: boolean;
  /** The name of the user's current plan */
  planName: string | null;
  /** The current subscription status (active, cancelled, expired, etc.) */
  subscriptionStatus: string | null;
  /** When the subscription ends (for cancelled subscriptions) */
  endsAt: Date | null;
  /** When the subscription renews next */
  renewsAt: Date | null;
  /** Whether subscription data is currently loading */
  isLoading: boolean;
  /** Whether there was an error loading subscription data */
  isError: boolean;
};

/**
 * Custom hook to check user subscription status
 *
 * @returns Object containing subscription status and loading state
 * @example
 * const { isPro, isPremium, isSubscribed, planName, isLoading } = useSubscription();
 *
 * if (isLoading) return <LoadingSpinner />;
 * return isPro ? <ProFeature /> : <UpgradePrompt />;
 */
export function useSubscription(): SubscriptionStatus {
  // Fetch user data with subscription info
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserProfile,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Memoize the subscription status to avoid unnecessary recalculations
  const subscriptionStatus = useMemo(() => {
    // Check if userData exists and has the right structure
    if (
      !userData?.userPlan ||
      typeof userData !== "object" ||
      !("userPlan" in userData)
    ) {
      return {
        isPro: false,
        isPremium: false,
        isSubscribed: false,
        isCancelled: false,
        isPaused: false,
        planName: null,
        subscriptionStatus: null,
        endsAt: null,
        renewsAt: null,
      };
    }

    // Get the plan name and subscription details from the userPlan object
    const planName = userData.userPlan?.subscriptionPlan?.name || null;
    const status = userData.userPlan?.status || null;
    const isPaused = userData.userPlan?.isPaused || false;
    const endsAt = userData.userPlan?.endsAt
      ? new Date(userData.userPlan.endsAt)
      : null;
    const renewsAt = userData.userPlan?.renewsAt
      ? new Date(userData.userPlan.renewsAt)
      : null;

    if (!planName) {
      return {
        isPro: false,
        isPremium: false,
        isSubscribed: false,
        isCancelled: false,
        isPaused: false,
        planName: null,
        subscriptionStatus: status,
        endsAt,
        renewsAt,
      };
    }

    // Case-insensitive check if the plan name contains "pro" or "premium"
    const planNameLower = planName.toLowerCase();
    const isPro =
      planNameLower.includes("pro") && !planNameLower.includes("premium");
    const isPremium = planNameLower.includes("premium");

    // Determine if subscription is active (including cancelled but still in grace period)
    const isActiveStatus = status === "active" || status === "on_trial";
    const isCancelledStatus = status === "cancelled";
    const isSubscribed =
      (isPro || isPremium) && (isActiveStatus || isCancelledStatus);

    return {
      isPro: isPro && isActiveStatus,
      isPremium: isPremium && isActiveStatus,
      isSubscribed,
      isCancelled: isCancelledStatus,
      isPaused,
      planName,
      subscriptionStatus: status,
      endsAt,
      renewsAt,
    };
  }, [userData]);

  return {
    ...subscriptionStatus,
    isLoading,
    isError,
  };
}

export const useGetPlanById = (id: string) => {
  const {
    data: planData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: () => getPlanById(id),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    plan: planData,
    isLoading,
    isError,
  };
};
