"use client";

import type React from "react";

import {
  Sparkles,
  BookOpenCheck,
  Target,
  Brain,
  Lock,
} from "lucide-react";
import UpgradeButton from "../ui/upgrade-button";
import { cn } from "@/lib/utils";

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: "ai-insights",
    title: "AI-Powered Insights",
    description: "Identify patterns in your answers and pinpoint exactly where to focus",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "personalized",
    title: "Personalized Study Plan",
    description: "Get a week-by-week roadmap built around your weakest topics",
    icon: <BookOpenCheck className="w-5 h-5" />,
  },
  {
    id: "certification",
    title: "Certification Readiness",
    description: "See a clear score of how ready you are to sit your exam",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description: "Track trends over time with detailed performance breakdowns",
    icon: <Brain className="w-5 h-5" />,
  },
];

export default function PaywallCard() {
  return (
    <div className="relative w-full max-w-2xl">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl overflow-hidden",
          "[background-size:32px_32px]",
          "[background-image:linear-gradient(to_right,#e4e4e710_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e710_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#26262640_1px,transparent_1px),linear-gradient(to_bottom,#26262640_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_80%)]" />

      {/* Card */}
      <div className="relative border border-dashed border-border rounded-2xl p-10">
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150" />
            <div className="relative h-14 w-14 rounded-full bg-primary/10 border border-dashed border-primary/30 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Premium AI Analysis
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            Stop guessing what to study next. Get AI-driven insights that
            analyze your performance and build a personalized path to passing
            your certification.
          </p>
        </div>

        {/* Features - 2 column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {premiumFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/40"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <UpgradeButton className="w-full max-w-xs" size="lg" variant="primary">
            Upgrade to Premium
          </UpgradeButton>
        </div>
      </div>
    </div>
  );
}
