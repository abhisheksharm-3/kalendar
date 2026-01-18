import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_ROUTES = ['/kalendar', '/settings', '/profile', '/user'];

/**
 * Proxy to protect routes requiring authentication.
 * Uses NextAuth JWT token for session validation.
 */
export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedPath = PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/kalendar/:path*', '/settings/:path*', '/profile/:path*', '/user/:path*'],
};
