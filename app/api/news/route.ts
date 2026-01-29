import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeAutismNews, extractNewsArticles } from '@/lib/firecrawl';

export async function GET() {
  try {
    // Try to get cached news from Supabase first
    const { data: cachedNews, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Supabase error:', error);
    }

    // If we have recent news (less than 6 hours old), return it
    if (cachedNews && cachedNews.length > 0) {
      const latestArticle = cachedNews[0];
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      
      if (new Date(latestArticle.fetched_at) > sixHoursAgo) {
        return NextResponse.json({ 
          articles: cachedNews,
          cached: true 
        });
      }
    }

    // Otherwise, scrape fresh news
    const scrapedData = await scrapeAutismNews();
    const allArticles: any[] = [];

    for (const { url, content } of scrapedData) {
      const articles = await extractNewsArticles(content, url);
      allArticles.push(...articles);
    }

    // Insert new articles into Supabase
    if (allArticles.length > 0) {
      const { error: insertError } = await supabase
        .from('news_articles')
        .upsert(
          allArticles.map(article => ({
            title: article.title,
            url: article.url,
            source: article.source,
            summary: article.summary,
            fetched_at: new Date().toISOString()
          })),
          { onConflict: 'url', ignoreDuplicates: true }
        );

      if (insertError) {
        console.error('Insert error:', insertError);
      }
    }

    return NextResponse.json({ 
      articles: allArticles,
      cached: false 
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
