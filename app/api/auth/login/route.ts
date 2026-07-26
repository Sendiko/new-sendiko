import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();

    if (!password || password.trim() !== expectedPassword) {
      return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Login successful' });

    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
