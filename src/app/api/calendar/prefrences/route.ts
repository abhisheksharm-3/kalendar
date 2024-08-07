// app/api/fetchUserPreferences/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mocking user preferences; replace with your logic to fetch from your database or another service
    const userPreferences = {
      preferredStartHour: 7,
      preferredEndHour: 11,
      preferredDays: ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday',  'Saturday', 'Sunday'],
    };

    return NextResponse.json(userPreferences);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 });
  }
}
