import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"; // Adjust this import path as necessary

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { summary, location, description, start, end } = body;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    // Check if 'kalendar' exists, if not create it
    let kalendarId = 'kalendar';
    try {
      await calendar.calendars.get({ calendarId: kalendarId });
    } catch (error) {
      if ((error as any).code === 404) {
        const newCalendar = await calendar.calendars.insert({
          requestBody: {
            summary: "kalendar",
            timeZone: "UTC"
          }
        });
        kalendarId = newCalendar.data.id!;
      } else {
        throw error;
      }
    }

    const event = {
      summary,
      location,
      description,
      start,
      end,
    };

    const result = await calendar.events.insert({
      calendarId: kalendarId,
      requestBody: event,
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: 'Error creating event', error: (error as Error).message },
      { status: 500 }
    );
  }
}