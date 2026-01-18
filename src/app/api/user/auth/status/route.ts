import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

/**
 * GET /api/user/auth/status
 * Returns the current authentication status.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
      isLoggedIn: !!session,
      hasValidToken: session?.error !== 'RefreshAccessTokenError',
    });
  } catch {
    return NextResponse.json({ isLoggedIn: false, hasValidToken: false });
  }
}