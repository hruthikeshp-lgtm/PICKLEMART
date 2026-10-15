import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_SECRET || 'admin123';
    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative operation' }, { status: 401 });
    }

    const stats = getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
