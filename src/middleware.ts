import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define your protected routes
const protectedRoutes = ['/kalendar', '/settings', '/profile'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the current path is a protected route or starts with a protected route
  const isProtectedPath = protectedRoutes.some(route => path === route || path.startsWith(`${route}/`));

  if (isProtectedPath) {
    const userSession = request.cookies.get('user-session');
    

    if (userSession) {
      // If a valid session exists, allow the request to proceed
      return NextResponse.next();
    } else {
      // If there's no valid session, redirect to login
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // For non-protected paths, allow the request to proceed
  return NextResponse.next();
}

// Update the matcher to include all your protected routes
export const config = {
  // matcher: ['/kalendar/:path*', '/settings/:path*', '/profile/:path*']
  matcher:['/temp']
}
