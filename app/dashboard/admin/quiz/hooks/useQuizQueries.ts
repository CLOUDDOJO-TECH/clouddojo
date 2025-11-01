"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import {
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
  duplicateQuiz,
  toggleQuizVisibility,
  toggleQuizAccess,
  bulkDeleteQuizzes,
  bulkUpdateVisibility,
  bulkUpdateAccess,
  updateQuiz,
} from "../manage/actions";

// Query Keys
export const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: () => [...quizKeys.lists()] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
};

/**
 * Hook to fetch all quizzes
 */
export function useQuizzes() {
  return useQuery({
    queryKey: quizKeys.list(),
    queryFn: getAllQuizzes,
  });
}

/**
 * Hook to fetch a single quiz by ID
 */
export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: quizKeys.detail(quizId),
    queryFn: async () => {
      const result = await getQuizById(quizId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch quiz");
      }
      return result.quiz;
    },
    enabled: !!quizId,
  });
}

/**
 * Hook to delete a quiz
 */
export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to duplicate a quiz
 */
export function useDuplicateQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: duplicateQuiz,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to toggle quiz visibility
 */
export function useToggleQuizVisibility() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ quizId, isPublic }: { quizId: string; isPublic: boolean }) =>
      toggleQuizVisibility(quizId, isPublic),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to toggle quiz access (free/premium)
 */
export function useToggleQuizAccess() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ quizId, free }: { quizId: string; free: boolean }) =>
      toggleQuizAccess(quizId, free),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to bulk delete quizzes
 */
export function useBulkDeleteQuizzes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: bulkDeleteQuizzes,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to bulk update quiz visibility
 */
export function useBulkUpdateVisibility() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      quizIds,
      isPublic,
    }: {
      quizIds: string[];
      isPublic: boolean;
    }) => bulkUpdateVisibility(quizIds, isPublic),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to bulk update quiz access
 */
export function useBulkUpdateAccess() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ quizIds, free }: { quizIds: string[]; free: boolean }) =>
      bulkUpdateAccess(quizIds, free),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

/**
 * Hook to update a quiz
 */
export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      quizId,
      data,
    }: {
      quizId: string;
      data: Parameters<typeof updateQuiz>[1];
    }) => updateQuiz(quizId, data),
    onMutate: () => {
      // Show loading toast
      sonnerToast.loading("Updating quiz...", { id: "update-quiz" });
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: quizKeys.list() });
        queryClient.invalidateQueries({
          queryKey: quizKeys.detail(variables.quizId),
        });
        sonnerToast.success(result.message || "Quiz updated successfully!", {
          id: "update-quiz",
        });
        // Redirect to preview page after success
        setTimeout(() => {
          router.push(`/dashboard/admin/quiz/preview/${variables.quizId}`);
        }, 1500);
      } else {
        sonnerToast.error(result.error || "Failed to update quiz", {
          id: "update-quiz",
        });
      }
    },
    onError: (error: Error) => {
      sonnerToast.error(error.message || "Failed to update quiz", {
        id: "update-quiz",
      });
    },
  });
}
