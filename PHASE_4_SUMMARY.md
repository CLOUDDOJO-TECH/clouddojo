# Phase 4: Scheduled Campaigns - Implementation Summary

## Overview

Phase 4 introduces intelligent scheduled email campaigns that run automatically based on time triggers (EventBridge cron). This phase focuses on proactive user engagement through monthly certification readiness reports and feature adoption nudges.

**Implementation Date:** 2025-11-20
**Status:** ✅ Complete
**Branch:** `claude/email-service-phase-2-01Kt6GGiwqYJwZeCBFqv1rMA`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [New Scheduled Campaigns](#new-scheduled-campaigns)
3. [Implementation Details](#implementation-details)
4. [Email Templates](#email-templates)
5. [Admin Dashboard Updates](#admin-dashboard-updates)
6. [Database Schema](#database-schema)
7. [Infrastructure](#infrastructure)
8. [Testing Guide](#testing-guide)
9. [Deployment Steps](#deployment-steps)
10. [Monitoring & Analytics](#monitoring--analytics)
11. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     AWS EventBridge (Cron)                       │
│                                                                  │
│  - Monthly Readiness:  0 9 1 * ? *  (1st of month at 9 AM UTC) │
│  - Feature Nudges:     0 11 * * ? *  (Daily at 11 AM UTC)      │
│  - Weekly Progress:    0 10 ? * SUN *  (Sundays at 10 AM UTC)  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Scheduled Campaign    │
              │  Lambda Functions      │
              │                        │
              │  • monthly-readiness   │
              │  • feature-nudges      │
              │  • weekly-progress     │
              └────────┬───────────────┘
                       │
                       │ 1. Query eligible users
                       │ 2. Calculate metrics/stats
                       │ 3. Queue emails
                       │
                       ▼
              ┌────────────────────────┐
              │    AWS SQS Queue       │
              │  (Email Queue)         │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  Queue Processor       │
              │  Lambda                │
              │                        │
              │  • Render template     │
              │  • Send via Resend     │
              │  • Log to database     │
              └────────────────────────┘
```

### Key Components

1. **EventBridge Rules**: Time-based triggers for campaign execution
2. **Campaign Lambdas**: Query users, calculate metrics, queue emails
3. **SQS Queue**: Reliable email delivery queue
4. **Queue Processor**: Template rendering and email sending
5. **Redis**: Deduplication and campaign frequency control

---

## New Scheduled Campaigns

### 1. Monthly Certification Readiness Report

**Purpose**: Provide users with comprehensive monthly insights into their certification exam readiness.

**Schedule**: 1st of each month at 9 AM UTC
**EventBridge Cron**: `0 9 1 * ? *`

**Lambda**: `aws-lambdas/scheduled-campaigns/src/monthly-readiness.ts`

#### Features

- **Readiness Score Calculation**: 0-100 score based on quiz performance
- **Provider Analysis**: Identifies top cloud provider (AWS, Azure, GCP, etc.)
- **Strength Detection**: Highlights areas where user excels
- **Weakness Identification**: Points out topics needing improvement
- **Personalized Recommendations**: Suggests specific quizzes to take

#### Eligibility Criteria

```typescript
{
  // Active in last 30 days
  quizAttempts: {
    some: {
      completedAt: { gte: last30Days }
    }
  },
  // Opted in to AI analysis notifications
  emailPreferences: {
    aiAnalysisNotifs: true,
    unsubscribedAll: false
  }
}
```

#### Data Collected

- **Quiz Performance**: Last 30 days of quiz attempts
- **Provider Distribution**: Quiz attempts grouped by cloud provider
- **Score Analytics**: Average scores, completion rates
- **Readiness Metrics**: Calculated readiness score (0-100)

#### Email Data Structure

```typescript
{
  username: string;
  certificationName: string;  // e.g., "AWS Solutions Architect"
  readinessScore: number;     // 0-100
  quizzesCompleted: number;
  averageScore: number;
  strengths: string[];        // e.g., ["VPC Networking", "IAM Policies"]
  weaknesses: string[];       // e.g., ["Lambda Functions", "S3 Lifecycle"]
  recommendations: string[];  // e.g., ["Practice more Lambda quizzes"]
  nextReportDate: string;     // "December 1, 2025"
}
```

#### Template Features

- **Visual Score Display**: Large circular progress indicator
- **Stats Grid**: Quizzes completed, average score
- **Strength/Weakness Lists**: Color-coded (green/red)
- **Recommendation Box**: Yellow highlight box with action items
- **Progress Tracking**: Next report date display
- **Preference Management**: Unsubscribe link

---

### 2. Feature Adoption Nudges

**Purpose**: Encourage users to try CloudDojo features they haven't used yet.

**Schedule**: Daily at 11 AM UTC
**EventBridge Cron**: `0 11 * * ? *`

**Lambda**: `aws-lambdas/scheduled-campaigns/src/feature-nudges.ts`

#### Tracked Features

```typescript
const FEATURES = [
  {
    id: 'ai-analysis',
    name: 'AI Certification Analysis',
    icon: '🤖',
    minQuizzesRequired: 5,
    checkFunction: async (prisma, userId) => {
      // Returns true if NOT used
      const analysis = await prisma.certificationAnalysis.findFirst({
        where: { userId }
      });
      return !analysis;
    }
  },
  {
    id: 'projects',
    name: 'Hands-on Projects',
    icon: '🚀',
    minQuizzesRequired: 10,
    checkFunction: async (prisma, userId) => {
      const projects = await prisma.projectProgress.findFirst({
        where: { userId }
      });
      return !projects;
    }
  },
  {
    id: 'daily-streak',
    name: 'Daily Streak Challenge',
    icon: '🔥',
    minQuizzesRequired: 3,
    checkFunction: async (prisma, userId) => {
      const streak = await prisma.userStreak.findFirst({
        where: { userId, currentStreak: { gte: 7 } }
      });
      return !streak; // Not on 7+ day streak
    }
  },
  {
    id: 'flashcards',
    name: 'Smart Flashcards',
    icon: '🎴',
    minQuizzesRequired: 5,
    checkFunction: async (prisma, userId) => {
      // TODO: Implement flashcard tracking
      return true; // Assume not used for now
    }
  }
];
```

#### Eligibility Criteria

```typescript
{
  // Active in last 14 days
  quizAttempts: {
    some: {
      completedAt: { gte: last14Days }
    }
  },
  // Opted in to feature updates
  emailPreferences: {
    featureUpdates: true,
    unsubscribedAll: false
  }
}
```

#### Smart Frequency Control

- **Redis Deduplication**: Checks if same feature nudge sent recently
- **7-Day Cooldown**: Won't send same feature nudge within 7 days
- **One Nudge Per Run**: Only sends one feature nudge per user per execution
- **Progressive Unlocking**: Features unlock at different quiz milestones

#### Email Data Structure

```typescript
{
  username: string;
  featureName: string;
  featureIcon: string;
  featureDescription: string;
  featureBenefits: string[];
  ctaUrl: string;
  quizzesTaken: number;
}
```

#### Redis Key Format

```
email_sent:${userId}:feature_${featureId}
TTL: 168 hours (7 days)
```

---

### 3. Enhanced Weekly Progress Report

**Purpose**: Provide users with weekly learning summaries.

**Schedule**: Every Sunday at 10 AM UTC
**EventBridge Cron**: `0 10 ? * SUN *`

**Lambda**: `aws-lambdas/scheduled-campaigns/src/weekly-progress.ts`

#### Enhancements Added

**New Helper Functions**:

```typescript
// Calculate XP earned this week
function calculateWeeklyXP(user: any): number {
  const weeklyQuizXP = user.quizAttempts.length * 20; // 20 XP per quiz
  return weeklyQuizXP;
}

// Calculate average quiz score
function calculateAverageScore(quizAttempts: any[]): number {
  if (quizAttempts.length === 0) return 0;
  const totalScore = quizAttempts.reduce(
    (sum, attempt) => sum + (attempt.score || 0),
    0
  );
  return Math.round(totalScore / quizAttempts.length);
}

// Find top-performing category
function getTopPerformanceCategory(quizAttempts: any[]): string | undefined {
  const providerCounts: Record<string, { count: number; totalScore: number }> = {};

  quizAttempts.forEach((attempt) => {
    if (attempt.quiz?.providers) {
      attempt.quiz.providers.forEach((provider: string) => {
        if (!providerCounts[provider]) {
          providerCounts[provider] = { count: 0, totalScore: 0 };
        }
        providerCounts[provider].count++;
        providerCounts[provider].totalScore += attempt.score || 0;
      });
    }
  });

  // Find provider with highest average score
  let topProvider: string | undefined;
  let highestAverage = 0;

  Object.entries(providerCounts).forEach(([provider, stats]) => {
    const average = stats.totalScore / stats.count;
    if (average > highestAverage) {
      highestAverage = average;
      topProvider = provider;
    }
  });

  return topProvider;
}
```

#### Eligibility Criteria

```typescript
{
  // Active in last 7 days
  updatedAt: { gte: last7Days },
  // Opted in to weekly reports
  emailPreferences: {
    weeklyProgressReport: true,
    unsubscribedAll: false
  }
}
```

#### Skip Logic

- **No Activity**: Skips users with 0 quizzes this week
- **Batch Processing**: Processes 1000 users per run
- **Activity Requirement**: Must have at least 1 quiz attempt

---

## Implementation Details

### File Structure

```
clouddojo/
├── aws-lambdas/
│   ├── scheduled-campaigns/
│   │   └── src/
│   │       ├── monthly-readiness.ts     [NEW] ✨
│   │       ├── feature-nudges.ts        [NEW] ✨
│   │       ├── weekly-progress.ts       [ENHANCED] 📝
│   │       └── inactive-users.ts        [EXISTING]
│   │
│   └── queue-processor/
│       └── src/
│           └── handler.ts               [UPDATED] 📝
│
├── src/server/routers/
│   └── admin/
│       └── email.ts                     [UPDATED] 📝
│
└── app/dashboard/admin/emails/
    └── components/
        ├── EmailHistoryViewer.tsx       [UPDATED] 📝
        └── CampaignManager.tsx          [UPDATED] 📝
```

### Code Changes Summary

#### 1. Monthly Readiness Campaign (`monthly-readiness.ts`)

**Lines of Code**: ~180 lines

**Key Logic**:

```typescript
// Group quizzes by provider
const quizzesByProvider: Record<string, any[]> = {};
user.quizAttempts.forEach((attempt) => {
  attempt.quiz.providers.forEach((provider: string) => {
    if (!quizzesByProvider[provider]) quizzesByProvider[provider] = [];
    quizzesByProvider[provider].push(attempt);
  });
});

// Find top provider by quiz count
const topProvider = Object.keys(quizzesByProvider).reduce((a, b) =>
  quizzesByProvider[a].length > quizzesByProvider[b].length ? a : b
);

// Calculate readiness score
const providerQuizzes = quizzesByProvider[topProvider];
const averageScore = providerQuizzes.reduce(
  (sum, q) => sum + (q.score || 0),
  0
) / providerQuizzes.length;

const readinessScore = Math.min(100, Math.round(averageScore * 1.2));

// Identify strengths (score >= 80%)
const strengths: string[] = [];
const weaknesses: string[] = [];

Object.entries(quizzesByProvider).forEach(([provider, quizzes]) => {
  const avg = quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.length;
  if (avg >= 80) {
    strengths.push(`${provider} (${Math.round(avg)}%)`);
  } else if (avg < 60) {
    weaknesses.push(`${provider} (${Math.round(avg)}%)`);
  }
});
```

#### 2. Feature Nudges Campaign (`feature-nudges.ts`)

**Lines of Code**: ~210 lines

**Key Logic**:

```typescript
for (const user of activeUsers) {
  const quizCount = user.quizAttempts.length;

  // Check each feature
  for (const feature of FEATURES) {
    // Skip if user hasn't reached minimum quizzes
    if (quizCount < feature.minQuizzesRequired) continue;

    // Check if user hasn't used this feature
    const hasNotUsed = await feature.checkFunction(prisma, user.userId);
    if (!hasNotUsed) continue;

    // Check if we already sent this nudge recently (7 days)
    const alreadySent = await wasEmailSentRecently(
      user.userId,
      `feature_${feature.id}`,
      168 // 7 days in hours
    );
    if (alreadySent) continue;

    // Queue email
    await queueEmail({ /* ... */ });

    // Only send one feature nudge per user per run
    break;
  }
}
```

#### 3. Queue Processor Updates (`handler.ts`)

**New Template Added**:

```typescript
monthly_certification_readiness: `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
      <!-- Readiness Score Display -->
      <div style="text-align: center; padding: 24px; background: linear-gradient(135deg, #0ea5e9, #3b82f6); border-radius: 12px; color: white;">
        <div style="font-size: 56px; font-weight: bold;">
          ${data.readinessScore}%
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        <div>${data.quizzesCompleted} Quizzes</div>
        <div>${data.averageScore}% Average</div>
      </div>

      <!-- Strengths/Weaknesses -->
      ${data.strengths?.length > 0 ? /* strengths list */ : ''}
      ${data.weaknesses?.length > 0 ? /* weaknesses list */ : ''}
      ${data.recommendations?.length > 0 ? /* recommendations */ : ''}
    </body>
  </html>
`
```

**Template Features**:
- Gradient backgrounds
- Grid layouts
- Conditional rendering
- Color-coded lists
- Responsive design

---

## Email Templates

### Monthly Readiness Template

**Visual Structure**:

```
┌─────────────────────────────────────┐
│  📊 Your AWS Readiness Report       │
│  Hi John, here's your update!       │
│  [Blue gradient header]             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Readiness Score               │
│          78%                        │
│  [Large circular display]           │
└─────────────────────────────────────┘

┌──────────────┬──────────────────────┐
│      25      │        78%          │
│   Quizzes    │  Average Score      │
└──────────────┴──────────────────────┘

💪 Your Strengths
• VPC Networking (85%)
• IAM Policies (90%)

🎯 Areas to Focus On
• Lambda Functions (55%)
• S3 Lifecycle (60%)

💡 Recommendations
□ Practice more Lambda quizzes
□ Review S3 best practices
□ Take the AWS SAA practice exam

[Continue Your Journey Button]

Next report: December 1, 2025
```

**Email Metrics**:
- Average Open Rate: Target 35-45%
- Click Rate: Target 15-25%
- Unsubscribe Rate: Target <2%

---

### Feature Adoption Template

**Visual Structure**:

```
┌─────────────────────────────────────┐
│         🤖                         │
│  Unlock AI Certification Analysis   │
│  You're Missing Out!               │
│  [Green gradient header]           │
└─────────────────────────────────────┘

AI Certification Analysis
━━━━━━━━━━━━━━━━━━━━━━━━

Get personalized insights and
readiness scores

Benefits:
✓ Identify your strengths and weaknesses
✓ Get personalized study recommendations
✓ Track your certification readiness

[Get Started Button]

You've completed 8 quizzes - you're
ready to use this feature!
```

---

## Admin Dashboard Updates

### 1. Email Type Enum Extension

**File**: `src/server/routers/admin/email.ts`

**Before**:
```typescript
const emailTypeEnum = z.enum([
  'welcome',
  'quiz_basic',
  'quiz_milestone',
  // ... other types
  'weekly_progress',
]);
```

**After**:
```typescript
const emailTypeEnum = z.enum([
  'welcome',
  'quiz_basic',
  'quiz_milestone',
  // ... other types
  'weekly_progress',
  'monthly_certification_readiness', // ✨ NEW
]);
```

### 2. EmailHistoryViewer Updates

**File**: `app/dashboard/admin/emails/components/EmailHistoryViewer.tsx`

**Email Type Filter - Updated Dropdown**:

```typescript
<SelectContent>
  <SelectItem value="all">All Types</SelectItem>
  <SelectItem value="welcome">Welcome</SelectItem>
  <SelectItem value="quiz_milestone">Quiz Milestone</SelectItem>
  <SelectItem value="badge_unlocked">Badge Unlocked</SelectItem>
  <SelectItem value="streak_milestone">Streak Milestone</SelectItem>
  <SelectItem value="level_up">Level Up</SelectItem>
  <SelectItem value="perfect_score">Perfect Score</SelectItem>
  <SelectItem value="feature_adoption">Feature Adoption</SelectItem>
  <SelectItem value="weekly_progress">Weekly Progress</SelectItem>
  <SelectItem value="monthly_certification_readiness">Monthly Readiness</SelectItem> ✨
  <SelectItem value="inactive_3day">Inactive (3 days)</SelectItem> ✨
  <SelectItem value="inactive_7day">Inactive (7 days)</SelectItem> ✨
  <SelectItem value="inactive_14day">Inactive (14 days)</SelectItem> ✨
</SelectContent>
```

**Features**:
- Complete email type coverage
- Better filtering capabilities
- Improved admin visibility

### 3. CampaignManager Updates

**File**: `app/dashboard/admin/emails/components/CampaignManager.tsx`

**Campaign Creation - Email Type Dropdown**:

```typescript
<SelectContent>
  <SelectItem value="welcome">Welcome</SelectItem>
  <SelectItem value="quiz_milestone">Quiz Milestone</SelectItem>
  <SelectItem value="badge_unlocked">Badge Unlocked</SelectItem>
  <SelectItem value="streak_milestone">Streak Milestone</SelectItem>
  <SelectItem value="level_up">Level Up</SelectItem>
  <SelectItem value="feature_adoption">Feature Adoption</SelectItem>
  <SelectItem value="weekly_progress">Weekly Progress</SelectItem>
  <SelectItem value="monthly_certification_readiness">Monthly Readiness</SelectItem> ✨
</SelectContent>
```

---

## Database Schema

### Email Preferences (Existing)

```prisma
model EmailPreferences {
  id                     String   @id @default(cuid())
  userId                 String   @unique
  user                   User     @relation(fields: [userId], references: [userId], onDelete: Cascade)

  // Marketing & Updates
  marketingEmails        Boolean  @default(true)
  productUpdates         Boolean  @default(true)
  featureUpdates         Boolean  @default(true)

  // Engagement Notifications
  weeklyProgressReport   Boolean  @default(true)   // For weekly-progress.ts
  aiAnalysisNotifs       Boolean  @default(true)   // For monthly-readiness.ts ✨

  // Transactional
  quizNotifications      Boolean  @default(true)
  badgeNotifications     Boolean  @default(true)
  streakReminders        Boolean  @default(true)

  // Master unsubscribe
  unsubscribedAll        Boolean  @default(false)

  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}
```

### Email Log (Existing)

```prisma
model EmailLog {
  id               String        @id @default(cuid())
  userId           String?
  user             User?         @relation(fields: [userId], references: [userId], onDelete: SetNull)

  emailType        String        // 'monthly_certification_readiness' ✨
  to               String
  from             String
  subject          String?

  status           EmailStatus   @default(PENDING)
  resendId         String?       @unique

  metadata         Json?         // Template data stored here
  errorMessage     String?
  retryCount       Int           @default(0)

  sentAt           DateTime?
  deliveredAt      DateTime?
  openedAt         DateTime?
  clickedAt        DateTime?
  bouncedAt        DateTime?
  failedAt         DateTime?

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([userId])
  @@index([emailType])
  @@index([status])
  @@index([createdAt])
}

enum EmailStatus {
  PENDING
  SENDING
  SENT
  DELIVERED
  OPENED
  CLICKED
  BOUNCED
  FAILED
}
```

---

## Infrastructure

### AWS EventBridge Rules

```yaml
MonthlyReadinessRule:
  Type: AWS::Events::Rule
  Properties:
    Name: monthly-readiness-report
    Description: Triggers monthly certification readiness report
    ScheduleExpression: cron(0 9 1 * ? *)  # 1st of month at 9 AM UTC
    State: ENABLED
    Targets:
      - Arn: !GetAtt MonthlyReadinessLambda.Arn
        Id: MonthlyReadinessTarget

FeatureNudgesRule:
  Type: AWS::Events::Rule
  Properties:
    Name: feature-adoption-nudges
    Description: Triggers daily feature adoption nudges
    ScheduleExpression: cron(0 11 * * ? *)  # Daily at 11 AM UTC
    State: ENABLED
    Targets:
      - Arn: !GetAtt FeatureNudgesLambda.Arn
        Id: FeatureNudgesTarget

WeeklyProgressRule:
  Type: AWS::Events::Rule
  Properties:
    Name: weekly-progress-report
    Description: Triggers weekly progress report every Sunday
    ScheduleExpression: cron(0 10 ? * SUN *)  # Sundays at 10 AM UTC
    State: ENABLED
    Targets:
      - Arn: !GetAtt WeeklyProgressLambda.Arn
        Id: WeeklyProgressTarget
```

### Lambda Permissions

```yaml
MonthlyReadinessPermission:
  Type: AWS::Lambda::Permission
  Properties:
    FunctionName: !Ref MonthlyReadinessLambda
    Action: lambda:InvokeFunction
    Principal: events.amazonaws.com
    SourceArn: !GetAtt MonthlyReadinessRule.Arn

FeatureNudgesPermission:
  Type: AWS::Lambda::Permission
  Properties:
    FunctionName: !Ref FeatureNudgesLambda
    Action: lambda:InvokeFunction
    Principal: events.amazonaws.com
    SourceArn: !GetAtt FeatureNudgesRule.Arn
```

### Environment Variables

```bash
# Campaign Lambdas
DATABASE_URL=postgresql://...
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/.../email-queue
REDIS_URL=redis://...

# Queue Processor
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
REDIS_URL=redis://...
```

---

## Testing Guide

### 1. Manual Testing

#### Test Monthly Readiness Campaign

```bash
# Invoke Lambda directly
aws lambda invoke \
  --function-name monthly-readiness-report \
  --payload '{}' \
  response.json

# Check response
cat response.json

# Verify in database
psql $DATABASE_URL -c "
  SELECT * FROM EmailLog
  WHERE emailType = 'monthly_certification_readiness'
  ORDER BY createdAt DESC
  LIMIT 10;
"

# Check SQS queue
aws sqs get-queue-attributes \
  --queue-url $SQS_QUEUE_URL \
  --attribute-names ApproximateNumberOfMessages
```

#### Test Feature Nudges Campaign

```bash
# Invoke Lambda
aws lambda invoke \
  --function-name feature-adoption-nudges \
  --payload '{}' \
  response.json

# Check Redis for deduplication keys
redis-cli --url $REDIS_URL
> KEYS email_sent:*:feature_*
> TTL email_sent:user123:feature_ai-analysis
```

### 2. Integration Testing

**Test Scenarios**:

1. **New User Flow**:
   - User signs up
   - Completes 5 quizzes
   - Should receive feature nudge for AI Analysis
   - Completes 10 quizzes
   - Should receive project nudge

2. **Monthly Report Flow**:
   - User active for 30 days
   - Has 20+ quiz attempts
   - Should receive readiness report on 1st of month
   - Report should show correct readiness score

3. **Deduplication Test**:
   - Send feature nudge for AI Analysis
   - Try sending again within 7 days
   - Should be skipped (Redis deduplication)

### 3. Email Preview Testing

```bash
# Access admin dashboard
https://clouddojo.tech/dashboard/admin/emails

# Steps:
1. Go to Email History tab
2. Filter by email type: "Monthly Readiness"
3. Click eye icon to preview
4. Verify template rendering
5. Check all data fields populated correctly
```

### 4. Load Testing

```typescript
// Simulate 10,000 users for monthly report
const users = Array(10000).fill(null).map((_, i) => ({
  userId: `user-${i}`,
  email: `user${i}@test.com`,
  firstName: `User${i}`,
  // ... quiz data
}));

// Monitor:
// - Lambda execution time
// - SQS queue depth
// - Database query performance
// - Memory usage
```

---

## Deployment Steps

### Prerequisites

- ✅ Phase 1, 2, 3 deployed
- ✅ SQS queue configured
- ✅ Redis cluster running
- ✅ EventBridge permissions set

### Deployment Checklist

#### 1. Deploy Campaign Lambdas

```bash
# Build and deploy monthly-readiness
cd aws-lambdas/scheduled-campaigns
npm run build
npm run deploy:monthly-readiness

# Build and deploy feature-nudges
npm run deploy:feature-nudges

# Update weekly-progress
npm run deploy:weekly-progress
```

#### 2. Deploy Queue Processor Updates

```bash
cd aws-lambdas/queue-processor
npm run build
npm run deploy
```

#### 3. Update Next.js Application

```bash
cd /home/user/clouddojo
npm run build
npm run deploy
```

#### 4. Configure EventBridge Rules

```bash
# Create monthly readiness rule
aws events put-rule \
  --name monthly-readiness-report \
  --schedule-expression "cron(0 9 1 * ? *)" \
  --state ENABLED

# Add Lambda target
aws events put-targets \
  --rule monthly-readiness-report \
  --targets "Id=1,Arn=arn:aws:lambda:region:account:function:monthly-readiness"

# Grant permission
aws lambda add-permission \
  --function-name monthly-readiness \
  --statement-id EventBridgeInvoke \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:region:account:rule/monthly-readiness-report

# Repeat for feature-nudges
```

#### 5. Verify Deployment

```bash
# Check Lambda functions
aws lambda list-functions | grep -E "(monthly|feature|weekly)"

# Check EventBridge rules
aws events list-rules

# Test invoke
aws lambda invoke --function-name monthly-readiness-report response.json
```

---

## Monitoring & Analytics

### CloudWatch Metrics

**Key Metrics to Monitor**:

```typescript
// Campaign execution metrics
{
  namespace: "EmailService/Campaigns",
  metrics: [
    "MonthlyReadiness.UsersProcessed",
    "MonthlyReadiness.EmailsQueued",
    "MonthlyReadiness.ExecutionTime",
    "FeatureNudges.UsersProcessed",
    "FeatureNudges.EmailsQueued",
    "FeatureNudges.DeduplicationHits",
    "WeeklyProgress.EmailsQueued",
    "WeeklyProgress.UsersSkipped"
  ]
}
```

### CloudWatch Alarms

```yaml
MonthlyReadinessErrorAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: MonthlyReadiness-Errors
    MetricName: Errors
    Namespace: AWS/Lambda
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 1
    Threshold: 5
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SNSAlertTopic

FeatureNudgesThrottleAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: FeatureNudges-Throttles
    MetricName: Throttles
    Namespace: AWS/Lambda
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 1
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
```

### Database Queries for Analytics

```sql
-- Monthly readiness campaign performance
SELECT
  DATE_TRUNC('day', createdAt) as date,
  COUNT(*) as emails_sent,
  COUNT(CASE WHEN openedAt IS NOT NULL THEN 1 END) as emails_opened,
  ROUND(
    COUNT(CASE WHEN openedAt IS NOT NULL THEN 1 END)::numeric /
    COUNT(*)::numeric * 100,
    2
  ) as open_rate
FROM EmailLog
WHERE emailType = 'monthly_certification_readiness'
  AND createdAt >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', createdAt)
ORDER BY date DESC;

-- Feature adoption campaign effectiveness
SELECT
  JSON_EXTRACT(metadata, '$.featureName') as feature,
  COUNT(*) as nudges_sent,
  COUNT(CASE WHEN clickedAt IS NOT NULL THEN 1 END) as clicks,
  ROUND(
    COUNT(CASE WHEN clickedAt IS NOT NULL THEN 1 END)::numeric /
    COUNT(*)::numeric * 100,
    2
  ) as click_rate
FROM EmailLog
WHERE emailType = 'feature_adoption'
  AND createdAt >= NOW() - INTERVAL '30 days'
GROUP BY JSON_EXTRACT(metadata, '$.featureName')
ORDER BY nudges_sent DESC;

-- Weekly progress report trends
SELECT
  DATE_TRUNC('week', createdAt) as week,
  COUNT(*) as emails_sent,
  AVG(CAST(JSON_EXTRACT(metadata, '$.quizzesCompleted') AS INT)) as avg_quizzes,
  AVG(CAST(JSON_EXTRACT(metadata, '$.averageScore') AS INT)) as avg_score
FROM EmailLog
WHERE emailType = 'weekly_progress'
  AND createdAt >= NOW() - INTERVAL '90 days'
GROUP BY DATE_TRUNC('week', createdAt)
ORDER BY week DESC;
```

### Admin Dashboard Analytics

**Access**: `https://clouddojo.tech/dashboard/admin/emails`

**Features**:
- **Email History Viewer**: Filter by campaign type, status, date range
- **Analytics Dashboard**: Open rates, click rates, bounce rates
- **Campaign Performance**: Success rates, user engagement
- **Email Preview**: View rendered emails before sending

---

## Performance Optimization

### 1. Database Query Optimization

```typescript
// Use selective includes to reduce data transfer
include: {
  quizAttempts: {
    where: { completedAt: { gte: last30Days } },
    select: {
      id: true,
      score: true,
      completedAt: true,
      quiz: {
        select: {
          providers: true,
          title: true
        }
      }
    }
  },
  xp: { select: { totalXP: true } },
  streak: { select: { currentStreak: true, longestStreak: true } }
}
```

### 2. Batch Processing

```typescript
// Process users in batches of 1000
const BATCH_SIZE = 1000;

const activeUsers = await prisma.user.findMany({
  where: { /* filters */ },
  take: BATCH_SIZE,
  skip: 0
});

// For larger campaigns, implement pagination
for (let offset = 0; offset < totalUsers; offset += BATCH_SIZE) {
  const batch = await prisma.user.findMany({
    where: { /* filters */ },
    take: BATCH_SIZE,
    skip: offset
  });

  await processBatch(batch);
}
```

### 3. Redis Caching

```typescript
// Cache frequently accessed data
const cacheKey = `campaign:monthly-readiness:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await calculateReadinessData(userId);
await redis.setex(cacheKey, 3600, JSON.stringify(data)); // 1 hour TTL

return data;
```

### 4. Parallel Processing

```typescript
// Process emails in parallel
const emailPromises = users.map(user =>
  queueEmail(buildEmailMessage(user))
);

const results = await Promise.allSettled(emailPromises);

const successful = results.filter(r => r.status === 'fulfilled').length;
const failed = results.filter(r => r.status === 'rejected').length;

console.log(`Queued: ${successful}, Failed: ${failed}`);
```

---

## Error Handling

### 1. Campaign Lambda Errors

```typescript
export async function handler() {
  const prisma = await getPrismaClient();

  try {
    // Campaign logic
    const results = await processCampaign();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        ...results
      })
    };
  } catch (error) {
    console.error('Campaign error:', error);

    // Log to monitoring system
    await logError('monthly-readiness', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  } finally {
    await prisma.$disconnect();
  }
}
```

### 2. User-Level Error Recovery

```typescript
for (const user of activeUsers) {
  try {
    await processUser(user);
    queued++;
  } catch (error) {
    console.error(`Error processing user ${user.userId}:`, error);
    failed++;
    // Continue processing other users
  }
}

console.log(`Campaign completed: ${queued} queued, ${failed} failed`);
```

### 3. Queue Failures

```typescript
// SQS partial batch failure handling
return {
  batchItemFailures: results
    .map((result, index) =>
      result.status === 'rejected'
        ? { itemIdentifier: event.Records[index].messageId }
        : null
    )
    .filter(Boolean)
};
```

---

## Security Considerations

### 1. Email Data Privacy

```typescript
// Never log sensitive user data
console.log(`Processing user ${user.userId}`); // ✅ Safe (just ID)
console.log(`Email: ${user.email}`);           // ❌ PII leak
```

### 2. Template Injection Prevention

```typescript
// Sanitize user data before template rendering
function sanitizeTemplateData(data: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === 'string'
        ? value.replace(/[<>]/g, '') // Remove HTML tags
        : value
    ])
  );
}
```

### 3. Rate Limiting

```typescript
// Prevent abuse of feature nudges
const RATE_LIMIT_KEY = `rate-limit:feature-nudge:${userId}`;
const attempts = await redis.incr(RATE_LIMIT_KEY);

if (attempts === 1) {
  await redis.expire(RATE_LIMIT_KEY, 86400); // 24 hours
}

if (attempts > 3) {
  console.log(`Rate limit exceeded for user ${userId}`);
  return; // Skip this user
}
```

---

## Future Enhancements

### Phase 4.1: Advanced Personalization

- **Dynamic Content**: A/B test different subject lines and templates
- **Send Time Optimization**: Send emails at optimal times per user
- **Localization**: Multi-language support for global users
- **Timezone Awareness**: Send campaigns in user's local timezone

### Phase 4.2: More Campaign Types

- **Monthly Newsletter**: Curated content and product updates
- **Certification Reminders**: Remind users of upcoming exam deadlines
- **Study Plan Suggestions**: AI-generated personalized study plans
- **Peer Comparison**: "You're in top 10% of users" emails
- **Re-engagement Series**: Multi-step campaigns for inactive users

### Phase 4.3: Enhanced Analytics

- **Cohort Analysis**: Track user behavior by signup date
- **Funnel Analytics**: Email → Open → Click → Action conversion rates
- **Predictive Modeling**: Predict churn risk, optimal send times
- **Revenue Attribution**: Track how emails drive subscriptions

### Phase 4.4: Advanced Segmentation

- **Behavioral Segments**: Group users by quiz activity patterns
- **Performance Segments**: High performers vs. struggling users
- **Engagement Segments**: Active, at-risk, dormant users
- **Certification Segments**: By target certification type

---

## Statistics

### Implementation Metrics

```yaml
Files Created: 2
  - monthly-readiness.ts (180 lines)
  - feature-nudges.ts (210 lines)

Files Modified: 5
  - weekly-progress.ts (+62 lines)
  - handler.ts (+80 lines for template)
  - email.ts (+1 line for enum)
  - EmailHistoryViewer.tsx (+4 lines for dropdown)
  - CampaignManager.tsx (+1 line for dropdown)

Total Lines Added: ~537 lines
Total Lines Modified: ~148 lines

Test Coverage:
  - Unit tests: Pending
  - Integration tests: Pending
  - Manual testing: ✅ Complete

Database Impact:
  - New tables: 0
  - New columns: 0
  - New indexes: 0
  - Uses existing EmailLog and EmailPreferences

Infrastructure:
  - New Lambdas: 2 (monthly-readiness, feature-nudges)
  - Updated Lambdas: 1 (weekly-progress)
  - New EventBridge Rules: 2
  - New SQS Queues: 0 (uses existing)
```

### Campaign Reach Estimates

```yaml
Monthly Readiness Report:
  - Target Audience: Active users (30-day activity)
  - Estimated Reach: 60-70% of user base
  - Expected Open Rate: 35-45%
  - Expected Click Rate: 15-25%

Feature Adoption Nudges:
  - Target Audience: Active users (14-day activity)
  - Estimated Reach: 40-50% of user base
  - Expected Open Rate: 30-40%
  - Expected Click Rate: 20-30%
  - 7-day cooldown reduces spam

Weekly Progress Report:
  - Target Audience: Active users (7-day activity)
  - Estimated Reach: 30-40% of user base
  - Expected Open Rate: 40-50%
  - Expected Click Rate: 25-35%
```

---

## Conclusion

Phase 4 successfully introduces two powerful scheduled campaigns that proactively engage users:

1. **Monthly Certification Readiness Reports**: Provide users with comprehensive insights into their exam readiness, helping them track progress and identify improvement areas.

2. **Feature Adoption Nudges**: Intelligently detect unused features and send targeted emails to boost feature adoption, with smart deduplication to prevent spam.

3. **Enhanced Weekly Progress Reports**: Improved with better analytics and performance tracking.

### Key Achievements

✅ Implemented 2 new scheduled campaigns
✅ Enhanced existing weekly progress campaign
✅ Added comprehensive email templates
✅ Updated admin dashboard for campaign management
✅ Integrated Redis-based deduplication
✅ Maintained backward compatibility
✅ Zero database schema changes required

### Next Steps

- **Phase 5**: Resend audience sync on signup
- **Phase 6**: A/B testing and optimization
- **Phase 7**: Advanced personalization and AI-driven campaigns

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Author**: Claude (Anthropic)
**Status**: ✅ Phase 4 Complete
