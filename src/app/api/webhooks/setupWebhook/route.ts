import { NextResponse } from 'next/server';
import { createGoogleCalendarClient, getOrCreateCalendar } from '@/lib/server/calendarUtilsforServer';

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
    }

    const calendar = createGoogleCalendarClient(accessToken);
    const kalendarId = await getOrCreateCalendar(calendar);
    const webhookResponse = await setupWebhook(calendar, kalendarId);

    return NextResponse.json(webhookResponse);
  } catch (error) {
    console.error('Error setting up webhook:', error);
    return NextResponse.json({ error: 'Failed to set up webhook' }, { status: 500 });
  }
}

async function setupWebhook(calendar: any, calendarId: string) {
  const webhookEndpoint = `${process.env.WEBHOOK_CALLBACK}/api/webhooks/googlecalendar`;
  const response = await calendar.events.watch({
    calendarId: calendarId,
    requestBody: {
      id: `unique-channel-id-${Date.now()}`,
      type: 'web_hook',
      address: webhookEndpoint,
    },
  });

  return response.data;
}
export const runtime = 'edge'