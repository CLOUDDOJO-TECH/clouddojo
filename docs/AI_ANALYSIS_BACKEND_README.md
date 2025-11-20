# AI Analysis Backend - Implementation Guide

> **Status**: ✅ Phase 1 Complete (Backend Infrastructure)
> **Last Updated**: 2025-11-19

---

## Overview

The AI Analysis system provides intelligent, per-quiz analysis with a freemium model. It uses background job processing (Inngest) to analyze quiz performance without blocking the user.

### Key Features

- ✅ **Per-quiz analysis** (not bulk batching)
- ✅ **Freemium model** (free tier + premium upsell)
- ✅ **Background processing** (non-blocking)
- ✅ **85% cost reduction** (2 AI calls vs 11)
- ✅ **Real-time insights** (30-60s analysis time)
- ✅ **Normalized database** (queryable metrics)

---

## Architecture

### Flow Diagram

```
Quiz Completed
    ↓
triggerQuizAnalysis() (Server Action)
    ↓
Inngest Event: "quiz/completed"
    ↓
analyzeQuizOrchestrator (Main Coordinator)
    ↓
    ├── analyzeCategoryScores (FREE, no AI)
    ├── analyzeTimeEfficiency (FREE, no AI)
    ├── analyzeStrengthsWeaknesses (PREMIUM, 1 AI call)
    ├── analyzeRecommendations (PREMIUM, 1 AI call)
    └── analyzeTopicMastery (PREMIUM, no AI)
    ↓
All analyses complete
    ↓
updateDashboardAnalysis (Aggregates all data)
    ↓
Dashboard ready!
```

---

## Database Schema

### QuizAnalysis

Per-quiz analysis storage.

```prisma
model QuizAnalysis {
  id                String   @id @default(uuid())
  quizAttemptId     String   @unique
  userId            String
  status            String   @default("pending")
  generatedAt       DateTime @default(now())

  // FREE tier metrics
  categoryScores    Json?    // { "Storage": 85, "Compute": 70 }
  timeEfficiency    String?  // "fast", "average", "slow"

  // PREMIUM tier metrics
  strengths         Json?    // AI-generated strengths
  weaknesses        Json?    // AI-generated weaknesses
  recommendations   Json?    // AI-generated recommendations
  topicMastery      Json?    // { "S3": 90, "EC2": 75 }
  insights          String?  // AI summary paragraph

  // Metadata
  quizScore         Float?
  processingTimeMs  Int?
  error             String?
}
```

### DashboardAnalysis

Aggregated dashboard metrics.

```prisma
model DashboardAnalysis {
  id                     String   @id @default(uuid())
  userId                 String   @unique
  lastUpdatedAt          DateTime @default(now())
  status                 String   @default("pending")

  // FREE tier metrics (computed from quiz analyses)
  overallScore           Float?
  totalQuizzesTaken      Int?
  averageTimePerQuiz     Int?
  categoryBreakdown      Json?
  recentTrend            String?
  consistencyScore       Int?

  // PREMIUM tier metrics
  certificationReadiness Float?
  topStrengths           Json?
  topWeaknesses          Json?
  trendingUp             Json?
  trendingDown           Json?
  studyPlan              Json?    // AI-generated study plan
  estimatedReadyDate     DateTime?
  percentileRank         Float?
  learningVelocity       String?
}
```

### TopicMastery

Individual topic tracking over time.

```prisma
model TopicMastery {
  id                String   @id @default(uuid())
  userId            String
  topic             String   // "S3", "EC2", "VPC"
  masteryScore      Float    // 0-100
  questionsAnswered Int
  lastPracticed     DateTime @default(now())
  trend             String   // "improving", "stable", "declining", "new"

  @@unique([userId, topic])
}
```

---

## Inngest Functions

### 1. analyzeQuizOrchestrator

**Purpose**: Main coordinator that triggers all analysis tasks
**Trigger**: `quiz/completed` event
**Execution Time**: ~30-60 seconds
**Retries**: 2

**Flow**:
1. Create QuizAnalysis record (status: "processing")
2. Fetch quiz data
3. Check user subscription tier
4. Trigger FREE tier analyses (parallel)
5. Trigger PREMIUM tier analyses if applicable (parallel)
6. Wait for completion (30s timeout)
7. Mark as completed
8. Trigger dashboard update

### 2. analyzeCategoryScores (FREE)

**Purpose**: Calculate category-level performance
**AI Required**: ❌ No (code-based)
**Execution Time**: < 1 second

**Output Example**:
```json
{
  "Storage": { "correct": 8, "total": 10, "percentage": 80 },
  "Compute": { "correct": 7, "total": 10, "percentage": 70 },
  "Networking": { "correct": 5, "total": 10, "percentage": 50 }
}
```

### 3. analyzeTimeEfficiency (FREE)

**Purpose**: Rate quiz completion speed
**AI Required**: ❌ No (code-based)
**Benchmark**: 60-90s per question

**Output**: "fast" | "average" | "slow"

### 4. analyzeStrengthsWeaknesses (PREMIUM)

**Purpose**: AI-powered strengths/weaknesses identification
**AI Required**: ✅ Yes (1 Gemini call)
**Execution Time**: ~10-15 seconds
**Rate Limit**: 10 per minute

**Output Example**:
```json
{
  "strengths": [
    "Strong understanding of S3 bucket policies",
    "Excellent knowledge of Lambda function triggers",
    "Good grasp of VPC fundamentals"
  ],
  "weaknesses": [
    "Struggling with IAM role trust policies",
    "Need to review CloudFormation syntax",
    "Confusion about ECS vs EKS use cases"
  ],
  "insight": "You have a solid foundation in AWS fundamentals but need to focus on IAM and container services."
}
```

### 5. analyzeRecommendations (PREMIUM)

**Purpose**: Generate actionable study recommendations
**AI Required**: ✅ Yes (1 Gemini call)
**Execution Time**: ~10-15 seconds

**Output Example**:
```json
{
  "recommendations": [
    {
      "title": "Deep dive into IAM policies",
      "description": "Review the IAM policy evaluation logic...",
      "priority": "high",
      "estimatedTime": "2 hours",
      "resources": ["AWS IAM Documentation", "IAM Policy Simulator"]
    }
  ]
}
```

### 6. analyzeTopicMastery (PREMIUM)

**Purpose**: Track mastery score per AWS service/topic
**AI Required**: ❌ No (code-based)
**Database**: Updates `TopicMastery` table

**Output**: Updates mastery scores with trends

### 7. updateDashboardAnalysis

**Purpose**: Aggregate all quiz analyses into dashboard metrics
**Trigger**: `dashboard/update-requested` event
**Debounce**: 5 minutes (won't update more than once per 5min)
**AI Required**: ✅ Yes (1 call for study plan only)

**Process**:
1. Fetch all quiz analyses (last 30 days)
2. Aggregate FREE metrics (code-based)
3. Aggregate PREMIUM metrics (code-based)
4. Generate AI study plan (PREMIUM only, 1 AI call)
5. Calculate percentile rank
6. Save to DashboardAnalysis table

---

## tRPC Endpoints

### Get Quiz Analysis

```typescript
const analysis = await trpc.analysis.getQuizAnalysis.useQuery({
  quizAttemptId: "quiz-123",
});

// Response (FREE user)
{
  found: true,
  status: "completed",
  categoryScores: { ... },
  timeEfficiency: "average",
  quizScore: 75,
  strengths: null, // Hidden for free users
  weaknesses: null,
  isPremium: false
}

// Response (PREMIUM user)
{
  ...
  strengths: ["..."],
  weaknesses: ["..."],
  recommendations: [...],
  isPremium: true
}
```

### Get Dashboard Analysis

```typescript
const dashboard = await trpc.analysis.getDashboardAnalysis.useQuery();

// Response (FREE user)
{
  overallScore: 78,
  totalQuizzesTaken: 12,
  categoryBreakdown: { ... },
  recentTrend: "improving",
  consistencyScore: 85,
  certificationReadiness: null, // Hidden
  studyPlan: null, // Hidden
  isPremium: false
}

// Response (PREMIUM user)
{
  ...
  certificationReadiness: 82,
  studyPlan: { ... },
  estimatedReadyDate: "2025-12-15",
  percentileRank: 78,
  isPremium: true
}
```

### Get Topic Mastery (PREMIUM only)

```typescript
const topics = await trpc.analysis.getTopicMastery.useQuery();

// Response
{
  topics: [
    { topic: "S3", masteryScore: 90, trend: "improving" },
    { topic: "EC2", masteryScore: 75, trend: "stable" },
    { topic: "VPC", masteryScore: 45, trend: "declining" }
  ],
  weakSpots: [...], // Topics < 60%
  strengths: [...]  // Topics >= 80%
}
```

### Check Analysis Status

```typescript
const status = await trpc.analysis.checkAnalysisStatus.useQuery({
  quizAttemptId: "quiz-123",
});

// Response
{
  status: "processing",
  generatedAt: "2025-11-19T...",
  message: "Analysis is in progress"
}
```

### Get Recent Analyses

```typescript
const recent = await trpc.analysis.getRecentAnalyses.useQuery({
  limit: 10,
});

// Response
{
  analyses: [
    {
      id: "...",
      quizTitle: "AWS Solutions Architect Practice",
      quizScore: 85,
      categoryScores: { ... },
      strengths: ["..."], // Only if premium
    }
  ],
  isPremium: true
}
```

---

## Usage Guide

### 1. Trigger Analysis After Quiz Completion

```typescript
// In your quiz completion handler
import { triggerQuizAnalysis } from "@/app/(actions)/ai-analysis/trigger-quiz-analysis";

async function handleQuizComplete(quizAttemptId: string) {
  // Mark quiz as completed in DB
  await prisma.quizAttempt.update({
    where: { id: quizAttemptId },
    data: { completedAt: new Date() },
  });

  // Trigger background analysis
  const result = await triggerQuizAnalysis(quizAttemptId);

  if (result.success) {
    console.log("Analysis started:", result.message);
    // Show user: "Generating your analysis... (~1 minute)"
  }
}
```

### 2. Check Analysis Status

```typescript
import { trpc } from "@/lib/trpc/react";

function QuizResultsPage({ quizAttemptId }: Props) {
  const { data: status } = trpc.analysis.checkAnalysisStatus.useQuery(
    { quizAttemptId },
    {
      refetchInterval: (data) => {
        // Poll every 5s until completed
        return data?.status === "completed" ? false : 5000;
      },
    }
  );

  if (status?.status === "processing") {
    return <LoadingSpinner message="Generating your analysis..." />;
  }

  // Show analysis...
}
```

### 3. Display Analysis Results

```typescript
function QuizAnalysisView({ quizAttemptId }: Props) {
  const { data: analysis } = trpc.analysis.getQuizAnalysis.useQuery({
    quizAttemptId,
  });

  if (!analysis?.found) {
    return <NoAnalysisYet />;
  }

  return (
    <div>
      {/* FREE tier content */}
      <CategoryScores data={analysis.categoryScores} />
      <TimeEfficiency rating={analysis.timeEfficiency} />

      {/* PREMIUM tier content (gated) */}
      {analysis.isPremium ? (
        <>
          <Strengths items={analysis.strengths} />
          <Weaknesses items={analysis.weaknesses} />
          <Recommendations items={analysis.recommendations} />
        </>
      ) : (
        <UpgradePrompt />
      )}
    </div>
  );
}
```

### 4. Display Dashboard

```typescript
function DashboardPage() {
  const { data: dashboard } = trpc.analysis.getDashboardAnalysis.useQuery();

  return (
    <div>
      {/* FREE metrics */}
      <OverallScore score={dashboard.overallScore} />
      <CategoryBreakdown data={dashboard.categoryBreakdown} />
      <ConsistencyScore score={dashboard.consistencyScore} />

      {/* PREMIUM metrics */}
      {dashboard.isPremium ? (
        <>
          <CertificationReadiness score={dashboard.certificationReadiness} />
          <StudyPlan plan={dashboard.studyPlan} />
          <TrendingCategories up={dashboard.trendingUp} down={dashboard.trendingDown} />
        </>
      ) : (
        <PremiumUpsellCard />
      )}
    </div>
  );
}
```

---

## Cost Analysis

### Per-Quiz Analysis

**FREE tier**: 0 AI calls (all code-based)
**PREMIUM tier**: 2 AI calls

- Strengths/Weaknesses: 1 call (~2K input, ~800 output tokens)
- Recommendations: 1 call (~2K input, ~800 output tokens)

**Cost per analysis**: ~$0.01 (PREMIUM only)

### Dashboard Aggregation

**All users**: 1 AI call (study plan, PREMIUM only)

- Study Plan: 1 call (~1K input, ~500 output tokens)

**Cost per dashboard update**: ~$0.005 (PREMIUM only)

### Monthly Cost Estimate

**1,000 Premium Users**:
- 3 quizzes/week × 4 weeks = 12 quizzes/month
- 12 × 2 calls = 24 quiz analysis calls
- 4 dashboard updates/month × 1 call = 4 dashboard calls
- Total: 28 AI calls/user/month

**1,000 users × 28 calls = 28,000 calls/month**

**Gemini 2.0 Flash Lite Pricing**:
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

**Total Cost**: ~$30-60/month for 1,000 premium users

---

## Environment Variables

Add to `.env`:

```bash
# Gemini AI (already exists)
GEMINI_API_KEY=your_key_here

# Inngest (for local development)
INNGEST_EVENT_KEY=your_local_key
INNGEST_SIGNING_KEY=your_signing_key

# Database (already exists)
DATABASE_URL=your_db_url
DIRECT_DATABASE_URL=your_direct_url
```

---

## Testing

### Run Local Inngest Dev Server

```bash
npx inngest-cli@latest dev
```

This starts a local Inngest server at `http://localhost:8288`

### Trigger Test Analysis

```typescript
// In your code or API route
import { inngest } from "@/inngest/client";

await inngest.send({
  name: "quiz/completed",
  data: {
    userId: "user_xxx",
    quizAttemptId: "quiz_xxx",
  },
});
```

### Monitor Inngest Dashboard

Visit `http://localhost:8288` to see:
- Function executions
- Event logs
- Retry attempts
- Errors

---

## Deployment

### Vercel Deployment

Inngest works seamlessly with Vercel:

1. Deploy your app to Vercel
2. Add Inngest environment variables
3. Inngest will automatically discover your functions at `/api/inngest`

### Inngest Cloud Setup

1. Sign up at https://www.inngest.com
2. Create a new app
3. Copy your keys to environment variables
4. Functions will auto-sync on deploy

---

## Monitoring

### Key Metrics to Track

1. **Analysis Completion Rate**: Should be > 99%
2. **Average Processing Time**: Should be < 60s
3. **AI API Costs**: Track daily/monthly spend
4. **Failed Jobs**: Monitor retry count
5. **User Tier Distribution**: Free vs Premium split

### Alerts to Set Up

- Alert if completion rate < 95%
- Alert if avg processing time > 90s
- Alert if daily AI costs > $20
- Alert if failed jobs > 5%

---

## Migration Path

### From Old AI Analysis

To migrate from the old AIAnalysisReport model:

1. **Keep old model** for backward compatibility
2. **Trigger per-quiz analysis** for new quiz completions
3. **Gradually backfill** old data if needed
4. **Deprecate old system** after 30 days

---

## Next Steps (Frontend Integration)

1. **Post-Quiz Results Page**:
   - Show loading state during analysis
   - Display FREE metrics immediately
   - Show PREMIUM upsell for locked content

2. **Dashboard Page**:
   - Display aggregated metrics
   - Show trends and charts
   - Premium upsell for advanced features

3. **Topic Mastery View** (PREMIUM):
   - List all topics with mastery scores
   - Highlight weak spots
   - Show improvement trends

4. **Study Plan View** (PREMIUM):
   - Weekly schedule
   - Priority actions
   - Milestones

---

## Support

For questions or issues:
- Check Inngest logs: `http://localhost:8288` (local)
- Review Prisma logs for database issues
- Check Gemini API quotas/limits
- Monitor Vercel logs for production issues

---

**Built with**:
- ✅ Inngest (background jobs)
- ✅ tRPC (type-safe API)
- ✅ Prisma (database ORM)
- ✅ Gemini 2.0 Flash Lite (AI)
- ✅ PostgreSQL (data storage)
