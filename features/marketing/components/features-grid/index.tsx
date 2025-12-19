"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  IconBookOpen,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

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
  {
    icon: IconBookOpen,
    title: "Self-paced courses",
    description: "Learn at your own speed with comprehensive course materials",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
];

export const FeaturesGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".feature-item");

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
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="py-20 md:py-32 px-6 sm:px-8 lg:px-16 max-w-7xl mx-auto font-main">
      {/* Header */}
      <div className="mb-12 md:mb-16">
        {/* Title */}
        <h2 className="bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5 text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
          Everything you need to pass
          <br />
          your cloud certification
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-4xl leading-relaxed ">
          Get scenario-based practice tests, AI-powered feedback, hands-on
          projects, and personalized study plans that adapt to your learning
          style and help you become certification-ready.
        </p>
      </div>

      {/* Features Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10 mb-16"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;

          // For mobile (3 cols): not last in row if (index + 1) % 3 !== 0
          // For desktop (4 cols): not last in row if (index + 1) % 4 !== 0
          const isNotLastInRowMobile = (index + 1) % 3 !== 0;
          const isNotLastInRowDesktop = (index + 1) % 4 !== 0;

          // For mobile: not last row if index < 6 (first 6 items, 2 rows)
          // For desktop: not last row if index < 4 (first 4 items, 1 row)
          const isNotLastRowMobile = index < 6;
          const isNotLastRowDesktop = index < 4;

          return (
            <div
              key={index}
              className="feature-item space-y-3 relative min-h-[44px]"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 lg:w-12 lg:h-12 ${feature.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-7 h-7 lg:w-6 lg:h-6 ${feature.color}`} />
              </div>

              {/* Title */}
              <h3 className="text-base lg:text-lg font-semibold text-foreground leading-snug min-h-[2.5rem] lg:min-h-0">
                {feature.title}
              </h3>

              {/* Description - Hidden on mobile, visible on desktop */}
              <p className="sr-only lg:not-sr-only lg:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Vertical dotted line (right side) */}
              {/* Mobile: Show if not last in 3-col row */}
              {isNotLastInRowMobile && (
                <div className="lg:hidden absolute top-0 -right-4 h-full w-px border-r-2 border-dotted border-border/50"></div>
              )}
              {/* Desktop: Show if not last in 4-col row */}
              {isNotLastInRowDesktop && (
                <div className="hidden lg:block absolute top-0 -right-5 h-full w-px border-r-2 border-dotted border-border/50"></div>
              )}

              {/* Horizontal dotted line (bottom) */}
              {/* Mobile: Show if not in last row (first 6 items) */}
              {isNotLastRowMobile && (
                <div className="lg:hidden absolute -bottom-4 left-0 w-full h-px border-b-2 border-dotted border-border/50"></div>
              )}
              {/* Desktop: Show if not in last row (first 4 items) */}
              {isNotLastRowDesktop && (
                <div className="hidden lg:block absolute -bottom-5 left-0 w-full h-px border-b-2 border-dotted border-border/50"></div>
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
