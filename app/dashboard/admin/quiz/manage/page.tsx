"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  useQuizzes,
  useDeleteQuiz,
  useDuplicateQuiz,
  useToggleQuizVisibility,
  useToggleQuizAccess,
  useBulkDeleteQuizzes,
  useBulkUpdateVisibility,
  useBulkUpdateAccess,
} from "../hooks/useQuizQueries";

export default function ManageQuizzesPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [quizzesToBulkDelete, setQuizzesToBulkDelete] = useState<string[]>([]);

  // Queries
  const { data: quizzes = [], isLoading: loading } = useQuizzes();

  // Mutations
  const deleteQuizMutation = useDeleteQuiz();
  const duplicateQuizMutation = useDuplicateQuiz();
  const toggleVisibilityMutation = useToggleQuizVisibility();
  const toggleAccessMutation = useToggleQuizAccess();
  const bulkDeleteMutation = useBulkDeleteQuizzes();
  const bulkUpdateVisibilityMutation = useBulkUpdateVisibility();
  const bulkUpdateAccessMutation = useBulkUpdateAccess();

  const handleView = (id: string) => {
    router.push(`/dashboard/admin/quiz/preview/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/quiz/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setQuizToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!quizToDelete) return;
    deleteQuizMutation.mutate(quizToDelete);
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateQuizMutation.mutate(id);
  };

  const handleToggleVisibility = (id: string, isPublic: boolean) => {
    toggleVisibilityMutation.mutate({ quizId: id, isPublic });
  };

  const handleToggleAccess = (id: string, free: boolean) => {
    toggleAccessMutation.mutate({ quizId: id, free });
  };

  const handleBulkDelete = (ids: string[]) => {
    setQuizzesToBulkDelete(ids);
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    if (quizzesToBulkDelete.length === 0) return;
    bulkDeleteMutation.mutate(quizzesToBulkDelete);
    setBulkDeleteDialogOpen(false);
    setQuizzesToBulkDelete([]);
  };

  const handleBulkUpdateVisibility = (ids: string[], isPublic: boolean) => {
    bulkUpdateVisibilityMutation.mutate({ quizIds: ids, isPublic });
  };

  const handleBulkUpdateAccess = (ids: string[], free: boolean) => {
    bulkUpdateAccessMutation.mutate({ quizIds: ids, free });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Quizzes
            </h1>
            <p className="text-muted-foreground mt-2">
              View, edit, and manage all quizzes in the system
            </p>
          </div>
          <Link href="/dashboard/admin/quiz/upload">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload New Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Quizzes</p>
            <p className="text-2xl font-bold">{quizzes.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Public Quizzes</p>
            <p className="text-2xl font-bold">
              {quizzes.filter((q) => q.isPublic).length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Free Quizzes</p>
            <p className="text-2xl font-bold">
              {quizzes.filter((q) => q.free).length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Questions</p>
            <p className="text-2xl font-bold">
              {quizzes.reduce((acc, q) => acc + q._count.questions, 0)}
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={quizzes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleVisibility={handleToggleVisibility}
          onToggleAccess={handleToggleAccess}
          onBulkDelete={handleBulkDelete}
          onBulkUpdateVisibility={handleBulkUpdateVisibility}
          onBulkUpdateAccess={handleBulkUpdateAccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {quizzesToBulkDelete.length} quizzes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {quizzesToBulkDelete.length} quiz(zes) and all their questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
