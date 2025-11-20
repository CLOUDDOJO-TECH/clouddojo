# CloudDojo Email Service - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Phase 1 Implementation](#phase-1-implementation)
4. [Getting Started](#getting-started)
5. [Email Types](#email-types)
6. [Integration Guide](#integration-guide)
7. [Testing](#testing)
8. [Monitoring](#monitoring)
9. [Future Phases](#future-phases)

---

## Overview

The CloudDojo email service is a robust, event-driven system built for scalability and reliability. It supports:

- ✅ **Event-driven emails** - Triggered by user actions
- ✅ **Scheduled campaigns** - Automated cron jobs
- ✅ **User preferences** - Granular subscription management
- ✅ **Email logging** - Full audit trail
- ✅ **Webhook handling** - Track opens, clicks, bounces
- ✅ **Queue-based processing** - Reliable delivery with retries
- ✅ **Deduplication** - Prevent duplicate sends

### Technology Stack

- **Email Provider**: Resend
- **Queue**: AWS SQS
- **Cache**: AWS ElastiCache (Redis)
- **Compute**: AWS Lambda
- **Scheduler**: AWS EventBridge
- **Infrastructure**: Terraform
- **Backend**: Next.js + tRPC
- **Database**: PostgreSQL (Prisma)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Event Triggers:                                                │
│  • User signup          ──> triggerWelcomeEmail()               │
│  • Quiz completed       ──> triggerQuizMilestone()              │
│  • Perfect score        ──> triggerPerfectScore()               │
│  • AI analysis ready    ──> triggerAIAnalysisReady()            │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS POST
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              AWS LAMBDA: EMAIL ORCHESTRATOR                      │
├─────────────────────────────────────────────────────────────────┤
│  1. Validate request signature                                  │
│  2. Get user & email preferences                                │
│  3. Check if user opted in for this email type                  │
│  4. Check Redis for recent sends (deduplication)                │
│  5. Check rate limits                                           │
│  6. Create email message                                        │
│  7. Send to SQS queue                                           │
│  8. Mark as sent in Redis                                       │
│  9. Log event to database                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AWS SQS QUEUE                               │
├─────────────────────────────────────────────────────────────────┤
│  • Reliable message queue                                       │
│  • Automatic retries (3 attempts)                               │
│  • Dead letter queue for failures                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ SQS Trigger
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              AWS LAMBDA: QUEUE PROCESSOR                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Receive message from SQS                                    │
│  2. Create email log entry (status: SENDING)                    │
│  3. Render email template                                       │
│  4. Send via Resend API                                         │
│  5. Update email log (status: SENT, resendId)                   │
│  6. Delete message from SQS                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      RESEND API                                  │
├─────────────────────────────────────────────────────────────────┤
│  • Delivers email to user                                       │
│  • Sends webhooks on events (delivered, opened, clicked, etc.)  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Webhooks
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              AWS LAMBDA: RESEND WEBHOOK                          │
├─────────────────────────────────────────────────────────────────┤
│  • email.delivered  ──> Update status to DELIVERED              │
│  • email.opened     ──> Update status to OPENED, track time     │
│  • email.clicked    ──> Update status to CLICKED, track time    │
│  • email.bounced    ──> Update status to BOUNCED                │
│  • email.complained ──> Auto-unsubscribe user                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              AWS EVENTBRIDGE (CRON JOBS)                         │
├─────────────────────────────────────────────────────────────────┤
│  • Weekly Progress      (Sundays 10 AM UTC)                     │
│  • Inactive Users       (Daily 2 PM UTC)                        │
│  • Feature Adoption     (Daily 11 AM UTC)                       │
│  • Monthly Readiness    (1st of month)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 Implementation

### ✅ Completed

1. **Database Schema**
   - `EmailPreferences` - User subscription preferences
   - `EmailLog` - Complete audit trail of all emails
   - `UserSegment` - User segmentation for targeting
   - `EmailTemplate` - Template management
   - `EmailCampaign` - Campaign tracking
   - `EmailEvent` - Event logging

2. **AWS Infrastructure**
   - Lambda functions (5 total)
   - SQS queues (main + DLQ)
   - ElastiCache Redis cluster
   - VPC with public/private subnets
   - NAT Gateway for internet access
   - Secrets Manager for credentials
   - EventBridge rules for cron jobs
   - CloudWatch logs and alarms

3. **Email Orchestration**
   - Event-driven architecture
   - User preference checking
   - Deduplication logic
   - Rate limiting
   - Queue-based processing

4. **tRPC API**
   - `email.getPreferences` - Get user preferences
   - `email.updatePreferences` - Update preferences
   - `email.unsubscribeAll` - Unsubscribe from all
   - `email.getHistory` - View email history
   - `email.getStats` - Email statistics
   - `email.sendTestEmail` - Send test email

---

## Getting Started

### 1. Prerequisites

Ensure you have:
- ✅ AWS account configured
- ✅ Resend API key
- ✅ Database URL
- ✅ Terraform installed

### 2. Deploy Infrastructure

```bash
# See infrastructure/README.md for detailed instructions

cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

### 3. Run Database Migration

```bash
# Generate Prisma client
pnpm prisma generate

# Run migration
pnpm prisma migrate deploy
```

### 4. Configure Environment Variables

Add to your `.env.production`:

```env
# From Terraform outputs
EMAIL_ORCHESTRATOR_URL=<your-lambda-url>
EMAIL_ORCHESTRATOR_SECRET=<generate-random-secret>
RESEND_WEBHOOK_URL=<your-webhook-url>
```

### 5. Configure Resend Webhooks

1. Go to https://resend.com/webhooks
2. Add webhook URL from Terraform output
3. Select events: delivered, opened, clicked, bounced, complained

### 6. Test the Integration

```typescript
import { triggerWelcomeEmail } from '@/lib/emails/services/orchestrator';

// In your signup handler
await triggerWelcomeEmail(user.id, user.email, user.firstName);
```

---

## Email Types

### Transactional Emails

| Email Type | Event Trigger | Preference Key | Description |
|------------|--------------|----------------|-------------|
| **Welcome** | `user.created` | `productUpdates` | Sent on user signup |
| **Quiz Milestone** | `quiz.completed` | `milestoneEmails` | After completing quizzes |
| **Perfect Score** | `quiz.perfect_score` | `milestoneEmails` | 100% score celebration |
| **AI Analysis Ready** | `ai_analysis.ready` | `aiAnalysisNotifs` | AI analysis complete |

### Lifecycle Emails

| Email Type | Schedule | Preference Key | Description |
|------------|----------|----------------|-------------|
| **Weekly Progress** | Sundays 10 AM | `weeklyProgressReport` | Week's stats |
| **3-Day Inactive** | Daily 2 PM | `productUpdates` | Re-engagement |
| **7-Day Inactive** | Daily 2 PM | `productUpdates` | Re-engagement |
| **14-Day Inactive** | Daily 2 PM | `productUpdates` | Last chance |

### Phase 2: Behavior-Triggered Emails ✅

| Email Type | Event Trigger | Preference Key | Description |
|------------|--------------|----------------|-------------|
| **Quiz Milestone** | `quiz.milestone` | `milestoneEmails` | 10, 25, 50, 100 quizzes |
| **Badge Unlocked** | `badge.unlocked` | `milestoneEmails` | Badge celebration |
| **Streak Milestone** | `streak.milestone` | `milestoneEmails` | 7, 14, 30, 100 day streaks |
| **Level Up** | `level.up` | `milestoneEmails` | XP level progression |
| **Feature Adoption** | `feature.adoption` | `featureUpdates` | Feature nudge emails |

### Future Email Types (Phase 3+)

- Monthly Certification Readiness
- Feature Spotlight
- Upgrade Nudges
- Social Emails (leaderboard position)
- Personalized learning paths

---

## Integration Guide

### Triggering Emails from Your Code

#### 1. User Signup (Clerk Webhook)

```typescript
// app/api/webhooks/clerk/route.ts

import { triggerWelcomeEmail } from '@/lib/emails/services/orchestrator';

export async function POST(req: Request) {
  // ... Clerk webhook handling ...

  if (evt.type === 'user.created') {
    const user = evt.data;

    // Create user in database
    const newUser = await prisma.user.create({ ... });

    // Trigger welcome email
    await triggerWelcomeEmail(
      newUser.userId,
      newUser.email,
      newUser.firstName
    );
  }
}
```

#### 2. Quiz Completion

```typescript
// src/server/routers/quiz.ts

import { triggerQuizMilestone, triggerPerfectScore } from '@/lib/emails/services/orchestrator';

export const quizRouter = router({
  submitQuiz: protectedProcedure
    .input(...)
    .mutation(async ({ ctx, input }) => {
      // ... quiz submission logic ...

      const quizCount = await ctx.prisma.quizAttempt.count({
        where: { userId: ctx.userId }
      });

      // Trigger milestone email
      if (quizCount % 5 === 0) { // Every 5 quizzes
        await triggerQuizMilestone(
          ctx.userId,
          quizCount,
          percentageScore,
          quiz.title
        );
      }

      // Perfect score celebration
      if (percentageScore === 100) {
        await triggerPerfectScore(ctx.userId, quiz.title);
      }

      return result;
    }),
});
```

#### 3. AI Analysis Completion

```typescript
// app/api/cron/refresh-ai-analysis/route.ts (migrated to Lambda)

import { triggerAIAnalysisReady } from '@/lib/emails/services/orchestrator';

// After generating AI analysis
await triggerAIAnalysisReady(
  user.userId,
  'AWS Solutions Architect',
  readinessScore
);
```

### Using tRPC for Email Preferences

```typescript
// Client-side component
'use client';

import { api } from '@/lib/trpc/client';

export function EmailPreferencesForm() {
  const { data: preferences } = api.email.getPreferences.useQuery();
  const updateMutation = api.email.updatePreferences.useMutation();

  const handleUpdate = (values) => {
    updateMutation.mutate(values);
  };

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={preferences?.weeklyProgressReport}
          onChange={(e) =>
            handleUpdate({ weeklyProgressReport: e.target.checked })
          }
        />
        Weekly Progress Report
      </label>
      {/* More preferences... */}
    </form>
  );
}
```

---

## Testing

### 1. Test Email Orchestrator

```bash
curl -X POST <ORCHESTRATOR_URL> \
  -H "Content-Type: application/json" \
  -H "x-clouddojo-signature: test" \
  -d '{
    "eventType": "user.created",
    "userId": "test-user-123",
    "eventData": {
      "username": "Test User",
      "email": "test@example.com"
    }
  }'
```

### 2. Test via tRPC

```typescript
// In your Next.js app
const result = await api.email.sendTestEmail.mutate({
  emailType: 'welcome',
});

console.log(result); // { success: true, emailType: 'welcome', ... }
```

### 3. Check Logs

```bash
# Email orchestrator logs
aws logs tail /aws/lambda/clouddojo-email-orchestrator-production --follow

# Queue processor logs
aws logs tail /aws/lambda/clouddojo-queue-processor-production --follow
```

### 4. Monitor SQS

```bash
# Check queue depth
aws sqs get-queue-attributes \
  --queue-url <QUEUE_URL> \
  --attribute-names ApproximateNumberOfMessages
```

---

## Monitoring

### Key Metrics

1. **Lambda Metrics**
   - Invocation count
   - Error rate
   - Duration
   - Throttles

2. **SQS Metrics**
   - Messages sent
   - Messages received
   - Messages in DLQ
   - Age of oldest message

3. **Email Metrics** (from database)
   - Total sent
   - Open rate
   - Click rate
   - Bounce rate

### CloudWatch Dashboards

Create dashboard with:
- Lambda invocations (all functions)
- Lambda errors
- SQS queue depth
- DLQ message count
- Redis CPU/memory

### Alerts

Already configured:
- ✅ DLQ messages > 10 (failed emails)

Add manually:
- Lambda errors > 5% error rate
- Redis memory > 80%
- Queue depth > 1000 messages

---

## Future Phases

### Phase 2: Behavior-Triggered Emails (Weeks 3-4) ✅ COMPLETE

- [x] Quiz milestones (10, 25, 50, 100 quizzes)
- [x] Feature adoption nudges
- [x] Badge unlocked celebrations
- [x] Streak milestones (7, 14, 30, 100 days)
- [x] Level up emails
- [x] Gamification router with email triggers
- [x] Analysis router with email triggers

See `PHASE_2_SUMMARY.md` for complete details.

### Phase 3: Admin Dashboard (Weeks 5-6) ✅ COMPLETE

- [x] Email history viewer with advanced filtering
- [x] Template management UI with inline editing
- [x] Campaign composer with scheduling
- [x] Segment viewer
- [x] Analytics dashboard with charts
- [x] Email preview functionality (enhancement)
- [x] Bulk operations (resend, delete) (enhancement)
- [x] CSV export (enhancement)

See `PHASE_3_SUMMARY.md` for complete details.

**Access**: Navigate to `/dashboard/admin/emails`

### Phase 4: Scheduled Campaigns ✅ COMPLETE

**Status**: ✅ Complete (2025-11-20)

- [x] Weekly progress reports (enhanced with helper functions)
- [x] Monthly certification readiness (new campaign)
- [x] Feature adoption nudges (new campaign)

**Key Deliverables**:
- Monthly Readiness Report campaign (runs 1st of each month)
- Feature Adoption Nudges campaign (runs daily)
- Enhanced Weekly Progress Report with analytics helpers
- Email templates for new campaign types
- Admin UI updates to support all email types

See `PHASE_4_SUMMARY.md` for complete details.

### Phase 5: Resend Integration (Week 9)

- [ ] Auto-sync users to Resend audiences on signup
- [ ] Create and manage segments in Resend
- [ ] Hybrid approach: Use Resend Broadcast for manual campaigns

### Phase 6: Analytics & Optimization (Week 10)

- [ ] Open/click tracking (webhooks already set up)
- [ ] A/B testing framework
- [ ] Template performance comparison
- [ ] Automated campaign optimization

---

## Troubleshooting

### Emails not sending

1. Check CloudWatch logs for errors
2. Verify SQS queue has messages
3. Check DLQ for failed messages
4. Verify Resend API key in Secrets Manager

### Lambda timeout errors

1. Check VPC NAT Gateway is working
2. Verify Redis connectivity
3. Check database connection pooling

### Redis connection failures

```bash
# Check Redis status
aws elasticache describe-cache-clusters \
  --cache-cluster-id clouddojo-redis-production \
  --show-cache-node-info
```

---

## Cost Optimization

Current setup costs ~$50-70/month. To reduce:

1. **Remove NAT Gateway** ($32/month)
   - Use VPC endpoints instead (Lambda → SQS, Secrets Manager)
   - Keep Redis in VPC (still needs NAT for database access)

2. **Use smaller Redis instance**
   - t4g.micro ($11/month) → cache.t3.micro ($7/month)
   - Or use Redis from your DB provider (Upstash, etc.)

3. **Optimize Lambda memory**
   - Test with 256MB instead of 512MB/1024MB
   - Can reduce costs by 50%

---

## Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com/lambda/
- **Resend Documentation**: https://resend.com/docs
- **Terraform AWS Provider**: https://registry.terraform.io/providers/hashicorp/aws/

For issues, check:
1. CloudWatch logs
2. SQS DLQ
3. Email logs in database

---

**Built with ❤️ for CloudDojo**
