// app/dashboard/admin/projects/manage/page.tsx  (Server Component — NO "use client")
import { requireAdmin } from "@/lib/utils/auth_utils";
import ProjectsClient from "./projects-client";
import { getAllProjects } from "./actions";

export default async function ManageProjectsPage() {
  await requireAdmin(); // server-side guard
  const res = await getAllProjects();
  const initialProjects = res.success ? res.projects : [];

  return <ProjectsClient initialProjects={initialProjects} />;
}
