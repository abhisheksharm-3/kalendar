import { getSession } from 'next-auth/react';
import { getGoogleCalendarEvents } from '@/lib/helpers/googleCalendar';
import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) { 
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events: any = await getGoogleCalendarEvents(session.user.accessToken as string);
    console.log('Successfully fetched initial events');
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Failed to fetch initial events:', error);
    return NextResponse.json({ error: 'Failed to fetch initial events: ' + error.message }, { status: 500 });
  }
}
