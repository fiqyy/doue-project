import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aro2026';
const AUTH_COOKIE_NAME = 'doue_admin_session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid password. Access to atelier admin restricted.' },
        { status: 401 }
      );
    }

    // Password matches aro2026
    const response = NextResponse.json({
      success: true,
      message: 'Atelier authentication verified',
      redirectUrl: '/admin'
    });

    // Set secure auth cookie
    response.cookies.set(AUTH_COOKIE_NAME, 'authenticated_aro2026', {
      httpOnly: false, // Accessible to client-side auth check
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = cookie?.value === 'authenticated_aro2026';

  return NextResponse.json({
    authenticated: isAuthenticated
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out of admin portal'
  });

  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
