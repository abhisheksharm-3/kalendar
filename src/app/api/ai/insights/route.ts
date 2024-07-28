import { NextRequest, NextResponse } from 'next/server';
import { getAIInsights } from '@/lib/ai-services';

export async function POST(request: NextRequest) {
  try {
    const { events, userHistory } = await request.json();
    const insights = await getAIInsights(events, userHistory);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}