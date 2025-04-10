"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the shape of your onboarding data
interface OnboardingData {
  companyType: string
  companySize: string
  goals: string[]
  preferredCertifications: string[]
  experience: string
}

// Define what the context will provide
interface OnboardingContextType {
  currentStep: number
  totalSteps: number
  onboardingData: OnboardingData
  updateOnboardingData: (data: Partial<OnboardingData>) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  goToStep: (step: number) => void
  isStepComplete: (step: number) => boolean
}

// Create the context with a default value
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// Provider component that wraps your onboarding flow
export function OnboardingProvider({ children }: { children: ReactNode }) {
  // Track the current step
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4 // Total number of steps in your flow
  
  // Store all onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyType: "",
    companySize: "",
    goals: [],
    preferredCertifications: [],
    experience: ""
  })
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }
  
  // Update onboarding data
  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
  }
  
  // Check if a step is complete based on data
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!onboardingData.companyType
      case 2:
        return !!onboardingData.companySize
      case 3:
        return onboardingData.goals.length > 0
      case 4:
        return !!onboardingData.experience
      default:
        return false
    }
  }
  
  // Provide the context values to all children components
  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        onboardingData,
        updateOnboardingData,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        isStepComplete
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

// Custom hook for using the context
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
} 