'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ParsedLead {
  company_name: string;
  website: string;
  contact_email: string;
  category: string;
  socials: {
    instagram?: string;
    tiktok?: string;
  };
  why_good_fit: string;
  suggested_collab: string;
}

export default function ImportLeadsPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([]);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [importCount, setImportCount] = useState(0);

  const parseInput = () => {
    setParseError('');
    setParsedLeads([]);

    try {
      let jsonString = jsonInput.trim();
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const arrayMatch = jsonString.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        jsonString = arrayMatch[0];
      }

      const data = JSON.parse(jsonString);
      
      if (!Array.isArray(data)) {
        throw new Error('Expected an array of leads');
      }

      const validated = data.map((lead: any, index: number) => {
        if (!lead.company_name) {
          throw new Error(`Lead ${index + 1} is missing company_name`);
        }
        return {
          company_name: lead.company_name || '',
          website: lead.website || '',
          contact_email: lead.contact_email || '',
          category: lead.category || 'other',
          socials: {
            instagram: lead.socials?.instagram || '',
            tiktok: lead.socials?.tiktok || '',
          },
          why_good_fit: lead.why_good_fit || '',
          suggested_collab: lead.suggested_collab || '',
        };
      });

      setParsedLeads(validated);
    } catch (error: any) {
      setParseError(error.message || 'Failed to parse JSON. Make sure it\'s valid JSON format.');
    }
  };

  const importLeads = async () => {
    setImporting(true);
    
    try {
      const res = await fetch('/api/leads/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: parsedLeads }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setImported(true);
        setImportCount(data.count || parsedLeads.length);
      } else {
        setParseError(data.error || 'Failed to import leads');
      }
    } catch (error) {
      setParseError('Network error. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const resetForm = () => {
    setJsonInput('');
    setParsedLeads([]);
    setParseError('');
    setImported(false);
    setImportCount(0);
  };

  if (imported) {
    return (
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-[#E8E0D4] p-12 text-center bg-[#FDFBF7]"
        >
          <div className="w-16 h-16 mx-auto mb-6 border border-[#C9B99A] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#C9B99A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-[#3D3225] mb-2 font-light">
            {importCount} Leads Imported
          </h2>
          <p className="text-[#6B5D4D] mb-8 text-sm">
            Your leads are ready in the pipeline.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-6 py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors"
            >
              View Pipeline
            </Link>
            <button 
              onClick={resetForm} 
              className="px-6 py-3 bg-[#F5F1EB] text-[#6B5D4D] text-xs tracking-[0.15em] uppercase hover:bg-[#E8E0D4] transition-colors"
            >
              Import More
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-[#9A8B78] tracking-[0.2em] uppercase text-xs mb-2">Import</p>
        <h1 className="font-serif text-2xl text-[#3D3225] font-light">Import Leads</h1>
        <p className="text-[#6B5D4D] text-sm mt-2">
          Paste the JSON response from ChatGPT to add leads to your pipeline.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-3 ${!parsedLeads.length ? 'text-[#3D3225]' : 'text-[#B8A888]'}`}>
          <span className={`w-8 h-8 flex items-center justify-center text-xs ${!parsedLeads.length ? 'bg-[#3D3225] text-[#FDFBF7]' : 'bg-[#E8E0D4] text-[#6B5D4D]'}`}>1</span>
          <span className="text-xs tracking-[0.1em] uppercase">Paste JSON</span>
        </div>
        <div className="flex-1 h-[1px] bg-[#E8E0D4]"></div>
        <div className={`flex items-center gap-3 ${parsedLeads.length && !imported ? 'text-[#3D3225]' : 'text-[#B8A888]'}`}>
          <span className={`w-8 h-8 flex items-center justify-center text-xs ${parsedLeads.length && !imported ? 'bg-[#3D3225] text-[#FDFBF7]' : 'bg-[#E8E0D4] text-[#6B5D4D]'}`}>2</span>
          <span className="text-xs tracking-[0.1em] uppercase">Review & Import</span>
        </div>
      </div>

      {!parsedLeads.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="border border-[#E8E0D4] p-6 mb-4 bg-[#FDFBF7]">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">
              Paste ChatGPT's JSON Response
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              placeholder={`Paste the JSON array from ChatGPT here...

Example format:
[
  {
    "company_name": "Brand Name",
    "website": "https://example.com",
    "contact_email": "partnerships@example.com",
    "category": "skincare",
    "socials": { "instagram": "@brand" },
    "why_good_fit": "Great aesthetic match",
    "suggested_collab": "Product review"
  }
]`}
              className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] placeholder:text-[#B8A888] font-mono text-sm resize-none focus:outline-none focus:border-[#C9B99A] transition-colors"
            />
          </div>

          {parseError && (
            <div className="border border-red-200 bg-red-50 p-4 mb-4">
              <p className="text-red-600 text-sm">{parseError}</p>
            </div>
          )}

          <button
            onClick={parseInput}
            disabled={!jsonInput.trim()}
            className="w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Parse & Preview Leads
          </button>

          <div className="mt-6 p-4 bg-[#F5F1EB] border border-[#E8E0D4]">
            <p className="text-[#6B5D4D] text-sm">
              Don't have leads yet?{' '}
              <Link href="/dashboard/find-leads" className="text-[#3D3225] border-b border-[#C9B99A]">
                Generate a prompt first
              </Link>
            </p>
          </div>
        </motion.div>
      )}

      {parsedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="border border-[#E8E0D4] p-6 mb-4 bg-[#FDFBF7]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[#3D3225] text-xs tracking-[0.15em] uppercase">
                Preview: {parsedLeads.length} Leads
              </h3>
              <button
                onClick={resetForm}
                className="text-[#9A8B78] hover:text-[#3D3225] text-xs tracking-wider uppercase transition-colors"
              >
                ← Start Over
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedLeads.map((lead, index) => (
                <div
                  key={index}
                  className="bg-[#F5F1EB] p-4 flex justify-between items-start border border-[#E8E0D4]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-[#3D3225] text-sm">{lead.company_name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-[#E8E0D4] text-[#6B5D4D] tracking-wider uppercase">
                        {lead.category}
                      </span>
                    </div>
                    {lead.website && (
                      <p className="text-[#9A8B78] text-xs truncate">{lead.website}</p>
                    )}
                    {lead.contact_email && (
                      <p className="text-[#9A8B78] text-xs">{lead.contact_email}</p>
                    )}
                    {lead.why_good_fit && (
                      <p className="text-[#6B5D4D] text-xs mt-2 line-clamp-2">{lead.why_good_fit}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {parseError && (
            <div className="border border-red-200 bg-red-50 p-4 mb-4">
              <p className="text-red-600 text-sm">{parseError}</p>
            </div>
          )}

          <button
            onClick={importLeads}
            disabled={importing}
            className="w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : `Import ${parsedLeads.length} Leads`}
          </button>
        </motion.div>
      )}
    </div>
  );
}
