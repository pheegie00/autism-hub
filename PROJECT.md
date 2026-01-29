# Autism Hub - Maryland

**Vision:** Comprehensive autism resource site with news, provider directory, research search, and auto-SEO content.

---

## Features

### 1. Latest Autism News Stream
- Aggregate from: The Transmitter, Autism Speaks, NIH, Spectrum News
- Auto-update daily
- Plain summaries for each story

### 2. Maryland Provider Directory
- Source: intervention-guide.pdf (4-table guide: evidence-based → fraudulent)
- Services: ABA, Speech, OT, PT, AAC, Feeding therapy, etc.
- Searchable by: location, service type, evidence level
- Ratings/reviews?

### 3. Medical Research Search
- Connect to PubMed API
- AI translation: medical jargon → plain English
- Show: title, plain summary, link to full paper
- Filter by: year, topic, relevance

### 4. Auto-SEO Content
- Use existing SEO bot to publish articles
- Topics: autism treatments, local resources, research summaries
- Fact-checking layer (verify against reputable sources)
- Auto-publish to WordPress blog

---

## Tech Stack Recommendation

### Frontend
**Next.js** (React framework)
- Fast, SEO-friendly
- Easy Netlify deployment
- Can do SSR for dynamic content

### Backend/Database
**Supabase** (free tier = great start)
- PostgreSQL database (provider directory)
- Auth (if you want user accounts later)
- Real-time subscriptions
- Easy API

**OR simpler:**
**Airtable** → provider directory
- Non-technical editing
- Built-in API
- Can embed views on site

### Content/CMS
**WordPress** (you already have this for SEO)
- Auto-publish SEO articles
- Blog section

### APIs/Integrations
- **PubMed API** - free, medical research
- **RSS feeds** - autism news sources
- **OpenAI/Anthropic** - plain English translations + fact-checking

---

## Build Phases

### Phase 1: Foundation (Week 1)
- [ ] Create Next.js site skeleton
- [ ] Deploy to Netlify
- [ ] Design homepage layout (news stream, directory search, research search)
- [ ] Connect domain

### Phase 2: Provider Directory (Week 1-2)
- [ ] Parse intervention-guide.pdf
- [ ] Extract all providers, categorize by evidence level
- [ ] Set up Airtable or Supabase database
- [ ] Build search interface (filters: service, location, evidence level)
- [ ] Add map view?

### Phase 3: News Stream (Week 2)
- [ ] Set up RSS feed aggregator
- [ ] Sources: The Transmitter, Autism Speaks, NIH
- [ ] Auto-fetch daily (cron job or Next.js API route)
- [ ] AI summaries for each article
- [ ] Display in feed with "Read more" links

### Phase 4: Research Search (Week 2-3)
- [ ] Integrate PubMed API
- [ ] Build search interface
- [ ] AI layer: fetch abstract → translate to plain English
- [ ] Cache translations (don't re-translate same papers)
- [ ] Show: title, plain summary, original abstract, full link

### Phase 5: SEO Automation (Week 3)
- [ ] Connect existing SEO bot
- [ ] Topic generator: "Top 10 ABA therapists in Baltimore" etc.
- [ ] Fact-check against provider directory + research
- [ ] Auto-publish to WordPress
- [ ] Cross-link to main autism hub site

### Phase 6: Polish (Week 4)
- [ ] Mobile optimization
- [ ] Analytics (Google Analytics or Plausible)
- [ ] Newsletter signup?
- [ ] Social sharing
- [ ] Accessibility audit

---

## Fact-Checking Strategy

**For SEO articles:**
1. Generate draft with AI
2. Extract claims
3. Check against:
   - Our provider directory
   - PubMed research
   - Reputable sources (NIH, CDC, Autism Speaks)
4. Flag unverifiable claims
5. Only publish if 90%+ verified

**Implementation:**
- Use Claude/GPT to extract factual claims
- Query our own database + PubMed for verification
- Simple scoring system
- Manual review if score < 90%

---

## Monetization (Optional)

- Provider listings (free basic, paid featured)
- Ads (Google AdSense)
- Affiliate links (books, tools, therapy products)
- Premium: detailed provider reviews

---

## MVP Timeline

**2 weeks to basic working site:**
- Week 1: Foundation + Provider Directory
- Week 2: News Stream + Research Search
- Week 3-4: SEO automation + polish

---

## Next Steps

1. Review intervention-guide.pdf - is this the right source?
2. Choose: Airtable vs Supabase for directory
3. Set up Next.js project (I can scaffold it)
4. Design mockup or use template?

Want to start this week?
