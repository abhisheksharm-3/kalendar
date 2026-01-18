import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getAISummary } from '@/lib/ai-services';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';

const RATE_LIMIT_CONFIG = {
  limit: 30,      // 30 requests
  windowMs: 60000, // per minute
};

/**
 * POST /api/ai/summary
 * Generates AI insights for calendar events.
 * Rate limited to 30 requests per minute.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const identifier = session.user?.email ?? getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(`ai-summary:${identifier}`, RATE_LIMIT_CONFIG);

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

    const { events } = await request.json();
    const insights = await getAISummary(events);

    return NextResponse.json(insights, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}