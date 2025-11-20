/**
 * Unit Tests for Calculation Helpers
 */

import { describe, it, expect } from 'vitest';
import {
  mean,
  standardDeviation,
  median,
  mode,
  calculateSlope,
  isImproving,
  isDeclining,
  calculateTrend,
  calculateConsistencyScore,
  calculatePercentile,
  calculateTimeEfficiency,
  calculateLearningVelocity,
  predictCertificationReadiness,
} from '@/inngest/helpers/calculations';

describe('Calculation Helpers', () => {
  describe('mean', () => {
    it('calculates average correctly', () => {
      expect(mean([10, 20, 30, 40, 50])).toBe(30);
    });

    it('handles empty array', () => {
      expect(mean([])).toBe(0);
    });

    it('handles single value', () => {
      expect(mean([42])).toBe(42);
    });

    it('handles decimal values', () => {
      expect(mean([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
    });
  });

  describe('standardDeviation', () => {
    it('calculates standard deviation correctly', () => {
      const result = standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result).toBeCloseTo(2, 0);
    });

    it('returns 0 for empty array', () => {
      expect(standardDeviation([])).toBe(0);
    });

    it('returns 0 for identical values', () => {
      expect(standardDeviation([5, 5, 5, 5])).toBe(0);
    });
  });

  describe('median', () => {
    it('calculates median for odd-length array', () => {
      expect(median([1, 3, 5, 7, 9])).toBe(5);
    });

    it('calculates median for even-length array', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it('handles unsorted array', () => {
      expect(median([9, 1, 5, 3, 7])).toBe(5);
    });

    it('handles empty array', () => {
      expect(median([])).toBe(0);
    });
  });

  describe('mode', () => {
    it('finds most frequent value', () => {
      expect(mode([1, 2, 2, 3, 4])).toBe(2);
    });

    it('returns first value for all unique', () => {
      expect(mode([1, 2, 3, 4, 5])).toBe(1);
    });

    it('handles empty array', () => {
      expect(mode([])).toBeNull();
    });

    it('works with strings', () => {
      expect(mode(['S3', 'EC2', 'S3', 'VPC'])).toBe('S3');
    });
  });

  describe('calculateSlope', () => {
    it('calculates positive slope for improving scores', () => {
      const scores = [60, 65, 70, 75, 80];
      expect(calculateSlope(scores)).toBeGreaterThan(0);
    });

    it('calculates negative slope for declining scores', () => {
      const scores = [80, 75, 70, 65, 60];
      expect(calculateSlope(scores)).toBeLessThan(0);
    });

    it('returns 0 for flat scores', () => {
      const scores = [70, 70, 70, 70, 70];
      expect(calculateSlope(scores)).toBeCloseTo(0);
    });

    it('handles minimum length', () => {
      expect(calculateSlope([70])).toBe(0);
    });
  });

  describe('isImproving', () => {
    it('returns true for improving trend', () => {
      const scores = [60, 65, 70, 75, 80];
      expect(isImproving(scores)).toBe(true);
    });

    it('returns false for declining trend', () => {
      const scores = [80, 75, 70, 65, 60];
      expect(isImproving(scores)).toBe(false);
    });

    it('returns false for flat trend', () => {
      const scores = [70, 70, 70, 70, 70];
      expect(isImproving(scores)).toBe(false);
    });
  });

  describe('isDeclining', () => {
    it('returns true for declining trend', () => {
      const scores = [80, 75, 70, 65, 60];
      expect(isDeclining(scores)).toBe(true);
    });

    it('returns false for improving trend', () => {
      const scores = [60, 65, 70, 75, 80];
      expect(isDeclining(scores)).toBe(false);
    });
  });

  describe('calculateTrend', () => {
    it('identifies accelerating trend', () => {
      const scores = [50, 60, 72, 85, 95];
      expect(calculateTrend(scores)).toBe('accelerating');
    });

    it('identifies improving trend', () => {
      const scores = [60, 65, 70, 75, 78];
      expect(calculateTrend(scores)).toBe('improving');
    });

    it('identifies stable trend', () => {
      const scores = [70, 71, 70, 72, 70];
      expect(calculateTrend(scores)).toBe('stable');
    });

    it('identifies declining trend', () => {
      const scores = [80, 75, 72, 70, 68];
      expect(calculateTrend(scores)).toBe('declining');
    });

    it('identifies rapid decline', () => {
      const scores = [90, 80, 65, 50, 40];
      expect(calculateTrend(scores)).toBe('rapid-decline');
    });
  });

  describe('calculateConsistencyScore', () => {
    it('gives high score for consistent performance', () => {
      const scores = [75, 76, 75, 77, 75];
      expect(calculateConsistencyScore(scores)).toBeGreaterThanOrEqual(80);
    });

    it('gives low score for inconsistent performance', () => {
      const scores = [50, 80, 60, 90, 55];
      expect(calculateConsistencyScore(scores)).toBeLessThan(50);
    });

    it('returns 100 for single score', () => {
      expect(calculateConsistencyScore([75])).toBe(100);
    });
  });

  describe('calculatePercentile', () => {
    it('calculates correct percentile', () => {
      const allScores = [50, 60, 70, 80, 90];
      expect(calculatePercentile(70, allScores)).toBe(60); // 3 out of 5 = 60%
    });

    it('handles empty array', () => {
      expect(calculatePercentile(75, [])).toBe(0);
    });

    it('handles 100th percentile', () => {
      const allScores = [50, 60, 70, 80, 90];
      expect(calculatePercentile(95, allScores)).toBe(100);
    });
  });

  describe('calculateTimeEfficiency', () => {
    it('rates fast completion', () => {
      expect(calculateTimeEfficiency(45)).toBe('fast');
    });

    it('rates average completion', () => {
      expect(calculateTimeEfficiency(75)).toBe('average');
    });

    it('rates slow completion', () => {
      expect(calculateTimeEfficiency(120)).toBe('slow');
    });
  });

  describe('calculateLearningVelocity', () => {
    it('identifies accelerating learning', () => {
      const scores = [50, 60, 72, 85, 95];
      expect(calculateLearningVelocity(scores)).toBe('accelerating');
    });

    it('identifies improving learning', () => {
      const scores = [60, 65, 70, 75, 78];
      expect(calculateLearningVelocity(scores)).toBe('improving');
    });

    it('identifies stable learning', () => {
      const scores = [70, 70, 70, 70, 70];
      expect(calculateLearningVelocity(scores)).toBe('stable');
    });

    it('identifies declining learning', () => {
      const scores = [80, 75, 72, 70, 68];
      expect(calculateLearningVelocity(scores)).toBe('declining');
    });

    it('handles insufficient data', () => {
      expect(calculateLearningVelocity([75])).toBe('insufficient-data');
    });
  });

  describe('predictCertificationReadiness', () => {
    it('marks as ready when above target', () => {
      const scores = [78, 80, 82, 85, 88];
      const result = predictCertificationReadiness(scores, 80);

      expect(result.ready).toBe(true);
      expect(result.readinessScore).toBe(100);
      expect(result.estimatedQuizzesNeeded).toBe(0);
    });

    it('estimates quizzes needed when improving', () => {
      const scores = [60, 65, 70, 72, 75];
      const result = predictCertificationReadiness(scores, 80);

      expect(result.ready).toBe(false);
      expect(result.readinessScore).toBeGreaterThan(0);
      expect(result.estimatedQuizzesNeeded).toBeGreaterThan(0);
    });

    it('handles no improvement gracefully', () => {
      const scores = [60, 60, 60, 60, 60];
      const result = predictCertificationReadiness(scores, 80);

      expect(result.ready).toBe(false);
      expect(result.estimatedQuizzesNeeded).toBe(50); // Max cap
    });

    it('handles declining scores', () => {
      const scores = [75, 72, 70, 68, 65];
      const result = predictCertificationReadiness(scores, 80);

      expect(result.ready).toBe(false);
      expect(result.estimatedQuizzesNeeded).toBe(50);
    });
  });
});
