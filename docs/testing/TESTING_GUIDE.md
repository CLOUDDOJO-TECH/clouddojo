# Testing Guide - AI Analysis System

> **Last Updated**: 2025-11-19
> **Test Framework**: Vitest
> **Coverage Tool**: V8

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Mocking Guide](#mocking-guide)
6. [Testing Inngest Functions](#testing-inngest-functions)
7. [Testing tRPC Endpoints](#testing-trpc-endpoints)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test calculations.test.ts
```

### Run Tests with UI

```bash
npm test -- --ui
```

---

## Test Structure

```
tests/
├── setup.ts                    # Global test configuration
├── __mocks__/                  # Shared mocks
│   ├── prisma.ts
│   ├── inngest.ts
│   └── ai.ts
├── unit/                       # Unit tests
│   ├── calculations.test.ts   # Math/logic helpers
│   ├── aggregation.test.ts    # Dashboard aggregation
│   └── quiz-data.test.ts      # Data formatting
├── integration/                # Integration tests
│   ├── analyze-quiz.test.ts   # Full quiz analysis flow
│   ├── dashboard.test.ts      # Dashboard update flow
│   └── topic-mastery.test.ts  # Topic tracking
└── e2e/                        # End-to-end tests (optional)
    └── full-flow.test.ts       # Complete user journey
```

---

## Running Tests

### NPM Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:run": "vitest run"
  }
}
```

### Test Commands

```bash
# Run all tests
npm test

# Run with coverage report
npm test:coverage

# Run in watch mode (auto-rerun on file changes)
npm test:watch

# Run once (no watch mode)
npm test:run

# Run with UI dashboard
npm test:ui

# Run specific test suite
npm test -- calculations

# Run tests matching pattern
npm test -- --grep="aggregation"
```

---

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/path/to/function';

describe('MyFunction', () => {
  it('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });

  it('should handle edge case', () => {
    const result = myFunction(edgeCase);
    expect(result).toBeNull();
  });
});
```

### Async Tests

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing with Mocks

```typescript
import { vi } from 'vitest';
import { prisma } from '@/lib/prisma';

it('should save to database', async () => {
  const mockCreate = vi.spyOn(prisma.quizAnalysis, 'create');
  mockCreate.mockResolvedValue({ id: 'test-id' } as any);

  await myFunction();

  expect(mockCreate).toHaveBeenCalledWith({
    data: expect.objectContaining({
      userId: 'test-user',
    }),
  });
});
```

### Testing Error Handling

```typescript
it('should throw error for invalid input', () => {
  expect(() => {
    myFunction(invalidInput);
  }).toThrow('Invalid input');
});

it('should handle async errors', async () => {
  await expect(asyncFunction()).rejects.toThrow('Error message');
});
```

---

## Mocking Guide

### Mocking Prisma

```typescript
// tests/setup.ts
vi.mock('@/lib/prisma', () => ({
  prisma: {
    quizAnalysis: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// In your test
import { prisma } from '@/lib/prisma';

it('should query database', async () => {
  vi.mocked(prisma.quizAnalysis.findUnique).mockResolvedValue({
    id: 'test-id',
    status: 'completed',
  } as any);

  const result = await getAnalysis('test-id');
  expect(result).toBeDefined();
});
```

### Mocking AI Calls

```typescript
// tests/__mocks__/ai.ts
vi.mock('@/lib/ai/call-ai', () => ({
  callAI: vi.fn(),
  callAIWithSchema: vi.fn(),
}));

// In your test
import { callAIWithSchema } from '@/lib/ai/call-ai';

it('should call AI with correct prompt', async () => {
  vi.mocked(callAIWithSchema).mockResolvedValue({
    strengths: ['S3 expertise', 'Lambda proficiency'],
    weaknesses: ['VPC confusion'],
    insight: 'Strong fundamentals',
  });

  const result = await analyzeQuiz(data);
  expect(result.strengths).toHaveLength(2);
});
```

### Mocking Inngest

```typescript
vi.mock('@/inngest/client', () => ({
  inngest: {
    send: vi.fn(),
    createFunction: vi.fn((config, trigger, handler) => handler),
  },
}));

// In your test
import { inngest } from '@/inngest/client';

it('should trigger inngest event', async () => {
  await triggerAnalysis('quiz-123');

  expect(inngest.send).toHaveBeenCalledWith({
    name: 'quiz/completed',
    data: { quizAttemptId: 'quiz-123' },
  });
});
```

### Mocking Sentry

```typescript
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  metrics: {
    increment: vi.fn(),
    distribution: vi.fn(),
  },
}));

// In your test
import * as Sentry from '@sentry/nextjs';

it('should track error in Sentry', async () => {
  await functionThatFails();

  expect(Sentry.captureException).toHaveBeenCalled();
  expect(Sentry.metrics.increment).toHaveBeenCalledWith(
    'ai_analysis.error',
    1
  );
});
```

---

## Testing Inngest Functions

### Test Inngest Function Logic

```typescript
import { describe, it, expect, vi } from 'vitest';
import { analyzeStrengthsWeaknesses } from '@/inngest/functions/analyze-strengths-weaknesses';
import { callAIWithSchema } from '@/lib/ai/call-ai';
import { prisma } from '@/lib/prisma';

describe('analyzeStrengthsWeaknesses', () => {
  const mockQuizData = {
    attempt: { id: 'quiz-123', percentageScore: 75 },
    questions: [
      {
        text: 'What is S3?',
        category: 'Storage',
        isCorrect: true,
      },
    ],
  };

  it('should skip for free tier users', async () => {
    const result = await analyzeStrengthsWeaknesses({
      event: {
        data: {
          analysisId: 'analysis-123',
          quizData: mockQuizData,
          tier: 'free',
        },
      },
      step: {
        run: vi.fn((name, fn) => fn()),
      },
    } as any);

    expect(result.skipped).toBe(true);
    expect(result.reason).toBe('premium-only');
  });

  it('should analyze for premium users', async () => {
    // Mock AI response
    vi.mocked(callAIWithSchema).mockResolvedValue({
      strengths: ['S3 expertise'],
      weaknesses: ['VPC concepts'],
      insight: 'Good fundamentals',
    });

    // Mock DB update
    vi.mocked(prisma.quizAnalysis.update).mockResolvedValue({} as any);

    const result = await analyzeStrengthsWeaknesses({
      event: {
        data: {
          analysisId: 'analysis-123',
          quizData: mockQuizData,
          tier: 'premium',
        },
      },
      step: {
        run: vi.fn((name, fn) => fn()),
      },
    } as any);

    expect(result.success).toBe(true);
    expect(callAIWithSchema).toHaveBeenCalled();
    expect(prisma.quizAnalysis.update).toHaveBeenCalled();
  });

  it('should capture errors in Sentry', async () => {
    vi.mocked(callAIWithSchema).mockRejectedValue(new Error('AI failed'));

    await expect(
      analyzeStrengthsWeaknesses({
        event: {
          data: {
            analysisId: 'analysis-123',
            quizData: mockQuizData,
            tier: 'premium',
          },
        },
        step: {
          run: vi.fn((name, fn) => fn()),
        },
      } as any)
    ).rejects.toThrow('AI failed');

    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
```

---

## Testing tRPC Endpoints

### Test tRPC Procedures

```typescript
import { describe, it, expect, vi } from 'vitest';
import { appRouter } from '@/src/server/routers/_app';
import { prisma } from '@/lib/prisma';

describe('Analysis Router', () => {
  const caller = appRouter.createCaller({
    user: { userId: 'test-user-123' },
    prisma,
  } as any);

  describe('getQuizAnalysis', () => {
    it('should return analysis for premium user', async () => {
      // Mock DB response
      vi.mocked(prisma.quizAttempt.findUnique).mockResolvedValue({
        id: 'quiz-123',
        userId: 'test-user-123',
      } as any);

      vi.mocked(prisma.quizAnalysis.findUnique).mockResolvedValue({
        id: 'analysis-123',
        quizAttemptId: 'quiz-123',
        status: 'completed',
        strengths: ['S3 expertise'],
        weaknesses: ['VPC confusion'],
        categoryScores: { Storage: 85 },
      } as any);

      vi.mocked(prisma.lsUserSubscription.findFirst).mockResolvedValue({
        status: 'active',
        subscriptionPlan: { name: 'Premium' },
      } as any);

      const result = await caller.analysis.getQuizAnalysis({
        quizAttemptId: 'quiz-123',
      });

      expect(result.found).toBe(true);
      expect(result.strengths).toBeDefined();
      expect(result.isPremium).toBe(true);
    });

    it('should filter premium content for free users', async () => {
      vi.mocked(prisma.quizAttempt.findUnique).mockResolvedValue({
        id: 'quiz-123',
        userId: 'test-user-123',
      } as any);

      vi.mocked(prisma.quizAnalysis.findUnique).mockResolvedValue({
        id: 'analysis-123',
        status: 'completed',
        categoryScores: { Storage: 85 },
        strengths: ['S3 expertise'],
      } as any);

      vi.mocked(prisma.lsUserSubscription.findFirst).mockResolvedValue(null);

      const result = await caller.analysis.getQuizAnalysis({
        quizAttemptId: 'quiz-123',
      });

      expect(result.found).toBe(true);
      expect(result.categoryScores).toBeDefined();
      expect(result.strengths).toBeNull(); // Filtered for free user
      expect(result.isPremium).toBe(false);
    });

    it('should throw error for unauthorized access', async () => {
      vi.mocked(prisma.quizAttempt.findUnique).mockResolvedValue({
        id: 'quiz-123',
        userId: 'other-user',
      } as any);

      await expect(
        caller.analysis.getQuizAnalysis({
          quizAttemptId: 'quiz-123',
        })
      ).rejects.toThrow('Quiz attempt not found');
    });
  });
});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --run

      - name: Generate coverage
        run: npm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test:run
```

---

## Troubleshooting

### Tests Timeout

If tests are timing out:

```typescript
// Increase timeout for specific test
it('should complete long operation', async () => {
  // Test code
}, 10000); // 10 second timeout

// Or globally in vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
});
```

### Mock Not Working

Ensure mocks are defined in `tests/setup.ts` and imported before the actual module:

```typescript
// ✅ Correct
vi.mock('@/lib/prisma');
import { prisma } from '@/lib/prisma';

// ❌ Wrong
import { prisma } from '@/lib/prisma';
vi.mock('@/lib/prisma');
```

### TypeScript Errors

Ensure `@types/node` and `@testing-library/jest-dom` are installed:

```bash
npm install -D @types/node @testing-library/jest-dom
```

### Coverage Not Showing

Make sure coverage provider is configured:

```bash
npm install -D @vitest/coverage-v8
```

---

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good - tests behavior
it('should calculate average score', () => {
  const scores = [80, 85, 90];
  const avg = calculateAverage(scores);
  expect(avg).toBe(85);
});

// ❌ Bad - tests implementation details
it('should loop through array', () => {
  const spy = vi.spyOn(Array.prototype, 'reduce');
  calculateAverage([80, 85, 90]);
  expect(spy).toHaveBeenCalled();
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
it('should return empty array when no quizzes exist', () => {});

// ❌ Bad
it('works', () => {});
```

### 3. Keep Tests Independent

```typescript
// ✅ Good - each test is independent
describe('Calculator', () => {
  it('should add numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should subtract numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});

// ❌ Bad - tests depend on each other
let calculator;
it('should create calculator', () => {
  calculator = new Calculator();
});
it('should add', () => {
  calculator.add(2, 3); // Depends on previous test
});
```

### 4. Use beforeEach for Setup

```typescript
describe('Quiz Analysis', () => {
  let mockQuizData;

  beforeEach(() => {
    mockQuizData = {
      attempt: { id: 'quiz-123' },
      questions: [],
    };
  });

  it('should analyze quiz', () => {
    // Use mockQuizData
  });
});
```

### 5. Test Edge Cases

```typescript
describe('calculateScore', () => {
  it('should handle normal input', () => {});
  it('should handle empty array', () => {});
  it('should handle negative numbers', () => {});
  it('should handle very large numbers', () => {});
  it('should handle null/undefined', () => {});
});
```

---

## Coverage Goals

Aim for:
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 70%+ coverage
- **Critical Paths**: 100% coverage

View coverage report:

```bash
npm test:coverage
# Open coverage/index.html in browser
```

---

## Testing Checklist

Before marking a feature complete:

- [ ] Unit tests for all helpers
- [ ] Integration tests for main flows
- [ ] Edge case testing
- [ ] Error handling tests
- [ ] Mock external dependencies
- [ ] Tests pass in CI/CD
- [ ] Coverage meets goals
- [ ] Tests are documented

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test-Driven Development Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

**Happy Testing!** 🧪
