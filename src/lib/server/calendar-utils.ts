import { google, calendar_v3 } from 'googleapis';

const CALENDAR_NAME = 'Kalendar';
const DEFAULT_TIMEZONE = 'Asia/Kolkata';

type GoogleCalendar = calendar_v3.Calendar;

/**
 * Creates a Google Calendar API client with the provided access token.
 */
export function createGoogleCalendarClient(accessToken: string): GoogleCalendar {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.calendar({ version: 'v3', auth });
}

/**
 * Gets the Kalendar calendar ID, creating it if it doesn't exist.
 */
export async function getOrCreateCalendar(calendar: GoogleCalendar): Promise<string> {
    const calendarList = await calendar.calendarList.list();
    const existingCalendar = calendarList.data.items?.find(
        (cal) => cal.summary === CALENDAR_NAME
    );

    if (existingCalendar?.id) {
        return existingCalendar.id;
    }

    const newCalendar = await calendar.calendars.insert({
        requestBody: {
            summary: CALENDAR_NAME,
            timeZone: DEFAULT_TIMEZONE,
            description: 'A calendar for all your events by Kalendar',
        },
    });

    if (!newCalendar.data.id) {
        throw new Error('Failed to create calendar');
    }

    return newCalendar.data.id;
}

/**
 * Formats an API error into a consistent response object.
 */
export function formatApiError(error: unknown): { error: string } {
    if (error instanceof Error) {
        return { error: error.message };
    }
    if (typeof error === 'object' && error !== null) {
        return { error: JSON.stringify(error) };
    }
    return { error: 'An unexpected error occurred' };
}
