import {
  ProjectBasicInfo,
  ProjectContent,
  ProjectSteps,
  ProjectCategories,
} from "./validators";

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
  // Save draft to localStorage
  saveDraft: (draft: Omit<ProjectDraft, "savedAt">): boolean => {
    try {
      const draftWithTimestamp: ProjectDraft = {
        ...draft,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithTimestamp));
      localStorage.setItem(DRAFT_TIMESTAMP_KEY, draftWithTimestamp.savedAt);
      return true;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return false;
    }
  },

  // Load draft from localStorage
  loadDraft: (): ProjectDraft | null => {
    try {
      const draftJson = localStorage.getItem(DRAFT_KEY);
      if (!draftJson) return null;

      const draft = JSON.parse(draftJson) as ProjectDraft;
      return draft;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  },

  // Check if draft exists
  hasDraft: (): boolean => {
    return localStorage.getItem(DRAFT_KEY) !== null;
  },

  // Get draft timestamp
  getDraftTimestamp: (): string | null => {
    return localStorage.getItem(DRAFT_TIMESTAMP_KEY);
  },

  // Clear draft
  clearDraft: (): void => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
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
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  },
};
