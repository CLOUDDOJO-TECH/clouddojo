# Backend Patterns Guide

> Clear guidelines on when to use tRPC, Server Actions, or API Routes in CloudDojo

## 📚 Overview

CloudDojo uses **three different backend patterns** for different use cases. This document clarifies when to use each pattern and provides examples.

---

## 🎯 Quick Decision Tree

```
Need to handle external webhooks?
  → Use API Routes

Need type-safe data fetching with React Query?
  → Use tRPC

Need simple form submission or mutation from a component?
  → Use Server Actions
```

---

## 1. tRPC (Preferred for Data Fetching)

### When to Use

✅ **Complex data queries** - When you need to fetch and transform data
✅ **Type-safe APIs** - When you want end-to-end TypeScript type safety
✅ **React Query integration** - When you want caching, refetching, and optimistic updates
✅ **Real-time updates** - When you need invalidation and auto-refetch
✅ **Protected routes** - When you need authentication middleware

### Location

```
/src/server/routers/
  ├── _app.ts           # Root router
  ├── quiz.ts           # Quiz-related procedures
  ├── gamification.ts   # Gamification procedures
  └── [feature].ts      # Feature-specific routers
```

### Example

```typescript
// src/server/routers/quiz.ts
export const quizRouter = router({
  getPublicQuestions: publicProcedure
    .input(z.object({ provider: providerEnum, limit: z.number() }))
    .query(async ({ input, ctx }) => {
      const questions = await ctx.prisma.question.findMany({
        where: { /* ... */ },
        take: input.limit,
      });
      return questions;
    }),
});

// components/quiz-list.tsx
export function QuizList() {
  const { data, isLoading } = trpc.quiz.getPublicQuestions.useQuery({
    provider: "AWS",
    limit: 10,
  });

  return <>{/* render questions */}</>;
}
```

### Benefits

- ✅ Full TypeScript type inference
- ✅ Automatic React Query integration
- ✅ Request batching out of the box
- ✅ Centralized business logic
- ✅ Middleware support (auth, logging, etc.)

---

## 2. Server Actions (For Form Submissions & Mutations)

### When to Use

✅ **Form submissions** - When you need to handle form data
✅ **Simple mutations** - When you need to create/update/delete single records
✅ **Progressive enhancement** - When forms should work without JavaScript
✅ **File uploads** - When handling multipart form data
✅ **Direct database operations** - When you don't need complex queries

### Location

```
/app/(actions)/
  ├── ai-analysis/
  ├── leaderboard/
  ├── onboarding/
  ├── quiz/
  ├── user/
  └── project-categories/
```

### Example

```typescript
// app/(actions)/quiz/create-quiz.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function createQuiz(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      userId,
    },
  });

  revalidatePath("/dashboard/quizzes");
  return quiz;
}

// components/quiz-form.tsx
import { createQuiz } from "@/app/(actions)/quiz/create-quiz";

export function QuizForm() {
  return (
    <form action={createQuiz}>
      <input name="title" required />
      <input name="description" />
      <button type="submit">Create Quiz</button>
    </form>
  );
}
```

### Benefits

- ✅ Built into Next.js 15
- ✅ No API route needed
- ✅ Automatic revalidation with `revalidatePath()`
- ✅ Works without client-side JavaScript
- ✅ Simple and direct

---

## 3. API Routes (For External Integrations)

### When to Use

✅ **Webhooks** - When you need to receive data from external services
✅ **Cron jobs** - When you need scheduled tasks
✅ **File uploads via API** - When handling uploads from external sources
✅ **Third-party integrations** - When integrating with non-Next.js clients
✅ **Custom headers/cookies** - When you need low-level HTTP control

### Location

```
/app/api/
  ├── webhooks/
  │   ├── clerk/route.ts
  │   └── lemonsqueezy/route.ts
  ├── cron/
  │   └── refresh-ai-analysis/route.ts
  └── upload/route.ts
```

### Example

```typescript
// app/api/webhooks/lemonsqueezy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("X-Signature");

  // Verify webhook signature
  if (!verifySignature(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await req.json();

  // Process webhook
  await prisma.subscription.update({
    where: { id: payload.subscription_id },
    data: { status: payload.status },
  });

  return NextResponse.json({ received: true });
}
```

### Benefits

- ✅ Full control over HTTP request/response
- ✅ Can receive webhooks from external services
- ✅ Can run cron jobs
- ✅ Supports any HTTP method
- ✅ Can set custom headers and cookies

---

## 🔄 Migration Path

We are currently **migrating from API Routes → tRPC** for data fetching.

### Migration Priority

1. **Keep as API Routes:**
   - ✅ `/api/webhooks/` - External webhooks
   - ✅ `/api/cron/` - Cron jobs
   - ✅ `/api/upload/` - File uploads

2. **Migrate to tRPC:**
   - 🔄 Leaderboard endpoints
   - 🔄 Project endpoints
   - 🔄 Category endpoints
   - 🔄 Analytics endpoints

3. **Migrate to Server Actions:**
   - 🔄 Form submissions
   - 🔄 Simple mutations

### Migration Progress

See [`/docs/TRPC_MIGRATION_PLAN.md`](./TRPC_MIGRATION_PLAN.md) for detailed migration plan.

---

## 📝 Best Practices

### tRPC

```typescript
// ✅ DO: Use input validation with Zod
.input(z.object({ id: z.string() }))

// ✅ DO: Use protectedProcedure for auth-required routes
export const protectedProcedure = t.procedure.use(authMiddleware);

// ✅ DO: Keep procedures focused and single-purpose
getUser: protectedProcedure.query(...)
updateUser: protectedProcedure.mutation(...)

// ❌ DON'T: Mix concerns in a single procedure
getUserAndUpdateAndDelete: protectedProcedure.mutation(...) // Too broad
```

### Server Actions

```typescript
// ✅ DO: Use "use server" directive
"use server";

// ✅ DO: Validate input
const validated = schema.parse(formData);

// ✅ DO: Revalidate after mutations
revalidatePath("/dashboard");

// ❌ DON'T: Use for complex queries
// Use tRPC instead for complex data fetching
```

### API Routes

```typescript
// ✅ DO: Validate webhook signatures
if (!verifySignature(signature)) {
  return NextResponse.json({ error: "Invalid" }, { status: 401 });
}

// ✅ DO: Use specific HTTP methods
export async function POST(req: NextRequest) { ... }

// ❌ DON'T: Use for internal data fetching
// Use tRPC or Server Actions instead
```

---

## 🗂️ File Organization

```
/src/server/routers/        # tRPC routers
  ├── _app.ts              # Root router
  └── [feature].ts         # Feature routers

/app/(actions)/            # Server Actions
  └── [feature]/
      └── [action].ts

/app/api/                  # API Routes (external only)
  ├── webhooks/
  ├── cron/
  └── upload/
```

---

## 🎓 Learning Resources

### tRPC
- [Official Docs](https://trpc.io)
- [tRPC with Next.js](https://trpc.io/docs/nextjs)
- Our migration plan: [`TRPC_MIGRATION_PLAN.md`](./TRPC_MIGRATION_PLAN.md)

### Server Actions
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Server Actions](https://react.dev/reference/react/use-server)

### API Routes
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## ❓ FAQ

### Q: Should I use tRPC or Server Actions for form submissions?

**A:** Prefer **Server Actions** for simple forms that don't need React Query features. Use **tRPC mutations** if you need optimistic updates, complex validation, or integration with other tRPC queries.

### Q: Can I use both tRPC and Server Actions in the same app?

**A:** Yes! They serve different purposes and work well together. Use tRPC for data fetching and Server Actions for form submissions.

### Q: When should I create a new tRPC router vs adding to existing router?

**A:** Create a new router when adding a distinct feature area (e.g., `user`, `analytics`). Add to existing router for related functionality (e.g., add `quiz.getQuizHistory` to existing `quiz` router).

### Q: Should I migrate all API routes to tRPC?

**A:** No. Keep API routes for webhooks, cron jobs, and external integrations. Migrate only data-fetching routes to tRPC.

---

## 📌 Summary

| Pattern | Use For | Example |
|---------|---------|---------|
| **tRPC** | Data fetching, type-safe APIs | Quiz list, user profile, analytics |
| **Server Actions** | Form submissions, simple mutations | Create quiz, update profile |
| **API Routes** | Webhooks, cron jobs, file uploads | LemonSqueezy webhook, Clerk webhook |

**Rule of thumb:**
- External → API Routes
- Data fetching → tRPC
- Forms → Server Actions

---

**Last Updated:** 2025-01-19
**Maintainer:** Development Team
**Status:** Active
