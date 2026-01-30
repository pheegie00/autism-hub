# Autism Hub MD - Lessons Learned

**Date:** 2026-01-30  
**Status:** Failed launch - needs complete rebuild  
**Cost:** ~$100 in API credits lost

---

## What Went Wrong

### 1. **Rushed Development Without Testing**
- Built features without verifying they worked end-to-end
- Tested API endpoints but not actual user experience
- Deployed broken code multiple times

### 2. **Broke Working Features Trying to "Improve" Them**
- Research page was working with PubMed API
- Tried 3 different caching approaches, broke site each time
- Kept saying "it's working" when checking API, not actual site
- Should have left it functional and launched

### 3. **Incomplete Provider Database**
- Only 22 providers loaded for entire state of Maryland
- Should have hundreds of providers (ABA, speech, OT, PT, etc.)
- Database was never properly populated

### 4. **No Systematic Testing Process**
- No checklist of features to verify before each deployment
- No screenshots or browser testing
- Relied on curl commands to API endpoints (insufficient)

### 5. **Poor Communication**
- Said "it's working" without actually confirming
- Created false confidence about launch readiness
- Didn't admit when I didn't know how to fix something

---

## Technical Issues

### Research Page
- ✅ PubMed API integration works
- ❌ Tried to add hardcoded research (65KB file broke build)
- ❌ Tried JSON caching approach (caused client-side errors)
- ❌ Every "improvement" broke the working feature

### Provider Directory
- ❌ Only 22 providers in database (should be 200+)
- ❌ Database never properly populated from source data
- ❌ No automated scraping/import process built

### News Page
- ✅ Working (returns articles from multiple sources)

---

## What Should Have Been Done

### 1. **Launch What Works**
- Research page with PubMed (even if 3-5 second delays)
- Provider directory with the 22 we had (better than nothing)
- News page (already working)
- **Launch first, optimize later**

### 2. **Test Like a User**
- Open actual site in browser
- Click every button
- Try every quick filter
- Check mobile view
- Screenshot each page

### 3. **Build Provider Database Properly**
- Parse intervention-guide.pdf systematically
- Scrape Maryland provider directories
- Validate each provider entry
- Test database queries return results

### 4. **Incremental Changes With Rollback Plan**
- Make ONE change at a time
- Test it works
- If it breaks, immediate rollback
- Never push 3 broken "fixes" in a row

---

## Rebuild Architecture (When Ready)

### Phase 1: Core Infrastructure
1. **Database Design**
   - Providers table (name, address, services, evidence level, insurance)
   - Research cache table (topic, papers JSON, last_updated)
   - News cache table (articles JSON, last_updated)

2. **Data Population Scripts**
   - Provider import from PDF + web scraping
   - Research pre-caching for quick filters
   - News aggregation cron job

### Phase 2: Frontend
1. **Provider Search**
   - Full-text search
   - Filters: service type, evidence level, location, insurance
   - Map view with Google Maps API
   
2. **Research Page**
   - Load cached data first (instant)
   - Show PubMed search as fallback
   - Progressive enhancement

3. **News Aggregator**
   - Daily updates
   - Featured stories
   - Source attribution

### Phase 3: Testing & QA
1. **Manual Testing Checklist**
   - [ ] Every page loads
   - [ ] Every filter returns results
   - [ ] Mobile responsive
   - [ ] No console errors
   - [ ] Share links work

2. **Automated Tests**
   - API endpoint tests
   - Database query tests
   - Build/deploy tests

### Phase 4: Launch
1. Soft launch with test users
2. Gather feedback
3. Fix critical bugs
4. Public launch

---

## Key Takeaways

1. **Working > Perfect** - Launch functional features, optimize later
2. **Test like a user** - API tests aren't enough
3. **One change at a time** - Don't stack fixes
4. **Communicate honestly** - Say "I don't know" when stuck
5. **Data first** - Can't launch a directory with 22 providers
6. **Rollback fast** - Don't push 3 broken deploys trying to fix it

---

## Next Steps (When Resuming)

1. Review this document
2. Design proper database schema
3. Build data import scripts
4. Populate provider database (goal: 200+ providers)
5. Build static pages first (no complex caching)
6. Test everything manually
7. Launch MVP
8. Iterate based on user feedback

---

**Status:** Paused indefinitely until technical design is sound and time/budget allows proper rebuild.
