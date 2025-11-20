/**
 * Sentry Configuration
 *
 * Configure Sentry for error tracking in the AI analysis system
 */

import * as Sentry from "@sentry/nextjs";

// Only initialize Sentry in production
if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions

    // Error Sampling
    sampleRate: 1.0, // 100% of errors

    // Environment
    environment: process.env.NODE_ENV,

    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',

    // Ignore common errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],

    // Enhanced context
    beforeSend(event, hint) {
      // Add custom context for AI analysis errors
      if (event.tags?.function?.startsWith('analyze-')) {
        event.fingerprint = [
          event.tags.function,
          event.tags.analysisId || 'unknown',
        ];
      }

      return event;
    },

    // Performance tracing for Inngest functions
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
    ],
  });
}

/**
 * Helper function to wrap Inngest functions with Sentry
 */
export function withSentry<T extends (...args: any[]) => any>(
  fn: T,
  functionName: string
): T {
  return (async (...args: Parameters<T>) => {
    const transaction = Sentry.startTransaction({
      op: 'function',
      name: functionName,
    });

    try {
      const result = await fn(...args);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      Sentry.captureException(error, {
        tags: {
          function: functionName,
        },
      });
      throw error;
    } finally {
      transaction.finish();
    }
  }) as T;
}
