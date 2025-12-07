'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  'skincare',
  'beauty',
  'home decor',
  'lifestyle',
  'wellness',
  'fashion',
  'food & beverage',
  'tech',
];

const quickSearches = [
  { label: 'DTC Skincare Brands', query: 'DTC skincare brands' },
  { label: 'Home Decor Companies', query: 'home decor lifestyle brands' },
  { label: 'Clean Beauty Brands', query: 'clean beauty brands' },
  { label: 'Wellness & Self-Care', query: 'wellness self-care brands' },
  { label: 'Cozy Lifestyle Brands', query: 'cozy lifestyle aesthetic brands' },
];

export default function FindLeadsPage() {
  const [searchType, setSearchType] = useState<'discover' | 'competitor'>('discover');
  const [category, setCategory] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [competitorBrand, setCompetitorBrand] = useState('');
  const [leadCount, setLeadCount] = useState(25);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const generateDiscoveryPrompt = () => {
    const searchTerm = customQuery || category;
    if (!searchTerm) return;

    const prompt = `You are helping a UGC (user-generated content) lifestyle creator named Michelle Choe find brand partnership opportunities.

About Michelle:
- YouTube: 36K subscribers
- Instagram: 10K followers  
- TikTok: 15K followers
- Aesthetic: soft, neutral, cozy luxury (Pottery Barn meets Korean minimalism)
- Past partners: Pottery Barn, YSL Beauty, Maybelline, Target, Jo Malone, Poppui
- Content style: authentic, aesthetic lifestyle content in home decor, beauty, skincare, wellness

TASK: Find ${leadCount} brands in the "${searchTerm}" category that would be great partnership opportunities for Michelle.

For EACH brand, provide this information in valid JSON format:

\`\`\`json
[
  {
    "company_name": "Brand Name Here",
    "website": "https://brandwebsite.com",
    "contact_email": "partnerships@brand.com",
    "category": "${category || 'lifestyle'}",
    "socials": {
      "instagram": "@brandhandle",
      "tiktok": "@brandtiktok"
    },
    "why_good_fit": "1-2 sentences on why this brand fits Michelle's aesthetic and audience",
    "suggested_collab": "Brief content idea Michelle could pitch"
  }
]
\`\`\`

IMPORTANT FOR contact_email:
- Find their PARTNERSHIP, COLLABORATION, INFLUENCER, or CREATOR email
- Good emails: partnerships@, collabs@, influencers@, creators@, hello@, info@, marketing@
- Do NOT use press@ or media@ emails (those are for journalists, not creators)
- If you can't find a partnership email, leave it as empty string ""

OTHER REQUIREMENTS:
- Focus on DTC brands that actively work with creators
- Include mix of established and emerging brands
- Prioritize brands with clean, aesthetic visual identity
- Look for brands that have worked with similar lifestyle/UGC creators
- Return ONLY the JSON array, no other text
- Make sure it's valid JSON that can be parsed`;

    setGeneratedPrompt(prompt);
  };

  const generateCompetitorPrompt = () => {
    if (!competitorBrand) return;

    const prompt = `You are helping a UGC (user-generated content) lifestyle creator named Michelle Choe find brand partnership opportunities.

About Michelle:
- YouTube: 36K subscribers
- Instagram: 10K followers  
- TikTok: 15K followers
- Aesthetic: soft, neutral, cozy luxury (Pottery Barn meets Korean minimalism)
- Past partners: Pottery Barn, YSL Beauty, Maybelline, Target, Jo Malone, Poppui

TASK: The brand "${competitorBrand}" is a dream partner or past partner for Michelle. Find 20 similar brands that:
1. Are in the same category/industry
2. Have a similar aesthetic or target demographic
3. Are known to work with influencers/creators
4. Would be receptive to UGC partnerships

For EACH brand, provide this information in valid JSON format:

\`\`\`json
[
  {
    "company_name": "Brand Name",
    "website": "https://brandwebsite.com",
    "contact_email": "partnerships@brand.com",
    "category": "category",
    "socials": {
      "instagram": "@handle",
      "tiktok": "@handle"
    },
    "why_good_fit": "Similar to ${competitorBrand} because...",
    "suggested_collab": "Content idea for Michelle"
  }
]
\`\`\`

IMPORTANT FOR contact_email:
- Find their PARTNERSHIP, COLLABORATION, INFLUENCER, or CREATOR email
- Good emails: partnerships@, collabs@, influencers@, creators@, hello@, info@, marketing@
- Do NOT use press@ or media@ emails (those are for journalists, not creators)
- If you can't find a partnership email, leave it as empty string ""

Return ONLY the JSON array, no other text. Make sure it's valid JSON.`;

    setGeneratedPrompt(prompt);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-taupe-700 mb-2">Find New Leads</h1>
        <p className="text-taupe-500">
          Generate a prompt, paste it into ChatGPT, then import the results.
        </p>
      </div>

      {/* Search Type Toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSearchType('discover')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            searchType === 'discover'
              ? 'bg-taupe-600 text-cream-50'
              : 'bg-cream-200 text-taupe-600 hover:bg-cream-300'
          }`}
        >
          🔍 Discover Brands
        </button>
        <button
          onClick={() => setSearchType('competitor')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            searchType === 'competitor'
              ? 'bg-taupe-600 text-cream-50'
              : 'bg-cream-200 text-taupe-600 hover:bg-cream-300'
          }`}
        >
          🎯 Find Similar Brands
        </button>
      </div>

      {/* Discovery Search */}
      {searchType === 'discover' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream-100 rounded-2xl p-6 mb-6"
        >
          <h3 className="font-serif text-xl text-taupe-700 mb-4">Brand Discovery</h3>
          
          {/* Quick Searches */}
          <div className="mb-6">
            <label className="text-taupe-500 text-sm mb-2 block">Quick searches:</label>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((search) => (
                <button
                  key={search.label}
                  onClick={() => {
                    setCustomQuery(search.query);
                    setCategory('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    customQuery === search.query
                      ? 'bg-taupe-600 text-cream-50'
                      : 'bg-cream-50 text-taupe-600 hover:bg-cream-200'
                  }`}
                >
                  {search.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="text-taupe-500 text-sm mb-2 block">Or select a category:</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCustomQuery('');
              }}
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-taupe-700"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Custom Query */}
          <div className="mb-4">
            <label className="text-taupe-500 text-sm mb-2 block">Or enter custom search:</label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => {
                setCustomQuery(e.target.value);
                setCategory('');
              }}
              placeholder="e.g., sustainable home goods brands, Korean skincare..."
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-taupe-700 placeholder:text-taupe-400"
            />
          </div>

          {/* Lead Count */}
          <div className="mb-6">
            <label className="text-taupe-500 text-sm mb-2 block">Number of leads: {leadCount}</label>
            <input
              type="range"
              min="10"
              max="50"
              value={leadCount}
              onChange={(e) => setLeadCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={generateDiscoveryPrompt}
            disabled={!category && !customQuery}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Prompt for ChatGPT
          </button>
        </motion.div>
      )}

      {/* Competitor Search */}
      {searchType === 'competitor' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream-100 rounded-2xl p-6 mb-6"
        >
          <h3 className="font-serif text-xl text-taupe-700 mb-4">Find Similar Brands</h3>
          <p className="text-taupe-500 text-sm mb-4">
            Enter a brand you love or have worked with, and find similar companies.
          </p>

          {/* Past Partners Quick Select */}
          <div className="mb-4">
            <label className="text-taupe-500 text-sm mb-2 block">Your past partners:</label>
            <div className="flex flex-wrap gap-2">
              {['Pottery Barn', 'YSL Beauty', 'Maybelline', 'Target', 'Jo Malone'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setCompetitorBrand(brand)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    competitorBrand === brand
                      ? 'bg-taupe-600 text-cream-50'
                      : 'bg-cream-50 text-taupe-600 hover:bg-cream-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-taupe-500 text-sm mb-2 block">Or enter any brand:</label>
            <input
              type="text"
              value={competitorBrand}
              onChange={(e) => setCompetitorBrand(e.target.value)}
              placeholder="e.g., Glossier, West Elm, Aesop..."
              className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-cream-300 text-taupe-700 placeholder:text-taupe-400"
            />
          </div>

          <button
            onClick={generateCompetitorPrompt}
            disabled={!competitorBrand}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Prompt for ChatGPT
          </button>
        </motion.div>
      )}

      {/* Generated Prompt Display */}
      {generatedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream-50 border border-cream-300 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl text-taupe-700">Your ChatGPT Prompt</h3>
            <button
              onClick={copyPrompt}
              className="btn btn-secondary text-sm flex items-center gap-2"
            >
              {copied ? '✓ Copied!' : '📋 Copy Prompt'}
            </button>
          </div>

          <div className="bg-cream-100 rounded-xl p-4 max-h-64 overflow-y-auto mb-6">
            <pre className="text-taupe-600 text-sm whitespace-pre-wrap font-sans">
              {generatedPrompt}
            </pre>
          </div>

          <div className="bg-blush-100 rounded-xl p-4 mb-4">
            <h4 className="font-medium text-taupe-700 mb-2">📝 Instructions:</h4>
            <ol className="text-taupe-600 text-sm space-y-2">
              <li>1. Copy the prompt above</li>
              <li>2. Open <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-taupe-700 underline">ChatGPT</a> and paste it</li>
              <li>3. Copy ChatGPT's JSON response</li>
              <li>4. Go to <Link href="/dashboard/import" className="text-taupe-700 underline">Import Leads</Link> and paste it</li>
            </ol>
          </div>

          <Link
            href="/dashboard/import"
            className="btn btn-primary w-full text-center block"
          >
            Go to Import Leads →
          </Link>
        </motion.div>
      )}
    </div>
  );
}