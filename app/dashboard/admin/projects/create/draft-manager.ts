import {
  ProjectBasicInfo,
  ProjectContent,
  ProjectSteps,
  ProjectCategories,
} from "./validators";
import {
  saveDraftToServer,
  loadDraftFromServer,
  deleteDraftFromServer,
  hasDraftOnServer,
} from "./draft-actions";

const DRAFT_KEY = "project-creation-draft";
const DRAFT_TIMESTAMP_KEY = "project-creation-draft-timestamp";

export interface ProjectDraft {
  currentStep: number;
  basicInfo: ProjectBasicInfo | null;
  content: ProjectContent | null;
  steps: ProjectSteps | null;
  categories: ProjectCategories | null;
  savedAt: string;
}

export const draftManager = {
  saveDraft: async (draft: Omit<ProjectDraft, "savedAt">): Promise<boolean> => {
    try {
      const draftWithTimestamp: ProjectDraft = {
        ...draft,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithTimestamp));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, draftWithTimestamp.savedAt);

      const result = await saveDraftToServer(draft);

      return result.success;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return false;
    }
  },

  loadDraft: async (): Promise<ProjectDraft | null> => {
    try {
      const draftJson = localStorage.getItem(DRAFT_KEY);
      if (draftJson) {
        const draft = JSON.parse(draftJson) as ProjectDraft;
        return draft;
      }

      const serverResult = await loadDraftFromServer();
      if (serverResult.success && serverResult.draft) {
        const draft: ProjectDraft = {
          currentStep: serverResult.draft.currentStep,
          basicInfo: serverResult.draft.basicInfo,
          content: serverResult.draft.content,
          steps: serverResult.draft.steps,
          categories: serverResult.draft.categories,
          savedAt: serverResult.draft.updatedAt.toISOString(),
        };

        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        localStorage.setItem(DRAFT_TIMESTAMP_KEY, draft.savedAt);

        return draft;
      }

      return null;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  },

  hasDraft: async (): Promise<boolean> => {
    if (localStorage.getItem(DRAFT_KEY) !== null) {
      return true;
    }

    const serverResult = await hasDraftOnServer();
    return serverResult.hasDraft;
  },

  getDraftTimestamp: (): string | null => {
    return localStorage.getItem(DRAFT_TIMESTAMP_KEY);
  },

  clearDraft: async (): Promise<void> => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    await deleteDraftFromServer();
  },

  getTimeAgo: (timestamp: string): string => {
    const now = new Date();
    const saved = new Date(timestamp);
    const diffMs = now.getTime() - saved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  },
};
