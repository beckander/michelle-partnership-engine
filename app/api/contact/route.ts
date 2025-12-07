import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Save contact submission
    const { error: contactError } = await supabase
      .from('contact_submissions')
      .insert([{
        name: body.name || '',
        email: body.email || '',
        company: body.company || '',
        message: body.message || '',
      }]);

    if (contactError) throw contactError;

    // Also create an inbound lead
    const { error: leadError } = await supabase
      .from('leads')
      .insert([{
        company_name: body.company || 'Unknown Company',
        contact_name: body.name || '',
        contact_email: body.email || '',
        website: '',
        category: 'other',
        source: 'inbound',
        status: 'new',
        socials: {},
        ai_pitch: '',
        notes: `Inbound inquiry: ${body.message || ''}`,
      }]);

    if (leadError) throw leadError;

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message! I\'ll get back to you within 48 hours.' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
