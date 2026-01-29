import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

export async function scrapeAutismNews() {
  const sources = [
    'https://www.thetransmitter.org/spectrum/',
    'https://www.autismspeaks.org/science-news',
    'https://www.nih.gov/news-events/news-releases?search=autism'
  ];

  const results = await Promise.allSettled(
    sources.map(async (url) => {
      try {
        const scrapeResult = await firecrawl.scrapeUrl(url, {
          formats: ['markdown'],
        });
        return {
          url,
          content: scrapeResult.markdown,
          success: true
        };
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
        return {
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        };
      }
    })
  );

  return results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value)
    .filter(result => result.success);
}

export async function extractNewsArticles(markdownContent: string, source: string) {
  // Parse markdown to extract article titles, URLs, dates
  // This is a simple parser - can be enhanced
  const articles: Array<{
    title: string;
    url: string;
    source: string;
    summary?: string;
  }> = [];

  // Simple regex to find markdown links [title](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(markdownContent)) !== null) {
    const [, title, url] = match;
    
    // Filter for article-like content
    if (title.length > 20 && !url.includes('javascript:') && 
        (url.includes('http') || url.startsWith('/'))) {
      articles.push({
        title: title.trim(),
        url: url.startsWith('/') ? new URL(url, source).toString() : url,
        source: new URL(source).hostname,
      });
    }
  }

  return articles.slice(0, 10); // Top 10 articles
}
