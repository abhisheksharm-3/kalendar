import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"; // Adjust this import path as necessary
import { google } from 'googleapis';
import { NextRequest } from "next/server";
import { Event } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // Fetch all calendars
    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;

    if (!calendars) {
      return new Response(JSON.stringify({ error: "No calendars found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch events from all calendars
    let allEvents: Event[] = [];
    for (const cal of calendars) {
      let pageToken = null;

      do {
        const response: any = await calendar.events.list({
          calendarId: cal.id ?? "primary",
          timeMin: (new Date()).toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          maxResults: 2500,
          pageToken: pageToken,
        });

        allEvents = allEvents.concat(response.data.items);
        pageToken = response.data.nextPageToken;
      } while (pageToken);
    }

    return new Response(JSON.stringify(allEvents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
