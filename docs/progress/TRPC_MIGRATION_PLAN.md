# tRPC Migration Plan - CloudDojo

## Overview
Migrate from direct Prisma database access to tRPC for type-safe, maintainable data layer.

**Timeline:** 4-6 weeks
**Approach:** Incremental migration (run tRPC alongside existing API routes)

---

## Phase 1: Foundation Setup (Days 1-3)

### Day 1: Dependencies & Core Setup
- [ ] Install dependencies
  - `@trpc/server` - tRPC server
  - `@trpc/client` - tRPC client
  - `@trpc/react-query` - React Query integration
  - `@trpc/next` - Next.js adapter
  - `@tanstack/react-query` - React Query v5
  - `zod` - Schema validation
  - `superjson` - Serialization (dates, Maps, Sets, etc.)

- [ ] Create folder structure
  ```
  /src
  ├── server/
  │   ├── trpc.ts           # tRPC instance & middleware
  │   ├── context.ts        # Request context (user, db)
  │   └── routers/
  │       ├── _app.ts       # Root router
  │       └── quiz.ts       # Quiz router (first)
  ├── lib/
  │   └── trpc/
  │       ├── client.ts     # tRPC client (server-side)
  │       └── react.tsx     # tRPC hooks (client-side)
  └── app/
      └── api/
          └── trpc/
              └── [trpc]/
                  └── route.ts  # HTTP handler
  ```

- [ ] Configure TypeScript paths in `tsconfig.json`

### Day 2: tRPC Core Implementation

**File: `/src/server/trpc.ts`**
```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Authenticated procedure with middleware
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Now guaranteed to be defined
    },
  });
});
```

**File: `/src/server/context.ts`**
```typescript
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function createContext() {
  const { userId } = await auth();

  return {
    prisma,
    userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

**File: `/src/server/routers/_app.ts`**
```typescript
import { router } from '../trpc';
import { quizRouter } from './quiz';

export const appRouter = router({
  quiz: quizRouter,
  // Add more routers here as we migrate
});

export type AppRouter = typeof appRouter;
```

### Day 3: Client Setup & API Route

**File: `/app/api/trpc/[trpc]/route.ts`**
```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

**File: `/src/lib/trpc/client.ts`**
```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
});
```

**File: `/src/lib/trpc/react.tsx`**
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';
import { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

**Update `/app/layout.tsx`**
```typescript
import { TRPCProvider } from '@/lib/trpc/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
```

---

## Phase 2: Quiz Router Migration (Days 4-7)

### Day 4-5: Quiz Procedures

**File: `/src/server/routers/quiz.ts`**

```typescript
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

const providerEnum = z.enum(['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker']);

export const quizRouter = router({
  // Public: Get demo questions
  getPublicQuestions: publicProcedure
    .input(
      z.object({
        provider: providerEnum,
        limit: z.number().min(1).max(15).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const quizzes = await ctx.prisma.quiz.findMany({
        where: {
          isPublic: true,
          free: true,
          providers: { has: input.provider },
        },
        include: {
          questions: {
            include: { options: true },
            take: input.limit,
          },
        },
        take: 5,
      });

      // Flatten and randomize questions
      const allQuestions = quizzes.flatMap(q => q.questions);
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);

      return shuffled.slice(0, input.limit);
    }),

  // Public: Verify answer
  verifyAnswer: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        selectedOptionIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.questionId },
        include: { options: true },
      });

      if (!question) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Question not found'
        });
      }

      const correctOptions = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id)
        .sort();

      const userOptions = [...input.selectedOptionIds].sort();

      const isCorrect =
        correctOptions.length === userOptions.length &&
        correctOptions.every((id, i) => id === userOptions[i]);

      return {
        isCorrect,
        correctOptionIds: correctOptions,
        explanation: question.explanation,
      };
    }),

  // Protected: Get user's quiz history
  getQuizHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const attempts = await ctx.prisma.quizAttempt.findMany({
        where: { userId: ctx.userId },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              providers: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
      });

      return attempts;
    }),

  // Protected: Start quiz session
  startQuizSession: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
        mode: z.enum(['practice', 'timed', 'exam']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const session = await ctx.prisma.quizAttempt.create({
        data: {
          userId: ctx.userId,
          quizId: input.quizId,
          mode: input.mode,
          startedAt: new Date(),
        },
      });

      return session;
    }),
});
```

### Day 6-7: Update Demo Page to Use tRPC

**File: `/app/demo/page.tsx`** (Updated)

```typescript
'use client';

import { trpc } from '@/lib/trpc/react';
import { useState } from 'react';

export default function DemoPage() {
  const [provider, setProvider] = useState<'AWS' | 'Azure' | 'GCP'>('AWS');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // ✅ Fully type-safe query with auto-complete!
  const { data: questions, isLoading } = trpc.quiz.getPublicQuestions.useQuery({
    provider,
    limit: 10,
  });

  // ✅ Type-safe mutation
  const verifyMutation = trpc.quiz.verifyAnswer.useMutation({
    onSuccess: (data) => {
      console.log('Is correct:', data.isCorrect);
      console.log('Explanation:', data.explanation);
    },
  });

  const handleSubmit = (selectedOptionIds: string[]) => {
    if (!questions?.[currentQuestion]) return;

    verifyMutation.mutate({
      questionId: questions[currentQuestion].id,
      selectedOptionIds,
    });
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (!questions?.length) return <div>No questions found</div>;

  return (
    <div>
      {/* Question UI here */}
      <button onClick={() => handleSubmit(['option-id'])}>
        Submit
      </button>
    </div>
  );
}
```

**Remove old API routes:**
- ~~`/app/api/demo/questions/route.ts`~~ (Delete)
- ~~`/app/api/demo/verify/route.ts`~~ (Delete)

---

## Phase 3: Progress & Analytics Router (Days 8-10)

### Progress Router

**File: `/src/server/routers/progress.ts`**

```typescript
export const progressRouter = router({
  // Get user stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.prisma.quizAttempt.aggregate({
      where: { userId: ctx.userId },
      _count: { id: true },
      _avg: { score: true },
    });

    return {
      totalAttempts: stats._count.id,
      averageScore: stats._avg.score || 0,
    };
  }),

  // Get performance by topic
  getTopicPerformance: protectedProcedure
    .input(z.object({ provider: providerEnum }))
    .query(async ({ input, ctx }) => {
      // Complex aggregation logic here
      const performance = await ctx.prisma.questionAttempt.groupBy({
        by: ['topic'],
        where: {
          attempt: {
            userId: ctx.userId,
            quiz: {
              providers: { has: input.provider },
            },
          },
        },
        _count: { id: true },
        _sum: { isCorrect: true },
      });

      return performance.map(p => ({
        topic: p.topic,
        total: p._count.id,
        correct: p._sum.isCorrect || 0,
        accuracy: ((p._sum.isCorrect || 0) / p._count.id) * 100,
      }));
    }),

  // Get weak areas
  getWeakAreas: protectedProcedure.query(async ({ ctx }) => {
    // AI-powered weak area detection
    // Complex query with multiple joins
  }),
});
```

---

## Phase 4: User & Settings Router (Days 11-12)

**File: `/src/server/routers/user.ts`**

```typescript
export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
    });
  }),

  updatePreferences: protectedProcedure
    .input(z.object({
      theme: z.enum(['light', 'dark', 'system']),
      emailNotifications: z.boolean(),
      studyReminders: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: input,
      });
    }),
});
```

---

## Testing Strategy

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from '@/server/routers/_app';

describe('Quiz Router', () => {
  it('should return public questions', async () => {
    const caller = appRouter.createCaller({
      prisma: mockPrisma,
      userId: null,
    });

    const result = await caller.quiz.getPublicQuestions({
      provider: 'AWS',
      limit: 5,
    });

    expect(result).toHaveLength(5);
  });
});
```

---

## Migration Checklist

### Week 1: Foundation
- [ ] Install all dependencies
- [ ] Create folder structure
- [ ] Set up tRPC core (trpc.ts, context.ts)
- [ ] Create root router (_app.ts)
- [ ] Set up API route handler
- [ ] Set up React Query provider
- [ ] Test with simple "hello" procedure

### Week 2: Quiz Migration
- [ ] Create quiz router with all procedures
- [ ] Update /demo page to use tRPC
- [ ] Test public questions endpoint
- [ ] Test verify answer endpoint
- [ ] Delete old API routes
- [ ] Verify type safety works

### Week 3: Progress & Analytics
- [ ] Create progress router
- [ ] Migrate dashboard to use tRPC
- [ ] Add caching strategies
- [ ] Performance testing

### Week 4: User & Polish
- [ ] Create user router
- [ ] Migrate remaining endpoints
- [ ] Add error handling
- [ ] Add loading states
- [ ] Write tests
- [ ] Documentation

---

## Benefits After Migration

### Developer Experience
✅ Full TypeScript autocomplete
✅ Catch errors at compile time
✅ Automatic API documentation
✅ Easy refactoring (rename = update everywhere)

### Performance
✅ Request batching (multiple queries in 1 HTTP request)
✅ React Query caching out of the box
✅ Optimistic updates built-in

### Maintainability
✅ All data logic in one place (`/server/routers`)
✅ Shared validation schemas
✅ Easy to add middleware (auth, logging, rate limiting)

### Security
✅ No accidental data exposure
✅ Centralized auth checks
✅ Input validation on every request

---

## Next Steps After tRPC

Once tRPC is in place, we can build:

1. **Custom Quiz Builder** - Clean API for filtering/creating quizzes
2. **Spaced Repetition** - Backend logic for SRS algorithm
3. **Analytics Dashboard** - Complex aggregations made easy
4. **Real-time Features** - WebSocket support (tRPC subscriptions)

---

## Questions to Address

1. **Caching Strategy** - How long to cache quiz questions?
2. **Rate Limiting** - Do we need rate limiting on demo endpoints?
3. **Error Handling** - Toast notifications vs inline errors?
4. **Loading States** - Skeletons vs spinners?

---

**Total Estimated Time:** 3-4 weeks for full migration
**Risk Level:** Low (incremental, can rollback anytime)
**Team Impact:** Minimal (old routes work until migrated)
