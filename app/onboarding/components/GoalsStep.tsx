"use client"

import { useState } from "react"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const goalOptions = [
  { 
    id: "certification",
    label: "Earn AWS Certifications",
    description: "Prepare for and pass official AWS certification exams"
  },
  { 
    id: "skills",
    label: "Improve AWS Skills", 
    description: "Build practical knowledge for day-to-day work"
  },
  { 
    id: "career",
    label: "Career Advancement", 
    description: "Use AWS certifications to advance your career"
  },
  { 
    id: "team",
    label: "Train Team Members", 
    description: "Help your team members prepare for AWS certifications"
  },
  { 
    id: "assessment",
    label: "Skills Assessment", 
    description: "Assess your current AWS knowledge level"
  }
]

export default function GoalsStep() {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding()
  const [selectedGoals, setSelectedGoals] = useState<string[]>(onboardingData.goals || [])
  
  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        const updated = prev.filter(id => id !== goalId)
        updateOnboardingData({ goals: updated })
        return updated
      } else {
        const updated = [...prev, goalId]
        updateOnboardingData({ goals: updated })
        return updated
      }
    })
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What are your goals?</h1>
        <p className="text-muted-foreground mt-2">
          Select all that apply. This helps us recommend the right learning path.
        </p>
      </div>
      
      <div className="space-y-4">
        {goalOptions.map((goal) => (
          <div 
            key={goal.id}
            className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 transition-colors"
            onClick={() => toggleGoal(goal.id)}
          >
            <Checkbox 
              id={goal.id} 
              checked={selectedGoals.includes(goal.id)}
              onCheckedChange={() => toggleGoal(goal.id)}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              <Label htmlFor={goal.id} className="text-base font-medium cursor-pointer">
                {goal.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
        >
          Back
        </Button>
        <Button 
          onClick={goToNextStep}
          disabled={selectedGoals.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 