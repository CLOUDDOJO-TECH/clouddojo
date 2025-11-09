"use client";

import React from "react";
interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background w-full bg-white dark:bg-slate-950 font-main">
      {/* Content area */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 w-full">
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl mx-auto">
            {/*md: screen stepper*/}
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index < currentStep
                      ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Current step content */}
            <div className="px-8 rounded-lg shadow-sm p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
