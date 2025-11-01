import { notFound } from "next/navigation";
import { getQuizById } from "../../manage/actions";
import PreviewClient from "./preview-client";

interface PreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const result = await getQuizById(id);

  if (!result.success || !result.quiz) {
    notFound();
  }

  return <PreviewClient quiz={result.quiz} />;
}
