# 🌸 Michelle Partnership Engine

AI-powered CRM + lead generator to secure brand partnerships for creator Michelle Choe.

## ✨ Features

- **Beautiful Landing Page** - Public portfolio site showcasing Michelle's work and brand partnerships
- **AI Lead Finder** - Generate prompts for ChatGPT to discover new brand partnership opportunities  
- **CRM Pipeline** - Kanban-style board to track leads through the sales process
- **Email Composer** - Generate personalized outreach emails and follow-ups
- **Inbound Lead Capture** - Contact form that feeds directly into the CRM

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd michelle-partnership-engine
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to access the CRM.

## 📁 Project Structure

```
michelle-partnership-engine/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── api/
│   │   ├── leads/               # Leads API
│   │   ├── emails/              # Emails API
│   │   └── contact/             # Contact form API
│   └── dashboard/
│       ├── page.tsx             # Pipeline/Kanban board
│       ├── layout.tsx           # Dashboard layout
│       ├── find-leads/          # AI Lead Finder
│       ├── import/              # Import ChatGPT results
│       └── emails/              # Email composer
├── lib/
│   ├── db.ts                    # Database operations
│   ├── types.ts                 # TypeScript types
│   └── prompts.ts               # AI prompts
├── data/
│   └── database.json            # JSON file database
└── components/                   # Reusable components
```

## 🎯 How to Use

### Finding New Leads

1. Go to **Dashboard → Find Leads**
2. Choose a category or enter a custom search term
3. Click **"Generate Prompt for ChatGPT"**
4. Copy the prompt and paste it into ChatGPT
5. Copy ChatGPT's JSON response
6. Go to **Dashboard → Import Leads**
7. Paste the JSON and click **Import**

### Managing Your Pipeline

1. Go to **Dashboard** to see all leads in a Kanban board
2. Click any lead card to see details
3. Use quick actions to move leads between stages
4. Click **"Generate Email"** to create outreach

### Composing Emails

1. Go to **Dashboard → Emails**
2. Select a lead from your pipeline
3. Choose email type (First Outreach, Follow-up #1, Follow-up #2)
4. Click **"Generate Prompt"**
5. Copy to ChatGPT, get the email, paste back to save

## 🎨 Customization

### Updating Michelle's Info

Edit the prompts in `lib/prompts.ts` to update:
- Social stats
- Past brand partners
- Aesthetic description

### Changing the Color Scheme

Edit `tailwind.config.js` to modify the color palette:
- `cream` - Background colors
- `taupe` - Text and UI colors
- `blush` - Accent colors
- `sage` - Status colors

### Adding Real Brand Logos

Replace the emoji placeholders in `app/page.tsx` with actual logo images.

## 🔮 Future Enhancements

- [ ] Gmail integration for sending emails directly
- [ ] OpenAI/Claude API integration for automatic generation
- [ ] Brand asset file uploads
- [ ] Email tracking (opens, replies)
- [ ] Automated follow-up scheduling
- [ ] Analytics dashboard

## 📝 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Database**: JSON file (can upgrade to SQLite/PostgreSQL)
- **AI**: ChatGPT (via copy/paste prompts)

## 🌟 Made with love for Michelle Choe

---

Questions? Issues? The CRM is designed to grow with your needs!
