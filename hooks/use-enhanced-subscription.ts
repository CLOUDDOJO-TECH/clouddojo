"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserSubscriptions } from "@/config/actions";
import { getCurrentUserProfile } from "@/app/(actions)/user/user-actions";
import { LsUserSubscription, LsSubscriptionPlan } from "@prisma/client";

export type SubscriptionState =
  | "active"
  | "on_trial"
  | "cancelled"
  | "cancelled_active"
  | "expired"
  | "paused"
  | "past_due"
  | "none";

export type EnhancedSubscriptionStatus = {
  // Basic status
  isSubscribed: boolean;
  isPro: boolean;
  isPremium: boolean;

  // Enhanced states
  state: SubscriptionState;
  isCancelled: boolean;
  isCancelledButActive: boolean;
  isPaused: boolean;
  isPastDue: boolean;
  isExpired: boolean;
  canReactivate: boolean;

  // Plan information
  planName: string | null;
  planPrice: number | null;
  interval: string | null;
  intervalCount: number | null;

  // Billing information
  currentPeriodEnd: Date | null;
  nextBillingDate: Date | null;
  daysUntilExpiry: number | null;

  // Subscription data
  activeSubscription: LsUserSubscription | null;
  billingPortalUrl: string | null;
  updatePaymentMethodUrl: string | null;
  allSubscriptions: LsUserSubscription[];
  subscriptionPlan: LsSubscriptionPlan | null;

  // Loading states
  isLoading: boolean;
  isError: boolean;
};

/**
 * Enhanced subscription hook that provides comprehensive billing state management
 */
export function useEnhancedSubscription(): EnhancedSubscriptionStatus {
  // Fetch current user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserProfile,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch detailed subscription data
  const {
    data: allSubscriptions = [],
    isLoading: isLoadingSubscriptions,
    isError: isSubscriptionsError,
  } = useQuery({
    queryKey: ["user-subscriptions"],
    queryFn: getUserSubscriptions,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Memoize the enhanced subscription status
  const enhancedStatus = useMemo(() => {
    const isLoading = isLoadingUser || isLoadingSubscriptions;
    const isError = isUserError || isSubscriptionsError;

    if (isLoading || isError) {
      return {
        isSubscribed: false,
        isPro: false,
        isPremium: false,
        state: "none" as SubscriptionState,
        isCancelled: false,
        isCancelledButActive: false,
        isPaused: false,
        isPastDue: false,
        isExpired: false,
        canReactivate: false,
        planName: null,
        planPrice: null,
        interval: null,
        intervalCount: null,
        currentPeriodEnd: null,
        nextBillingDate: null,
        daysUntilExpiry: null,
        activeSubscription: null,
        billingPortalUrl: null,
        updatePaymentMethodUrl: null,
        allSubscriptions: [],
        subscriptionPlan: null,
        isLoading,
        isError,
      };
    }

    // Find the most relevant subscription (active, cancelled, or most recent)
    const activeSubscription =
      allSubscriptions.find(
        (sub) => sub.status === "active" || sub.status === "on_trial",
      ) ||
      allSubscriptions.find(
        (sub) =>
          sub.status === "cancelled" && new Date(sub.endsAt || "") > new Date(),
      ) ||
      allSubscriptions[0] ||
      null;

    if (!activeSubscription) {
      return {
        isSubscribed: false,
        isPro: false,
        isPremium: false,
        state: "none" as SubscriptionState,
        isCancelled: false,
        isCancelledButActive: false,
        isPaused: false,
        isPastDue: false,
        isExpired: false,
        canReactivate: false,
        planName: null,
        planPrice: null,
        interval: null,
        intervalCount: null,
        currentPeriodEnd: null,
        nextBillingDate: null,
        daysUntilExpiry: null,
        activeSubscription: null,
        allSubscriptions,
        billingPortalUrl: null,
        updatePaymentMethodUrl: null,
        subscriptionPlan: null,
        isLoading,
        isError,
      };
    }

    // Parse subscription details
    const subscriptionPlan =
      (activeSubscription as any).subscriptionPlan || null;
    const planName = subscriptionPlan?.name || null;
    const planPrice = activeSubscription.price
      ? parseFloat(activeSubscription.price) / 100
      : null;
    const interval = subscriptionPlan?.interval || null;
    const intervalCount = subscriptionPlan?.intervalCount || null;
    const status = activeSubscription.status;
    const isPaused = activeSubscription.isPaused || false;
    const billingPortalUrl = activeSubscription.billingPortalUrl || null;
    const updatePaymentMethodUrl =
      activeSubscription.updatePaymentMethodUrl || null;

    // Parse dates
    const endsAt = activeSubscription.endsAt
      ? new Date(activeSubscription.endsAt)
      : null;
    const renewsAt = activeSubscription.renewsAt
      ? new Date(activeSubscription.renewsAt)
      : null;
    const now = new Date();

    // Calculate days until expiry
    const daysUntilExpiry = endsAt
      ? Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Determine subscription state
    let state: SubscriptionState;
    let isCancelled = false;
    let isCancelledButActive = false;
    let isPastDue = false;
    let isExpired = false;
    let canReactivate = false;

    switch (status) {
      case "active":
        state = "active";
        break;
      case "on_trial":
        state = "on_trial";
        break;
      case "cancelled":
        isCancelled = true;
        if (endsAt && endsAt > now) {
          state = "cancelled_active";
          isCancelledButActive = true;
          canReactivate = true;
        } else {
          state = "expired";
          isExpired = true;
        }
        break;
      case "paused":
        state = "paused";
        canReactivate = true;
        break;
      case "past_due":
        state = "past_due";
        isPastDue = true;
        break;
      default:
        if (endsAt && endsAt < now) {
          state = "expired";
          isExpired = true;
        } else {
          state = "none";
        }
    }

    // Determine plan type
    const planNameLower = planName?.toLowerCase() || "";
    const isPro =
      planNameLower.includes("pro") && !planNameLower.includes("premium");
    const isPremium = planNameLower.includes("premium");

    // Determine if actively subscribed (has access)
    const isSubscribed =
      (isPro || isPremium) &&
      (state === "active" ||
        state === "on_trial" ||
        state === "cancelled_active" ||
        state === "past_due");

    return {
      isSubscribed,
      isPro: isPro && (state === "active" || state === "on_trial"),
      isPremium: isPremium && (state === "active" || state === "on_trial"),
      state,
      isCancelled,
      isCancelledButActive,
      isPaused,
      isPastDue,
      isExpired,
      canReactivate,
      planName,
      planPrice,
      interval,
      intervalCount,
      currentPeriodEnd: endsAt,
      nextBillingDate: isCancelled ? null : renewsAt,
      daysUntilExpiry,
      activeSubscription,
      allSubscriptions,
      billingPortalUrl,
      updatePaymentMethodUrl,
      subscriptionPlan,
      isLoading,
      isError,
    };
  }, [
    userData,
    allSubscriptions,
    isLoadingUser,
    isLoadingSubscriptions,
    isUserError,
    isSubscriptionsError,
  ]);

  return enhancedStatus;
}
