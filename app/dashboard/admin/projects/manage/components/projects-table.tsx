"use client";

import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Clock,
  DollarSign,
  ListChecks,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  ProjectTableData,
  deleteProject,
  toggleProjectPublishStatus,
} from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectsTableProps {
  projects: ProjectTableData[];
}

export function ProjectsTable({
  projects: initialProjects,
}: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Sync local state when props change (from React Query refetch)
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    toast.loading("Deleting project...", { id: "delete-project" });

    const result = await deleteProject(projectToDelete);

    if (result.success) {
      toast.success("Project deleted successfully", { id: "delete-project" });
      setProjects(projects.filter((p) => p.id !== projectToDelete));
      // Invalidate query cache to refetch projects
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to delete project", {
        id: "delete-project",
      });
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleTogglePublish = async (projectId: string) => {
    toast.loading("Updating project status...", { id: "toggle-publish" });

    const result = await toggleProjectPublishStatus(projectId);

    if (result.success) {
      toast.success(result.message || "Status updated", {
        id: "toggle-publish",
      });
      setProjects(
        projects.map((p) =>
          p.id === projectId ? { ...p, isPublished: result.isPublished! } : p,
        ),
      );
      // Invalidate query cache to refetch projects
      queryClient.invalidateQueries({ queryKey: ["allProjects"] });
    } else {
      toast.error(result.error || "Failed to update status", {
        id: "toggle-publish",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINER":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "ADVANCED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "EXPERT":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TUTORIAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "CHALLENGE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "ASSESSMENT":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
      case "CAPSTONE":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes === 0
      ? `${hours}h`
      : `${hours}h ${remainingMinutes}m`;
  };

  const formatCost = (cents: number) => {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (projects.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center bg-muted/30">
        <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by creating your first project.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">
                <Users className="h-4 w-4 inline mr-1" />
                Users
              </TableHead>
              <TableHead className="text-center">
                <ListChecks className="h-4 w-4 inline mr-1" />
                Steps
              </TableHead>
              <TableHead className="text-center">
                <FolderTree className="h-4 w-4 inline mr-1" />
                Categories
              </TableHead>
              <TableHead>
                <Clock className="h-4 w-4 inline mr-1" />
                Duration
              </TableHead>
              <TableHead>
                <DollarSign className="h-4 w-4 inline mr-1" />
                Cost
              </TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[280px]">
                      {project.title}
                    </span>
                    {project.isPremium && (
                      <Badge
                        className="bg-yellow-500 text-yellow-50 w-fit mt-1"
                        variant="secondary"
                      >
                        Premium
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={getTypeColor(project.projectType)}
                    variant="secondary"
                  >
                    {project.projectType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={getDifficultyColor(project.difficulty)}
                    variant="secondary"
                  >
                    {project.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={project.isPublished ? "default" : "outline"}>
                    {project.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {project.userCount}
                </TableCell>
                <TableCell className="text-center">
                  {project.stepsCount}
                </TableCell>
                <TableCell className="text-center">
                  {project.categoriesCount}
                </TableCell>
                <TableCell>{formatTime(project.estimatedTime)}</TableCell>
                <TableCell>{formatCost(project.estimatedCost)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(project.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/projects/edit/${project.id}`,
                          )
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleTogglePublish(project.id)}
                      >
                        {project.isPublished ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
