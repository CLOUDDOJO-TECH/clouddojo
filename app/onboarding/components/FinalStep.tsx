"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "./OnboardingContext";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { useOnboardingQueries } from "../hooks/useOnboardingQueries";
import Confetti from "react-confetti";
import { StepHeader } from "./blocks/step-header";

const experienceOptions = [
  { value: "Beginner", label: "Beginner - Just starting with AWS" },
  {
    value: "Intermediate",
    label: "Intermediate - Comfortable with basic services",
  },
  { value: "Advanced", label: "Advanced - Working with AWS professionally" },
  {
    value: "Expert",
    label: "Expert - Deep AWS knowledge across multiple domains",
  },
];

export default function FinalStep() {
  const { isLoaded, user } = useUser();
  const { onboardingData, updateOnboardingData, goToPreviousStep } =
    useOnboarding();
  const { submitOnboardingData, isSubmitting } = useOnboardingQueries();

  const [experience, setExperience] = useState<string>(
    onboardingData.experience || "",
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Automatically hide confetti after 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleExperienceChange = (value: string) => {
    setExperience(value);
    updateOnboardingData({ experience: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !user) {
      return;
    }

    setShowConfetti(true);

    // Submit onboarding data using the TanStack Query mutation
    submitOnboardingData({
      userId: user.id,
      ...onboardingData,
    });
  };

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}

      <StepHeader
        title="Almost done!"
        subtitle="Tell us about your AWS experience so we can personalize your learning journey."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            What's your experience level with AWS?
          </h2>
          <RadioGroup
            value={experience}
            onValueChange={handleExperienceChange}
            className="space-y-3"
          >
            {experienceOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                  experience === option.value
                    ? "bg-emerald-400/10 border-emerald-400"
                    : "hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10"
                }`}
                onClick={() => handleExperienceChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="grid gap-1.5">
                  <Label
                    htmlFor={option.value}
                    className="text-base font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="link"
            onClick={goToPreviousStep}
            className="text-emerald-600"
          >
            Go back
          </Button>
          <Button
            type="submit"
            disabled={!experience || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
          >
            {isSubmitting ? "Submitting..." : "Finish"}
          </Button>
        </div>
      </form>
    </div>
  );
}
