import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import {
  createGoogleCalendarClient,
  getOrCreateCalendar,
  formatApiError,
} from '@/lib/server/calendar-utils';
import type { EventType } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/calendar/events/get
 * Fetches events from the user's Kalendar calendar.
 * 
 * Query params:
 * - timeMin: ISO date string for start of range (default: start of current month)
 * - timeMax: ISO date string for end of range (default: end of next month)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (session.error === 'RefreshAccessTokenError') {
      return NextResponse.json(
        { error: 'Session expired. Please sign in again.' },
        { status: 401 }
      );
    }

    // Parse date range from query params
    const { searchParams } = new URL(req.url);
    const now = new Date();
    const defaultTimeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const defaultTimeMax = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

    const timeMin = searchParams.get('timeMin') ?? defaultTimeMin;
    const timeMax = searchParams.get('timeMax') ?? defaultTimeMax;

    const calendar = createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);
    const events = await fetchEvents(calendar, calendarId, timeMin, timeMax);

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(formatApiError(error), { status: 500 });
  }
}

async function fetchEvents(
  calendar: ReturnType<typeof createGoogleCalendarClient>,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<EventType[]> {
  const allEvents: EventType[] = [];
  let pageToken: string | undefined;

  do {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
      pageToken,
    });

    if (response.data.items) {
      allEvents.push(...(response.data.items as EventType[]));
    }
    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);

  return allEvents;
}