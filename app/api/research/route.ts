import { NextResponse } from 'next/server';
import { searchPubMed, fetchPubMedDetails } from '@/lib/pubmed';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'treatment';
    const maxResults = parseInt(searchParams.get('limit') || '10');

    // Check if we have cached results
    const { data: cachedResults } = await supabase
      .from('research_papers')
      .select('*')
      .textSearch('title', query)
      .limit(maxResults);

    if (cachedResults && cachedResults.length >= 5) {
      return NextResponse.json({
        papers: cachedResults,
        cached: true
      });
    }

    // Fetch from PubMed
    const pmids = await searchPubMed(query, maxResults);
    const papers = await fetchPubMedDetails(pmids);

    // Cache in Supabase
    if (papers.length > 0) {
      const { error } = await supabase
        .from('research_papers')
        .upsert(
          papers.map(paper => ({
            pubmed_id: paper.pubmedId,
            title: paper.title,
            abstract: paper.abstract,
            authors: paper.authors,
            journal: paper.journal,
            publication_date: paper.publicationDate,
            doi: paper.doi,
            url: paper.url
          })),
          { onConflict: 'pubmed_id', ignoreDuplicates: true }
        );

      if (error) {
        console.error('Cache error:', error);
      }
    }

    return NextResponse.json({
      papers,
      cached: false
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Failed to search research' },
      { status: 500 }
    );
  }
}
