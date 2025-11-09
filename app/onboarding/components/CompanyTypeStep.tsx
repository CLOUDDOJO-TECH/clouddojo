"use client";

import { useState } from "react";
import { useOnboarding } from "./OnboardingContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { StepHeader } from "./blocks/step-header";

const companyTypes = [
  {
    value: "Individual",
    label: "Individual",
    description: "Independent user or freelancer",
  },
  {
    value: "Startup",
    label: "Startup",
    description: "Early-stage company with high growth potential",
  },
  {
    value: "SMB",
    label: "Small/Medium Business",
    description: "Established business with less than 500 employees",
  },
  {
    value: "Enterprise",
    label: "Enterprise",
    description: "Large organization with complex infrastructure",
  },
  {
    value: "Educational",
    label: "Educational",
    description: "School, university or other educational institution",
  },
];

export default function CompanyTypeStep() {
  const { onboardingData, updateOnboardingData, goToNextStep } =
    useOnboarding();
  const [companyType, setCompanyType] = useState<string>(
    onboardingData.companyType || "",
  );

  const handleTypeChange = (value: string) => {
    setCompanyType(value);
    updateOnboardingData({ companyType: value });
  };

  const handleContinue = () => {
    if (companyType) {
      goToNextStep();
    }
  };

  return (
    <div className="space-y-6 font-main">
      <StepHeader
        title="What type of organization are you?"
        subtitle="This helps us tailor your AWS certification experience to your specific needs."
      />

      <RadioGroup
        value={companyType}
        onValueChange={handleTypeChange}
        className="space-y-3"
      >
        {companyTypes.map((type) => (
          <div
            key={type.value}
            className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
              companyType === type.value
                ? "bg-emerald-400/10 border-emerald-400"
                : "hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10"
            }`}
            onClick={() => handleTypeChange(type.value)}
          >
            <RadioGroupItem value={type.value} id={type.value} />
            <div className="grid gap-1.5">
              <Label
                htmlFor={type.value}
                className="text-base font-medium cursor-pointer"
              >
                {type.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!companyType}
          className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
