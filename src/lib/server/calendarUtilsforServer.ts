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
    console.log('calendarList.data:', calendarList.data);
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
    console.log('newCalendar.data:', newCalendar.data);
    return newCalendar.data.id!;
  } catch (error) {
    console.error('Error in getOrCreateCalendar:', error);
    throw error;
  } finally {
    // Release the lock
    calendarCreationLock = false;
  }
}

export async function handleApiError(error: unknown) {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return { error: error.message };
  } else if (typeof error === 'object' && error !== null) {
    return { error: JSON.stringify(error) };
  } else {
    return { error: 'An unexpected error occurred' };
  }
}
