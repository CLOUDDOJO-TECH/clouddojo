"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  MicrosoftAzure,
  AmazonWebServices,
  Docker,
  GoogleCloud,
  Kubernetes,
  Oracle,
} from "@/components/logos";
import GameOfLife from "../HeroBackground";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const providers = [
  {
    title: "Amazon Web Services",
    description:
      "From Cloud Practitioner to Solutions Architect — prepare for every AWS certification with real-world practice tests and hands-on projects.",
    link: "https://aws.amazon.com",
    icon: AmazonWebServices,
    borderColor: "border-orange-500",
    textColor: "text-orange-400",
  },
  {
    title: "Azure",
    description:
      "Azure certifications unlock enterprise opportunities. CloudDojo helps you master them with targeted practice tests and performance analytics.",
    link: "https://azure.microsoft.com",
    icon: MicrosoftAzure,
    borderColor: "border-blue-500",
    textColor: "text-blue-400",
  },
  {
    title: "Google Cloud Platform",
    description:
      "Master GCP certifications with practice tests built to mirror actual Google Cloud exams — from Associate to Professional level.",
    link: "https://cloud.google.com",
    icon: GoogleCloud,
    borderColor: "border-red-500",
    textColor: "text-red-400",
  },
  {
    title: "Oracle Cloud",
    description:
      "Oracle Cloud is growing fast. Get ahead with OCI certification prep — practice tests, analytics, and study resources all in one place",
    link: "https://www.oracle.com/cloud",
    icon: Oracle,
    borderColor: "border-rose-500",
    textColor: "text-rose-400",
  },
  {
    title: "Docker",
    description:
      "Learn Docker by doing. Build containerized apps, write Dockerfiles, and master the containerization skills that every cloud role requires.",
    link: "https://www.docker.com",
    icon: Docker,
    borderColor: "border-cyan-500",
    textColor: "text-cyan-400",
  },
  {
    title: "Kubernetes",
    description:
      "Master Kubernetes through real projects. Deploy apps, configure clusters, and build the container orchestration skills every cloud engineer needs.",
    link: "https://kubernetes.io",
    icon: Kubernetes,
    borderColor: "border-blue-600",
    textColor: "text-blue-500",
  },
];

export default function ProvidersSection() {
  return (
    <section className="relative min-h-screen">
      {/* Game of Life Background */}
      <GameOfLife />

      <div className="relative py-32 z-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-5xl text-center bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5">
              One platform. Every cloud. Unlimited career opportunities.
            </h2>
          </div>

          <HoverEffect items={providers} />
        </div>
      </div>
    </section>
  );
}

const HoverEffect = ({
  items,
  className,
}: {
  items: typeof providers;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={item.link}
            className="relative group block p-2 h-full w-full cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-neutral-800/50 block rounded-none"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card borderColor={hoveredIndex === idx ? item.borderColor : ""}>
              <div className="*:size-10">
                <Icon />
              </div>

              <div className="space-y-2 py-6">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {truncateDescription(item.description)}
                </CardDescription>
              </div>

              <div className="flex gap-3 border-t border-dashed pt-6">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className={cn(
                    "gap-1 pr-1.5 rounded-none transition-colors",
                    hoveredIndex === idx && item.textColor,
                  )}
                >
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                    <ChevronRight className="ml-0 size-3.5! opacity-50" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

const Card = ({
  className,
  children,
  borderColor,
}: {
  className?: string;
  children: React.ReactNode;
  borderColor?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-none h-full w-full p-4 overflow-hidden bg-background border border-border relative z-20",
        borderColor,
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
};

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("font-medium tracking-wide text-base", className)}>
      {children}
    </h4>
  );
};

const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-muted-foreground tracking-wide leading-relaxed text-sm line-clamp-2",
        className,
      )}
    >
      {children}
    </p>
  );
};

const truncateDescription = (text: string, maxWords: number = 10) => {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};
