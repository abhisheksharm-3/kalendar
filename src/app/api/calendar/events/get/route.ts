import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { createGoogleCalendarClient, getOrCreateCalendar, handleApiError } from '@/lib/server/calendarUtilsforServer';
import { Event } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const calendar = createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);

    const events = await fetchAllEvents(calendar, calendarId);
    console.log(events)

    return NextResponse.json(events);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function fetchAllEvents(calendar: any, calendarId: string) {
  let allEvents: Event[] = [];
  let pageToken = null;

  do {
    const response: any = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 2500,
      pageToken,
    });

    allEvents = allEvents.concat(response.data.items);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return allEvents;
}
export const runtime = 'edge'