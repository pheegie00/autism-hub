import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

// Major autism research organizations and nonprofits
const KNOWN_ORGS = [
  {
    name: 'Autism Speaks',
    url: 'https://www.autismspeaks.org',
    description: 'Leading autism advocacy and research organization',
    focus: ['Research funding', 'Advocacy', 'Family services']
  },
  {
    name: 'Organization for Autism Research (OAR)',
    url: 'https://researchautism.org',
    description: 'Applied research to answer questions parents and caregivers have',
    focus: ['Applied research', 'Scholarships', 'Life journey']
  },
  {
    name: 'Simons Foundation Autism Research Initiative (SFARI)',
    url: 'https://www.sfari.org',
    description: 'Advancing understanding of autism through research',
    focus: ['Genetics', 'Neuroscience', 'Research grants']
  },
  {
    name: 'Autism Science Foundation',
    url: 'https://autismsciencefoundation.org',
    description: 'Supporting autism research and science-based information',
    focus: ['Research grants', 'Education', 'Evidence-based practices']
  },
  {
    name: 'National Institute of Mental Health (NIMH)',
    url: 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd',
    description: 'Federal research on autism spectrum disorders',
    focus: ['Clinical trials', 'Federal funding', 'Research programs']
  },
  {
    name: 'Kennedy Krieger Institute',
    url: 'https://www.kennedykrieger.org',
    description: 'Maryland-based leader in autism research and treatment',
    focus: ['Clinical services', 'Research', 'Maryland families']
  },
  {
    name: 'The Transmitter',
    url: 'https://www.thetransmitter.org',
    description: 'Neuroscience news and autism research coverage',
    focus: ['Science journalism', 'Research updates', 'Neuroscience']
  },
  {
    name: 'Interactive Autism Network (IAN)',
    url: 'https://iancommunity.org',
    description: 'Research registry connecting families with scientists',
    focus: ['Research participation', 'Family registry', 'Studies']
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const scrape = searchParams.get('scrape') === 'true';

  // If no query, return default list
  if (!query) {
    return NextResponse.json({ 
      organizations: KNOWN_ORGS,
      count: KNOWN_ORGS.length 
    });
  }

  // Filter known orgs by query
  const filtered = KNOWN_ORGS.filter(org =>
    org.name.toLowerCase().includes(query.toLowerCase()) ||
    org.description.toLowerCase().includes(query.toLowerCase()) ||
    org.focus.some(f => f.toLowerCase().includes(query.toLowerCase()))
  );

  // If scrape is requested, get fresh data from one org
  if (scrape && filtered.length > 0) {
    try {
      const org = filtered[0];
      const scrapeResult = await firecrawl.scrape(org.url, {
        formats: ['markdown'],
      });

      return NextResponse.json({
        organizations: [{
          ...org,
          liveContent: scrapeResult.markdown?.slice(0, 1000), // Preview
          scrapedAt: new Date().toISOString()
        }],
        count: 1
      });
    } catch (error) {
      console.error('Scrape error:', error);
      // Fall through to return filtered results without scrape
    }
  }

  return NextResponse.json({
    organizations: filtered,
    count: filtered.length
  });
}
