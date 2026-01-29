import axios from 'axios';

const PUBMED_SEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_FETCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

export interface PubMedArticle {
  pubmedId: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string;
  publicationDate: string;
  doi?: string;
  url: string;
}

export async function searchPubMed(query: string, maxResults: number = 10): Promise<string[]> {
  try {
    const response = await axios.get(PUBMED_SEARCH_URL, {
      params: {
        db: 'pubmed',
        term: `${query} AND autism`,
        retmax: maxResults,
        retmode: 'json',
        sort: 'relevance'
      }
    });

    const idList = response.data.esearchresult?.idlist || [];
    return idList;
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

export async function fetchPubMedDetails(pmids: string[]): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return [];

  try {
    const response = await axios.get(PUBMED_FETCH_URL, {
      params: {
        db: 'pubmed',
        id: pmids.join(','),
        retmode: 'xml'
      }
    });

    // Parse XML response (simplified - production would use proper XML parser)
    const articles: PubMedArticle[] = [];
    const xmlData = response.data;

    // Simple regex-based parsing (consider using a proper XML parser like fast-xml-parser)
    pmids.forEach((pmid) => {
      const titleMatch = xmlData.match(new RegExp(`<ArticleTitle>([^<]+)</ArticleTitle>`));
      const abstractMatch = xmlData.match(new RegExp(`<AbstractText[^>]*>([^<]+)</AbstractText>`));
      
      if (titleMatch) {
        articles.push({
          pubmedId: pmid,
          title: titleMatch[1] || 'Untitled',
          abstract: abstractMatch?.[1] || 'No abstract available',
          authors: 'Authors TBD', // Would parse from XML
          journal: 'Journal TBD', // Would parse from XML
          publicationDate: '2024', // Would parse from XML
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('PubMed fetch error:', error);
    return [];
  }
}

export async function translateToPlainEnglish(abstract: string): Promise<string> {
  // Placeholder for AI translation
  // In production, call OpenAI/Anthropic API
  return `Plain English summary: ${abstract.slice(0, 200)}... (AI translation coming soon)`;
}
