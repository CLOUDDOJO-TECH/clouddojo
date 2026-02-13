import { notFound } from "next/navigation"
import { GetuQizAttempt } from "@/app/(actions)/quiz/attempts/get_quiz-attempt"
import Results from "../../components/Results"
import { AttemptData } from "../../types"

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
  const { attemptId } = await params

  const response = await GetuQizAttempt({ attemptId })

  if (!response.success || !response.data) {
    notFound()
  }

  return <Results attempt={response.data as AttemptData} />
}
