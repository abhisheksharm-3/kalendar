"use server"
import { google } from 'googleapis';

const CALENDAR_NAME = "Kalendar";
let calendarCreationLock = false;

export async function createGoogleCalendarClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth });
}

export async function getOrCreateCalendar(calendar: any): Promise<string> {
  // Wait until the lock is released if it is currently locked
  while (calendarCreationLock) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Lock the critical section
  calendarCreationLock = true;

  try {
    const calendarList = await calendar.calendarList.list();
    const existingCalendar = calendarList.data.items?.find((cal: { summary: string; }) => cal.summary === CALENDAR_NAME);

    if (existingCalendar) {
      return existingCalendar.id!;
    }
    console.log("creating new calendar", existingCalendar);

    const newCalendar = await calendar.calendars.insert({
      requestBody: {
        summary: CALENDAR_NAME,
        timeZone: "Asia/Kolkata",
        description: "A calendar for all your events by Kalendar",
      }
    });

    return newCalendar.data.id!;
  } finally {
    // Release the lock
    calendarCreationLock = false;
  }
}

export async function handleApiError(error: unknown) {
  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return { error: message };
}
