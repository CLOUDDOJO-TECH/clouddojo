import { NextRequest, NextResponse } from 'next/server';
import { processWebhookEvent, storeWebhookEvent } from '@/config/actions';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Get the raw body
    const body = await req.text();
    const signature = req.headers.get('x-signature');

    if (!signature) {
      console.error('Missing signature header');
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing LEMONSQUEEZY_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Compute the expected signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');

    // Extract the signature from the header (remove the 'sha256=' prefix if present)
    const providedSignature = signature.startsWith('sha256=') 
      ? signature.slice(7) 
      : signature;

    // Compare signatures using a timing-safe comparison
    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(providedSignature)
    )) {
      console.error('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const eventName = payload.meta?.event_name;

    if (!eventName) {
      console.error('Missing event name in webhook payload');
      return NextResponse.json(
        { error: 'Missing event name' },
        { status: 400 }
      );
    }

    console.log(`Received LemonSqueezy webhook: ${eventName}`);

    // Store the webhook event in the database
    const webhookEvent = await storeWebhookEvent(eventName, payload);

    // Process the webhook event
    await processWebhookEvent(webhookEvent);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing LemonSqueezy webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}