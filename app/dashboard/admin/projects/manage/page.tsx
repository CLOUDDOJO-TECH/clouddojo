import { requireAdmin } from "@/lib/utils/auth_utils";
import ProjectsClient from "./projects-client";
import { getAllProjects } from "./actions";

export default async function ManageProjectsPage() {
  await requireAdmin();
  const { projects } = await getAllProjects();

  return <ProjectsClient initialProjects={projects} />;
}
