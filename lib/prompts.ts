// AI Prompts for Michelle Partnership Engine
// These are the prompts you copy into ChatGPT and paste back the results

export const MICHELLE_CONTEXT = `
Michelle Choe is a lifestyle and UGC (user-generated content) creator with:
- YouTube: 36K subscribers
- Instagram: 10K followers  
- TikTok: 15K followers

Her aesthetic is soft, neutral, cozy luxury - think Pottery Barn meets Korean minimalism.

Past brand partners include:
- Pottery Barn
- YSL Beauty
- Maybelline
- Target
- Jo Malone
- Poppui

She creates authentic, aesthetic content in categories: home decor, beauty, skincare, lifestyle, wellness, and fashion.
`;

export function generateLeadDiscoveryPrompt(category: string, count: number = 25): string {
  return `${MICHELLE_CONTEXT}

I need you to find ${count} brands in the "${category}" category that would be great partnership opportunities for Michelle.

For EACH brand, provide the following in this EXACT JSON format (this is critical for importing):

\`\`\`json
[
  {
    "company_name": "Brand Name",
    "website": "https://brandwebsite.com",
    "contact_email": "pr@brand.com or marketing@brand.com (find if possible, otherwise leave empty string)",
    "category": "${category}",
    "socials": {
      "instagram": "@brandhandle",
      "tiktok": "@brandtiktok",
      "youtube": ""
    },
    "why_good_fit": "Brief 1-2 sentence explanation of why this brand aligns with Michelle's aesthetic and audience",
    "suggested_collab": "Brief idea for what kind of content Michelle could create"
  }
]
\`\`\`

Focus on:
- DTC (direct-to-consumer) brands that actively work with creators
- Brands with clean, aesthetic visual identity
- Companies that align with Michelle's neutral, cozy, elevated lifestyle aesthetic
- Mix of established brands and emerging brands
- Brands that have worked with similar creators before

Return ONLY the JSON array, no other text. Make sure it's valid JSON I can parse.`;
}

export function generateCompetitorLookupPrompt(brandName: string): string {
  return `${MICHELLE_CONTEXT}

The brand "${brandName}" has worked with Michelle or is a dream partner for her.

Find 15-20 similar brands that:
1. Are in the same category/industry
2. Have a similar aesthetic or target demographic
3. Are known to work with creators/influencers
4. Would be receptive to UGC partnerships

Return in this EXACT JSON format:

\`\`\`json
[
  {
    "company_name": "Brand Name",
    "website": "https://brandwebsite.com",
    "contact_email": "",
    "category": "category",
    "socials": {
      "instagram": "@handle",
      "tiktok": "@handle",
      "youtube": ""
    },
    "why_good_fit": "Similar to ${brandName} because...",
    "suggested_collab": "Content idea"
  }
]
\`\`\`

Return ONLY the JSON array, no other text.`;
}

export function generatePitchPrompt(companyName: string, category: string, website?: string): string {
  return `${MICHELLE_CONTEXT}

Write a personalized partnership pitch for Michelle to send to ${companyName} (${category} brand${website ? `, website: ${website}` : ''}).

The pitch should:
- Be warm, professional, and authentic (not salesy)
- Reference something specific about the brand that shows Michelle has done her research
- Highlight why Michelle's audience and aesthetic align with the brand
- Suggest a specific content idea or collaboration format
- Be concise (under 150 words)

Return ONLY the pitch text, no other formatting or explanation.`;
}

export function generateOutreachEmailPrompt(
  companyName: string, 
  contactName: string | null,
  pitch: string
): string {
  return `${MICHELLE_CONTEXT}

Write a cold outreach email for Michelle to send to ${companyName}${contactName ? ` (contact: ${contactName})` : ''}.

Use this pitch as the basis:
"${pitch}"

Email requirements:
- Subject line that gets opened (not clickbait, but intriguing)
- Warm, friendly opening
- Brief intro of Michelle (1 sentence)
- The pitch content, naturally woven in
- Clear but soft call-to-action
- Professional sign-off
- Total length: 150-200 words max

Return in this format:
SUBJECT: [subject line here]

[email body here]

Best,
Michelle`;
}

export function generateFollowUpEmailPrompt(
  companyName: string,
  followUpNumber: 1 | 2,
  originalSubject: string
): string {
  const context = followUpNumber === 1 
    ? "It's been a few days since the initial email with no response."
    : "It's been about a week since the first follow-up with no response.";
  
  return `${MICHELLE_CONTEXT}

Write follow-up email #${followUpNumber} for Michelle to send to ${companyName}.

Context: ${context}

Original email subject was: "${originalSubject}"

Requirements:
- Keep it SHORT (under 100 words)
- Friendly, not pushy or guilt-trippy
- Add a small piece of new value or angle
- ${followUpNumber === 2 ? "This is the last follow-up, so make it count but gracefully give them an out" : "Leave room for another follow-up if needed"}
- Reference the original email naturally

Return in this format:
SUBJECT: Re: ${originalSubject}

[email body here]

Best,
Michelle`;
}

// Parser function to extract JSON from ChatGPT response
export function parseAILeadsResponse(response: string): any[] {
  try {
    // Try to find JSON array in the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // If response is already clean JSON
    return JSON.parse(response);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Could not parse the AI response. Make sure it\'s valid JSON.');
  }
}

// Parser for email response
export function parseEmailResponse(response: string): { subject: string; body: string } {
  const subjectMatch = response.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : 'Partnership Opportunity with Michelle Choe';
  
  // Get everything after the subject line
  const bodyStart = response.indexOf('\n', response.toLowerCase().indexOf('subject:'));
  const body = bodyStart !== -1 ? response.slice(bodyStart).trim() : response;
  
  return { subject, body };
}
