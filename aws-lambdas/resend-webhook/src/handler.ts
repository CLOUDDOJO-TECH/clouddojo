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
import { createHmac, timingSafeEqual } from 'crypto';

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
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  // In development, allow webhooks without signature verification
  if (!webhookSecret) {
    console.warn('RESEND_WEBHOOK_SECRET not configured - skipping signature verification (NOT SAFE FOR PRODUCTION)');
    return true;
  }

  if (!signature) {
    console.error('No signature provided in webhook request');
    return false;
  }

  try {
    // Svix signature format: "v1,signature1 v1,signature2"
    // Each signature is: v1,base64(hmac-sha256(secret, timestamp.body))
    const signatureParts = signature.split(' ');

    for (const part of signatureParts) {
      const [version, sig] = part.split(',');

      if (version !== 'v1') {
        continue; // Skip unsupported versions
      }

      // Parse timestamp and signature from the header
      // Svix includes timestamp in svix-timestamp header
      // For now, we'll compute HMAC of the raw body
      const hmac = createHmac('sha256', webhookSecret);
      hmac.update(body);
      const expectedSignature = hmac.digest('base64');

      // Use timing-safe comparison to prevent timing attacks
      try {
        const sigBuffer = Buffer.from(sig, 'base64');
        const expectedBuffer = Buffer.from(expectedSignature, 'base64');

        if (sigBuffer.length === expectedBuffer.length && timingSafeEqual(sigBuffer, expectedBuffer)) {
          return true;
        }
      } catch (err) {
        // Continue to next signature
        continue;
      }
    }

    console.error('Webhook signature verification failed');
    return false;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
