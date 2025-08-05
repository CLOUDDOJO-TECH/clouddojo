"use client";

import { useState } from "react";
import type { OnboardingData } from "./types/onboarding";
import { onboardingSteps } from "./components/data/onboarding_data";
import { CompletionScreen } from "./components/Onboarding_Complete";
import { GlassCard } from "./components/blocks/glass-card";
import { StepIcon } from "./components/blocks/step-icon";
import { StepHeader } from "./components/blocks/step-header";
import { StepContent } from "./components/blocks/step-content";
import { NavigationButtons } from "./components/blocks/navigation-button";
import { StepCounter } from "./components/blocks/step-counter";
import { ProgressIndicator } from "./components/blocks/progress-indicator";
import { cn } from "@/lib/utils";

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
    <div className="relative min-h-screen bg-gradient-to-br font-main from-background via-background/50 to-background/60  items-center  flex-col justify-center p-4 w-full my-6 flex">
      {/*grid backgroun*/}
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

      <div className="items-center justify-center flex-col md:my-8 my-4 md:w-[60%]">
        <GlassCard>
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
          <StepIcon icon={currentStepData.icon} />
          <StepHeader
            title={currentStepData.title}
            subtitle={currentStepData.subtitle}
          />

          <div className="mb-8 justify-center items-center w-full">
            <StepContent
              step={currentStepData}
              selectedData={selectedData}
              onSelection={handleSelection}
            />
          </div>

          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            onNext={handleNext}
          />

          <StepCounter currentStep={currentStep} totalSteps={totalSteps} />
        </GlassCard>
      </div>
    </div>
  );
}
