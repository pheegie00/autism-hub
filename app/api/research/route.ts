import { NextResponse } from 'next/server';
import { searchPubMed, fetchPubMedDetails } from '@/lib/pubmed';
import { getHardcodedResearch, hasHardcodedResearch } from '@/lib/hardcoded-research';

// Serverless runtime config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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

    // Check for hardcoded research first (for quick filters)
    if (hasHardcodedResearch(query)) {
      const papers = getHardcodedResearch(query);
      console.log(`[Research API] Returning ${papers.length} hardcoded papers for "${query}"`);
      return NextResponse.json({
        papers,
        cached: true,
        source: 'hardcoded'
      });
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
      cached: false,
      source: 'pubmed'
    });
  } catch (error: any) {
    console.error('[Research API] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to search PubMed' },
      { status: 500 }
    );
  }
}
