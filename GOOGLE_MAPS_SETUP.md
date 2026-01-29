# Google Maps API Setup for Provider Search

This enables automatic discovery of autism service providers in Maryland using Google Places API.

## Step 1: Enable Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **"APIs & Services"** → **"Library"**
4. Search for and enable these APIs:
   - **Places API** ✅ (required)
   - **Maps JavaScript API** (optional, for future map views)

## Step 2: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key

## Step 3: Restrict API Key (Recommended)

1. Click on the API key you just created
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Places API"**
3. Under **"Application restrictions"** (optional):
   - Select **"HTTP referrers"**
   - Add your domain: `*.netlify.app/*` or your custom domain
4. Click **"Save"**

## Step 4: Add to Environment Variables

### For Local Development:
Add to `/home/ubuntu/clawd/projects/autism-hub/.env.local`:
```
GOOGLE_MAPS_API_KEY=AIzaSy...your-key-here
```

### For Netlify Production:
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select **autism-hub-md** site
3. Go to **"Site configuration"** → **"Environment variables"**
4. Click **"Add a variable"**
   - Key: `GOOGLE_MAPS_API_KEY`
   - Value: Your API key from Step 2
5. Click **"Save"**
6. Redeploy the site

## Step 5: Test It

1. Go to your site: `https://autism-hub-md.netlify.app/directory`
2. Search for a city like "Columbia" or "Baltimore"
3. You should see real providers pulled from Google Places!

## What Gets Searched

The API automatically searches for:
- **Keywords:** autism therapy, ABA therapy, speech therapy autism, occupational therapy autism, autism behavioral health, developmental pediatrics, autism evaluation
- **Cities:** Columbia, Baltimore, Annapolis, Silver Spring, Rockville, Frederick, Gaithersburg, Bowie, Hagerstown, Towson
- **Filters:** Evidence-based services (ABA, speech, OT, PT)

## Data Included

For each provider, you'll get:
- ✅ Practice name
- ✅ Full address
- ✅ Phone number (if available)
- ✅ Website (if available)
- ✅ Google rating & review count
- ✅ Latitude/longitude (for future map features)

## Pricing

Google Places API pricing (as of 2024):
- **Text Search:** $32 per 1,000 requests
- **Place Details:** $17 per 1,000 requests
- **Free tier:** $200/month credit = ~5,000+ searches/month

**Estimated cost:** If 100 people search per day = ~$15-20/month (well under free tier)

## Rate Limiting

The code includes:
- 200ms delay between requests to avoid hitting rate limits
- Caching to reduce duplicate searches
- Fallback to sample data if API is unavailable

## Troubleshooting

**"GOOGLE_MAPS_API_KEY not configured" error:**
- Make sure env variable is set in Netlify
- Redeploy after adding the variable

**No results showing:**
- Check API key is correct
- Verify Places API is enabled in Google Cloud Console
- Check API key restrictions aren't blocking requests

**Need help?** Just ask!
