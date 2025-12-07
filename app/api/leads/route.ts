import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newLead = {
      company_name: body.company_name || '',
      contact_name: body.contact_name || '',
      contact_email: body.contact_email || '',
      website: body.website || '',
      category: body.category || 'other',
      source: body.source || 'manual',
      status: 'new',
      socials: body.socials || {},
      ai_pitch: body.ai_pitch || body.why_good_fit || '',
      notes: body.notes || body.suggested_collab || '',
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([newLead])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
