import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googlesheets';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Send to Google Sheets
    await appendToSheet(email);

    return NextResponse.json({ 
      success: true, 
      message: 'Subscribed successfully' 
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
