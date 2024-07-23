import { NextRequest, NextResponse } from 'next/server';
import { account } from '@/app/api/appwriteConfig';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Create a session for the user
    const session = await account.createEmailPasswordSession(email, password);

    // Optionally, fetch user details if needed
    const user = await account.get();

    return NextResponse.json({ user, session });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 });
  }
}
