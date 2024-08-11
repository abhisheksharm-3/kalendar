import { NextResponse } from 'next/server';
import { getAISchedule } from '@/lib/ai-services';
import { Event, UserPreferences } from '@/lib/types';
export const maxDuration = 5

export async function POST(request: Request) {
  try {
    const { date, comments, events, userPreferences } = await request.json();

    const result = await getAISchedule(events, userPreferences, comments);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in AI scheduling:', error);
    return NextResponse.json({ error: 'Failed to generate AI schedule' }, { status: 500 });
  }
}