import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Use Supabase Auth to verify credentials
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }

  if (data.user) {
    const user = { 
      id: data.user.id,
      email: data.user.email, 
      name: data.user.user_metadata?.full_name || 'Risk Officer' 
    };
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ user, expires });

    (await cookies()).set('session', session, { 
      expires, 
      httpOnly: true,
      secure: true,      // Required for SameSite=None
      sameSite: 'none',  // Required for cross-origin iframe
      path: '/'
    });

    return NextResponse.json({ 
      success: true, 
      user,
      supabaseSession: data.session 
    });
  }

  return NextResponse.json({ success: false, message: 'Credenciais inválidas' }, { status: 401 });
}
