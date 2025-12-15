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
} from "./icons";
import { LogoGradientFull } from "@/public/brand/logo-gradient-full";

const comparisonData = [
  {
    feature: "Study materials",
    clouddojo: "Interactive tests with AI hints",
    others: "Static PDFs and brain dumps",
    icon: IconFeatherFillDuo18,
    color: "text-teal-400",
  },
  {
    feature: "AI feedback",
    clouddojo: "Instant AI analysis per quiz",
    others: "No feedback or days later",
    icon: IconSparkle3OutlineDuo18,
    color: "text-pink-400",
  },
  {
    feature: "Hands-on projects",
    clouddojo: "Real cloud infrastructure builds",
    others: "Theory only or paid separately",
    icon: IconForkliftFillDuo18,
    color: "text-orange-400",
  },
  {
    feature: "Multi-cloud coverage",
    clouddojo: "AWS, Azure, GCP in one platform",
    others: "One provider per course",
    icon: IconEarthOutlineDuo18,
    color: "text-violet-400",
  },
  {
    feature: "Competitive leaderboards",
    clouddojo: "Global rankings and achievements",
    others: "No gamification or limited",
    icon: IconGamingButtonsFillDuo18,
    color: "text-cyan-400",
  },
  {
    feature: "Smart flashcards",
    clouddojo: "AI-generated from your mistakes",
    others: "Manual creation or none",
    icon: IconTasks2OutlineDuo18,
    color: "text-emerald-400",
  },
  {
    feature: "Certification roadmap",
    clouddojo: "Personalized study path with milestones",
    others: "Generic study guides",
    icon: IconTargetFillDuo18,
    color: "text-blue-400",
  },
];

export const ComparisonSection: React.FC = () => {
  return (
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
                {row.feature}
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
  );
};
