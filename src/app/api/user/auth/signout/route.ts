import { NextResponse } from 'next/server';

/**
 * GET /api/user/auth/signout
 * Signs out the user by redirecting to NextAuth signout.
 */
export async function GET() {
  return NextResponse.redirect('/api/auth/signout');
}