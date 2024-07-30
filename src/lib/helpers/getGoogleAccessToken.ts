import { getOAuth2Session } from '../server/getOAuth2Session';

export async function getGoogleAccessToken() {
  try {
    const session = await getOAuth2Session();
    if (!session) {
      throw new Error('No Google OAuth2 session found');
    }
    return session.providerAccessToken;
  } catch (error) {
    console.error('Error getting Google access token:', error);
    return null;
  }
}