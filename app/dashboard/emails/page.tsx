'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  category: string;
  status: string;
  ai_pitch: string;
}

function EmailsContent() {
  const searchParams = useSearchParams();
  const preselectedLeadId = searchParams.get('lead');
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailType, setEmailType] = useState<'first' | 'followup1' | 'followup2'>('first');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (preselectedLeadId && leads.length > 0) {
      const lead = leads.find(l => l.id === preselectedLeadId);
      if (lead) setSelectedLead(lead);
    }
  }, [preselectedLeadId, leads]);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmailPrompt = () => {
    if (!selectedLead) return;

    let prompt = '';

    if (emailType === 'first') {
      prompt = `You are helping Michelle Choe, a UGC (user-generated content) lifestyle creator, write an outreach email.

About Michelle:
- YouTube: 36K subscribers
- Instagram: 10K followers  
- TikTok: 15K followers
- Aesthetic: soft, neutral, cozy luxury (Pottery Barn meets Korean minimalism)
- Past partners: Pottery Barn, YSL Beauty, Maybelline, Target, Jo Malone

TASK: Write a cold outreach email to ${selectedLead.company_name}${selectedLead.contact_name ? ` (contact: ${selectedLead.contact_name})` : ''}.

${selectedLead.ai_pitch ? `Use this pitch angle: "${selectedLead.ai_pitch}"` : `The brand is in the ${selectedLead.category} category.`}

Email requirements:
- Subject line that gets opened (intriguing but not clickbait)
- Warm, friendly opening that feels personal
- Brief intro of Michelle (1-2 sentences max)
- Specific content idea for this brand
- Clear but soft call-to-action
- Professional sign-off
- Total length: 150-200 words max

IMPORTANT: The tone should be warm, authentic, and confident - not salesy or desperate.

Return in this exact format:
SUBJECT: [subject line]

[email body]

Best,
Michelle`;
    } else if (emailType === 'followup1') {
      prompt = `You are helping Michelle Choe write a follow-up email to ${selectedLead.company_name}.

Context: Michelle sent an initial outreach email a few days ago with no response yet. This is follow-up #1.

Requirements:
- Keep it SHORT (under 100 words)
- Friendly and helpful, not pushy
- Add a small piece of new value (maybe reference recent content she made, or a new idea)
- Gentle nudge without guilt-tripping
- Leave room for them to respond

Return in this format:
SUBJECT: Re: Partnership with Michelle Choe

[email body]

Best,
Michelle`;
    } else {
      prompt = `You are helping Michelle Choe write a final follow-up email to ${selectedLead.company_name}.

Context: Michelle has sent one initial email and one follow-up with no response. This is the last follow-up.

Requirements:
- Very short (under 75 words)
- Gracefully give them an "out" while leaving door open
- No guilt or pressure
- Professional and kind
- Maybe mention she'll reach out in the future if timing is better

Return in this format:
SUBJECT: Re: Partnership with Michelle Choe

[email body]

Best,
Michelle`;
    }

    setGeneratedPrompt(prompt);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveEmailDraft = async () => {
    if (!selectedLead || !emailDraft) return;

    const subjectMatch = emailDraft.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Partnership Opportunity';
    const body = emailDraft.replace(/SUBJECT:\s*.+?\n/i, '').trim();

    try {
      await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: selectedLead.id,
          subject,
          body,
          type: emailType === 'first' ? 'first_outreach' : emailType,
        }),
      });
      alert('Email draft saved!');
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  if (loading) {
    return <div className="text-taupe-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-taupe-700 mb-2">Email Composer</h1>
        <p className="text-taupe-500">
          Generate personalized outreach emails for your leads.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-cream-100 rounded-2xl p-6">
          <h3 className="font-serif text-xl text-taupe-700 mb-4">Select Lead</h3>
          
          {leads.length === 0 ? (
            <p className="text-taupe-500 text-sm">
              No leads yet. <a href="/dashboard/find-leads" className="underline">Find some leads first!</a>
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {leads.filter(l => l.status !== 'dead' && l.status !== 'closed_won').map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedLead?.id === lead.id
                      ? 'bg-taupe-600 text-cream-50'
                      : 'bg-cream-50 text-taupe-700 hover:bg-cream-200'
                  }`}
                >
                  <p className="font-medium text-sm">{lead.company_name}</p>
                  {lead.contact_email && (
                    <p className={`text-xs ${selectedLead?.id === lead.id ? 'text-cream-200' : 'text-taupe-500'}`}>
                      {lead.contact_email}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedLead && (
            <div className="mt-6 pt-6 border-t border-cream-300">
              <h4 className="text-taupe-600 text-sm mb-3">Email Type</h4>
              <div className="space-y-2">
                {[
                  { key: 'first', label: 'First Outreach' },
                  { key: 'followup1', label: 'Follow-up #1 (Day 2-3)' },
                  { key: 'followup2', label: 'Follow-up #2 (Day 5-7)' },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setEmailType(type.key as 'first' | 'followup1' | 'followup2')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                      emailType === type.key
                        ? 'bg-taupe-600 text-cream-50'
                        : 'bg-cream-50 text-taupe-600 hover:bg-cream-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <button
                onClick={generateEmailPrompt}
                className="btn btn-primary w-full mt-4"
              >
                Generate Prompt
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream-100 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-taupe-700">ChatGPT Prompt</h3>
                <button
                  onClick={copyPrompt}
                  className="text-sm text-taupe-500 hover:text-taupe-700"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="bg-cream-50 rounded-xl p-4 max-h-48 overflow-y-auto">
                <pre className="text-taupe-600 text-xs whitespace-pre-wrap font-sans">
                  {generatedPrompt}
                </pre>
              </div>
            </motion.div>
          )}

          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream-50 border border-cream-300 rounded-2xl p-6"
            >
              <h3 className="font-medium text-taupe-700 mb-3">Paste Email Draft</h3>
              <p className="text-taupe-500 text-xs mb-3">
                After ChatGPT generates the email, paste it here to save.
              </p>
              <textarea
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                rows={8}
                placeholder="SUBJECT: Your subject line&#10;&#10;Email body here..."
                className="w-full px-4 py-3 rounded-xl bg-cream-100 border border-cream-200 text-taupe-700 placeholder:text-taupe-400 text-sm resize-none"
              />
              <button
                onClick={saveEmailDraft}
                disabled={!emailDraft}
                className="btn btn-primary w-full mt-4 disabled:opacity-50"
              >
                Save Draft
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmailsPage() {
  return (
    <Suspense fallback={<div className="text-taupe-500">Loading...</div>}>
      <EmailsContent />
    </Suspense>
  );
}
