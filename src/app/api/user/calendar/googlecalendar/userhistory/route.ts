// app/api/fetchUserHistory/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\/n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = 'primary'; // or specify a different calendar ID if needed
    const timeMin = new Date();
    timeMin.setMonth(timeMin.getMonth() - 1); // Fetch events from the past month
    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin.toISOString(),
      timeMax: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json(response.data.items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user history' }, { status: 500 });
  }
}
