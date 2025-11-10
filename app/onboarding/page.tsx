"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { OnboardingData } from "./types/onboarding";
import { onboardingSteps } from "./components/data/onboarding_data";
import { CompletionScreen } from "./components/Onboarding_Complete";
import { StepHeader } from "./components/blocks/step-header";
import { StepContent } from "./components/blocks/step-content";
import { NavigationButtons } from "./components/blocks/navigation-button";
import { ProgressIndicator } from "./components/blocks/progress-indicator";
import { ThemeToggle } from "./components/blocks/theme-toggle";
import { cn } from "@/lib/utils";

import PathDrawing from "@/public/illustrations/animate-desk";

export default function CloudDojoOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedData, setSelectedData] = useState<OnboardingData>({
    experience: "",
    platforms: [],
    certifications: [],
    role: "",
    focusArea: [],
  });

  const totalSteps = onboardingSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelection = (
    category: keyof OnboardingData,
    value: string,
    isMultiple = false,
  ) => {
    if (isMultiple) {
      setSelectedData((prev) => ({
        ...prev,
        [category]: (prev[category] as string[]).includes(value)
          ? (prev[category] as string[]).filter((item) => item !== value)
          : [...(prev[category] as string[]), value],
      }));
    } else {
      setSelectedData((prev) => ({
        ...prev,
        [category]: value,
      }));
    }
  };

  if (isCompleted) {
    return <CompletionScreen selectedData={selectedData} />;
  }

  const currentStepData = onboardingSteps.find(
    (step) => step.id === currentStep,
  );

  if (!currentStepData) {
    return null;
  }

  return (
    <div className="relative min-h-screen items-center flex-col justify-center p-4 w-full my-6 flex overflow-hidden font-main">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/*to be taken out :)*/}
      {/*<PathDrawing />*/}

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

      {/* Content - Directly on the grid, no card wrapper */}
      <div className="relative z-10 items-center justify-center flex-col md:my-8 my-4 md:w-[60%] w-full max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        </motion.div>

        {/*<StepIcon icon={currentStepData.icon} />*/}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StepHeader
              title={currentStepData.title}
              subtitle={currentStepData.subtitle}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentStep}`}
            className="mb-8 justify-center items-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StepContent
              step={currentStepData}
              selectedData={selectedData}
              onSelection={handleSelection}
            />
          </motion.div>
        </AnimatePresence>

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
