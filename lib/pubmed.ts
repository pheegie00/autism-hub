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
    // Expand search terms for broader international coverage
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
        useMinDate = false; // Don't restrict date for specific topics - they have older research
        break;
      }
    }
    
    // If query is generic or empty, use diverse autism research terms
    if (!query || query.length < 3 || query === 'treatment' || query === 'autism') {
      searchTerm = '(autism OR ASD OR "autism spectrum disorder") AND (treatment OR therapy OR intervention OR microbiome OR "gut bacteria" OR HBOT OR "hyperbaric oxygen" OR leucovorin OR folinic OR "stem cell" OR "stem cells" OR oxytocin OR bumetanide OR cannabidiol OR CBD OR diet OR probiotic OR methylation OR epigenetic OR "African American" OR "Black children" OR "racial disparities" OR "health disparities" OR MMR OR vaccine OR vaccination OR immunization OR "vaccine safety")';
    } else if (!query.match(/\(|\|/)) {
      // Only add autism context if user didn't already provide complex boolean query
      searchTerm = `(autism OR ASD OR "autism spectrum disorder" OR autistic) AND (${searchTerm})`;
    }

    console.log(`Searching PubMed for: ${searchTerm.slice(0, 100)}...`);

    const params: any = {
      db: 'pubmed',
      term: searchTerm,
      retmax: maxResults,
      retmode: 'json',
      sort: 'relevance', // Changed to relevance for better results
    };
    
    // Only add mindate for recent topics
    if (useMinDate) {
      params.mindate = '2018'; // Expanded from 2020 to 2018 for more results
    }

    const response = await axios.get(PUBMED_SEARCH_URL, { 
      params,
      timeout: 10000 // 10 second timeout
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
      timeout: 15000 // 15 second timeout
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
