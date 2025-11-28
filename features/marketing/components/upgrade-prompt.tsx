"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Trophy, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
  variant?: "inline" | "modal" | "banner";
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
  onClose?: () => void;
}

const DEFAULT_FEATURES = [
  "AI-powered insights after every quiz",
  "Personalized study plans based on your performance",
  "Certification readiness tracking",
  "Priority customer support",
];

export function UpgradePrompt({
  variant = "inline",
  title = "Unlock Premium Features",
  description = "Get AI-powered insights and personalized study plans to ace your certification",
  features = DEFAULT_FEATURES,
  className,
  onClose,
}: UpgradePromptProps) {
  const router = useRouter();

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-emerald-500/20 bg-linear-to-r from-emerald-500/10 to-green-500/10 p-4",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-full bg-emerald-500/20 p-3">
            <Sparkles className="h-6 w-6 text-emerald-500" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground/70 mt-1">{description}</p>
          </div>

          <Button
            onClick={() => router.push("/pricing")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-foreground/60 hover:text-foreground"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <Card className={cn("p-6 border-emerald-500/20 bg-emerald-500/5 max-w-md mx-auto", className)}>
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/20 p-4">
            <Trophy className="h-8 w-8 text-emerald-500" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="text-sm text-foreground/70 mt-2">{description}</p>
          </div>

          <div className="space-y-2 text-left">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={() => router.push("/pricing")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              View Pricing Plans
            </Button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-full text-sm text-foreground/60 hover:text-foreground"
              >
                Maybe later
              </button>
            )}
          </div>

          <p className="text-xs text-foreground/50">
            Starting at $8.99/month • Cancel anytime
          </p>
        </div>
      </Card>
    );
  }

  // Inline variant (default)
  return (
    <Card className={cn("p-6 border-emerald-500/20 bg-emerald-500/5", className)}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-full bg-emerald-500/20 p-2">
            <Target className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-foreground/70 mt-1">{description}</p>
          </div>
        </div>

        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => router.push("/pricing")}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>

        <p className="text-center text-xs text-foreground/50">
          Starting at $8.99/month • Cancel anytime
        </p>
      </div>
    </Card>
  );
}
