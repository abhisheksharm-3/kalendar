import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import {
  createGoogleCalendarClient,
  getOrCreateCalendar,
  formatApiError,
} from '@/lib/server/calendar-utils';

/**
 * PUT /api/calendar/events/update
 * Updates an existing event in the user's Kalendar calendar.
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Access token not found' },
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
    const { id, summary, description, start, end, recurrence, reminders } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request: Event ID is required' },
        { status: 400 }
      );
    }

    const result = await calendar.events.update({
      calendarId,
      eventId: id,
      requestBody: {
        summary,
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