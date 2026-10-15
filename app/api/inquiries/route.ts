import { NextResponse } from 'next/server';
import { getInquiries, createInquiry } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPass = process.env.ADMIN_SECRET || 'admin123';
    if (!authHeader || authHeader !== `Bearer ${adminPass}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized administrative operation' }, { status: 401 });
    }

    const inquiries = getInquiries();
    return NextResponse.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and message are required' },
        { status: 400 }
      );
    }

    const newInquiry = createInquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      message: message.trim(),
    });

    return NextResponse.json(
      { success: true, message: 'Thank you for reaching out to Pickle Mart! We will contact you soon.', inquiry: newInquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
