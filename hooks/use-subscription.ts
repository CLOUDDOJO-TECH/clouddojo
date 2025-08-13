"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/app/(actions)/user/user-actions";

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
  /** The name of the user's current plan */
  planName: string | null;
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
    isError
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
    if (!userData?.userPlan || typeof userData !== 'object' || !('userPlan' in userData)) {
      return {
        isPro: false,
        isPremium: false,
        isSubscribed: false,
        planName: null
      };
    }

    // Get the plan name from the userPlan object
    const planName = userData.userPlan?.subscriptionPlan?.name || null;

    
    if (!planName) {
      return {
        isPro: false,
        isPremium: false,
        isSubscribed: false,
        planName: null
      };
    }
    
    // Case-insensitive check if the plan name contains "pro" or "premium"
    const planNameLower = planName.toLowerCase();
    const isPro = planNameLower.includes('pro') && !planNameLower.includes('premium');
    const isPremium = planNameLower.includes('premium');
    const isSubscribed = isPro || isPremium;
    
    return {
      isPro,
      isPremium,
      isSubscribed,
      planName
    };
  }, [userData]);
  
  return {
    ...subscriptionStatus,
    isLoading,
    isError
  };
}