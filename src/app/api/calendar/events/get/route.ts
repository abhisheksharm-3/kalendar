import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { createGoogleCalendarClient, getOrCreateCalendar, handleApiError } from '@/lib/server/calendarUtilsforServer';
import { Event } from "@/lib/types";
import { cookies } from "next/headers";
import { refreshAccessToken } from "@/lib/server/refreshTokens";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let accessToken = session.accessToken;
    let refreshToken = session.refreshToken;
    let calendar = await createGoogleCalendarClient(accessToken);
    let calendarId: string;
    let events: Event[];

    try {
      calendarId = await getOrCreateCalendar(calendar);
      events = await fetchAllEvents(calendar, calendarId);
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
        events = await fetchAllEvents(calendar, calendarId);
      } else {
        throw error; // Re-throw if it's not a token issue
      }
    }
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