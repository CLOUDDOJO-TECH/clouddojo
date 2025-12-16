"use client";
import React from "react";
import {
  IconSparkle3OutlineDuo18,
  IconTasks2OutlineDuo18,
  IconTargetFillDuo18,
  IconForkliftFillDuo18,
  IconGamingButtonsFillDuo18,
  IconEarthOutlineDuo18,
  IconLinkFillDuo18,
  IconXmarkFillDuo18,
  IconFeatherFillDuo18,
  IconInfoCircle,
} from "./icons";
import { LogoGradientFull } from "@/public/brand/logo-gradient-full";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const comparisonData = [
  {
    feature: "Study materials",
    clouddojo: "Interactive tests with AI hints",
    others: "Static PDFs and brain dumps",
    icon: IconFeatherFillDuo18,
    color: "text-teal-400",
    tooltip:
      "Practice with real exam-style questions powered by AI that provides instant hints and explanations when you're stuck.",
  },
  {
    feature: "AI feedback",
    clouddojo: "Instant AI analysis per quiz",
    others: "No feedback or days later",
    icon: IconSparkle3OutlineDuo18,
    color: "text-pink-400",
    tooltip:
      "Get immediate, personalized analysis after every quiz showing your strengths, weaknesses, and areas to focus on.",
  },
  {
    feature: "Hands-on projects",
    clouddojo: "Real cloud infrastructure builds",
    others: "Theory only or paid separately",
    icon: IconForkliftFillDuo18,
    color: "text-orange-400",
    tooltip:
      "Build actual cloud infrastructure on AWS, Azure, and GCP with guided projects that mirror real-world scenarios.",
  },
  {
    feature: "Multi-cloud coverage",
    clouddojo: "AWS, Azure, GCP in one platform",
    others: "One provider per course",
    icon: IconEarthOutlineDuo18,
    color: "text-violet-400",
    tooltip:
      "Master all major cloud providers in one place instead of juggling multiple platforms and subscriptions.",
  },
  {
    feature: "Competitive leaderboards",
    clouddojo: "Global rankings and achievements",
    others: "No gamification or limited",
    icon: IconGamingButtonsFillDuo18,
    color: "text-cyan-400",
    tooltip:
      "Compete with cloud professionals worldwide, earn achievements, and track your ranking as you progress.",
  },
  {
    feature: "Smart flashcards",
    clouddojo: "AI-generated from your mistakes",
    others: "Manual creation or none",
    icon: IconTasks2OutlineDuo18,
    color: "text-emerald-400",
    tooltip:
      "AI automatically creates flashcards from questions you get wrong, helping you focus on what you need to learn.",
  },
  {
    feature: "Certification roadmap",
    clouddojo: "Personalized study path with milestones",
    others: "Generic study guides",
    icon: IconTargetFillDuo18,
    color: "text-blue-400",
    tooltip:
      "Follow a customized study plan based on your current skill level, target certification, and learning pace.",
  },
];

export const ComparisonSection: React.FC = () => {
  return (
    <TooltipProvider>
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto font-main">
        {/* Separator */}
        <div className="w-full border-t-2 border-dotted border-border/50 mb-16 md:mb-24"></div>

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
            Built for cloud professionals,
            <br />
            not certification mills
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            We built CloudDojo because existing platforms are either too
            expensive, too outdated, or too generic. Usually all three.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 pb-6 border-b border-border">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Feature
            </div>
            <div className="flex items-center">
              <LogoGradientFull size="40px" />
            </div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Traditional Platforms
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisonData.map((row, index) => {
            const Icon = row.icon;
            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_1.5fr_1.5fr] gap-4 py-6 border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{row.feature}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex">
                        <IconInfoCircle
                          size="16px"
                          className="text-muted-foreground/50 cursor-help"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-xs bg-neutral-900 text-white border-neutral-800"
                    >
                      <p className="text-xs">{row.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Icon size="20px" className={`${row.color} flex-shrink-0`} />
                  <span className="text-sm font-medium">{row.clouddojo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconXmarkFillDuo18
                    size="20px"
                    className="text-red-500 flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">
                    {row.others}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Stop wasting time with outdated study materials.{" "}
            <span className="text-foreground font-semibold">
              Start learning smarter.
            </span>
          </p>
        </div>
      </section>
    </TooltipProvider>
  );
};
