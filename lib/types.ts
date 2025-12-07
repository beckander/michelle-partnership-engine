export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'replied' 
  | 'negotiating' 
  | 'contract_sent' 
  | 'closed_won' 
  | 'dead';

export type LeadSource = 
  | 'ai-search' 
  | 'inbound' 
  | 'upload' 
  | 'competitor' 
  | 'manual';

export type LeadCategory = 
  | 'beauty' 
  | 'skincare' 
  | 'lifestyle' 
  | 'home' 
  | 'wellness' 
  | 'fashion' 
  | 'food' 
  | 'tech' 
  | 'other';

export interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  website: string;
  category: LeadCategory;
  source: LeadSource;
  status: LeadStatus;
  socials: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  ai_pitch: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: string;
  lead_id: string;
  subject: string;
  body: string;
  type: 'first_outreach' | 'followup1' | 'followup2' | 'negotiation' | 'contract';
  sent_at: string | null;
  opened: boolean;
  replied: boolean;
}

export interface BrandAsset {
  id: string;
  name: string;
  file_url: string;
  type: 'media_kit' | 'analytics' | 'examples' | 'moodboard';
  uploaded_at: string;
}

export interface ContactFormSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
}

export interface Database {
  leads: Lead[];
  emails: Email[];
  brand_assets: BrandAsset[];
  contact_submissions: ContactFormSubmission[];
}
