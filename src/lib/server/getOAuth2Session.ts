"use server"

import { createSessionClient } from './appwrite';

export async function getOAuth2Session() {
  try {
    const { account } = await createSessionClient();
    const sessions = await account.listSessions();
    console.log(sessions);
    
    // Find the Google OAuth2 session
    const googleSession = sessions.sessions.find(session => session.provider === 'google');
    
    if (!googleSession) {
      throw new Error('No Google OAuth2 session found');
    }

    return googleSession;
  } catch (error) {
    console.error('Error fetching OAuth2 session:', error);
    return null;
  }
}