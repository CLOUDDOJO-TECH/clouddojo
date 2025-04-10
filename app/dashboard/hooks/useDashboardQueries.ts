"use client"

import { useQuery } from "@tanstack/react-query"
import { 
  fetchUserPerformanceStats, 
  fetchUserActivity, 
  fetchQuizCategories 
} from "@/app/(actions)/dashboard-data"

export function useDashboardQueries(enabled: boolean) {
  // Query for user performance stats
  const { 
    data: performanceData,
    isLoading: isLoadingPerformance,
    refetch: performanceRefetch
  } = useQuery({
    queryKey: ['performanceStats'],
    queryFn: async () => fetchUserPerformanceStats(),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
 
  
  // Query for user activity history
  const {
    data: activityData,
    isLoading: isLoadingActivity
  } = useQuery({
    queryKey: ['activityHistory'],
    queryFn: async () => fetchUserActivity(),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
  
  // Query for quiz categories
  const {
    data: categoriesData,
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['quizCategories'],
    queryFn: async () => fetchQuizCategories(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
  
  // Format the data for components
  const performanceStats = performanceData?.stats || null
  const activityHistory = activityData?.activity || []
  const categories = categoriesData?.categories || []
  
  return {
    performanceStats,
    activityHistory,
    performanceRefetch,
    categories,
    hasAttempts: performanceData?.hasAttempts || false,
    isLoadingPerformance,
    isLoadingActivity,
    isLoadingCategories,
  }
} 