"use client";
import React from "react";
import Image from "next/image";
import previewImage from "@/public/previews/projects-test.png";
import { IconChatBot, IconBrain, IconLightning, IconClock } from "./icons";

const aiFeatures = [
  {
    icon: IconChatBot,
    title: "24/7 AI Study Companion",
    description:
      "Get instant answers for AWS, Azure, and GCP concepts at 3am. No waiting for forum responses or office hours.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: IconBrain,
    title: "Personalized Study Plans",
    description:
      "AI analyzes your performance and creates custom study paths. Focus on what matters for your certification.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: IconLightning,
    title: "Smart Performance Insights",
    description:
      "Know your strengths, weaknesses, and exact certification readiness. Track topic mastery across all cloud providers.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: IconClock,
    title: "Adaptive Explanations",
    description:
      "Complex topics like VPC peering or Kubernetes pods explained multiple ways until you truly understand.",
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
        <h2 className="bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5 text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
          AI that actually helps you
          <br />
          pass your certification
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed">
          Powered by Google Gemini 2.0, our AI doesn't just give you answers—it
          teaches you to think like a cloud architect. Get personalized feedback
          on every practice question, understand your weak spots, and know
          exactly when you're ready to book your exam.
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
    </section>
  );
};
