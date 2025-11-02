"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  ProjectBasicInfo,
  ProjectContent,
  ProjectSteps,
  ProjectCategories,
} from "./validators";

export interface ServerProjectDraft {
  id: string;
  currentStep: number;
  basicInfo: ProjectBasicInfo | null;
  content: ProjectContent | null;
  steps: ProjectSteps | null;
  categories: ProjectCategories | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveDraftToServer(draft: {
  currentStep: number;
  basicInfo: ProjectBasicInfo | null;
  content: ProjectContent | null;
  steps: ProjectSteps | null;
  categories: ProjectCategories | null;
}): Promise<{ success: boolean; draftId?: string; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract title from basicInfo for easier identification
    const title = draft.basicInfo?.title || "Untitled Project";

    // Check if user already has a draft, update it or create new one
    const existingDraft = await prisma.projectDraft.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    const draftData = {
      title,
      currentStep: draft.currentStep,
      draftData: {
        basicInfo: draft.basicInfo,
        content: draft.content,
        steps: draft.steps,
        categories: draft.categories,
      },
    };

    let savedDraft;

    if (existingDraft) {
      // Update existing draft
      savedDraft = await prisma.projectDraft.update({
        where: { id: existingDraft.id },
        data: draftData,
      });
    } else {
      // Create new draft
      savedDraft = await prisma.projectDraft.create({
        data: {
          userId,
          ...draftData,
        },
      });
    }

    return { success: true, draftId: savedDraft.id };
  } catch (error) {
    console.error("Failed to save draft to server:", error);
    return { success: false, error: "Failed to save draft" };
  }
}

export async function loadDraftFromServer(): Promise<{
  success: boolean;
  draft?: ServerProjectDraft;
  error?: string;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const dbDraft = await prisma.projectDraft.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (!dbDraft) {
      return { success: false, error: "No draft found" };
    }

    const draftData = dbDraft.draftData as {
      basicInfo: ProjectBasicInfo | null;
      content: ProjectContent | null;
      steps: ProjectSteps | null;
      categories: ProjectCategories | null;
    };

    const draft: ServerProjectDraft = {
      id: dbDraft.id,
      currentStep: dbDraft.currentStep,
      basicInfo: draftData.basicInfo,
      content: draftData.content,
      steps: draftData.steps,
      categories: draftData.categories,
      createdAt: dbDraft.createdAt,
      updatedAt: dbDraft.updatedAt,
    };

    return { success: true, draft };
  } catch (error) {
    console.error("Failed to load draft from server:", error);
    return { success: false, error: "Failed to load draft" };
  }
}

export async function deleteDraftFromServer(
  draftId?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (draftId) {
      // Delete specific draft
      await prisma.projectDraft.delete({
        where: { id: draftId, userId },
      });
    } else {
      // Delete all drafts for user
      await prisma.projectDraft.deleteMany({
        where: { userId },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete draft from server:", error);
    return { success: false, error: "Failed to delete draft" };
  }
}

export async function hasDraftOnServer(): Promise<{
  success: boolean;
  hasDraft: boolean;
  updatedAt?: Date;
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, hasDraft: false };
    }

    const draft = await prisma.projectDraft.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });

    return {
      success: true,
      hasDraft: !!draft,
      updatedAt: draft?.updatedAt,
    };
  } catch (error) {
    console.error("Failed to check draft on server:", error);
    return { success: false, hasDraft: false };
  }
}
