"use client";

import React from "react";
import { useGetAllProjects } from "./hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { ProjectsTable } from "./components/projects-table";

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: any[];
}) {
  const { data, isLoading, error } = useGetAllProjects(initialProjects);

  const projects = data?.projects || initialProjects || [];

  if (isLoading) return <div>Loading projects…</div>;
  if (error) return <div>Error loading projects</div>;
  return (
    <div className="container mx-auto p-6 md:px-14">
      <div className="space-y-6">
        <div>
          <Link href="/dashboard/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manage Projects
              </h1>
              <p className="text-muted-foreground mt-2">
                View, edit, and manage all hands-on projects
              </p>
            </div>
            <Link href="/dashboard/admin/projects/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </Link>
          </div>
        </div>

        <ProjectsTable projects={projects} />
      </div>
    </div>
  );
}
