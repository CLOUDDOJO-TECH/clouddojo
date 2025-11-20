/**
 * Vitest Test Setup
 *
 * Global test configuration and mocks
 */

import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
process.env.GEMINI_API_KEY = 'test-api-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.DIRECT_DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock Prisma Client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    quizAnalysis: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    dashboardAnalysis: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    topicMastery: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    quizAttempt: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    lsUserSubscription: {
      findFirst: vi.fn(),
    },
  },
}));

// Mock Clerk Auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => ({
    userId: 'test-user-123',
  })),
}));

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  metrics: {
    increment: vi.fn(),
    distribution: vi.fn(),
  },
}));

// Mock Inngest Client
vi.mock('@/inngest/client', () => ({
  inngest: {
    send: vi.fn(),
    createFunction: vi.fn((config, trigger, handler) => handler),
  },
}));

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
