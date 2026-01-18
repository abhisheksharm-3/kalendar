import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import {
  createGoogleCalendarClient,
  getOrCreateCalendar,
  formatApiError,
} from '@/lib/server/calendar-utils';

/**
 * POST /api/calendar/events/create
 * Creates a new event in the user's Kalendar calendar.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Access token is missing or invalid.' },
        { status: 401 }
      );
    }

    if (session.error === 'RefreshAccessTokenError') {
      return NextResponse.json(
        { error: 'Session expired. Please sign in again.' },
        { status: 401 }
      );
    }

    const calendar = createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);
    const { summary, location, description, start, end, recurrence, reminders } =
      await request.json();

    const result = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        location,
        description,
        start,
        end,
        recurrence,
        reminders,
      },
    });

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(formatApiError(error), { status: 500 });
  }
}