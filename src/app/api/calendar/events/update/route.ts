import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { createGoogleCalendarClient, getOrCreateCalendar, handleApiError } from '@/app/api/(serverUtils)/calendarUtilsforServer';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized: Access token not found' }, { status: 401 });
    }

    const { id, summary, description, start, end } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Bad Request: Event ID is required to update event' }, { status: 400 });
    }

    const calendar = await createGoogleCalendarClient(session.accessToken);
    const calendarId = await getOrCreateCalendar(calendar);

    const result = await calendar.events.update({
      calendarId,
      eventId: id,
      requestBody: { summary, description, start, end },
    });

    return NextResponse.json(result.data);
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}