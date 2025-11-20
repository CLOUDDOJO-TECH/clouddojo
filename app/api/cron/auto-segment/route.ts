/**
 * Auto-Segmentation Cron Job API Route
 *
 * This endpoint should be called daily by a cron service (Vercel Cron, AWS EventBridge, etc.)
 * to automatically segment all users.
 *
 * Security: Protected by cron secret token
 *
 * Example Vercel Cron config (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/auto-segment",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { runAutoSegmentation } from '@/services/auto-segmentation.service';

export const maxDuration = 300; // 5 minutes max execution time

export async function GET(request: NextRequest) {
  try {
    // Verify cron authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // In production, require CRON_SECRET for security
    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret) {
        return NextResponse.json(
          { error: 'CRON_SECRET not configured' },
          { status: 500 }
        );
      }

      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Run auto-segmentation
    console.log('[Auto-Segment] Starting auto-segmentation...');
    const result = await runAutoSegmentation();
    console.log('[Auto-Segment] Completed:', result);

    return NextResponse.json({
      success: true,
      message: 'Auto-segmentation completed successfully',
      result,
    });
  } catch (error) {
    console.error('[Auto-Segment] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger (requires admin authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // For now, this is unprotected - should add proper auth

    console.log('[Auto-Segment] Manual trigger initiated');
    const result = await runAutoSegmentation();
    console.log('[Auto-Segment] Manual trigger completed:', result);

    return NextResponse.json({
      success: true,
      message: 'Auto-segmentation triggered manually',
      result,
    });
  } catch (error) {
    console.error('[Auto-Segment] Manual trigger error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
