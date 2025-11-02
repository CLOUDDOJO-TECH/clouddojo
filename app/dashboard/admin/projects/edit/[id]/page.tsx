import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth_utils";
import EditProjectClient from "./edit-client";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: {
          stepNumber: "asc",
        },
      },
      projectCategoryAssignments: {
        include: {
          projectCategory: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return <EditProjectClient project={project} />;
}
