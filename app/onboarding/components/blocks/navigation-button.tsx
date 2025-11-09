"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      {/* Mobile: Bottom buttons with text */}
      <div className="flex md:hidden justify-between gap-4 w-full">
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ${
            currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Back</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 rounded-2xl text-white font-semibold transition-all duration-300"
        >
          <span className="font-medium">
            {currentStep === totalSteps ? "Complete Setup" : "Continue"}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop: Side chevron buttons with tooltips */}
      <div className="hidden md:block">
        {/* Back button - Left side */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onBack}
              disabled={currentStep === 1}
              className={`fixed left-8 top-1/2 -translate-y-1/2 p-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-110 ${
                currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Previous</p>
          </TooltipContent>
        </Tooltip>

        {/* Next button - Right side */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onNext}
              className="fixed right-8 top-1/2 -translate-y-1/2 p-4 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 rounded-full text-white font-semibold transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Next</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
