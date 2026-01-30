import { NextResponse } from 'next/server';
import { searchPubMed, fetchPubMedDetails } from '@/lib/pubmed';
import fs from 'fs';
import path from 'path';

// Serverless runtime config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Map of query terms to JSON filenames
const CACHED_TOPICS: Record<string, string> = {
  'microbiome': 'microbiome.json',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const maxResults = parseInt(searchParams.get('limit') || '50');

    if (!query.trim()) {
      return NextResponse.json({
        error: 'Search query is required'
      }, { status: 400 });
    }

    console.log(`[Research API] Search request for: ${query}`);

    // Check if we have cached data for this query
    const normalizedQuery = query.toLowerCase().trim();
    for (const [key, filename] of Object.entries(CACHED_TOPICS)) {
      if (normalizedQuery.includes(key)) {
        try {
          const dataPath = path.join(process.cwd(), 'data', 'research', filename);
          if (fs.existsSync(dataPath)) {
            const papers = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
            console.log(`[Research API] Returning ${papers.length} cached papers for "${query}"`);
            return NextResponse.json({
              papers,
              cached: true
            });
          }
        } catch (err) {
          console.error(`[Research API] Error reading cached data:`, err);
          // Fall through to PubMed
        }
      }
    }

    // Fall back to PubMed API
    console.log(`[Research API] Fetching from PubMed for: ${query}`);
    const pmids = await searchPubMed(query, maxResults);
    
    if (pmids.length === 0) {
      return NextResponse.json({
        papers: [],
        message: 'No results found'
      });
    }

    const papers = await fetchPubMedDetails(pmids);
    console.log(`[Research API] Returning ${papers.length} papers from PubMed`);

    return NextResponse.json({
      papers,
      cached: false
    });
  } catch (error: any) {
    console.error('[Research API] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to search PubMed' },
      { status: 500 }
    );
  }
}
