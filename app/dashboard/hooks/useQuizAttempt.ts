import { GetuQizAttempt } from "@/app/(actions)/quiz/attempts/get_quiz-attempt"
import { useQuery } from "@tanstack/react-query"

export const useGetQuizAttempts = ({attemptId}: { attemptId: string}) => {
    const { 
        data,
        isLoading,
        isError,
        error
      } = useQuery({
        queryKey: ['performanceStats', attemptId],
        queryFn: async () => GetuQizAttempt({attemptId}),
        staleTime: 1000 * 60 * 5, // 5 minutes
      })

    console.log("Hook data:", data);

    return {
        quizAttemptsData: data?.data,
        quizAttemptLoading: isLoading,
        quizAttemptError: isError,
        quizAttemptErrorMessage: error
    }
}