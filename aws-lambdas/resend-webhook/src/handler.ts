/**
 * Resend Webhook Handler Lambda
 *
 * Receives webhooks from Resend for:
 * - Email delivered
 * - Email opened
 * - Email clicked
 * - Email bounced
 * - Email complained (spam)
 */

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPrismaClient } from '../../shared/utils/prisma-client';

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
  };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Resend webhook received');

  try {
    // Verify webhook signature (recommended)
    const signature = event.headers['svix-signature'] || event.headers['Svix-Signature'];
    if (!verifySignature(signature, event.body || '')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    const webhookEvent: ResendWebhookEvent = JSON.parse(event.body || '{}');
    const prisma = await getPrismaClient();

    // Process based on event type
    switch (webhookEvent.type) {
      case 'email.delivered':
        await handleDelivered(prisma, webhookEvent);
        break;

      case 'email.opened':
        await handleOpened(prisma, webhookEvent);
        break;

      case 'email.clicked':
        await handleClicked(prisma, webhookEvent);
        break;

      case 'email.bounced':
        await handleBounced(prisma, webhookEvent);
        break;

      case 'email.complained':
        await handleComplained(prisma, webhookEvent);
        break;

      default:
        console.log(`Unknown event type: ${webhookEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
}

async function handleDelivered(prisma: any, event: ResendWebhookEvent) {
  console.log(`Email delivered: ${event.data.email_id}`);

  await prisma.emailLog.updateMany({
    where: { resendId: event.data.email_id },
    data: {
      status: 'DELIVERED',
      deliveredAt: new Date(event.created_at),
    },
  });
}

async function handleOpened(prisma: any, event: ResendWebhookEvent) {
  console.log(`Email opened: ${event.data.email_id}`);

  // Only update if not already opened (track first open)
  await prisma.emailLog.updateMany({
    where: {
      resendId: event.data.email_id,
      openedAt: null,
    },
    data: {
      status: 'OPENED',
      openedAt: new Date(event.created_at),
    },
  });
}

async function handleClicked(prisma: any, event: ResendWebhookEvent) {
  console.log(`Email clicked: ${event.data.email_id}`);

  await prisma.emailLog.updateMany({
    where: {
      resendId: event.data.email_id,
      clickedAt: null,
    },
    data: {
      status: 'CLICKED',
      clickedAt: new Date(event.created_at),
    },
  });
}

async function handleBounced(prisma: any, event: ResendWebhookEvent) {
  console.log(`Email bounced: ${event.data.email_id}`);

  await prisma.emailLog.updateMany({
    where: { resendId: event.data.email_id },
    data: {
      status: 'BOUNCED',
      bouncedAt: new Date(event.created_at),
    },
  });

  // TODO: Mark user email as invalid, stop sending
}

async function handleComplained(prisma: any, event: ResendWebhookEvent) {
  console.log(`Email complained (spam): ${event.data.email_id}`);

  const emailLog = await prisma.emailLog.findFirst({
    where: { resendId: event.data.email_id },
  });

  if (emailLog && emailLog.userId) {
    // Automatically unsubscribe user
    await prisma.emailPreferences.update({
      where: { userId: emailLog.userId },
      data: {
        unsubscribedAll: true,
        unsubscribedAt: new Date(),
      },
    });

    console.log(`User ${emailLog.userId} automatically unsubscribed due to complaint`);
  }
}

function verifySignature(signature: string | undefined, body: string): boolean {
  // TODO: Implement Svix signature verification
  // See: https://docs.resend.com/api-reference/webhooks/verify-signature

  if (!signature) {
    console.warn('No signature provided');
  }

  return true; // Temporarily allow all
}
