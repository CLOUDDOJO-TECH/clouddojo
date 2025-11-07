"use client";

import { useState, useEffect } from 'react';

interface ProjectStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string | null;
  instructions: string;
  estimatedTime: number;
  expectedOutput: string | null;
  validationCriteria: string[];
  mediaUrls: string[];
  stepType: string;
  isOptional: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface ProjectStepsData {
  project: {
    id: string;
    title: string;
  };
  steps: ProjectStep[];
  progress: {
    completedSteps: number[];
    currentStep: number;
    status: string;
  };
}

interface UseProjectStepsReturn {
  data: ProjectStepsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProjectSteps = (projectId: string): UseProjectStepsReturn => {
  const [data, setData] = useState<ProjectStepsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${projectId}/steps`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch steps: ${response.statusText}`);
      }

      const stepsData = await response.json();
      setData(stepsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project steps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchSteps();
    }
  }, [projectId]);

  const refetch = () => {
    fetchSteps();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};