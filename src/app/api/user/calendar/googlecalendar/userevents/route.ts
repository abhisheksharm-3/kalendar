import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient, getLoggedInUser } from '@/lib/server/appwrite';
import { Databases } from 'node-appwrite';

export async function GET(req: NextRequest) {
    try {
        const user = await getLoggedInUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { account } = await createSessionClient();
        const databases = new Databases(account.client);

        // Fetch calendar events using Appwrite SDK
        const events = await fetchAppwriteCalendarEvents(databases, user.$id);

        console.log('Successfully fetched initial events');
        
        return NextResponse.json(events);
    } catch (error: any) {
        console.error('Failed to fetch initial events:', error);
        return NextResponse.json({ error: 'Failed to fetch initial events: ' + error.message }, { status: 500 });
    }
}

async function fetchAppwriteCalendarEvents(databases: Databases, userId: string) {
    // Implement this function to fetch calendar events from Appwrite
    // Example (adjust according to your database structure):
    
}