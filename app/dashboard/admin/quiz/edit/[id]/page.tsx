import { notFound } from "next/navigation";
import { getQuizById } from "../../manage/actions";
import EditClient from "./edit-client";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const result = await getQuizById(id);

  if (!result.success || !result.quiz) {
    notFound();
  }

  return <EditClient quiz={result.quiz} />;
}
