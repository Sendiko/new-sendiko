import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const envPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const expectedPassword = envPassword.replace(/^["']|["']$/g, '').trim();
    const inputPassword = (password || '').trim();

    console.log('[AUTH LOG] Attempted password:', inputPassword);
    console.log('[AUTH LOG] Expected password:', expectedPassword);

    if (inputPassword !== expectedPassword) {
      console.log('[AUTH LOG] Password mismatch!');
      return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 401 });
    }

    console.log('[AUTH LOG] Password correct! Setting admin_session cookie.');

    const response = NextResponse.json({ message: 'Login successful' });

    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('[AUTH LOG] Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
