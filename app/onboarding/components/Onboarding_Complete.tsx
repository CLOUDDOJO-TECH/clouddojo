"use client";
import Image from "next/image";
import { Loader, Rocket } from "lucide-react";
import type { OnboardingData } from "../types/onboarding";
import { GlassCard } from "./blocks/glass-card";
import { cn } from "@/lib/utils";
import { useOnboardingQueries } from "../hooks/useOnboardingQueries";

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

  // upload this data to the server
  const {} = useOnboardingQueries();
  return (
    <div className="min-h-screen font-main bg-background flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />

      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-background"></div>
      <GlassCard>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 flex items-center justify-center ">
                <Image
                  src="/images/wallet-icon.png"
                  alt="CloudDojo Logo"
                  width={80}
                  height={80}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">
              Welcome to CloudDojo!
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Your personalized cloud certification journey starts now. We've
              tailored everything based on your preferences.
            </p>
          </div>

          {/* Personalized Stats */}
          <div className="hidden grid grid-cols-2 gap-4 py-6">
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl font-bold text-emerald-400">
                {selectedData.platforms.length}
              </div>
              <div className="text-xs text-gray-400">Cloud Platforms</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl font-bold text-emerald-400">
                {selectedData.certifications.length}
              </div>
              <div className="text-xs text-gray-400">Target Certs</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl font-bold text-emerald-400">
                {selectedData.focusArea.length}
              </div>
              <div className="text-xs text-gray-400">Focus Areas</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="text-xl font-bold text-emerald-400">✨</div>
              <div className="text-xs text-gray-400">Ready to Go</div>
            </div>
          </div>

          <button
            onClick={() => handleSubmit()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl text-white font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Rocket className="w-5 h-5" />
            )}
            <span>{isSubmitting ? "Filling you in..." : "Join the club"}</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
