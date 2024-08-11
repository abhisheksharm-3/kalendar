import { NextResponse } from 'next/server';
import { createGoogleCalendarClient, getOrCreateCalendar } from '@/lib/server/calendarUtilsforServer';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { refreshAccessToken } from '@/lib/server/refreshTokens';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // const { accessToken } = await request.json();

    // if (!accessToken) {
    //   return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
    // }
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    let accessToken = session.accessToken;
    let refreshToken = session.refreshToken;
    let calendar = await createGoogleCalendarClient(accessToken);
    let calendarId: string;

    try {
      calendarId = await getOrCreateCalendar(calendar);
    } catch (error: any) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        // Token is invalid, try to refresh
        const refreshedToken = await refreshAccessToken({ accessToken, refreshToken, expiresAt: session.expiresAt });
        
        if (!refreshedToken) {
          // Refresh token is also invalid, delete the session cookie
          cookies().delete('next-auth.session-token');
          return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
        }

        accessToken = refreshedToken.accessToken as string;
        calendar = await createGoogleCalendarClient(accessToken);
        calendarId = await getOrCreateCalendar(calendar);
      } else {
        throw error; // Re-throw if it's not a token issue
      }
    }
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