import { NextRequest, NextResponse } from 'next/server';
import { account, ID } from '@/app/api/appwriteConfig';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    // Create the user account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
