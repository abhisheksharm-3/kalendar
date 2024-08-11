import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { createGoogleCalendarClient, getOrCreateCalendar, handleApiError } from '@/lib/server/calendarUtilsforServer';
import { cookies } from 'next/headers';
import { refreshAccessToken } from '@/lib/server/refreshTokens';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Access token is missing or invalid for creating events.' }, { status: 401 });
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

    const { summary, location, description, start, end } = await request.json();

    const result = await calendar.events.insert({
      calendarId,
      requestBody: { summary, location, description, start, end },
    });

    return NextResponse.json(result.data);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}