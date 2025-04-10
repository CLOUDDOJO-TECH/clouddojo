"use client"

import { useState } from "react"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const companySizes = [
  { value: "1-10", label: "1-10 employees", description: "Small team or startup" },
  { value: "11-50", label: "11-50 employees", description: "Growing small business" },
  { value: "51-200", label: "51-200 employees", description: "Medium-sized business" },
  { value: "201-1000", label: "201-1000 employees", description: "Large business" },
  { value: "1000+", label: "1000+ employees", description: "Enterprise organization" }
]

export default function CompanySizeStep() {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding()
  const [companySize, setCompanySize] = useState<string>(onboardingData.companySize || "")
  
  const handleSizeChange = (value: string) => {
    setCompanySize(value)
    updateOnboardingData({ companySize: value })
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">How large is your organization?</h1>
        <p className="text-muted-foreground mt-2">
          This helps us understand your infrastructure scale and needs.
        </p>
      </div>
      
      <RadioGroup 
        value={companySize} 
        onValueChange={handleSizeChange}
        className="space-y-3"
      >
        {companySizes.map((size) => (
          <div 
            key={size.value}
            className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 transition-colors"
            onClick={() => handleSizeChange(size.value)}
          >
            <RadioGroupItem value={size.value} id={size.value} />
            <div className="grid gap-1.5">
              <Label htmlFor={size.value} className="text-base font-medium cursor-pointer">
                {size.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {size.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
      
      <div className="pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
        >
          Back
        </Button>
        <Button 
          onClick={goToNextStep}
          disabled={!companySize}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 