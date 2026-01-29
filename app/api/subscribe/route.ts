import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Insert email into subscribers table
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ 
        email,
        subscribed_at: new Date().toISOString(),
        source: 'modal'
      }])
      .select()
      .single();

    if (error) {
      // If duplicate email, that's okay
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
