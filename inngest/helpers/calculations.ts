/**
 * Calculation Helpers
 *
 * Math utilities for AI analysis metrics
 */

/**
 * Calculate mean (average) of an array of numbers
 */
export function mean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return sum / numbers.length;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = mean(numbers);
  const squareDiffs = numbers.map((n) => Math.pow(n - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculate median
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Calculate mode (most frequent value)
 */
export function mode(values: any[]): any {
  if (values.length === 0) return null;

  const frequency: Record<string, number> = {};
  let maxFreq = 0;
  let modeValue = values[0];

  values.forEach((val) => {
    const key = String(val);
    frequency[key] = (frequency[key] || 0) + 1;
    if (frequency[key] > maxFreq) {
      maxFreq = frequency[key];
      modeValue = val;
    }
  });

  return modeValue;
}

/**
 * Calculate slope (trend) using linear regression
 */
export function calculateSlope(numbers: number[]): number {
  if (numbers.length < 2) return 0;

  const n = numbers.length;
  const sumX = (n * (n - 1)) / 2; // Sum of indices 0, 1, 2, ..., n-1
  const sumY = numbers.reduce((acc, val) => acc + val, 0);
  const sumXY = numbers.reduce((acc, val, i) => acc + i * val, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return slope;
}

/**
 * Determine if a series of numbers is improving
 */
export function isImproving(numbers: number[]): boolean {
  const slope = calculateSlope(numbers);
  return slope > 0.5; // Positive slope > 0.5 indicates improvement
}

/**
 * Determine if a series is declining
 */
export function isDeclining(numbers: number[]): boolean {
  const slope = calculateSlope(numbers);
  return slope < -0.5; // Negative slope < -0.5 indicates decline
}

/**
 * Calculate trend label
 */
export function calculateTrend(numbers: number[]): string {
  const slope = calculateSlope(numbers);

  if (slope > 2) return "accelerating";
  if (slope > 0.5) return "improving";
  if (slope < -2) return "rapid-decline";
  if (slope < -0.5) return "declining";
  return "stable";
}

/**
 * Calculate consistency score (0-100)
 * Lower standard deviation = higher consistency
 */
export function calculateConsistencyScore(numbers: number[]): number {
  if (numbers.length < 2) return 100;

  const stdDev = standardDeviation(numbers);

  // Map standard deviation to consistency score (inverse relationship)
  if (stdDev < 5) return 95;
  if (stdDev < 10) return 80;
  if (stdDev < 15) return 60;
  if (stdDev < 20) return 40;
  return 20;
}

/**
 * Calculate percentile rank
 */
export function calculatePercentile(value: number, allValues: number[]): number {
  if (allValues.length === 0) return 0;

  const sorted = [...allValues].sort((a, b) => a - b);
  const rank = sorted.filter((v) => v <= value).length;
  const percentile = (rank / sorted.length) * 100;

  return Math.round(percentile);
}

/**
 * Count occurrences in an array
 */
export function countOccurrences<T>(items: T[]): Map<T, number> {
  const counts = new Map<T, number>();

  items.forEach((item) => {
    counts.set(item, (counts.get(item) || 0) + 1);
  });

  return counts;
}

/**
 * Get top N items by frequency
 */
export function getTopN<T>(counts: Map<T, number>, n: number): Array<{ item: T; count: number }> {
  return Array.from(counts.entries())
    .map(([item, count]) => ({ item, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/**
 * Calculate time efficiency rating
 */
export function calculateTimeEfficiency(
  avgTimePerQuestion: number,
  benchmark: { fast: number; average: number } = { fast: 60, average: 90 }
): "fast" | "average" | "slow" {
  if (avgTimePerQuestion < benchmark.fast) return "fast";
  if (avgTimePerQuestion <= benchmark.average) return "average";
  return "slow";
}

/**
 * Calculate learning velocity (points per quiz)
 */
export function calculateLearningVelocity(scores: number[]): string {
  if (scores.length < 2) return "insufficient-data";

  const slope = calculateSlope(scores);

  if (slope > 2) return "accelerating";
  if (slope > 0) return "improving";
  if (slope === 0) return "stable";
  return "declining";
}

/**
 * Predict certification readiness
 */
export function predictCertificationReadiness(scores: number[], targetScore: number = 80): {
  ready: boolean;
  readinessScore: number;
  estimatedQuizzesNeeded: number;
} {
  const avgScore = mean(scores);

  if (avgScore >= targetScore) {
    return {
      ready: true,
      readinessScore: 100,
      estimatedQuizzesNeeded: 0,
    };
  }

  const velocity = calculateSlope(scores);
  const pointsNeeded = targetScore - avgScore;

  // If not improving, will need many quizzes
  if (velocity <= 0) {
    return {
      ready: false,
      readinessScore: Math.round((avgScore / targetScore) * 100),
      estimatedQuizzesNeeded: 50, // Arbitrary large number
    };
  }

  const quizzesNeeded = Math.ceil(pointsNeeded / velocity);

  return {
    ready: false,
    readinessScore: Math.round((avgScore / targetScore) * 100),
    estimatedQuizzesNeeded: Math.min(quizzesNeeded, 50), // Cap at 50
  };
}
