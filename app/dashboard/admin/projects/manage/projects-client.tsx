"use client";

import React, { useState } from "react";
import { useGetAllProjects } from "./hooks";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  ProjectTableData,
  deleteProject,
  toggleProjectPublishStatus,
  bulkDeleteProjects,
  bulkPublishProjects,
  bulkUnpublishProjects,
  duplicateProject,
} from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: ProjectTableData[];
}) {
  const {
    data: projects,
    isLoading,
    error,
  } = useGetAllProjects(initialProjects);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [projectsToDelete, setProjectsToDelete] = useState<string[]>([]);

  const handleView = (id: string) => {
    router.push(`/projects/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/projects/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    toast.loading("Deleting project...", { id: "delete-project" });

    const result = await deleteProject(projectToDelete);

    if (result.success) {
      toast.success("Project deleted successfully", { id: "delete-project" });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to delete project", {
        id: "delete-project",
      });
    }

    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleDuplicate = async (id: string) => {
    toast.loading("Duplicating project...", { id: "duplicate-project" });

    const result = await duplicateProject(id);

    if (result.success) {
      toast.success("Project duplicated successfully", {
        id: "duplicate-project",
      });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to duplicate project", {
        id: "duplicate-project",
      });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    toast.loading(
      isPublished ? "Publishing project..." : "Unpublishing project...",
      { id: "toggle-publish" },
    );

    const result = await toggleProjectPublishStatus(id);

    if (result.success) {
      toast.success(result.message || "Status updated", {
        id: "toggle-publish",
      });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to update status", {
        id: "toggle-publish",
      });
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setProjectsToDelete(ids);
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (projectsToDelete.length === 0) return;

    toast.loading(`Deleting ${projectsToDelete.length} project(s)...`, {
      id: "bulk-delete",
    });

    const result = await bulkDeleteProjects(projectsToDelete);

    if (result.success) {
      toast.success(result.message || "Projects deleted successfully", {
        id: "bulk-delete",
      });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to delete projects", {
        id: "bulk-delete",
      });
    }

    setBulkDeleteDialogOpen(false);
    setProjectsToDelete([]);
  };

  const handleBulkPublish = async (ids: string[]) => {
    toast.loading(`Publishing ${ids.length} project(s)...`, {
      id: "bulk-publish",
    });

    const result = await bulkPublishProjects(ids);

    if (result.success) {
      toast.success(result.message || "Projects published successfully", {
        id: "bulk-publish",
      });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to publish projects", {
        id: "bulk-publish",
      });
    }
  };

  const handleBulkUnpublish = async (ids: string[]) => {
    toast.loading(`Unpublishing ${ids.length} project(s)...`, {
      id: "bulk-unpublish",
    });

    const result = await bulkUnpublishProjects(ids);

    if (result.success) {
      toast.success(result.message || "Projects unpublished successfully", {
        id: "bulk-unpublish",
      });
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to unpublish projects", {
        id: "bulk-unpublish",
      });
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-full p-4 md:p-6 overflow-x-auto">
        <div className="border rounded-lg p-12 text-center bg-destructive/10">
          <h3 className="text-lg font-semibold mb-2">Error Loading Projects</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-full p-4 md:p-6 overflow-x-auto">
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

          {isLoading ? (
            <div className="flex items-center justify-center p-12 border rounded-lg bg-muted/30">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="group rounded-lg bg-gradient-to-br from-blue-50 via-cyan-50 to-transparent dark:from-blue-950/30 dark:via-cyan-950/30 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      className="text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7 16.5C7.00033 14.015 10.3333 9 12 9C13.6667 9 16.9997 14.015 17 16.5C17 18.9853 14.7614 21 12 21C9.23858 21 7 18.9853 7 16.5Z"
                        fill="currentColor"
                        opacity="0.3"
                      />
                      <path
                        d="M12.3555 1.17975C12.6333 1.22007 12.8835 1.42661 13.3828 1.8399C14.5704 2.8229 15.6975 3.87361 16.7432 5.01569C17.7733 6.14079 18.827 7.46472 19.627 8.88092C20.4224 10.2894 21.0058 11.8567 21.0059 13.4503C21.0058 18.9618 16.2992 22 12.0059 22.0001C7.71247 22.0001 3.00593 18.9618 3.00586 13.4503C3.00601 11.6543 3.31206 9.81195 3.64062 7.99908C3.79551 7.14453 3.87278 6.71677 4.0918 6.49615C4.28495 6.30176 4.54241 6.19717 4.81641 6.20123C5.1273 6.20598 5.47988 6.45692 6.18457 6.95807L8.20117 8.39166L10.9971 2.40631C11.2819 1.79667 11.4252 1.49135 11.6592 1.336C11.8588 1.20356 12.1184 1.1454 12.3555 1.17975ZM12 11.0001C10.8333 11.0001 8.50023 14.7613 8.5 16.6251C8.50004 18.4372 9.98124 19.9144 11.8398 19.9952C11.8929 19.998 11.9463 20.0001 12 20.0001C12.0534 20.0001 12.1065 19.9979 12.1592 19.9952C14.0182 19.9149 15.5 18.4375 15.5 16.6251C15.4998 14.7613 13.1667 11.0001 12 11.0001Z"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground font-main">
                      Total Projects
                    </p>
                  </div>
                  <p className="text-2xl font-bold font-main">
                    {projects?.length || 0}
                  </p>
                </div>
                <div className="group rounded-lg bg-gradient-to-br from-green-50 via-emerald-50 to-transparent dark:from-green-950/30 dark:via-emerald-950/30 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      className="text-green-600 dark:text-green-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z"
                        fill="currentColor"
                        opacity="0.2"
                      />
                      <path
                        d="M11.5469 5.06433C12.27 4.96199 12.9923 4.98279 13.6953 5.11609C14.4005 5.25026 14.5631 6.11158 14.043 6.60633L11.7432 8.78992C11.3354 9.17715 11.3271 9.82485 11.7246 10.2225L13.7568 12.2548C14.1609 12.6586 14.8213 12.6419 15.2051 12.2186L17.3428 9.86219C17.8292 9.32637 18.7024 9.47533 18.8516 10.1835C19.0088 10.931 19.0415 11.6997 18.9277 12.4774C18.5408 15.1252 16.4821 17.3221 13.8594 17.8573C12.3852 18.1582 10.9728 17.9545 9.76172 17.3895L6.26302 21.381C5.19562 22.5987 3.36687 22.9201 2.22209 21.7748C1.07797 20.6302 1.39892 18.8026 2.61542 17.7352L6.60645 14.2333C6.0368 13.0111 5.83465 11.5841 6.14746 10.0956C6.69765 7.481 8.90125 5.43845 11.5469 5.06433Z"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground font-main">
                      Published Projects
                    </p>
                  </div>
                  <p className="text-2xl font-bold font-main">
                    {projects?.filter((p) => p.isPublished).length || 0}
                  </p>
                </div>
                <div className="group rounded-lg bg-gradient-to-br from-purple-50 via-fuchsia-50 to-transparent dark:from-purple-950/30 dark:via-fuchsia-950/30 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 18 18"
                      className="text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.554137 13.5756C1.34525 11.4759 3.36866 9.978 5.74997 9.978C8.13128 9.978 10.1547 11.4759 10.9458 13.5756C11.3059 14.5315 10.7272 15.5154 9.84596 15.8102C8.82613 16.1509 7.42657 16.477 5.75097 16.477C4.0754 16.477 2.67527 16.151 1.65458 15.8104C0.771586 15.5163 0.194851 14.5312 0.554137 13.5756Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12.5523 13.9772C13.9847 13.9159 15.1901 13.6248 16.096 13.3222C16.9772 13.0274 17.5559 12.0435 17.1958 11.0875C16.4047 8.98793 14.3813 7.48999 12 7.48999C10.5581 7.48999 9.24737 8.03921 8.26202 8.93866C10.147 9.65809 11.6398 11.1632 12.3495 13.0467C12.4675 13.3601 12.5329 13.6723 12.5523 13.9772Z"
                        fill="currentColor"
                        fillOpacity="0.4"
                      />
                      <path
                        d="M5.75 8.50049C6.99267 8.50049 8 7.49361 8 6.25049C8 5.00736 6.99267 4.00049 5.75 4.00049C4.50733 4.00049 3.5 5.00736 3.5 6.25049C3.5 7.49361 4.50733 8.50049 5.75 8.50049Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 6.00049C13.2427 6.00049 14.25 4.99361 14.25 3.75049C14.25 2.50736 13.2427 1.50049 12 1.50049C10.7573 1.50049 9.75 2.50736 9.75 3.75049C9.75 4.99361 10.7573 6.00049 12 6.00049Z"
                        fill="currentColor"
                        fillOpacity="0.4"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground font-main">
                      Total Users
                    </p>
                  </div>
                  <p className="text-2xl font-bold font-main">
                    {projects?.reduce((acc, p) => acc + p.userCount, 0) || 0}
                  </p>
                </div>
                <div className="group rounded-lg bg-gradient-to-br from-orange-50 via-amber-50 to-transparent dark:from-orange-950/30 dark:via-amber-950/30 p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      className="text-orange-600 dark:text-orange-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    >
                      <path
                        d="M5 7C5.73993 7 6.38454 7.40267 6.73047 8H18C18.5523 8 19 8.44772 19 9C19 9.55228 18.5523 10 18 10H6.73047C6.38454 10.5973 5.73993 11 5 11C3.89543 11 3 10.1046 3 9C3 7.89543 3.89543 7 5 7Z"
                        fill="currentColor"
                        opacity="0.3"
                      />
                      <path
                        d="M5 5C7.20914 5 9 6.79086 9 9C9 11.2091 7.20914 13 5 13C2.79086 13 1 11.2091 1 9C1 6.79086 2.79086 5 5 5ZM19 5C21.2091 5 23 6.79086 23 9C23 11.2091 21.2091 13 19 13C16.7909 13 15 11.2091 15 9C15 6.79086 16.7909 5 19 5ZM5 7.5C4.17157 7.5 3.5 8.17157 3.5 9C3.5 9.82843 4.17157 10.5 5 10.5C5.82843 10.5 6.5 9.82843 6.5 9C6.5 8.17157 5.82843 7.5 5 7.5Z"
                        fill="currentColor"
                      />
                      <path
                        d="M4 19V16C4 15.4477 4.44772 15 5 15C5.55228 15 6 15.4477 6 16V19C6 19.5523 5.55228 20 5 20C4.44772 20 4 19.5523 4 19Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16.5 19V16C16.5 15.4477 16.9477 15 17.5 15C18.0523 15 18.5 15.4477 18.5 16V19C18.5 19.5523 18.0523 20 17.5 20C16.9477 20 16.5 19.5523 16.5 19Z"
                        fill="currentColor"
                      />
                      <path
                        d="M19.5 19V16C19.5 15.4477 19.9477 15 20.5 15C21.0523 15 21.5 15.4477 21.5 16V19C21.5 19.5523 21.0523 20 20.5 20C19.9477 20 19.5 19.5523 19.5 19Z"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground font-main">
                      Total Steps
                    </p>
                  </div>
                  <p className="text-2xl font-bold font-main">
                    {projects?.reduce((acc, p) => acc + p.stepsCount, 0) || 0}
                  </p>
                </div>
              </div>

              {/* Data Table */}
              <DataTable
                columns={columns}
                data={projects || []}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onTogglePublish={handleTogglePublish}
                onBulkDelete={handleBulkDelete}
                onBulkPublish={handleBulkPublish}
                onBulkUnpublish={handleBulkUnpublish}
              />
            </>
          )}
        </div>
      </div>

      {/* Single Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this project and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-gradient-to-b from-red-600 to-red-700 text-white shadow hover:from-red-700 hover:to-red-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {projectsToDelete.length} project(s)?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all selected projects and their
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              className="bg-gradient-to-b from-red-600 to-red-700 text-white shadow hover:from-red-700 hover:to-red-800"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
