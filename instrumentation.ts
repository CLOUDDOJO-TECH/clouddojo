import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');

    // Sync LemonSqueezy plans with the database on server startup
    const { syncPlans } = await import('./config/actions');
    syncPlans().catch((error) =>
      console.error('Failed to sync LemonSqueezy plans on startup:', error),
    );
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
