import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).set('session', '', { 
    expires: new Date(0), 
    path: '/',
    secure: true,
    sameSite: 'none'
  });
  return NextResponse.json({ success: true });
}
