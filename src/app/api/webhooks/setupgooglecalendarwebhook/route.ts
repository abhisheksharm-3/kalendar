import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"; // Adjust this import path as necessary

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // Check if "kalendar" exists
    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;
    let kalendarId = calendars?.find(cal => cal.summary === "kalendar")?.id;

    if (!kalendarId) {
      return NextResponse.json({ error: 'Kalendar not found' }, { status: 404 });
    }

    const response = await calendar.events.watch({
      calendarId: kalendarId,
      requestBody: {
        id: `unique-channel-id-${Date.now()}`, // Generate a unique ID
        type: 'web_hook',
        address: `${process.env.WEBHOOK_CALLBACK}/api/webhooks/googlecalendar`, // Your webhook endpoint
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error setting up webhook:', error);
    return NextResponse.json({ error: 'Failed to set up webhook' }, { status: 500 });
  }
}