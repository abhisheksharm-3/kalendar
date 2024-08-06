import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(request: Request) {
  
  const headers = request.headers;
  console.log("Webhook headers:", headers);
  await fetchUpdatedEvents();
  return new NextResponse(null, { status: 200 });
}

async function fetchUpdatedEvents() {
  const session = await getServerSession(authOptions);
  console.log(session)
  if (!session || !session.accessToken) {
    console.error("No valid session");
    return;
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;
    const kalendarId = calendars?.find((cal) => cal.summary === "Kalendar")?.id;

    if (!kalendarId) {
      console.error("Kalendar not found");
      return;
    }
    console.log("Calendars:", calendars);
console.log("Kalendar ID:", kalendarId);
console.log("i reached here")

    let allEvents: Event[] = [];
    let pageToken = null;

    do {
      const response: any = await calendar.events.list({
        calendarId: kalendarId,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 2500,
        pageToken: pageToken,
      });
      console.log("Calendar response:", response.data);
      allEvents = allEvents.concat(response.data.items || []);
      pageToken = response.data.nextPageToken || null;
    } while (pageToken);

    console.log("Updated events fetched successfully:", allEvents.length);

    if ((global as any).sendCalendarUpdate) {
      (global as any).sendCalendarUpdate();
    }
  } catch (error: any) {
    console.error("Error fetching updated events:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
  }
}
