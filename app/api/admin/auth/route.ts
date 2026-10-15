import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPass = process.env.ADMIN_SECRET || 'admin123';

    if (password === adminPass) {
      return NextResponse.json({
        success: true,
        token: adminPass,
        message: 'Admin authenticated successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid administrator password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
