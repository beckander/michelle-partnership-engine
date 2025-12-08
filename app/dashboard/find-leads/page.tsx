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
  { label: 'DTC Skincare', query: 'DTC skincare brands' },
  { label: 'Home Decor', query: 'home decor lifestyle brands' },
  { label: 'Clean Beauty', query: 'clean beauty brands' },
  { label: 'Wellness', query: 'wellness self-care brands' },
  { label: 'Luxury Lifestyle', query: 'luxury lifestyle aesthetic brands' },
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

    const prompt = `You are helping a lifestyle and beauty creator named Michelle Choe find brand partnership opportunities.

About Michelle:
- YouTube: 37K subscribers
- Instagram: 9.7K followers  
- TikTok: 15K followers
- Aesthetic: soft, neutral, cozy luxury (Pottery Barn meets Korean minimalism)
- Past partners: Pottery Barn, Armani Beauty, Notion, Target, Princess Polly, Poppui
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
- Look for brands that have worked with similar lifestyle creators
- Return ONLY the JSON array, no other text
- Make sure it's valid JSON that can be parsed`;

    setGeneratedPrompt(prompt);
  };

  const generateCompetitorPrompt = () => {
    if (!competitorBrand) return;

    const prompt = `You are helping a lifestyle and beauty creator named Michelle Choe find brand partnership opportunities.

About Michelle:
- YouTube: 37K subscribers
- Instagram: 9.7K followers  
- TikTok: 15K followers
- Aesthetic: soft, neutral, cozy luxury (Pottery Barn meets Korean minimalism)
- Past partners: Pottery Barn, Armani Beauty, Notion, Target, Princess Polly, Poppui

TASK: The brand "${competitorBrand}" is a dream partner or past partner for Michelle. Find 20 similar brands that:
1. Are in the same category/industry
2. Have a similar aesthetic or target demographic
3. Are known to work with influencers/creators
4. Would be receptive to creator partnerships

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
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="text-[#9A8B78] tracking-[0.2em] uppercase text-xs mb-2">Lead Generation</p>
        <h1 className="font-serif text-2xl text-[#3D3225] font-light">Find New Leads</h1>
        <p className="text-[#6B5D4D] text-sm mt-2">
          Generate a prompt, paste it into ChatGPT, then import the results.
        </p>
      </div>

      {/* Search Type Toggle */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setSearchType('discover')}
          className={`px-5 py-2.5 text-xs tracking-[0.1em] uppercase transition-all ${
            searchType === 'discover'
              ? 'bg-[#3D3225] text-[#FDFBF7]'
              : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
          }`}
        >
          Discover Brands
        </button>
        <button
          onClick={() => setSearchType('competitor')}
          className={`px-5 py-2.5 text-xs tracking-[0.1em] uppercase transition-all ${
            searchType === 'competitor'
              ? 'bg-[#3D3225] text-[#FDFBF7]'
              : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
          }`}
        >
          Similar Brands
        </button>
      </div>

      {/* Discovery Search */}
      {searchType === 'discover' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#E8E0D4] p-6 mb-6 bg-[#FDFBF7]"
        >
          <h3 className="text-[#3D3225] text-xs tracking-[0.15em] uppercase mb-5">Brand Discovery</h3>
          
          {/* Quick Searches */}
          <div className="mb-6">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">Quick Searches</label>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((search) => (
                <button
                  key={search.label}
                  onClick={() => {
                    setCustomQuery(search.query);
                    setCategory('');
                  }}
                  className={`px-4 py-2 text-xs tracking-wider transition-all ${
                    customQuery === search.query
                      ? 'bg-[#3D3225] text-[#FDFBF7]'
                      : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
                  }`}
                >
                  {search.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="mb-5">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">Or Select Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCustomQuery('');
              }}
              className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] focus:outline-none focus:border-[#C9B99A] transition-colors text-sm"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Custom Query */}
          <div className="mb-5">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">Or Custom Search</label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => {
                setCustomQuery(e.target.value);
                setCategory('');
              }}
              placeholder="e.g., sustainable home goods brands, Korean skincare..."
              className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors text-sm"
            />
          </div>

          {/* Lead Count */}
          <div className="mb-6">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">Number of Leads: {leadCount}</label>
            <input
              type="range"
              min="10"
              max="50"
              value={leadCount}
              onChange={(e) => setLeadCount(parseInt(e.target.value))}
              className="w-full accent-[#C9B99A]"
            />
          </div>

          <button
            onClick={generateDiscoveryPrompt}
            disabled={!category && !customQuery}
            className="w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Prompt
          </button>
        </motion.div>
      )}

      {/* Competitor Search */}
      {searchType === 'competitor' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#E8E0D4] p-6 mb-6 bg-[#FDFBF7]"
        >
          <h3 className="text-[#3D3225] text-xs tracking-[0.15em] uppercase mb-2">Find Similar Brands</h3>
          <p className="text-[#9A8B78] text-sm mb-5">
            Enter a brand you love and find similar companies.
          </p>

          {/* Past Partners Quick Select */}
          <div className="mb-5">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">Your Past Partners</label>
            <div className="flex flex-wrap gap-2">
              {['Pottery Barn', 'Armani Beauty', 'Notion', 'Target', 'Princess Polly'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setCompetitorBrand(brand)}
                  className={`px-4 py-2 text-xs tracking-wider transition-all ${
                    competitorBrand === brand
                      ? 'bg-[#3D3225] text-[#FDFBF7]'
                      : 'bg-[#F5F1EB] text-[#6B5D4D] hover:bg-[#E8E0D4]'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[#9A8B78] text-xs tracking-[0.1em] uppercase mb-3 block">Or Enter Any Brand</label>
            <input
              type="text"
              value={competitorBrand}
              onChange={(e) => setCompetitorBrand(e.target.value)}
              placeholder="e.g., Glossier, West Elm, Aesop..."
              className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#E8E0D4] text-[#3D3225] placeholder:text-[#B8A888] focus:outline-none focus:border-[#C9B99A] transition-colors text-sm"
            />
          </div>

          <button
            onClick={generateCompetitorPrompt}
            disabled={!competitorBrand}
            className="w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Generate Prompt
          </button>
        </motion.div>
      )}

      {/* Generated Prompt Display */}
      {generatedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#E8E0D4] p-6 bg-[#FDFBF7]"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#3D3225] text-xs tracking-[0.15em] uppercase">Your ChatGPT Prompt</h3>
            <button
              onClick={copyPrompt}
              className="px-4 py-2 bg-[#F5F1EB] text-[#6B5D4D] text-xs tracking-wider hover:bg-[#E8E0D4] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="bg-[#F5F1EB] p-4 max-h-64 overflow-y-auto mb-6 border border-[#E8E0D4]">
            <pre className="text-[#3D3225] text-xs whitespace-pre-wrap font-sans leading-relaxed">
              {generatedPrompt}
            </pre>
          </div>

          <div className="bg-[#F5F1EB] p-4 mb-5 border border-[#E8E0D4]">
            <h4 className="text-[#3D3225] text-xs tracking-[0.1em] uppercase mb-3">Instructions</h4>
            <ol className="text-[#6B5D4D] text-sm space-y-1.5">
              <li>1. Copy the prompt above</li>
              <li>2. Open <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="text-[#3D3225] border-b border-[#C9B99A]">ChatGPT</a> and paste it</li>
              <li>3. Copy ChatGPT's JSON response</li>
              <li>4. Go to <Link href="/dashboard/import" className="text-[#3D3225] border-b border-[#C9B99A]">Import Leads</Link> and paste it</li>
            </ol>
          </div>

          <Link
            href="/dashboard/import"
            className="block w-full py-3 bg-[#3D3225] text-[#FDFBF7] text-center text-xs tracking-[0.15em] uppercase hover:bg-[#2A231A] transition-colors"
          >
            Go to Import Leads →
          </Link>
        </motion.div>
      )}
    </div>
  );
}
