import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

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

export async function searchPubMed(query: string, maxResults: number = 20): Promise<string[]> {
  try {
    // Expand search terms for broader international coverage
    let searchTerm = query;
    
    // If query is generic or empty, use diverse autism research terms
    if (!query || query.length < 3 || query === 'treatment' || query === 'autism') {
      searchTerm = '(autism OR ASD OR "autism spectrum disorder") AND (treatment OR therapy OR intervention OR microbiome OR "gut bacteria" OR HBOT OR "hyperbaric oxygen" OR leucovorin OR folinic OR "stem cell" OR "neural stem cell" OR oxytocin OR bumetanide OR cannabidiol OR CBD OR diet OR probiotic OR methylation OR epigenetic)';
    } else {
      // User provided specific query - still include autism context
      searchTerm = `(autism OR ASD OR "autism spectrum disorder") AND (${query})`;
    }

    const response = await axios.get(PUBMED_SEARCH_URL, {
      params: {
        db: 'pubmed',
        term: searchTerm,
        retmax: maxResults,
        retmode: 'json',
        sort: 'date', // Get recent research
        mindate: '2020', // Last 5 years for relevance
      }
    });

    const idList = response.data.esearchresult?.idlist || [];
    console.log(`PubMed search found ${idList.length} articles`);
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

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    const result = parser.parse(response.data);
    const articles: PubMedArticle[] = [];

    // Handle both single article and multiple articles
    let articleList = result.PubmedArticleSet?.PubmedArticle || [];
    if (!Array.isArray(articleList)) {
      articleList = [articleList];
    }

    for (const article of articleList) {
      try {
        const medlineCitation = article.MedlineCitation;
        const pmid = medlineCitation?.PMID?.['#text'] || medlineCitation?.PMID || 'unknown';
        
        const articleData = medlineCitation?.Article;
        const title = articleData?.ArticleTitle || 'No title available';
        
        // Parse abstract (can be single or multiple paragraphs)
        let abstract = 'No abstract available';
        const abstractData = articleData?.Abstract?.AbstractText;
        if (abstractData) {
          if (Array.isArray(abstractData)) {
            abstract = abstractData
              .map((a: any) => a['#text'] || a)
              .join(' ');
          } else {
            abstract = abstractData['#text'] || abstractData;
          }
        }

        // Parse authors
        let authors = 'Authors not listed';
        const authorList = articleData?.AuthorList?.Author;
        if (authorList) {
          const authorArray = Array.isArray(authorList) ? authorList : [authorList];
          const authorNames = authorArray
            .slice(0, 3) // First 3 authors
            .map((author: any) => {
              const lastName = author.LastName || '';
              const initials = author.Initials || '';
              return `${lastName} ${initials}`.trim();
            })
            .filter(Boolean);
          
          if (authorNames.length > 0) {
            authors = authorNames.join(', ');
            if (authorArray.length > 3) {
              authors += ', et al.';
            }
          }
        }

        // Parse journal
        const journal = articleData?.Journal?.Title || 
                       articleData?.Journal?.ISOAbbreviation || 
                       'Unknown journal';

        // Parse publication date
        let publicationDate = 'Date unknown';
        const pubDate = articleData?.Journal?.JournalIssue?.PubDate;
        if (pubDate) {
          const year = pubDate.Year || '';
          const month = pubDate.Month || '';
          publicationDate = `${month} ${year}`.trim();
        }

        // DOI
        const articleIds = article.PubmedData?.ArticleIdList?.ArticleId;
        let doi = undefined;
        if (articleIds) {
          const idArray = Array.isArray(articleIds) ? articleIds : [articleIds];
          const doiObj = idArray.find((id: any) => id['@_IdType'] === 'doi');
          doi = doiObj?.['#text'] || doiObj;
        }

        articles.push({
          pubmedId: pmid.toString(),
          title,
          abstract: abstract.slice(0, 500), // Truncate long abstracts
          authors,
          journal,
          publicationDate,
          doi,
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
        });
      } catch (parseError) {
        console.error('Error parsing article:', parseError);
        continue;
      }
    }

    console.log(`Successfully parsed ${articles.length} articles`);
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
