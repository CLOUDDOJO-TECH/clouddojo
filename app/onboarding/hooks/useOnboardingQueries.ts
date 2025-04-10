"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveOnboardingData, getOnboardingData, checkOnboardingStatus } from "@/app/(actions)/onboarding/onboarding"

interface OnboardingMutationOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook for fetching and updating onboarding data using TanStack Query
 */
export function useOnboardingQueries() {
  const router = useRouter()
  
  // Query for checking onboarding status
  const { 
    data: statusData,
    isLoading: isCheckingStatus,
    error: statusError 
  } = useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: async () => {
      const result = await checkOnboardingStatus()
      if (!result.success) {
        throw new Error(result.error || "Failed to check onboarding status")
      }
      return result
    }
  })

  // Query for fetching onboarding data (if needed)
  const {
    data: onboardingData,
    isLoading: isLoadingOnboarding,
    error: onboardingError
  } = useQuery({
    queryKey: ['onboardingData'],
    queryFn: async () => {
      const result = await getOnboardingData()
      if (!result.success) {
        throw new Error(result.error || "Failed to get onboarding data")
      }
      return result
    },
    enabled: false // Only fetch when explicitly called
  })

  // Mutation for saving onboarding data
  const { 
    mutate: submitOnboardingData,
    isPending: isSubmitting,
    error: submitError
  } = useMutation({
    mutationFn: async (data: any) => {
      const result = await saveOnboardingData(data)
      if (!result.success) {
        throw new Error(result.error || "Failed to save onboarding data")
      }
      return result
    },
    onSuccess: () => {
      toast.success("Onboarding completed successfully!")
      router.push("/dashboard")
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.")
    }
  })

  return {
    // Status checking
    statusData,
    isCheckingStatus,
    statusError,
    
    // Onboarding data
    onboardingData,
    isLoadingOnboarding,
    onboardingError,
    
    // Submission
    submitOnboardingData,
    isSubmitting,
    submitError,
    
    // Redirect if already completed
    redirectIfCompleted: () => {
      if (statusData?.hasCompletedOnboarding) {
        router.push("/dashboard")
      }
    }
  }
} 