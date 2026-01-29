# Maryland Autism Hub

Comprehensive autism resource site with news aggregation, provider directory, research search, and auto-SEO content.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

3. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### ✅ Iteration 1 (Complete)
- [x] Next.js foundation
- [x] Tailwind CSS styling
- [x] Supabase client setup
- [x] Homepage layout (3 sections)
- [x] Responsive design

### 🚧 Iteration 2 (Next)
- [ ] Supabase database schema for providers
- [ ] Provider search functionality
- [ ] News feed aggregation (RSS)
- [ ] PubMed API integration

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Netlify
- **APIs:** PubMed, RSS feeds, OpenAI/Anthropic

## Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Netlify dashboard

## Project Structure

```
autism-hub/
├── app/
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout
├── lib/
│   └── supabase.ts       # Supabase client
├── PROJECT.md            # Full project plan
└── README.md             # This file
```

## Next Steps

1. Get Supabase URL + API key
2. Create provider database schema
3. Parse intervention-guide.pdf
4. Build provider search interface

See PROJECT.md for full roadmap.
