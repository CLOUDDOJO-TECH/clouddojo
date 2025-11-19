"use client";

import type React from "react";

import {
  ArrowRight,
  Sparkles,
  BookOpenCheck,
  Target,
  Brain,
} from "lucide-react";
import { useState } from "react";
import UpgradeButton from "../ui/upgrade-button";
import Image from "next/image";
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
    description: "Deep learning pattern analysis",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "personalized",
    title: "Personalized Study Plan",
    description: "Custom learning roadmap",
    icon: <BookOpenCheck className="w-6 h-6" />,
  },
  {
    id: "certification",
    title: "Certification Readiness",
    description: "Track your exam readiness",
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description: "Detailed performance metrics",
    icon: <Brain className="w-6 h-6" />,
  },
];

export default function PaywallCard() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-xl lg:max-w-2xl">

      {/* Main Card */}
      <div className="relative backdrop-blur-xl  p-8 ">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-background"></div>
        {/* 3D Contract Icon */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-2xl rounded-full"></div>
          <Image
            src="/images/wallet-icon.png"
            alt="premium upgrade"
            width={150}
            height={150}
            priority
            className="relative z-10"
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-8 relative">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Premium AI Analysis
          </h1>
          <p className="text-foreground/60 text-sm leading-relaxed">
            Unlock advanced insights and personalized learning recommendations to
            accelerate your certification journey
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8 relative">
          {premiumFeatures.map((feature) => (
            <div
              key={feature.id}
              className="w-full flex items-center  p-4 rounded-2xl transition-all duration-300 bg-foreground/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-emerald-400">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-foreground font-semibold text-base">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/50 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-center w-full items-center gap-4 relative">
          <UpgradeButton className="mt-2 w-[50%]" size="md" variant="primary">
            Upgrade to Premium
          </UpgradeButton>
        </div>
      </div>

      {/* Ambient Glow Effect */}
      <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-3xl -z-10 scale-110" />
    </div>
  );
}
