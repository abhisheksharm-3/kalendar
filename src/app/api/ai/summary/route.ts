import { NextRequest, NextResponse } from 'next/server';
import { getAISummary } from '@/lib/ai-services';

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json();
    const insights = await getAISummary(events);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating AI Summary:', error);
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}