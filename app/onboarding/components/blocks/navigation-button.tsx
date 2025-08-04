"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between gap-4">
      <button
        onClick={onBack}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 ${
          currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </button>

      <button
        onClick={onNext}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl text-white font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
      >
        <span className="font-medium">
          {currentStep === totalSteps ? "Complete Setup" : "Continue"}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
