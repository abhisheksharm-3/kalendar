import { NextResponse } from 'next/server';
import { createSessionClient } from "@/lib/server/appwrite";

export async function GET() {
  try {
    const { account } = await createSessionClient();
    const session = await account.getSession('current');
    return NextResponse.json({ isLoggedIn: !!session });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false });
  }
}