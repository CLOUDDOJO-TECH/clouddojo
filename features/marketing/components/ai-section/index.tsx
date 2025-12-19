"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import previewImage from "@/public/previews/projects-test.png";
import {
  IconPenSparkle,
  IconSideProfileHeart,
  IconFaceExpression,
  IconSlider,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

const aiFeatures = [
  {
    icon: IconPenSparkle,
    title: "AI Study Companion",
    description:
      "Like a study partner, but on steroids. Knows your strengths...",
    descriptionFull:
      "Like a study partner, but on steroids. Knows your strengths and weaknesses better than you do.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: IconSideProfileHeart,
    title: "Personalized Study Plans",
    description: "Custom study paths based on what you know and don't...",
    descriptionFull:
      "Time is precious. AI creates custom study paths based on what you know and what you don't—no wasted effort.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: IconFaceExpression,
    title: "Smart Performance Insights",
    description:
      "AI analyzes every answer and shows you where you're leaking...",
    descriptionFull:
      "Taking practice tests isn't enough. AI analyzes every answer and shows you exactly where you're leaking points.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: IconSlider,
    title: "Adaptive Explanations",
    description:
      "Short explanations for Kubernetes, VPC, and tricky concepts...",
    descriptionFull:
      "Not just another generic ChatGPT answer. Get short, bite-sized explanations for Kubernetes, VPC, and every tricky concept.",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
];

export const AISection: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const bottomInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate features grid
    if (featuresRef.current) {
      const items = featuresRef.current.querySelectorAll(".ai-feature-item");

      gsap.set(items, {
        opacity: 0,
        y: 30,
        scale: 0.95,
      });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }

    // Animate preview image
    if (previewRef.current) {
      gsap.set(previewRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.98,
      });

      gsap.to(previewRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: previewRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }

    // Animate bottom info cards
    if (bottomInfoRef.current) {
      const cards = bottomInfoRef.current.querySelectorAll(".info-card");

      gsap.set(cards, {
        opacity: 0,
        y: 30,
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bottomInfoRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto font-main">
      {/* Separator */}
      <div className="w-full border-t-2 border-dotted border-border/50 mb-16 md:mb-24"></div>

      {/* Header */}
      <div className="mb-12 md:mb-16 text-center">
        {/* Title */}
        <h2 className="heading-gradient text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
          AI that actually helps you pass your certification
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed sr-only">
          Powered by frontier LLMS, our AI doesn't just give you answers—it
          teaches you to think like a cloud architect. Get personalized feedback
          on every practice question, understand your weak spots, and know
          exactly when you're ready to take your exam.
        </p>
      </div>

      {/* Features Grid - Single Row */}
      <div
        ref={featuresRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-16"
      >
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const isNotLast = index !== aiFeatures.length - 1;

          return (
            <div key={index} className="ai-feature-item space-y-4 relative">
              {/* Icon */}
              <div
                className={`w-16 h-16 lg:w-14 lg:h-14 ${feature.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-8 h-8 lg:w-7 lg:h-7 ${feature.color}`} />
              </div>

              {/* Title */}
              <h3 className="text-xl lg:text-lg font-semibold text-foreground leading-tight">
                {feature.title}
              </h3>

              {/* Description - Short on mobile, full on desktop */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="lg:hidden">{feature.description}</span>
                <span className="hidden lg:inline">
                  {feature.descriptionFull}
                </span>
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
      <div
        ref={previewRef}
        className="relative w-full overflow-hidden shadow-2xl"
      >
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

      {/* Bottom Info Section - Hidden on mobile */}
      <div
        ref={bottomInfoRef}
        className="mt-20 hidden md:grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
      >
        <div className="info-card">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            Per-Quiz Analysis
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every practice test gets analyzed immediately. See your category
            scores, time efficiency, and topic mastery—all tracked
            automatically. No manual review needed.
          </p>
        </div>

        <div className="info-card">
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
