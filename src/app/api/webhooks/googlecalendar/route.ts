import { NextResponse } from "next/server";
import { getLoggedInUser, getAccessToken } from "@/lib/server/appwrite";
import { createGoogleCalendarClient, getOrCreateCalendar, handleApiError } from "@/lib/server/calendarUtilsforServer";

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