import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"; // Adjust this import path as necessary

// Define a constant for the calendar name
const CALENDAR_NAME = "Kalendar";

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

    // Find or create the custom calendar
    let customCalendarId: string | null = null;
    
    // List all calendars
    const calendarList = await calendar.calendarList.list();
    
    // Find the calendar with the specified name
    const customCalendar = calendarList.data.items?.find(cal => cal.summary === CALENDAR_NAME);

    if (customCalendar) {
      customCalendarId = customCalendar.id!;
    } else {
      // If the calendar doesn't exist, create it
      const newCalendar = await calendar.calendars.insert({
        requestBody: {
          summary: CALENDAR_NAME,
          timeZone: "IST",
          description: "A calendar for all your events by Kalendar",
        }
      });
      customCalendarId = newCalendar.data.id!;
    }

    const event = {
      summary,
      location,
      description,
      start,
      end,
    };

    const result = await calendar.events.insert({
      calendarId: customCalendarId,
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