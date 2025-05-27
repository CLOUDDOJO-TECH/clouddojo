"use client"

import React from "react"
import { useOnboarding } from "./OnboardingContext"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
}

export default function OnboardingStepper() {
  const { currentStep, totalSteps, goToStep, isStepComplete } = useOnboarding()
  
  const steps: Step[] = [
    {
      id: 1,
      title: "Company Type",
      description: "What type of organization are you?"
    },
    {
      id: 2,
      title: "Company Size",
      description: "How many people are in your organization?"
    },
    {
      id: 3,
      title: "Goals",
      description: "What are you hoping to achieve?"
    },
    {
      id: 4,
      title: "Experience Level",
      description: "What's your AWS experience level?"
    }
  ]
  
  const handleStepClick = (stepId: number) => {
    // Only allow navigation to completed steps or the current step
    if (stepId <= currentStep) {
      goToStep(stepId)
    }
  }
  
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isActive = currentStep === step.id
        const isLast = index === steps.length - 1
        const canNavigate = isCompleted || isActive
        
        return (
          <div key={step.id} className="relative">
            {/* Step indicator with number or checkmark */}
            <div 
              className={cn(
                "flex items-start group",
                canNavigate && "cursor-pointer"
              )}
              onClick={() => canNavigate && handleStepClick(step.id)}
            >
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 dark:bg-emerald-600 bg-gray-50 z-10 transition-colors",
                  isCompleted ? "bg-emerald-500 border-emerald-500" : 
                  isActive ? "border-emerald-500 text-emerald-500" : 
                  "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400",
                  canNavigate && "group-hover:border-emerald-600 group-hover:bg-emerald-50 dark:group-hover:bg-slate-900"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-sm font-medium dark:bg-emerald-600 bg-white">{step.id}</span>
                )}
              </div>
              
              {/* Step content */}
              <div className="ml-4 pb-14">
                <p 
                  className={cn(
                    "text-sm font-medium",
                    isCompleted || isActive ? "text-white" : "text-emerald-700",
                    canNavigate && "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  )}
                >
                  {step.title}
                </p>
                <p className={cn(
                  "text-sm text-muted-foreground mt-0.5", 
                  isCompleted || isActive ? "text-emerald-900/50": "text-gray-500 dark:text-gray-400",
                  canNavigate && "group-hover:text-emerald-400 dark:group-hover:text-emerald-300")}>
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Connecting line */}
            {!isLast && (
              <div 
                className={cn(
                  "absolute top-8 left-4 w-0.5 h-full -ml-px",
                  isCompleted ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
                )} 
              />
            )}
          </div>
        )
      })}
    </div>
  )
} 