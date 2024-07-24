import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { account } from './app/api/appwriteConfig'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define the protected path
  const isProtectedPath = path === '/kalendar'

  if (isProtectedPath) {
    try {
      // Try to get the current session
      await account.getSession('current');
      
      // If successful, allow the request to proceed
      return NextResponse.next()
    } catch (error) {
      // If there's an error (no valid session), redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // For non-protected paths, allow the request to proceed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/newpage',
}