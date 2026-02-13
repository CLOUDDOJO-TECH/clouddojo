"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEnhancedSubscription } from "@/hooks/use-enhanced-subscription";
import {
  CreditCard,
  AlertTriangle,
  ArrowUpCircle,
  ExternalLink,
  WalletCards,
} from "lucide-react";
import { format } from "date-fns";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { BillingHistory } from "./billing-history";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionSettings() {
  const handleManageBilling = (url: string) => {
    window.open(url, "_blank");
  };

  const {
    isLoading,
    isError,
    state,
    isSubscribed,
    isCancelledButActive,
    isPastDue,
    canReactivate,
    planName,
    planPrice,
    interval,
    intervalCount,
    currentPeriodEnd,
    nextBillingDate,
    daysUntilExpiry,
    activeSubscription,
    billingPortalUrl,
    updatePaymentMethodUrl,
    allSubscriptions,
  } = useEnhancedSubscription();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="p-6 space-y-6">
            {/* Header row: title + badge */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Plan info grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>

            {/* Action button */}
            <Skeleton className="h-10 w-72 rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading subscription information. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card className="border-dashed">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Current Plan</h3>
            <SubscriptionStatusBadge
              state={state}
              daysUntilExpiry={daysUntilExpiry}
            />
          </div>
          {isSubscribed || isCancelledButActive ? (
            <div className="space-y-6">
              {/* Plan Information */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{planName}</h3>
                  <p className="text-2xl font-bold">
                    ${planPrice?.toFixed(2) || "0.00"}
                    <span className="text-sm text-muted-foreground font-normal">
                      /
                      {intervalCount && intervalCount > 1
                        ? `${intervalCount} ${interval}s`
                        : interval || "month"}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {isCancelledButActive ? "Access Until" : "Next Billing"}
                  </p>
                  <p className="font-semibold">
                    {isCancelledButActive && currentPeriodEnd
                      ? format(currentPeriodEnd, "MMM dd, yyyy")
                      : nextBillingDate
                        ? format(nextBillingDate, "MMM dd, yyyy")
                        : "N/A"}
                  </p>
                </div>

                {/*<div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">
                    {activeSubscription?.statusFormatted ||
                      activeSubscription?.status ||
                      "Unknown"}
                  </p>
                </div>*/}
              </div>

              {/* Status-specific alerts */}
              {isCancelledButActive && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      Subscription Cancelled
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Your subscription will remain active until{" "}
                      <strong>
                        {currentPeriodEnd
                          ? format(currentPeriodEnd, "MMMM dd, yyyy")
                          : "the end of your billing period"}
                      </strong>
                      . You can reactivate anytime before then to continue
                      uninterrupted access.
                    </p>
                    {daysUntilExpiry && daysUntilExpiry > 0 && (
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}{" "}
                        remaining
                      </p>
                    )}
                  </div>
                </div>
              )}

              {isPastDue && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-red-800 dark:text-red-200">
                      Payment Required
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Your payment method was declined. Please update your
                      payment information to continue your subscription.
                    </p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        window.open(
                          "https://app.lemonsqueezy.com/my-orders",
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </div>
                </div>
              )}

              {billingPortalUrl && (
                <Link href={billingPortalUrl} target="_blank">
                  <Button className="w-full md:w-auto mt-6">
                    <WalletCards className="h-4 w-4 mr-2" />
                    Manage Subscriptions and Billing
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-semibold mb-1">
                No Active Subscription
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                You're on the free plan. Upgrade to unlock premium features and unlimited practice tests.
              </p>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/pricing")}
                className="gap-2"
              >
                <ArrowUpCircle className="h-4 w-4" />
                View Plans & Pricing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
