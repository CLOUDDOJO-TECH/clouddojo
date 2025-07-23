import { Suspense } from "react"
import { notFound } from "next/navigation"
import { GetQuizById } from "@/app/(actions)/quiz/get-quiz"
import QuizComponent from "../components/QuizComponent"
import { QuizWithRelations } from "../types"

// Loading fallback
function QuizLoading() {
  return (
    <div className="container w-full max-w-4xl mx-auto p-4 md:p-6 pt-16 md:pt-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading quiz...</p>
      </div>
    </div>
  )
}

// Error component
function QuizError({ error }: { error: string }) {
  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error loading quiz</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )
}

export default async function PracticeTestPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params
  const { data, error } = await GetQuizById(quizId)
  
  if (error) {
    return notFound()
  }

  const quiz = data as QuizWithRelations

  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizComponent quiz={quiz} quizId={quizId} />
    </Suspense>
  )
}

