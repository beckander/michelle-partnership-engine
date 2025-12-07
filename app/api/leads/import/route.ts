import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leads: rawLeads } = body;

    if (!Array.isArray(rawLeads) || rawLeads.length === 0) {
      return NextResponse.json({ error: 'No leads provided' }, { status: 400 });
    }

    const formattedLeads = rawLeads.map((lead: any) => ({
      company_name: lead.company_name || '',
      contact_name: lead.contact_name || '',
      contact_email: lead.contact_email || '',
      website: lead.website || '',
      category: lead.category || 'other',
      source: 'ai-search',
      status: 'new',
      socials: {
        instagram: lead.socials?.instagram || '',
        tiktok: lead.socials?.tiktok || '',
        youtube: lead.socials?.youtube || '',
      },
      ai_pitch: lead.why_good_fit || '',
      notes: lead.suggested_collab || '',
    }));

    const { data, error } = await supabase
      .from('leads')
      .insert(formattedLeads)
      .select();

    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      count: data?.length || 0,
      leads: data 
    }, { status: 201 });
  } catch (error) {
    console.error('Error importing leads:', error);
    return NextResponse.json({ error: 'Failed to import leads' }, { status: 500 });
  }
}
