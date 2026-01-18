import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import {
  createGoogleCalendarClient,
  getOrCreateCalendar,
} from '@/lib/server/calendar-utils';

/**
 * POST /api/webhooks/setupWebhook
 * Sets up a webhook to receive Google Calendar event updates.
 */
export async function POST() {
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

    const calendar = createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);
    const webhookResponse = await setupWebhook(calendar, calendarId);

    return NextResponse.json(webhookResponse);
  } catch {
    return NextResponse.json({ error: 'Failed to set up webhook' }, { status: 500 });
  }
}

async function setupWebhook(
  calendar: ReturnType<typeof createGoogleCalendarClient>,
  calendarId: string
) {
  const webhookEndpoint = `${process.env.WEBHOOK_CALLBACK}/api/webhooks/googlecalendar`;
  const response = await calendar.events.watch({
    calendarId,
    requestBody: {
      id: `webhook-${Date.now()}`,
      type: 'web_hook',
      address: webhookEndpoint,
    },
  });

  return response.data;
}