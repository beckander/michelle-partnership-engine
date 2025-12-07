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
          className="bg-green-50 rounded-2xl p-8 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-serif text-2xl text-taupe-700 mb-2">
            Successfully Imported {importCount} Leads!
          </h2>
          <p className="text-taupe-500 mb-6">
            Your new leads are ready in the pipeline.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard" className="btn btn-primary">
              View Pipeline
            </Link>
            <button onClick={resetForm} className="btn btn-secondary">
              Import More
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-taupe-700 mb-2">Import Leads</h1>
        <p className="text-taupe-500">
          Paste the JSON response from ChatGPT to add leads to your pipeline.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${!parsedLeads.length ? 'text-taupe-700' : 'text-taupe-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${!parsedLeads.length ? 'bg-taupe-600 text-cream-50' : 'bg-cream-200'}`}>1</span>
          <span className="text-sm font-medium">Paste JSON</span>
        </div>
        <div className="flex-1 h-px bg-cream-300"></div>
        <div className={`flex items-center gap-2 ${parsedLeads.length && !imported ? 'text-taupe-700' : 'text-taupe-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${parsedLeads.length && !imported ? 'bg-taupe-600 text-cream-50' : 'bg-cream-200'}`}>2</span>
          <span className="text-sm font-medium">Review & Import</span>
        </div>
      </div>

      {!parsedLeads.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-cream-100 rounded-2xl p-6 mb-4">
            <label className="text-taupe-600 text-sm mb-2 block font-medium">
              Paste ChatGPT's JSON response:
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
    "contact_email": "pr@example.com",
    "category": "skincare",
    "socials": { "instagram": "@brand" },
    "why_good_fit": "Great aesthetic match",
    "suggested_collab": "Product review"
  }
]`}
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-taupe-700 placeholder:text-taupe-400 font-mono text-sm resize-none"
            />
          </div>

          {parseError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-600 text-sm">⚠️ {parseError}</p>
            </div>
          )}

          <button
            onClick={parseInput}
            disabled={!jsonInput.trim()}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Parse & Preview Leads
          </button>

          <div className="mt-6 p-4 bg-blush-100 rounded-xl">
            <p className="text-taupe-600 text-sm">
              💡 <strong>Tip:</strong> Don't have leads yet?{' '}
              <Link href="/dashboard/find-leads" className="text-taupe-700 underline">
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
          <div className="bg-cream-100 rounded-2xl p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-xl text-taupe-700">
                Preview: {parsedLeads.length} Leads
              </h3>
              <button
                onClick={resetForm}
                className="text-taupe-500 hover:text-taupe-700 text-sm"
              >
                ← Start Over
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {parsedLeads.map((lead, index) => (
                <div
                  key={index}
                  className="bg-cream-50 rounded-xl p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-taupe-700">{lead.company_name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-taupe-500">
                        {lead.category}
                      </span>
                    </div>
                    {lead.website && (
                      <p className="text-taupe-500 text-sm truncate">{lead.website}</p>
                    )}
                    {lead.contact_email && (
                      <p className="text-taupe-500 text-sm">{lead.contact_email}</p>
                    )}
                    {lead.why_good_fit && (
                      <p className="text-taupe-400 text-xs mt-2 line-clamp-2">{lead.why_good_fit}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-taupe-400">
                    {lead.socials?.instagram && <p>{lead.socials.instagram}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={importLeads}
            disabled={importing}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {importing ? 'Importing...' : `Import ${parsedLeads.length} Leads to Pipeline`}
          </button>
        </motion.div>
      )}
    </div>
  );
}
