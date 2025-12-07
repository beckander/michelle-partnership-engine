import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('lead_id');
    
    if (!leadId) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 });
    }
    
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newEmail = {
      lead_id: body.lead_id,
      subject: body.subject || '',
      body: body.body || '',
      type: body.type || 'first_outreach',
      sent_at: null,
      opened: false,
      replied: false,
    };

    const { data, error } = await supabase
      .from('emails')
      .insert([newEmail])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ email: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating email:', error);
    return NextResponse.json({ error: 'Failed to create email' }, { status: 500 });
  }
}
