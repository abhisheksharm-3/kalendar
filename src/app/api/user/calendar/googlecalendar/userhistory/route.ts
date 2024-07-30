import { NextResponse } from 'next/server';
import { createSessionClient, getLoggedInUser } from '@/lib/server/appwrite';
import { Databases } from 'node-appwrite';

export async function GET() {
    try {
        const user = await getLoggedInUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log(user);
        

        const { account } = await createSessionClient();
        const databases = new Databases(account.client);

        const timeMin = new Date();
        timeMin.setMonth(timeMin.getMonth() - 1); // Fetch events from the past month

        const userHistory = await fetchUserHistoryFromAppwrite(databases, user.$id, timeMin.toISOString(), new Date().toISOString());

        return NextResponse.json(userHistory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user history' }, { status: 500 });
    }
}

async function fetchUserHistoryFromAppwrite(databases: Databases, userId: string, timeMin: string, timeMax: string) {
    // Implement this function to fetch user history from Appwrite database
    // Example (adjust according to your database structure):
}