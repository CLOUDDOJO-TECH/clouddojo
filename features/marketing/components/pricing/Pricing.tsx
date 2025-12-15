"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NoiseBackground } from "@/components/ui/noise-bacground";
import { IconCheckCircle } from "./icons";
import IconChevronRightFill12 from "./chevron-icon";
import IconCircleArrowRightFill24 from "./circle-arrow-icon";

const pricingPlans = [
  {
    name: "7-Day Free Trial",
    price: "Free",
    period: "for 7 days",
    description: "Try all Pro features risk-free",
    features: [
      "All practice tests",
      "CloudDojo AI Coach",
      "Premium Flashcards",
      "Downloadable PDF reports",
      "Full platform access",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8.99",
    period: "/month",
    description: "For serious cloud engineers",
    features: [
      "All practice tests",
      "CloudDojo AI Coach",
      "Premium Flashcards",
      "Downloadable PDF reports",
      "AI Chatbot with unlimited queries",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Gold",
    price: "$14.99",
    period: "/month",
    description: "For teams and enterprises",
    features: [
      "Everything in Pro",
      "Shareable Lab Reports",
      "Custom Roadmaps",
      "Live Exercises",
      "Cloud Job opportunities",
      "Team collaboration tools",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto font-main">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="heading-gradient text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
          Simple, transparent pricing
        </h2>
        <p className="sr-only text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include access to our
          core features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`relative border rounded-none p-8 flex flex-col ${
              plan.highlighted
                ? "border-foreground bg-secondary/30 shadow-lg scale-105"
                : "border-border bg-background"
            }`}
          >
            {/* Popular Badge */}
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-xs font-bold px-4 py-1 rounded-none">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Plan Name */}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

            {/* Price */}
            <div className="mb-4">
              <span className="text-5xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6">{plan.description}</p>

            {/* CTA Button */}
            <div className="w-full mb-8">
              {plan.highlighted ? (
                <Link href="/sign-in" className="flex justify-center">
                  <NoiseBackground containerClassName="w-full p-2">
                    <button className="h-full w-full cursor-pointer bg-background px-4 py-2 text-foreground shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-200 active:scale-98 dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] font-semibold flex items-center justify-center gap-2 group">
                      <span className="transition-transform duration-200 group-hover:-translate-x-1">
                        {plan.cta}
                      </span>
                      <IconCircleArrowRightFill24
                        size="20px"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </button>
                  </NoiseBackground>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 rounded-none group"
                  >
                    <span className="transition-transform duration-200 group-hover:-translate-x-1">
                      {plan.cta}
                    </span>
                    <IconCircleArrowRightFill24
                      size="20px"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Button>
                </Link>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-3 flex-grow">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start gap-3">
                  <IconCheckCircle
                    size="20px"
                    className={
                      plan.highlighted
                        ? "text-[rgb(16,185,129)]"
                        : index === 2
                          ? "text-[rgb(255,200,100)]"
                          : "text-foreground"
                    }
                  />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          Need a custom plan?{" "}
          <Link
            href="/contact"
            className="text-foreground font-semibold hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
};
