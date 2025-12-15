"use client";
import React from "react";
import Image from "next/image";
import previewImage from "@/public/previews/projects-test.png";
import { IconChatBot, IconBrain, IconLightning, IconClock } from "./icons";

const aiFeatures = [
  {
    icon: IconChatBot,
    title: "AI Study Companion",
    description:
      "Like a study partner, but on steroids. Knows your strengths and weaknesses better than you do.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: IconBrain,
    title: "Personalized Study Plans",
    description:
      "Time is precious. AI creates custom study paths based on what you know and what you don't—no wasted effort.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: IconLightning,
    title: "Smart Performance Insights",
    description:
      "Taking practice tests isn't enough. AI analyzes every answer and shows you exactly where you're leaking points.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: IconClock,
    title: "Adaptive Explanations",
    description:
      "Not just another generic ChatGPT answer. Get short, bite-sized explanations for Kubernetes, VPC, and every tricky concept.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
];

export const AISection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto font-main">
      {/* Separator */}
      <div className="w-full border-t-2 border-dotted border-border/50 mb-16 md:mb-24"></div>

      {/* Header */}
      <div className="mb-12 md:mb-16">
        {/* Title */}
        <h2 className="heading-gradient text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
          AI that actually helps you
          <br />
          pass your certification
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed sr-only">
          Powered by frontier LLMS, our AI doesn't just give you answers—it
          teaches you to think like a cloud architect. Get personalized feedback
          on every practice question, understand your weak spots, and know
          exactly when you're ready to take your exam.
        </p>
      </div>

      {/* Features Grid - Single Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const isNotLast = index !== aiFeatures.length - 1;

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

              {/* Vertical dotted line (right side) - hidden on mobile and last item */}
              {isNotLast && (
                <div className="hidden lg:block absolute top-0 -right-4 h-full w-px border-r-2 border-dotted border-border/50"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Preview */}
      <div className="relative w-full overflow-hidden shadow-2xl">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={previewImage}
            alt="CloudDojo AI-powered learning preview"
            fill
            className="object-cover"
            placeholder="blur"
            priority
          />
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Per-Quiz Analysis
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every practice test gets analyzed immediately. See your category
            scores, time efficiency, and topic mastery—all tracked
            automatically. No manual review needed.
          </p>
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Certification Readiness Score
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Stop guessing if you're ready. AI predicts your pass probability and
            tells you exactly when to book your exam—backed by your actual
            performance data.
          </p>
        </div>
      </div>
    </section>
  );
};
