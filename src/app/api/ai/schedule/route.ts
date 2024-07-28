import { NextRequest, NextResponse } from 'next/server';
import { getAISchedule } from '@/lib/ai-services';

export async function POST(request: NextRequest) {
  try {
    const { events, userPreferences } = await request.json();
    const aiSchedule = await getAISchedule(events, userPreferences);
    return NextResponse.json(aiSchedule);
  } catch (error) {
    console.error('Error generating AI schedule:', error);
    return NextResponse.json({ error: 'Failed to generate AI schedule' }, { status: 500 });
  }
}