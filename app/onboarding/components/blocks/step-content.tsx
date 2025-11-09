"use client";

import { MultiSelectButton } from "./multi-select-button";
import { FocusAreaButton } from "./focus-area-button";
import { CertificationGrid } from "./certification-grid";
import { FocusAreaGrid } from "./focus-area-grid";
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

  // Handle certification selection separately
  const handleCertificationChange = (certificationIds: string[]) => {
    // Replace the entire array of certifications
    const updatedData = { ...selectedData, certifications: certificationIds };
    // Call onSelection for each certification to update the state properly
    certificationIds.forEach((id) => {
      if (!isSelected(id)) {
        onSelection(step.category, id, true);
      }
    });
    // Remove certifications that were deselected
    const currentCerts = selectedData.certifications as string[];
    currentCerts?.forEach((id) => {
      if (!certificationIds.includes(id)) {
        onSelection(step.category, id, true);
      }
    });
  };

  // Special handling for certifications category
  if (step.category === "certifications") {
    const selectedCertifications = (selectedData.certifications ||
      []) as string[];
    return (
      <CertificationGrid
        selectedCertifications={selectedCertifications}
        onSelectionChange={handleCertificationChange}
      />
    );
  }

  // Handle focus area selection with grid
  const handleFocusAreaChange = (areaIds: string[]) => {
    // Replace the entire array of focus areas
    areaIds.forEach((id) => {
      if (!isSelected(id)) {
        onSelection(step.category, id, true);
      }
    });
    // Remove areas that were deselected
    const currentAreas = selectedData.focusArea as string[];
    currentAreas?.forEach((id) => {
      if (!areaIds.includes(id)) {
        onSelection(step.category, id, true);
      }
    });
  };

  // Special handling for focus areas category
  if (step.category === "focusArea") {
    const selectedAreas = (selectedData.focusArea || []) as string[];
    return (
      <FocusAreaGrid
        selectedAreas={selectedAreas}
        onSelectionChange={handleFocusAreaChange}
      />
    );
  }

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

  // Use grid layout for platforms (multiple select), otherwise use vertical stack
  const isGridLayout =
    step.category === "platforms" && step.type === "multiple";

  return (
    <div
      className={
        isGridLayout ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "space-y-3"
      }
    >
      {step.options.map(renderButton)}
    </div>
  );
}
