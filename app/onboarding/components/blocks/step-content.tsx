"use client";

import { MultiSelectButton } from "./multi-select-button";
import { FocusAreaButton } from "./focus-area-button";
import { OnboardingData, OnboardingStep } from "../../types/onboarding";
import { SelectionButton } from "./selection-button";

interface StepContentProps {
  step: OnboardingStep;
  selectedData: OnboardingData;
  onSelection: (
    category: keyof OnboardingData,
    value: string,
    isMultiple?: boolean,
  ) => void;
}

export function StepContent({
  step,
  selectedData,
  onSelection,
}: StepContentProps) {
  const isSelected = (optionId: string) => {
    const categoryData = selectedData[step.category];
    if (Array.isArray(categoryData)) {
      return categoryData.includes(optionId);
    }
    return categoryData === optionId;
  };

  const handleOptionClick = (optionId: string) => {
    onSelection(step.category, optionId, step.type === "multiple");
  };

  const renderButton = (option: any) => {
    if (step.category === "focusAreas") {
      return (
        <FocusAreaButton
          key={option.id}
          option={option}
          isSelected={isSelected(option.id)}
          onClick={() => handleOptionClick(option.id)}
        />
      );
    }

    if (step.type === "multiple") {
      return (
        <MultiSelectButton
          key={option.id}
          option={option}
          isSelected={isSelected(option.id)}
          onClick={() => handleOptionClick(option.id)}
        />
      );
    }

    return (
      <SelectionButton
        key={option.id}
        option={option}
        isSelected={isSelected(option.id)}
        onClick={() => handleOptionClick(option.id)}
      />
    );
  };

  return <div className="space-y-3">{step.options.map(renderButton)}</div>;
}
