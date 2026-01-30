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

export async function searchPubMed(query: string, maxResults: number = 50): Promise<string[]> {
  try {
    let searchTerm = query;
    let useMinDate = true;
    
    // Expand specific search terms with variations and synonyms
    const expandedTerms: Record<string, string> = {
      'HBOT': '(HBOT OR "hyperbaric oxygen" OR "hyperbaric oxygen therapy" OR HBO OR "hyperbaric treatment")',
      'hyperbaric': '(HBOT OR "hyperbaric oxygen" OR "hyperbaric oxygen therapy" OR HBO OR "hyperbaric treatment")',
      'MMR vaccine': '(MMR OR "measles mumps rubella" OR "MMR vaccine" OR "MMR vaccination" OR "vaccine safety")',
      'stem cell': '("stem cell" OR "stem cells" OR "mesenchymal stem" OR "neural stem" OR "cord blood" OR "cell therapy")',
      'microbiome': '(microbiome OR "gut bacteria" OR "gut microbiota" OR microbiota OR probiotic OR probiotics OR "intestinal bacteria")',
      'leucovorin': '(leucovorin OR "folinic acid" OR folate OR "folic acid" OR "cerebral folate")',
      'vaccine': '(vaccine OR vaccination OR immunization OR MMR OR "vaccine safety" OR "adverse events")',
      'African American': '("African American" OR "Black children" OR "racial disparities" OR "health disparities" OR "health equity" OR minority)',
    };
    
    // Check if query matches any expandable term
    for (const [key, expansion] of Object.entries(expandedTerms)) {
      if (query.toLowerCase().includes(key.toLowerCase())) {
        searchTerm = expansion;
        useMinDate = false;
        break;
      }
    }
    
    // If query is generic or empty, use diverse autism research terms
    if (!query || query.length < 3 || query === 'treatment' || query === 'autism') {
      searchTerm = '(autism OR ASD OR "autism spectrum disorder") AND (treatment OR therapy OR intervention OR microbiome OR "gut bacteria" OR HBOT OR "hyperbaric oxygen" OR leucovorin OR folinic OR "stem cell" OR "stem cells" OR oxytocin OR bumetanide OR cannabidiol OR CBD OR diet OR probiotic OR methylation OR epigenetic OR "African American" OR "Black children" OR "racial disparities" OR "health disparities" OR MMR OR vaccine OR vaccination OR immunization OR "vaccine safety")';
    } else if (!query.match(/\(|\|/)) {
      searchTerm = `(autism OR ASD OR "autism spectrum disorder" OR autistic) AND (${searchTerm})`;
    }

    console.log(`Searching PubMed for: ${searchTerm.slice(0, 100)}...`);

    const params: Record<string, string | number> = {
      db: 'pubmed',
      term: searchTerm,
      retmax: maxResults,
      retmode: 'json',
      sort: 'relevance',
    };
    
    if (useMinDate) {
      params.mindate = '2018';
    }

    const response = await axios.get(PUBMED_SEARCH_URL, { 
      params,
      timeout: 10000
    });

    const idList = response.data.esearchresult?.idlist || [];
    console.log(`PubMed search found ${idList.length} articles for query: ${query}`);
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
      },
      timeout: 15000
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });

    const result = parser.parse(response.data);
    const articles: PubMedArticle[] = [];

    let articleList = result.PubmedArticleSet?.PubmedArticle || [];
    if (!Array.isArray(articleList)) {
      articleList = [articleList];
    }

    // Helper to extract text from potentially complex XML objects
    const extractText = (value: unknown): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return String(value);
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') {
        // Handle objects like { "#text": "content", "sup": "1" }
        const obj = value as Record<string, unknown>;
        if ('#text' in obj) return String(obj['#text']);
        // Try to extract any text-like content
        const textContent = Object.values(obj)
          .filter(v => typeof v === 'string')
          .join(' ');
        return textContent || JSON.stringify(value);
      }
      return String(value);
    };

    for (const article of articleList) {
      try {
        const medlineCitation = article.MedlineCitation;
        const pmid = medlineCitation?.PMID?.['#text'] || medlineCitation?.PMID || 'unknown';
        
        const articleData = medlineCitation?.Article;
        const title = extractText(articleData?.ArticleTitle) || 'No title available';
        
        let abstract = 'No abstract available';
        const abstractData = articleData?.Abstract?.AbstractText;
        if (abstractData) {
          if (Array.isArray(abstractData)) {
            abstract = abstractData
              .map((a: { '#text'?: string } | string) => (typeof a === 'object' ? a['#text'] : a) || a)
              .join(' ');
          } else {
            abstract = (typeof abstractData === 'object' ? abstractData['#text'] : abstractData) || abstractData;
          }
        }

        let authors = 'Authors not listed';
        const authorList = articleData?.AuthorList?.Author;
        if (authorList) {
          const authorArray = Array.isArray(authorList) ? authorList : [authorList];
          const authorNames = authorArray
            .slice(0, 3)
            .map((author: { LastName?: string; Initials?: string }) => {
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

        const journal = extractText(articleData?.Journal?.Title) || 
                       extractText(articleData?.Journal?.ISOAbbreviation) || 
                       'Unknown journal';

        let publicationDate = 'Date unknown';
        const pubDate = articleData?.Journal?.JournalIssue?.PubDate;
        if (pubDate) {
          const year = pubDate.Year || '';
          const month = pubDate.Month || '';
          publicationDate = `${month} ${year}`.trim();
        }

        const articleIds = article.PubmedData?.ArticleIdList?.ArticleId;
        let doi = undefined;
        if (articleIds) {
          const idArray = Array.isArray(articleIds) ? articleIds : [articleIds];
          const doiObj = idArray.find((id: { '@_IdType'?: string; '#text'?: string }) => id['@_IdType'] === 'doi');
          doi = doiObj?.['#text'] || (typeof doiObj === 'string' ? doiObj : undefined);
        }

        articles.push({
          pubmedId: pmid.toString(),
          title,
          abstract: abstract.slice(0, 500),
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
