# CloudDojo Email System

This document covers the email infrastructure used in CloudDojo, including how to preview templates, add new templates, trigger emails, and debug issues.

## Overview

CloudDojo uses:
- **[React Email](https://react.email)** for building email templates as React components
- **[Resend](https://resend.com)** for sending transactional emails
- **[Inngest](https://inngest.com)** for background processing with automatic retries

## Quick Start

### Preview Templates Locally

```bash
npm run email:dev
```

This starts the React Email dev server at `http://localhost:3000` where you can preview all email templates with live reload.

### Send Test Emails

```bash
# Set environment variables first
export RESEND_API_KEY=your_api_key
export EMAIL_TEST_MODE=true  # Redirects all emails to test address

npm run email:test
```

This sends all email types to the test email address (`bonyuglen@gmail.com` by default).

## Email Templates

All templates are located in `/lib/emails/templates/`:

| Template | File | Sender | Variables |
|----------|------|--------|-----------|
| Welcome | `WelcomeEmail.tsx` | `welcome@clouddojo.tech` | `name`, `loginUrl`, `dashboardUrl` |
| Password Reset | `PasswordResetEmail.tsx` | `reset@clouddojo.tech` | `name`, `resetUrl`, `expiryTime` |
| Study Reminder | `StudyReminderEmail.tsx` | `reminders@clouddojo.tech` | `name`, `lastCertification`, `daysSinceLastStudy`, `practiceTestUrl`, `unsubscribeUrl` |
| Quiz Results | `QuizResultsEmail.tsx` | `results@clouddojo.tech` | `name`, `score`, `totalQuestions`, `passPercentage`, `passed`, `weakAreas[]`, `nextSteps`, `retakeUrl` |

### Base Layout

All templates use `BaseLayout.tsx` which provides:
- CloudDojo header with logo
- Consistent styling with brand colors (emerald/teal palette)
- Footer with unsubscribe link and copyright
- Mobile-responsive design

## Sender Addresses

We use category-specific sender addresses for better email deliverability and organization:

| Category | Address | Purpose |
|----------|---------|---------|
| Welcome | `welcome@clouddojo.tech` | New user onboarding |
| Password Reset | `reset@clouddojo.tech` | Security-related emails |
| Reminders | `reminders@clouddojo.tech` | Study reminders |
| Results | `results@clouddojo.tech` | Quiz/test results |
| Support | `support@clouddojo.tech` | User support emails |
| Feedback | `feedback@clouddojo.tech` | Feedback notifications |

**Why category-specific addresses?**
- Better email reputation per category
- Easier to track and filter in email clients
- Allows users to filter/whitelist specific email types
- Helps with deliverability analytics

## How to Trigger Emails

### Direct Send (Synchronous)

Use these for immediate sends (e.g., password reset):

```typescript
import { 
  sendWelcomeEmailNew,
  sendPasswordResetEmail,
  sendStudyReminderEmail,
  sendQuizResultsEmail 
} from '@/lib/emails/emailService';

// Send welcome email
await sendWelcomeEmailNew({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
});

// Send password reset
await sendPasswordResetEmail({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  resetToken: 'unique-token',
  expiryMinutes: 60,
});

// Send study reminder
await sendStudyReminderEmail({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  lastCertification: 'AWS Solutions Architect',
  daysSinceLastStudy: 5,
});

// Send quiz results
await sendQuizResultsEmail({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  quizData: {
    score: 55,
    totalQuestions: 65,
    passPercentage: 72,
    passed: true,
    weakAreas: ['Networking', 'Security'],
    nextSteps: 'Review weak areas and retake the test.',
  },
});
```

### Background Send (Queued via Inngest)

Use these for non-critical emails to avoid blocking API responses:

```typescript
import {
  queueWelcomeEmail,
  queuePasswordResetEmail,
  queueStudyReminderEmail,
  queueQuizResultsEmail,
} from '@/lib/emails/queue/emailQueue';

// Queue welcome email (non-blocking)
await queueWelcomeEmail({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
});
```

**Benefits of queued sends:**
- Non-blocking (API responds immediately)
- Automatic retries (3 attempts with exponential backoff)
- Better error handling
- Scales better for bulk sends

## Adding a New Email Template

### Step 1: Create the Template Component

Create a new file in `/lib/emails/templates/`:

```typescript
// lib/emails/templates/MyNewEmail.tsx
import { Button, Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseLayout from './BaseLayout';

interface MyNewEmailProps {
  name: string;
  customField: string;
}

export const MyNewEmail = ({
  name = 'there',
  customField = 'default value',
}: MyNewEmailProps) => {
  return (
    <BaseLayout previewText="Your preview text here">
      <Heading className="text-2xl font-bold text-gray-900 text-center mb-6">
        Your Heading
      </Heading>
      <Text className="text-gray-700 mb-4">
        Hi {name}, {customField}
      </Text>
      {/* Add more content */}
    </BaseLayout>
  );
};

export default MyNewEmail;
```

### Step 2: Add the Sending Function

Add to `/lib/emails/emailService.ts`:

```typescript
interface SendMyNewEmailParams {
  userId: string;
  email: string;
  name: string;
  customField: string;
}

export async function sendMyNewEmail({
  userId,
  email,
  name,
  customField,
}: SendMyNewEmailParams): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined');
  }

  const recipient = getRecipient(email);
  const subject = 'Your Email Subject';

  try {
    const data = await resend.emails.send({
      from: SENDERS.support, // Choose appropriate sender
      to: recipient,
      subject,
      react: MyNewEmail({ name, customField }),
    });

    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'my-new-email',
      sender: SENDERS.support,
      subject,
      success: true,
      variables: { name, customField, userId },
    });

    return { success: true, data };
  } catch (error) {
    // Handle error...
    return { success: false, error };
  }
}
```

### Step 3: (Optional) Add Queue Function

If you want background processing, add to `/lib/emails/queue/emailQueue.ts`:

```typescript
// Add event type to inngest/client.ts first
"email/send-my-new-email": {
  data: {
    userId: string;
    email: string;
    name: string;
    customField: string;
  };
};

// Then add queue function
export async function queueMyNewEmail(params: SendMyNewEmailParams) {
  await inngest.send({
    name: "email/send-my-new-email",
    data: params,
  });
}

// And the worker
export const sendMyNewEmailWorker = inngest.createFunction(
  {
    id: "send-my-new-email",
    name: "Send My New Email",
    retries: 3,
  },
  { event: "email/send-my-new-email" },
  async ({ event, step }) => {
    const { userId, email, name, customField } = event.data;
    const result = await step.run("send-email", async () => {
      return await sendMyNewEmail({ userId, email, name, customField });
    });
    if (!result.success) {
      throw new Error(`Failed to send email: ${result.error}`);
    }
    return { success: true, email };
  }
);
```

### Step 4: Preview and Test

1. Run `npm run email:dev` to preview the template
2. Add a test case in `scripts/testEmails.ts`
3. Run `npm run email:test` to verify it sends correctly

## Test Mode

To prevent accidentally sending emails to real users during development:

### Environment Variables

```bash
# Redirect all emails to test address
EMAIL_TEST_MODE=true

# Set the test email address (required for email:test script)
EMAIL_TEST_ADDRESS=your-test@example.com

# In development, emails are automatically redirected even without this flag
NODE_ENV=development
```

### Test Email Address

Configure via the `EMAIL_TEST_ADDRESS` environment variable. This address must be set when running the email test script.

```bash
EMAIL_TEST_ADDRESS=your-test@example.com npm run email:test
```

## Email Logs

### Development Logs

In development, all email sends are logged to the console with:
- Timestamp
- Recipient (original and actual)
- Email type
- Sender address
- Subject
- Success/failure status
- Variables used

### Getting Logs Programmatically

```typescript
import { getEmailLogs } from '@/lib/emails/emailService';

const logs = getEmailLogs();
console.log(logs);
```

### Production Monitoring

In production:
- Check Resend dashboard for delivery status
- Review Inngest dashboard for failed jobs
- Application logs contain email send attempts

## Debugging Failed Sends

### Common Issues

1. **RESEND_API_KEY not set**
   - Error: "RESEND_API_KEY is not defined"
   - Fix: Set the environment variable

2. **Invalid sender address**
   - Ensure sender domain is verified in Resend
   - Check DNS records (SPF, DKIM, DMARC)

3. **Rate limiting**
   - Resend has rate limits per plan
   - Use queued sends for bulk emails
   - Check Resend dashboard for limits

4. **Template rendering errors**
   - Run `npm run email:dev` to preview templates
   - Check for missing required props

### Checking Inngest Jobs

For queued emails, check the Inngest dashboard:
1. Go to Inngest dashboard (local: http://localhost:8288)
2. Find the failed function run
3. Review error message and retry if needed

## Architecture Decisions

### Why React Email?

- **Component-based**: Reusable, maintainable templates
- **TypeScript support**: Type-safe template props
- **Preview server**: Easy local development
- **Plain text generation**: Automatic plain text fallback
- **Email client compatibility**: Well-tested across clients

### Why Resend?

- **Developer-friendly**: Simple API, good DX
- **React Email integration**: First-class support
- **Reliable delivery**: Good deliverability rates
- **Analytics**: Built-in tracking and analytics

### Why Inngest (not BullMQ)?

- **Serverless-friendly**: Works with Vercel/Next.js
- **Built-in retries**: Automatic exponential backoff
- **No infrastructure**: No Redis/queue setup needed
- **Type-safe events**: TypeScript integration
- **Existing usage**: Already used for quiz analysis

## Resend Dashboard

Access at: https://resend.com/dashboard

Monitor:
- Email delivery rates
- Bounce rates
- Spam complaints
- Rate limit usage
- Domain verification status

## Rate Limiting & Scheduling

### Resend Rate Limits

Check your plan at https://resend.com/pricing:
- Free: 100 emails/day
- Pro: 50,000 emails/month
- Enterprise: Custom limits

### Study Reminders

- Don't send more than one reminder per 48 hours to the same user
- Batch reminders to avoid rate limits
- Consider user timezone (9am-6pm local time when available)

## File Structure

```
lib/emails/
├── templates/
│   ├── BaseLayout.tsx          # Shared layout component
│   ├── WelcomeEmail.tsx        # Welcome email template
│   ├── PasswordResetEmail.tsx  # Password reset template
│   ├── StudyReminderEmail.tsx  # Study reminder template
│   └── QuizResultsEmail.tsx    # Quiz results template
├── queue/
│   └── emailQueue.ts           # Inngest queue & workers
├── emailService.ts             # Main sending functions
├── drafts/                     # Legacy/draft templates
│   ├── welcome-mail.tsx
│   ├── new-report.tsx
│   └── campaign-cron.tsx
├── analysis-notification.tsx   # Legacy template
├── feedback-notification.tsx   # Legacy template
├── feedback-thank-you.tsx      # Legacy template
├── welcome-email.tsx           # Legacy template
└── send-email.ts               # Legacy sending functions

scripts/
└── testEmails.ts               # Email testing script

inngest/
├── client.ts                   # Inngest client with email events
└── functions/                  # Other Inngest functions

app/api/inngest/
└── route.ts                    # Inngest webhook (includes email workers)
```
