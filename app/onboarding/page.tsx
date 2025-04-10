"use client"

import { useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { OnboardingProvider, useOnboarding } from "./components/OnboardingContext"
import OnboardingLayout from "./components/OnboardingLayout"
import CompanyTypeStep from "./components/CompanyTypeStep"
import CompanySizeStep from "./components/CompanySizeStep"
import GoalsStep from "./components/GoalsStep"
import FinalStep from "./components/FinalStep"
import { useOnboardingQueries } from "./hooks/useOnboardingQueries"

function OnboardingContent() {
  const { currentStep, totalSteps } = useOnboarding()
  
  // Render the current step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyTypeStep />
      case 2:
        return <CompanySizeStep />
      case 3:
        return <GoalsStep />
      case 4:
        return <FinalStep />
      default:
        return <CompanyTypeStep />
    }
  }
  
  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={totalSteps}>
      {renderStep()}
    </OnboardingLayout>
  )
}

export default function OnboardingPage() {
  const { isLoaded, user } = useUser()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { 
    statusData, 
    isCheckingStatus,
    redirectIfCompleted
  } = useOnboardingQueries()
  
  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, router])
  
  // Check if user has already completed onboarding
  useEffect(() => {
    if (isLoaded && user && statusData) {
      redirectIfCompleted()
    }
  }, [isLoaded, user, statusData, redirectIfCompleted])
  
  // Prevent flash of onboarding content for unauthorized users
  if (!isLoaded || !isSignedIn) {
    return null
  }
  
  // Show loading state while checking onboarding status
  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="text-sm text-muted-foreground">Checking onboarding status...</p>
        </div>
      </div>
    )
  }
  
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  )
} 