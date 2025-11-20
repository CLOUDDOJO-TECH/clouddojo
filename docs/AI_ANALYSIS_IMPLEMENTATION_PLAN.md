# AI Analysis Implementation Plan - Per-Quiz Architecture

> **Created**: 2025-11-19
> **Approach**: Option 2 (Per-Quiz Analysis) with Inngest
> **Timeline**: 4 weeks
> **Focus**: Backend only (frontend later)

---

## Implementation Strategy

### Phase 1: Infrastructure & Schema (Week 1)
1. Install and configure Inngest
2. Design normalized database schema
3. Create Prisma migrations
4. Set up Inngest functions structure

### Phase 2: Per-Quiz Analysis (Week 2)
5. Implement individual analysis modules (Inngest functions)
6. Create AI prompts for each metric
7. Add freemium tier logic
8. Test per-quiz analysis flow

### Phase 3: Dashboard Aggregation (Week 3)
9. Build aggregation logic (code-based, no AI)
10. Create dashboard compilation function
11. Implement caching strategy
12. Add tRPC endpoints for data access

### Phase 4: Testing & Optimization (Week 4)
13. End-to-end testing
14. Performance optimization
15. Cost monitoring
16. Documentation

---

## Database Schema Design

### New Models

```prisma
// Per-quiz analysis (generated after each quiz)
model QuizAnalysis {
  id                String   @id @default(uuid())
  quizAttemptId     String   @unique
  userId            String
  status            String   @default("pending") // pending, processing, completed, failed
  generatedAt       DateTime @default(now())

  // Basic metrics (FREE tier)
  categoryScores    Json?    // { "Storage": 85, "Compute": 70 }
  timeEfficiency    String?  // "fast", "average", "slow"
  difficultyTrend   String?  // "improving", "stable", "declining"

  // Premium metrics
  strengths         Json?    // ["Strong in S3 buckets", "Great with Lambda"]
  weaknesses        Json?    // ["VPC concepts need work"]
  recommendations   Json?    // ["Practice VPC labs", "Review security groups"]
  topicMastery      Json?    // { "S3": 90, "EC2": 75, "VPC": 45 }
  insights          String?  // AI-generated paragraph

  // Metadata
  quizScore         Float?
  processingTimeMs  Int?
  error             String?

  quizAttempt       QuizAttempt @relation(fields: [quizAttemptId], references: [id], onDelete: Cascade)
  user              User        @relation(fields: [userId], references: [userId], onDelete: Cascade)

  @@index([userId, generatedAt])
  @@index([status])
}

// Aggregated dashboard analysis (compiled from QuizAnalysis)
model DashboardAnalysis {
  id                     String   @id @default(uuid())
  userId                 String   @unique
  lastUpdatedAt          DateTime @default(now())
  status                 String   @default("pending")

  // Free tier metrics (computed from quiz analyses)
  overallScore           Float?
  totalQuizzesTaken      Int?
  averageTimePerQuiz     Int?     // seconds
  categoryBreakdown      Json?    // Average scores per category
  recentTrend            String?  // "improving", "stable", "declining"

  // Premium tier metrics
  certificationReadiness Float?
  topStrengths           Json?    // Top 5 strengths across all quizzes
  topWeaknesses          Json?    // Top 5 weaknesses
  trendingUp             Json?    // Categories showing improvement
  trendingDown           Json?    // Categories declining
  studyPlan              Json?    // AI-generated personalized plan
  estimatedReadyDate     DateTime?
  percentileRank         Float?   // Compared to other users

  // Metadata
  lastQuizAnalyzed       String?  // quizAttemptId
  nextUpdateAt           DateTime?

  user                   User @relation(fields: [userId], references: [userId], onDelete: Cascade)

  @@index([lastUpdatedAt])
}

// Track individual topic mastery over time
model TopicMastery {
  id                String   @id @default(uuid())
  userId            String
  topic             String   // "S3", "EC2", "VPC", etc.
  masteryScore      Float    // 0-100
  questionsAnswered Int
  lastPracticed     DateTime @default(now())
  trend             String   // "improving", "stable", "declining"

  user              User @relation(fields: [userId], references: [userId], onDelete: Cascade)

  @@unique([userId, topic])
  @@index([userId, masteryScore])
}

// User subscription/premium status (if not already exists)
model UserSubscription {
  id                String   @id @default(uuid())
  userId            String   @unique
  tier              String   @default("free") // "free", "premium", "pro"
  features          Json?    // Enabled features
  validUntil        DateTime?

  user              User @relation(fields: [userId], references: [userId], onDelete: Cascade)
}
```

---

## Inngest Functions Architecture

### Function 1: Quiz Analysis Orchestrator
**Trigger**: `quiz/completed` event
**Purpose**: Coordinate all analysis tasks
**Execution**: Async, non-blocking

```typescript
// inngest/functions/analyze-quiz-orchestrator.ts
export const analyzeQuizOrchestrator = inngest.createFunction(
  {
    id: "analyze-quiz-orchestrator",
    retries: 2,
  },
  { event: "quiz/completed" },
  async ({ event, step }) => {
    const { userId, quizAttemptId } = event.data;

    // Step 1: Create QuizAnalysis record
    const analysis = await step.run("create-analysis-record", async () => {
      return await prisma.quizAnalysis.create({
        data: {
          userId,
          quizAttemptId,
          status: "processing",
        },
      });
    });

    // Step 2: Fetch quiz data (cached)
    const quizData = await step.run("fetch-quiz-data", async () => {
      return await getQuizAttemptData(quizAttemptId);
    });

    // Step 3: Check user subscription tier
    const userTier = await step.run("check-user-tier", async () => {
      return await getUserSubscriptionTier(userId);
    });

    // Step 4: Trigger parallel analysis tasks
    await Promise.all([
      // FREE tier analyses
      step.sendEvent("analyze-category-scores", {
        name: "quiz/analyze-category-scores",
        data: { analysisId: analysis.id, quizData, tier: userTier },
      }),

      step.sendEvent("analyze-time-efficiency", {
        name: "quiz/analyze-time-efficiency",
        data: { analysisId: analysis.id, quizData, tier: userTier },
      }),

      // PREMIUM tier analyses (only if premium)
      ...(userTier !== "free" ? [
        step.sendEvent("analyze-strengths-weaknesses", {
          name: "quiz/analyze-strengths-weaknesses",
          data: { analysisId: analysis.id, quizData, tier: userTier },
        }),

        step.sendEvent("analyze-recommendations", {
          name: "quiz/analyze-recommendations",
          data: { analysisId: analysis.id, quizData, tier: userTier },
        }),

        step.sendEvent("analyze-topic-mastery", {
          name: "quiz/analyze-topic-mastery",
          data: { analysisId: analysis.id, quizData, tier: userTier },
        }),
      ] : []),
    ]);

    // Step 5: Wait for all analyses to complete
    await step.waitForEvent("quiz/analysis-completed", {
      match: "data.analysisId",
      timeout: "2m",
    });

    // Step 6: Mark as completed
    await step.run("mark-completed", async () => {
      return await prisma.quizAnalysis.update({
        where: { id: analysis.id },
        data: { status: "completed" },
      });
    });

    // Step 7: Trigger dashboard update
    await step.sendEvent("trigger-dashboard-update", {
      name: "dashboard/update-requested",
      data: { userId },
    });

    return { success: true, analysisId: analysis.id };
  }
);
```

### Function 2: Category Scores Analysis (FREE)
**Trigger**: `quiz/analyze-category-scores` event
**AI Required**: No (code-based calculation)

```typescript
// inngest/functions/analyze-category-scores.ts
export const analyzeCategoryScores = inngest.createFunction(
  {
    id: "analyze-category-scores",
    retries: 1,
  },
  { event: "quiz/analyze-category-scores" },
  async ({ event, step }) => {
    const { analysisId, quizData } = event.data;

    // Calculate category scores (no AI needed)
    const categoryScores = await step.run("calculate-scores", async () => {
      const scores: Record<string, { correct: number; total: number; percentage: number }> = {};

      quizData.questions.forEach((q) => {
        const category = q.question.category.name;
        if (!scores[category]) {
          scores[category] = { correct: 0, total: 0, percentage: 0 };
        }
        scores[category].total++;
        if (q.isCorrect) scores[category].correct++;
      });

      // Calculate percentages
      Object.keys(scores).forEach((category) => {
        scores[category].percentage = Math.round(
          (scores[category].correct / scores[category].total) * 100
        );
      });

      return scores;
    });

    // Save to database
    await step.run("save-category-scores", async () => {
      return await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: { categoryScores },
      });
    });

    // Send completion event
    await step.sendEvent("category-scores-complete", {
      name: "quiz/analysis-module-completed",
      data: { analysisId, module: "category-scores" },
    });

    return { success: true };
  }
);
```

### Function 3: Time Efficiency Analysis (FREE)
**Trigger**: `quiz/analyze-time-efficiency` event
**AI Required**: No

```typescript
// inngest/functions/analyze-time-efficiency.ts
export const analyzeTimeEfficiency = inngest.createFunction(
  {
    id: "analyze-time-efficiency",
    retries: 1,
  },
  { event: "quiz/analyze-time-efficiency" },
  async ({ event, step }) => {
    const { analysisId, quizData } = event.data;

    const efficiency = await step.run("calculate-efficiency", async () => {
      const avgTimePerQuestion = quizData.timeSpentSecs / quizData.questions.length;

      // Benchmark: 60-90 seconds per question is average
      let rating: string;
      if (avgTimePerQuestion < 60) rating = "fast";
      else if (avgTimePerQuestion <= 90) rating = "average";
      else rating = "slow";

      return {
        rating,
        avgTimePerQuestion: Math.round(avgTimePerQuestion),
        totalTime: quizData.timeSpentSecs,
      };
    });

    await step.run("save-time-efficiency", async () => {
      return await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: {
          timeEfficiency: efficiency.rating,
          quizScore: quizData.percentageScore,
        },
      });
    });

    await step.sendEvent("time-efficiency-complete", {
      name: "quiz/analysis-module-completed",
      data: { analysisId, module: "time-efficiency" },
    });

    return { success: true };
  }
);
```

### Function 4: Strengths & Weaknesses Analysis (PREMIUM)
**Trigger**: `quiz/analyze-strengths-weaknesses` event
**AI Required**: Yes (1 Gemini call)

```typescript
// inngest/functions/analyze-strengths-weaknesses.ts
export const analyzeStrengthsWeaknesses = inngest.createFunction(
  {
    id: "analyze-strengths-weaknesses",
    retries: 3,
    rateLimit: {
      limit: 10,
      period: "1m",
    },
  },
  { event: "quiz/analyze-strengths-weaknesses" },
  async ({ event, step }) => {
    const { analysisId, quizData, tier } = event.data;

    // Premium only
    if (tier === "free") {
      return { skipped: true, reason: "premium-only" };
    }

    const analysis = await step.run("ai-analyze-strengths-weaknesses", async () => {
      const prompt = `
You are an AWS certification coach analyzing a single quiz attempt.

Quiz: ${quizData.quiz.name}
Score: ${quizData.percentageScore}%
Questions: ${quizData.questions.length}

Question Details:
${quizData.questions.map((q, i) => `
${i + 1}. ${q.question.text}
   Category: ${q.question.category.name}
   Difficulty: ${q.question.difficultyLevel}
   User Answer: ${q.userAnswer} ${q.isCorrect ? '✓' : '✗'}
   ${!q.isCorrect ? `Correct Answer: ${q.question.correctAnswer}` : ''}
   Explanation: ${q.question.explanation || 'N/A'}
`).join('\n')}

Analyze THIS quiz only and provide:
1. Top 3 specific strengths (what they did well)
2. Top 3 specific weaknesses (what needs improvement)
3. One key insight (1-2 sentences)

Return VALID JSON:
{
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "weaknesses": ["Specific weakness 1", "Specific weakness 2", "Specific weakness 3"],
  "insight": "One key takeaway about their performance"
}

Be specific and actionable. Focus on AWS concepts, not generic advice.
`;

      return await callGeminiAI(prompt, {});
    });

    await step.run("save-strengths-weaknesses", async () => {
      return await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: {
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          insights: analysis.insight,
        },
      });
    });

    await step.sendEvent("strengths-weaknesses-complete", {
      name: "quiz/analysis-module-completed",
      data: { analysisId, module: "strengths-weaknesses" },
    });

    return { success: true };
  }
);
```

### Function 5: Recommendations Generator (PREMIUM)
**Trigger**: `quiz/analyze-recommendations` event
**AI Required**: Yes (1 Gemini call)

```typescript
// inngest/functions/analyze-recommendations.ts
export const analyzeRecommendations = inngest.createFunction(
  {
    id: "analyze-recommendations",
    retries: 3,
    rateLimit: {
      limit: 10,
      period: "1m",
    },
  },
  { event: "quiz/analyze-recommendations" },
  async ({ event, step }) => {
    const { analysisId, quizData, tier } = event.data;

    if (tier === "free") {
      return { skipped: true, reason: "premium-only" };
    }

    // Get weaknesses from analysis (if already computed)
    const currentAnalysis = await step.run("get-current-analysis", async () => {
      return await prisma.quizAnalysis.findUnique({
        where: { id: analysisId },
      });
    });

    const recommendations = await step.run("ai-generate-recommendations", async () => {
      const prompt = `
You are an AWS certification coach providing actionable study recommendations.

Quiz Performance:
- Score: ${quizData.percentageScore}%
- Weaknesses: ${JSON.stringify(currentAnalysis?.weaknesses || [])}

Missed Questions:
${quizData.questions
  .filter(q => !q.isCorrect)
  .map(q => `
- ${q.question.text}
  Category: ${q.question.category.name}
  Correct: ${q.question.correctAnswer}
  Explanation: ${q.question.explanation || 'N/A'}
`).join('\n')}

Provide 3-5 specific, actionable recommendations to improve.

Return VALID JSON:
{
  "recommendations": [
    {
      "title": "Short recommendation title",
      "description": "Detailed action to take",
      "priority": "high|medium|low",
      "estimatedTime": "30 minutes|2 hours|etc",
      "resources": ["Resource 1", "Resource 2"]
    }
  ]
}

Focus on practical next steps, not generic advice.
`;

      return await callGeminiAI(prompt, {});
    });

    await step.run("save-recommendations", async () => {
      return await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: {
          recommendations: recommendations.recommendations,
        },
      });
    });

    await step.sendEvent("recommendations-complete", {
      name: "quiz/analysis-module-completed",
      data: { analysisId, module: "recommendations" },
    });

    return { success: true };
  }
);
```

### Function 6: Topic Mastery Tracker (PREMIUM)
**Trigger**: `quiz/analyze-topic-mastery` event
**AI Required**: No (code-based)

```typescript
// inngest/functions/analyze-topic-mastery.ts
export const analyzeTopicMastery = inngest.createFunction(
  {
    id: "analyze-topic-mastery",
    retries: 1,
  },
  { event: "quiz/analyze-topic-mastery" },
  async ({ event, step }) => {
    const { analysisId, quizData, tier } = event.data;

    if (tier === "free") {
      return { skipped: true, reason: "premium-only" };
    }

    const topicScores = await step.run("calculate-topic-mastery", async () => {
      // Group questions by AWS service/topic
      const topics: Record<string, { correct: number; total: number }> = {};

      quizData.questions.forEach((q) => {
        const topic = q.question.awsService || q.question.category.name;
        if (!topics[topic]) {
          topics[topic] = { correct: 0, total: 0 };
        }
        topics[topic].total++;
        if (q.isCorrect) topics[topic].correct++;
      });

      return Object.entries(topics).map(([topic, stats]) => ({
        topic,
        score: Math.round((stats.correct / stats.total) * 100),
        questionsAnswered: stats.total,
      }));
    });

    // Update TopicMastery table
    await step.run("update-topic-mastery", async () => {
      await Promise.all(
        topicScores.map(async ({ topic, score, questionsAnswered }) => {
          // Get previous mastery
          const existing = await prisma.topicMastery.findUnique({
            where: {
              userId_topic: {
                userId: quizData.userId,
                topic,
              },
            },
          });

          const trend = existing
            ? score > existing.masteryScore
              ? "improving"
              : score < existing.masteryScore
              ? "declining"
              : "stable"
            : "new";

          return await prisma.topicMastery.upsert({
            where: {
              userId_topic: {
                userId: quizData.userId,
                topic,
              },
            },
            update: {
              masteryScore: score,
              questionsAnswered: {
                increment: questionsAnswered,
              },
              lastPracticed: new Date(),
              trend,
            },
            create: {
              userId: quizData.userId,
              topic,
              masteryScore: score,
              questionsAnswered,
              trend: "new",
            },
          });
        })
      );
    });

    await step.run("save-topic-mastery-to-analysis", async () => {
      const masteryData = topicScores.reduce((acc, { topic, score }) => {
        acc[topic] = score;
        return acc;
      }, {} as Record<string, number>);

      return await prisma.quizAnalysis.update({
        where: { id: analysisId },
        data: { topicMastery: masteryData },
      });
    });

    await step.sendEvent("topic-mastery-complete", {
      name: "quiz/analysis-module-completed",
      data: { analysisId, module: "topic-mastery" },
    });

    return { success: true };
  }
);
```

### Function 7: Dashboard Aggregation
**Trigger**: `dashboard/update-requested` event
**Debounce**: 5 minutes (don't update too frequently)

```typescript
// inngest/functions/update-dashboard-analysis.ts
export const updateDashboardAnalysis = inngest.createFunction(
  {
    id: "update-dashboard-analysis",
    debounce: {
      key: "event.data.userId",
      period: "5m",
    },
    retries: 2,
  },
  { event: "dashboard/update-requested" },
  async ({ event, step }) => {
    const { userId } = event.data;

    // Get user tier
    const userTier = await step.run("check-user-tier", async () => {
      return await getUserSubscriptionTier(userId);
    });

    // Fetch all quiz analyses (last 30 days)
    const quizAnalyses = await step.run("fetch-quiz-analyses", async () => {
      return await prisma.quizAnalysis.findMany({
        where: {
          userId,
          status: "completed",
          generatedAt: { gte: subDays(new Date(), 30) },
        },
        orderBy: { generatedAt: "desc" },
        include: { quizAttempt: true },
      });
    });

    if (quizAnalyses.length === 0) {
      return { skipped: true, reason: "no-quiz-data" };
    }

    // FREE tier aggregation (code-based, no AI)
    const freeMetrics = await step.run("aggregate-free-metrics", async () => {
      return aggregateFreeMetrics(quizAnalyses);
    });

    // PREMIUM tier aggregation
    let premiumMetrics = {};
    if (userTier !== "free") {
      premiumMetrics = await step.run("aggregate-premium-metrics", async () => {
        return aggregatePremiumMetrics(quizAnalyses, userTier);
      });

      // Generate AI study plan (1 AI call)
      const studyPlan = await step.run("generate-study-plan", async () => {
        return await generateStudyPlan(userId, quizAnalyses, premiumMetrics);
      });

      premiumMetrics = { ...premiumMetrics, studyPlan };
    }

    // Save to dashboard
    await step.run("save-dashboard-analysis", async () => {
      return await prisma.dashboardAnalysis.upsert({
        where: { userId },
        update: {
          lastUpdatedAt: new Date(),
          ...freeMetrics,
          ...premiumMetrics,
          lastQuizAnalyzed: quizAnalyses[0].quizAttemptId,
        },
        create: {
          userId,
          ...freeMetrics,
          ...premiumMetrics,
          lastQuizAnalyzed: quizAnalyses[0].quizAttemptId,
        },
      });
    });

    return { success: true, userId };
  }
);
```

---

## Additional Cool Metrics

### 1. Percentile Ranking (PREMIUM)
Compare user to others taking same certification path:

```typescript
async function calculatePercentileRank(userId: string, userScore: number) {
  const allScores = await prisma.dashboardAnalysis.findMany({
    where: {
      overallScore: { not: null },
    },
    select: { overallScore: true },
  });

  const sortedScores = allScores
    .map(a => a.overallScore!)
    .sort((a, b) => a - b);

  const rank = sortedScores.filter(score => score <= userScore).length;
  const percentile = (rank / sortedScores.length) * 100;

  return Math.round(percentile);
}
```

### 2. Learning Velocity (PREMIUM)
How fast is the user improving?

```typescript
function calculateLearningVelocity(analyses: QuizAnalysis[]) {
  if (analyses.length < 2) return "insufficient-data";

  const scores = analyses
    .filter(a => a.quizScore)
    .map(a => a.quizScore!);

  // Linear regression
  const slope = calculateSlope(scores);

  if (slope > 2) return "accelerating";
  if (slope > 0) return "improving";
  if (slope === 0) return "stable";
  return "declining";
}
```

### 3. Consistency Score (FREE)
How consistent are their scores?

```typescript
function calculateConsistency(analyses: QuizAnalysis[]) {
  const scores = analyses.map(a => a.quizScore!);
  const stdDev = standardDeviation(scores);

  if (stdDev < 5) return { rating: "very-consistent", score: 95 };
  if (stdDev < 10) return { rating: "consistent", score: 80 };
  if (stdDev < 15) return { rating: "somewhat-consistent", score: 60 };
  return { rating: "inconsistent", score: 40 };
}
```

### 4. Weak Spot Alerts (PREMIUM)
Identify topics that repeatedly cause issues:

```typescript
async function identifyWeakSpots(userId: string) {
  const topicMasteries = await prisma.topicMastery.findMany({
    where: {
      userId,
      masteryScore: { lt: 60 }, // Below 60%
    },
    orderBy: { masteryScore: "asc" },
    take: 5,
  });

  return topicMasteries.map(t => ({
    topic: t.topic,
    score: t.masteryScore,
    practiceCount: t.questionsAnswered,
    urgency: t.masteryScore < 40 ? "high" : "medium",
  }));
}
```

### 5. Predicted Certification Date (PREMIUM)
When will they be ready?

```typescript
async function predictCertificationReadiness(userId: string, analyses: QuizAnalysis[]) {
  const recentScores = analyses.slice(0, 10).map(a => a.quizScore!);
  const avgScore = mean(recentScores);
  const trend = calculateTrend(recentScores);

  // Need 80% average to be "ready"
  const targetScore = 80;
  const currentScore = avgScore;

  if (currentScore >= targetScore) {
    return {
      ready: true,
      readinessScore: 100,
      estimatedDate: new Date(),
    };
  }

  // Estimate based on learning velocity
  const velocity = calculateSlope(recentScores); // points per quiz
  const pointsNeeded = targetScore - currentScore;
  const quizzesNeeded = Math.ceil(pointsNeeded / velocity);

  // Assume 3 quizzes per week
  const weeksNeeded = Math.ceil(quizzesNeeded / 3);
  const estimatedDate = addWeeks(new Date(), weeksNeeded);

  return {
    ready: false,
    readinessScore: Math.round((currentScore / targetScore) * 100),
    estimatedDate,
    quizzesNeeded,
  };
}
```

### 6. Study Streak Bonus (Gamification - FREE)
Encourage daily practice:

```typescript
async function calculateStudyStreak(userId: string) {
  const analyses = await prisma.quizAnalysis.findMany({
    where: { userId, status: "completed" },
    orderBy: { generatedAt: "desc" },
    select: { generatedAt: true },
  });

  let streak = 0;
  let currentDate = new Date();

  for (const analysis of analyses) {
    const diff = differenceInDays(currentDate, analysis.generatedAt);
    if (diff > 1) break;
    streak++;
    currentDate = analysis.generatedAt;
  }

  return {
    currentStreak: streak,
    longestStreak: await getLongestStreak(userId),
    bonusXP: streak * 10, // 10 XP per day
  };
}
```

---

## Freemium Feature Matrix

| Feature | Free | Premium |
|---------|------|---------|
| Quiz completion | ✅ | ✅ |
| Basic score & time | ✅ | ✅ |
| Category breakdown | ✅ | ✅ |
| Time efficiency rating | ✅ | ✅ |
| Consistency score | ✅ | ✅ |
| Study streak | ✅ | ✅ |
| **AI-powered strengths/weaknesses** | ❌ | ✅ |
| **Personalized recommendations** | ❌ | ✅ |
| **Topic mastery tracking** | ❌ | ✅ |
| **Certification readiness** | ❌ | ✅ |
| **Trending topics** | ❌ | ✅ |
| **AI study plan** | ❌ | ✅ |
| **Percentile ranking** | ❌ | ✅ |
| **Learning velocity** | ❌ | ✅ |
| **Weak spot alerts** | ❌ | ✅ |
| **Predicted ready date** | ❌ | ✅ |

---

## File Structure

```
src/
├── inngest/
│   ├── client.ts                      # Inngest client setup
│   ├── functions/
│   │   ├── analyze-quiz-orchestrator.ts
│   │   ├── analyze-category-scores.ts
│   │   ├── analyze-time-efficiency.ts
│   │   ├── analyze-strengths-weaknesses.ts
│   │   ├── analyze-recommendations.ts
│   │   ├── analyze-topic-mastery.ts
│   │   └── update-dashboard-analysis.ts
│   └── helpers/
│       ├── aggregation.ts             # Dashboard aggregation logic
│       ├── calculations.ts            # Math utilities
│       └── ai-prompts.ts              # Gemini prompts
├── lib/
│   ├── ai/
│   │   ├── call-gemini.ts             # Gemini API wrapper
│   │   └── prompt-templates.ts
│   └── subscription/
│       └── get-user-tier.ts           # Check user subscription
├── server/
│   ├── routers/
│   │   └── analysis.ts                # tRPC router for analysis
│   └── actions/
│       ├── get-quiz-analysis.ts
│       └── get-dashboard-analysis.ts
└── app/
    └── api/
        └── inngest/
            └── route.ts                # Inngest webhook endpoint
```

---

## Testing Strategy

### Unit Tests
- Individual Inngest functions
- Aggregation logic
- Math calculations
- Freemium logic

### Integration Tests
- Full quiz completion → analysis flow
- Dashboard update flow
- Premium vs free tier differences

### Performance Tests
- Load test with 100 concurrent quiz completions
- Verify Inngest handles rate limiting
- Check database query performance

---

## Monitoring & Alerts

### Metrics to Track
1. Analysis completion rate (should be > 99%)
2. Average processing time per analysis
3. AI API costs (daily/monthly)
4. Failed jobs (retry count)
5. Dashboard aggregation time

### Alerts
- Alert if completion rate < 95%
- Alert if processing time > 30s
- Alert if daily AI costs > $20
- Alert if failed jobs > 5%

---

## Cost Estimation

### AI Calls per User per Month
- Free tier: 0 AI calls
- Premium tier:
  - Per quiz: 2 AI calls (strengths/weaknesses + recommendations)
  - Dashboard: 1 AI call (study plan)
  - Average 3 quizzes/week = 12 quizzes/month
  - Total: 24 + 4 = **28 AI calls/month per user**

### Cost Calculation (Premium Users)
- 1,000 premium users × 28 calls = 28,000 calls/month
- Avg 2,000 input tokens, 800 output tokens per call
- Input: 28,000 × 2,000 × $0.075/1M = $4.20
- Output: 28,000 × 800 × $0.30/1M = $6.72
- **Total: ~$11/month for 1,000 premium users**

### With 10K Premium Users
- 280,000 calls/month
- **Total: ~$110/month**

**Much cheaper than current $200-400/month for 1K users!**

---

## Next Steps

1. ✅ Create this implementation plan
2. ⏳ Install Inngest
3. ⏳ Create database schema & migration
4. ⏳ Implement Inngest functions
5. ⏳ Create aggregation logic
6. ⏳ Add tRPC endpoints
7. ⏳ Test end-to-end
8. ⏳ Deploy to production
