import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"; // Adjust this import path as necessary

export async function POST(request: Request) {
  const { accessToken } = await request.json();

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // Check if "kalendar" exists
    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;
    console.log(calendars)
    let kalendarId = calendars?.find(cal => cal.summary === "Kalendar")?.id;

    if (!kalendarId) {
      const newCalendar = await calendar.calendars.insert({
        requestBody: {
          summary: "Kalendar",
          timeZone: "IST",
          description: "A calendar for all your events by Kalendar",
        }
      });
      kalendarId = newCalendar.data.id;
    }

    const response = await calendar.events.watch({
      calendarId: kalendarId!,
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