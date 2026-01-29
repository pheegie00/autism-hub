'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ResearchPaper {
  pubmedId: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string;
  publicationDate: string;
  url: string;
}

export default function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/research?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPapers(data.papers || []);
    } catch (error) {
      console.error('Failed to search research:', error);
    } finally {
      setLoading(false);
    }
  }

  const quickSearches = [
    'microbiome', 'HBOT', 'leucovorin', 'stem cell', 
    'oxytocin', 'bumetanide', 'CBD', 'MMR vaccine',
    'African American boys', 'racial disparities', 'vaccine safety'
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="text-white hover:text-purple-100 text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">
            🔬 International Autism Research
          </h1>
          <p className="mt-2 text-purple-100 text-lg">
            Search PubMed's global database of medical research
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: microbiome, HBOT, MMR vaccine, African American boys, stem cell..."
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:bg-gray-400 font-semibold text-lg shadow-md"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Quick search buttons */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    handleSearch({ preventDefault: () => {} } as any);
                  }}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            🌍 Searching international PubMed database • 2020-2026 research
          </p>
        </form>

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching PubMed...</p>
            </div>
          ) : searched && papers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                No papers found. Try a different search term.
              </p>
            </div>
          ) : papers.length > 0 ? (
            <>
              <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-700">
                  Found <span className="font-bold text-purple-600">{papers.length}</span> research papers
                </p>
              </div>
              
              <div className="space-y-6">
                {papers.map((paper) => (
                  <article key={paper.pubmedId} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        PubMed ID: {paper.pubmedId}
                      </span>
                    </div>
                    
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors block mb-3"
                    >
                      {paper.title}
                    </a>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span>👥 {paper.authors}</span>
                      <span>•</span>
                      <span>📖 {paper.journal}</span>
                      <span>•</span>
                      <span>📅 {paper.publicationDate}</span>
                    </div>

                    <div className="mt-4 bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <p className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">📄</span> Abstract
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {paper.abstract}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-md"
                      >
                        Read Full Paper →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
