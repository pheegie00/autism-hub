import { NextResponse } from 'next/server';
import { searchPubMed, fetchPubMedDetails } from '@/lib/pubmed';

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

    console.log(`[Research API] Searching PubMed for: ${query}`);

    // Fetch directly from PubMed (no caching for now)
    const pmids = await searchPubMed(query, maxResults);
    
    if (pmids.length === 0) {
      return NextResponse.json({
        papers: [],
        message: 'No results found'
      });
    }

    const papers = await fetchPubMedDetails(pmids);
    console.log(`[Research API] Returning ${papers.length} papers`);

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
