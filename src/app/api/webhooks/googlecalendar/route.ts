import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import {
  createGoogleCalendarClient,
  getOrCreateCalendar,
  formatApiError,
} from '@/lib/server/calendar-utils';
import type { EventType } from '@/lib/types';

/**
 * POST /api/webhooks/googlecalendar
 * Receives webhook notifications from Google Calendar.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const calendar = createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);
    await fetchUpdatedEvents(calendar, calendarId);

    return NextResponse.json({ message: 'Events updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(formatApiError(error), { status: 500 });
  }
}

async function fetchUpdatedEvents(
  calendar: ReturnType<typeof createGoogleCalendarClient>,
  calendarId: string
): Promise<EventType[]> {
  const allEvents: EventType[] = [];
  let pageToken: string | undefined;

  do {
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
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