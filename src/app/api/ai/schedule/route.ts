import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getAISchedule } from '@/lib/ai-services';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const RATE_LIMIT_CONFIG = {
  limit: 10,      // 10 requests
  windowMs: 60000, // per minute
};

/**
 * POST /api/ai/schedule
 * Generates an AI-optimized schedule based on user events and preferences.
 * Rate limited to 10 requests per minute.
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Apply rate limiting
    const identifier = session.user?.email ?? getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(`ai-schedule:${identifier}`, RATE_LIMIT_CONFIG);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    const { comments, events, userPreferences } = await request.json();
    const result = await getAISchedule(events, userPreferences, comments);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate AI schedule' }, { status: 500 });
  }
}