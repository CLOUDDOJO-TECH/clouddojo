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
  // Save draft to both localStorage and server
  saveDraft: async (draft: Omit<ProjectDraft, "savedAt">): Promise<boolean> => {
    try {
      const draftWithTimestamp: ProjectDraft = {
        ...draft,
        savedAt: new Date().toISOString(),
      };

      // Save to localStorage for quick access
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithTimestamp));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, draftWithTimestamp.savedAt);

      // Save to server for persistence across devices
      await saveDraftToServer(draft);

      return true;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return false;
    }
  },

  // Load draft (tries localStorage first, then server)
  loadDraft: async (): Promise<ProjectDraft | null> => {
    try {
      // Try localStorage first for speed
      const draftJson = localStorage.getItem(DRAFT_KEY);
      if (draftJson) {
        const draft = JSON.parse(draftJson) as ProjectDraft;
        return draft;
      }

      // If not in localStorage, try server
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

        // Cache in localStorage
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

  // Check if draft exists (checks both localStorage and server)
  hasDraft: async (): Promise<boolean> => {
    // Check localStorage first
    if (localStorage.getItem(DRAFT_KEY) !== null) {
      return true;
    }

    // Check server
    const serverResult = await hasDraftOnServer();
    return serverResult.hasDraft;
  },

  // Get draft timestamp
  getDraftTimestamp: (): string | null => {
    return localStorage.getItem(DRAFT_TIMESTAMP_KEY);
  },

  // Clear draft from both localStorage and server
  clearDraft: async (): Promise<void> => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    await deleteDraftFromServer();
  },

  // Get formatted time ago
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
