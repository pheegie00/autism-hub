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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">
            🔬 Autism Research Search
          </h1>
          <p className="mt-2 text-gray-600">
            Search PubMed medical research with plain-English summaries
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: treatment, therapy, intervention..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Searches PubMed database for autism-related research
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
            <div className="space-y-6">
              {papers.map((paper) => (
                <article key={paper.pubmedId} className="bg-white rounded-lg shadow-md p-6">
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {paper.title}
                  </a>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    {paper.authors} • {paper.journal} • {paper.publicationDate}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">📄 Abstract:</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {paper.abstract}
                    </p>
                  </div>

                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="text-sm font-medium text-blue-900 mb-2">🤖 Plain English (coming soon):</p>
                    <p className="text-sm text-blue-800">
                      AI translation feature will be added in next iteration
                    </p>
                  </div>

                  <div className="mt-4">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read full paper on PubMed →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
