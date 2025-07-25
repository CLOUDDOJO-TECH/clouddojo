import { useQuery } from '@tanstack/react-query'
import { transformAnalysisData } from './transform-analysis';
import { ReportData } from '../types';
import { getCachedAIAnalysis } from '@/app/(actions)/ai-analysis/get-cached-ai-analysis';

const useAIAnalysis = () => {
  return useQuery({
    queryKey: ['ai-analysis'],
    queryFn: async () => {
      const result = await getCachedAIAnalysis();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to analyze test data");
      }

      const transformed = Array.isArray(result.data)
        ? transformAnalysisData(result.data as any)
        : (result.data as ReportData);

      return transformed;
    }
  });
};

export default useAIAnalysis;