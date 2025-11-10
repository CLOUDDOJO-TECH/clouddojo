"use client";
import { Loader, Rocket } from "lucide-react";
import type { OnboardingData } from "../types/onboarding";
import { ThemeToggle } from "./blocks/theme-toggle";
import { AnimatedOnboardingSvg } from "./blocks/animated-onboarding-svg";
import { cn } from "@/lib/utils";
import { useOnboardingQueries } from "../hooks/useOnboardingQueries";
import { Button } from "@/components/ui/button";

interface CompletionScreenProps {
  selectedData: OnboardingData;
}

export function CompletionScreen({ selectedData }: CompletionScreenProps) {
  const { submitOnboardingData, isSubmitting } = useOnboardingQueries();

  const handleSubmit = () => {
    const formattedData: OnboardingData = {
      experience: selectedData.experience.trim(),
      role: selectedData.role.toUpperCase(), // Optional formatting
      platforms: selectedData.platforms.map((p) => p.toLowerCase()),
      certifications: selectedData.certifications.map((c) => c.toLowerCase()),
      focusArea: selectedData.focusArea.map((f) => f.toLowerCase()),
    };

    submitOnboardingData(formattedData);
  };

  return (
    <div className="min-h-screen font-main flex items-center justify-center p-4 overflow-hidden">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Grid background - Behind everything */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(circle,#e5e5e5_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(circle,#404040_1px,transparent_1px)]",
        )}
      />

      {/* Radial gradient overlay - Behind the card */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Content */}
      <div className="text-center space-y-8 flex z-10 flex-col p-4 max-w-2xl">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-[430px] h-[430px] flex items-center justify-center">
              <AnimatedOnboardingSvg className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-kaushan">
            Welcome to CloudDojo!
          </h1>
        </div>

        <Button
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          variant="outline"
          size="lg"
          className="border border-priamry text-primary rounded-lg"
        >
          {isSubmitting ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Rocket className="w-5 h-5" />
          )}
          <span>{isSubmitting ? "Filling you in..." : "Join the club"}</span>
        </Button>
      </div>
    </div>
  );
}
