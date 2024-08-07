import { NextResponse } from "next/server";
import { getLoggedInUser, getAccessToken } from "@/lib/server/appwrite";
import { handleApiError } from "../../(serverUtils)/calendarUtilsforServer";
import { google } from "googleapis";
let calendarCreationLock = false;
export async function POST(request: Request) {
  try {
    console.log("Webhook headers:", request.headers);
    await fetchUpdatedEvents();
    return NextResponse.json({ message: "Events updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
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
    const existingCalendar = calendarList.data.items?.find((cal: { summary: string; }) => cal.summary === "Kalendar");

    if (existingCalendar) {
      return existingCalendar.id!;
    }
    console.log("creating new calendar", existingCalendar);

    const newCalendar = await calendar.calendars.insert({
      requestBody: {
        summary: "Kalendar",
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

async function fetchUpdatedEvents() {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const accessToken = await getAccessToken(user.$id);
    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    const calendar = createGoogleCalendarClient(accessToken);
    const calendarId = await getOrCreateCalendar(calendar);
    const events = await fetchAllEvents(calendar, calendarId);

    console.log("Updated events fetched successfully:", events.length);
    triggerCalendarUpdate();
  } catch (error) {
    console.error("Error fetching updated events:", error);
    throw error;
  }
}

async function fetchAllEvents(calendar: any, calendarId: string) {
  let allEvents: any[] = [];
  let pageToken: string | null = null;

  do {
    try {
      const response: any = await calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 2500,
        pageToken: pageToken,
      });

      allEvents = allEvents.concat(response.data.items || []);
      pageToken = response.data.nextPageToken || null;
    } catch (error) {
      console.error("Error fetching events page:", error);
      throw error;
    }
  } while (pageToken);

  return allEvents;
}

function triggerCalendarUpdate() {
  if (typeof (global as any).sendCalendarUpdate === "function") {
    (global as any).sendCalendarUpdate();
  }
}
export const runtime = 'edge'