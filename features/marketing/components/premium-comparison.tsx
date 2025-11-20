"use client";

import { Check, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Feature {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

interface PremiumComparisonProps {
  showCTA?: boolean;
  compact?: boolean;
  className?: string;
}

const FEATURES: Feature[] = [
  {
    name: "Practice Quizzes",
    free: "200+ questions",
    premium: "Unlimited",
  },
  {
    name: "Quiz Categories",
    free: "All categories",
    premium: "All categories",
  },
  {
    name: "AI-Powered Insights",
    free: false,
    premium: true,
  },
  {
    name: "Personalized Study Plans",
    free: false,
    premium: true,
  },
  {
    name: "Topic Mastery Tracking",
    free: "Basic stats",
    premium: "Advanced analytics",
  },
  {
    name: "Certification Readiness Score",
    free: false,
    premium: true,
  },
  {
    name: "Custom Study Recommendations",
    free: false,
    premium: true,
  },
  {
    name: "Progress Tracking",
    free: true,
    premium: true,
  },
  {
    name: "Streak & Gamification",
    free: true,
    premium: true,
  },
  {
    name: "PDF Export",
    free: false,
    premium: true,
  },
  {
    name: "Priority Support",
    free: false,
    premium: true,
  },
];

export function PremiumComparison({ showCTA = true, compact = false, className }: PremiumComparisonProps) {
  const router = useRouter();

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-xs text-foreground/70">{value}</span>;
    }
    return value ? (
      <Check className="h-4 w-4 text-emerald-500" />
    ) : (
      <X className="h-4 w-4 text-foreground/20" />
    );
  };

  const displayedFeatures = compact ? FEATURES.slice(0, 6) : FEATURES;

  return (
    <Card className={cn("p-6 border-border", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Free vs Premium
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            See what you get with a Premium subscription
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 text-sm font-medium text-foreground/70">
                  Feature
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground/70">
                  Free
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-foreground/70">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedFeatures.map((feature, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 text-sm text-foreground">
                    {feature.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderFeatureValue(feature.free)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderFeatureValue(feature.premium)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        {showCTA && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Upgrade to unlock all features
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Join thousands of students passing their certifications faster
              </p>
            </div>
            <Button
              onClick={() => router.push("/pricing")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              View Pricing Plans
            </Button>
            <p className="text-center text-xs text-foreground/50">
              Starting at $8.99/month • Cancel anytime
            </p>
          </div>
        )}

        {compact && (
          <div className="text-center">
            <button
              onClick={() => router.push("/pricing")}
              className="text-xs text-emerald-500 hover:text-emerald-600 underline"
            >
              See all features →
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
