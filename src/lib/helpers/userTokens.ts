// src/utils/auth.ts

import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function getValidAccessToken() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.refreshToken) {
    throw new Error("No valid session or refresh token");
  }

  const expiresAt = session.expiresAt as number;

  if (Date.now() < expiresAt * 1000) {
    return session.accessToken;
  }

  // Token has expired, let's refresh it
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL
  );

  oauth2Client.setCredentials({
    refresh_token: session.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  const newAccessToken = credentials.access_token;

  // Here you might want to update the session with the new access token
  // This depends on your specific implementation and needs

  return newAccessToken;
}