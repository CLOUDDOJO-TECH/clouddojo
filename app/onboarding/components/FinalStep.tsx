"use client"

import { useState } from "react"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs"
import { useOnboardingQueries } from "../hooks/useOnboardingQueries"

const experienceOptions = [
  { value: "Beginner", label: "Beginner - Just starting with AWS" },
  { value: "Intermediate", label: "Intermediate - Comfortable with basic services" },
  { value: "Advanced", label: "Advanced - Working with AWS professionally" },
  { value: "Expert", label: "Expert - Deep AWS knowledge across multiple domains" },
]

export default function FinalStep() {
  const { isLoaded, user } = useUser()
  const { onboardingData, updateOnboardingData, goToPreviousStep } = useOnboarding()
  const { submitOnboardingData, isSubmitting } = useOnboardingQueries()
  
  const [experience, setExperience] = useState<string>(onboardingData.experience || "")

  const handleExperienceChange = (value: string) => {
    setExperience(value)
    updateOnboardingData({ experience: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded || !user) {
      return
    }
    
    // Submit onboarding data using the TanStack Query mutation
    submitOnboardingData({
      userId: user.id,
      ...onboardingData,
    })
    
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Almost done!</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about your AWS experience so we can personalize your learning journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">What's your experience level with AWS?</h2>
          <RadioGroup 
            value={experience} 
            onValueChange={handleExperienceChange}
            className="space-y-3"
          >
            {experienceOptions.map((option) => (
              <div 
                key={option.value}
                className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 transition-colors"
                onClick={() => handleExperienceChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="grid gap-1.5">
                  <Label htmlFor={option.value} className="text-base font-medium cursor-pointer">
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
            variant="outline"
            onClick={goToPreviousStep}
          >
            Go back
          </Button>
          <Button 
            type="submit"
            disabled={!experience || isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSubmitting ? "Submitting..." : "Finish"}
          </Button>
        </div>
      </form>
    </div>
  )
} 