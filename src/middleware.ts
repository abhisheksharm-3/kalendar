import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLoggedInUser } from './lib/server/appwrite'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define the protected path
  const isProtectedPath = path === '/kalendar'

  if (isProtectedPath) {
    const user = await getLoggedInUser();
    
    if (user) {
      // If a valid session exists, allow the request to proceed
      return NextResponse.next();
    } else {
      // If there's no valid session, redirect to login
      return NextResponse.redirect(new URL('/user/auth', request.url));
    }
  }

  // For non-protected paths, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/newpage',
}
