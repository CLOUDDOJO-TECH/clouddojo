"use client";

import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Pause,
  CreditCard,
} from "lucide-react";
import { SubscriptionState } from "@/hooks/use-enhanced-subscription";

interface SubscriptionStatusBadgeProps {
  state: SubscriptionState;
  daysUntilExpiry?: number | null;
  className?: string;
}

export function SubscriptionStatusBadge({
  state,
  daysUntilExpiry,
  className,
}: SubscriptionStatusBadgeProps) {
  const getStatusConfig = (state: SubscriptionState) => {
    switch (state) {
      case "active":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          text: "Active",
          className:
            "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
        };

      case "on_trial":
        return {
          variant: "outline" as const,
          icon: Clock,
          text: "Trial",
          className:
            "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        };

      case "cancelled_active":
        return {
          variant: "outline" as const,
          icon: AlertTriangle,
          text:
            daysUntilExpiry && daysUntilExpiry > 0
              ? `Cancelled | Ends in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}`
              : "Cancelled",
          className:
            "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
        };

      case "cancelled":
      case "expired":
        return {
          variant: "outline" as const,
          icon: XCircle,
          text: "Expired",
          className:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        };

      case "paused":
        return {
          variant: "outline" as const,
          icon: Pause,
          text: "Paused",
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
        };

      case "past_due":
        return {
          variant: "outline" as const,
          icon: CreditCard,
          text: "Payment Due",
          className:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        };

      default:
        return {
          variant: "outline" as const,
          icon: XCircle,
          text: "No Plan",
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
        };
    }
  };

  const config = getStatusConfig(state);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1.5 px-3 py-1 ${config.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}
