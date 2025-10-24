import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { cancelSub, getUserSubscriptions } from '@/config/actions';
import { z } from 'zod';

const cancelRequestSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = cancelRequestSchema.parse(body);

    // Get user's subscriptions to verify ownership
    const userSubscriptions = await getUserSubscriptions();
    const subscription = userSubscriptions.find(
      (sub) => sub.lemonSqueezyId === validatedData.subscriptionId
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found or you do not have permission to cancel it' },
        { status: 404 }
      );
    }

    // Check if subscription is already cancelled
    if (subscription.status === 'cancelled' || subscription.status === 'expired') {
      return NextResponse.json(
        { error: 'Subscription is already cancelled or expired' },
        { status: 400 }
      );
    }

    // Cancel the subscription
    const cancelledSubscription = await cancelSub(validatedData.subscriptionId);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription.lemonSqueezyId,
        status: cancelledSubscription.data?.data.attributes.status,
        endsAt: cancelledSubscription.data?.data.attributes.ends_at,
      },
      reason: validatedData.reason,
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to cancel subscription. Please try again.' },
      { status: 500 }
    );
  }
}