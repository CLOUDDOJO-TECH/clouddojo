"use client";
import React from "react";
import Image from "next/image";
import previewImage from "@/public/previews/detail-features-section.png";
import {
  IconHand2,
  IconChatBot,
  IconProgressBar,
  IconPage,
  IconForklift,
  IconGrid2,
  IconHexagonCheck,
  IconUsers,
} from "./icons";

const features = [
  {
    icon: IconHand2,
    title: "Scenario-based learning",
    description: "Real-world scenarios that mirror actual certification exams",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: IconChatBot,
    title: "AI-powered feedback",
    description: "Instant personalized feedback on every answer you submit",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: IconProgressBar,
    title: "Smart progress tracking",
    description: "Track your performance across topics and identify weak areas",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: IconPage,
    title: "Detailed explanations",
    description: "In-depth explanations for every question with best practices",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: IconForklift,
    title: "Hands-on projects",
    description:
      "Build real cloud infrastructure in actual AWS, Azure, and GCP",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: IconGrid2,
    title: "Multiple providers",
    description: "Comprehensive coverage for AWS, Azure, and Google Cloud",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: IconHexagonCheck,
    title: "Exam readiness score",
    description: "Know exactly when you're ready to book your certification",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: IconUsers,
    title: "Competitive leaderboards",
    description: "Compete with peers and climb the ranks as you learn",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto font-main">
      {/* Header */}
      <div className="mb-12 md:mb-16">
        {/* Title */}
        <h2 className="bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5 text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
          Everything you need to pass
          <br />
          your cloud certification
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed">
          Master AWS, Azure, and Google Cloud certifications with our
          comprehensive learning platform. Get scenario-based practice tests,
          AI-powered feedback, hands-on projects, and personalized study plans
          that adapt to your learning style and help you become
          certification-ready.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isNotLastInRow = (index + 1) % 4 !== 0;
          const isNotLastRow = index < 4;

          return (
            <div key={index} className="space-y-3 relative">
              {/* Icon */}
              <div
                className={`w-12 h-12 ${feature.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${feature.color}`} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Vertical dotted line (right side) - hidden on mobile and last column */}
              {isNotLastInRow && (
                <div className="hidden lg:block absolute top-0 -right-4 h-full w-px border-r-2 border-dotted border-border/50"></div>
              )}

              {/* Horizontal dotted line (bottom) - hidden on last row */}
              {isNotLastRow && (
                <div className="hidden sm:block absolute -bottom-4 left-0 w-full h-px border-b-2 border-dotted border-border/50"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Preview */}
      <div className="relative w-full   overflow-hidden shadow-2xl">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={previewImage}
            alt="CloudDojo platform features preview"
            fill
            className="object-cover"
            placeholder="blur"
            priority
          />
        </div>
      </div>
    </section>
  );
};
