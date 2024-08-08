import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { createGoogleCalendarClient, getOrCreateCalendar, handleApiError } from '@/lib/server/calendarUtilsforServer';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Access token is missing or invalid for creating events.' }, { status: 401 });
    }

    const { summary, location, description, start, end } = await request.json();

    const calendar = await createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);

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