"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { checkOnboardingStatus } from "@/app/(actions)/onboarding/onboarding"

export function useUserStatus() {
  const router = useRouter()
  const { isLoaded, user } = useUser()

  const {
    data: statusData,
    isLoading: isCheckingStatus,
    error: statusError
  } = useQuery({
    queryKey: ['userStatus'],
    queryFn: async () => {
      if (!isLoaded || !user) {
        throw new Error("User not authenticated")
      }
      
      const result = await checkOnboardingStatus()
      if (!result.success) {
        throw new Error(result.error || "Failed to check user status")
      }
      return result
    },
    enabled: isLoaded && !!user,
    retry: false
  })

  const redirectToOnboardingIfNeeded = () => {
    if (statusData && !statusData.hasCompletedOnboarding) {
      router.push('/onboarding')
    }
  }

  return {
    statusData,
    isCheckingStatus,
    statusError,
    redirectToOnboardingIfNeeded,
    isUserInitialized: isLoaded && !!user && !!statusData
  }
}