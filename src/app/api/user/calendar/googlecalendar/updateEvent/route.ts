// app/api/user/calendar/googlecalendar/updateEvent/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updatedEvent = await request.json();
    console.log(updatedEvent.summary)

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: 'v3', auth });
 // List all calendars
 const calendarList = await calendar.calendarList.list();
 const calendars = calendarList.data.items;
 
 if (!calendars) {
   return NextResponse.json({ message: 'No calendars found' }, { status: 404 });
 }

 // Find the calendar with the specified summary
 const targetCalendar = calendars.find(cal => cal.summary === 'Kalendar');

 if (!targetCalendar) {
   return NextResponse.json({ message: 'Calendar not found' }, { status: 404 });
 }

 // Use the calendarId of the found calendar
 const result = await calendar.events.update({
   calendarId: targetCalendar.id!,
      eventId: updatedEvent.id,
      requestBody: {
        summary: updatedEvent.summary,
        description: updatedEvent.description,
        start: updatedEvent.start,
        end: updatedEvent.end,
      },
    });
    console.log(result.data);
    

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { message: 'Error updating event', error: (error as Error).message },
      { status: 500 }
    );
  }
}