'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary?: string;
  published_date?: string;
  featured?: boolean;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        setArticles(data.articles || []);
        setCached(data.cached);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">
            📰 Latest Autism News
          </h1>
          <p className="mt-2 text-gray-600">
            Real-time updates from The Transmitter, Autism Speaks, and NIH
          </p>
          {cached && (
            <p className="text-xs text-gray-500 mt-1">
              ⚡ Cached results (refreshes every 6 hours)
            </p>
          )}
        </div>
      </header>

      {/* Featured Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white mb-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">🏛️</span>
            <div className="flex-1">
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                FEATURED • January 2026
              </div>
              <h2 className="text-3xl font-bold mb-3">
                HHS Secretary Kennedy Launches Autism Research Coalition
              </h2>
              <p className="text-lg text-purple-100 mb-4">
                Robert F. Kennedy Jr., the new HHS Secretary, is assembling an autism research coalition that includes two autistic adults as key members. This marks a significant shift toward including autistic voices in federal autism research policy.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.hhs.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  Learn More →
                </a>
                <a
                  href="/research?q=autism+coalition"
                  className="inline-flex items-center bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border-2 border-white/50"
                >
                  Related Research
                </a>
              </div>
              <p className="text-sm text-purple-200 mt-4">
                💡 Key focus areas: Vaccine safety research, environmental factors, treatment efficacy, and representation of autistic perspectives in policy decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading latest news...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article, index) => (
              <article 
                key={index} 
                className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  article.featured 
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300' 
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {article.featured && (
                      <div className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                        🏛️ FEATURED
                      </div>
                    )}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xl font-semibold hover:text-blue-600 block ${
                        article.featured ? 'text-purple-900' : 'text-gray-900'
                      }`}
                    >
                      {article.title}
                    </a>
                    {article.summary && (
                      <p className={`mt-2 text-sm ${
                        article.featured ? 'text-purple-800 font-medium' : 'text-gray-600'
                      }`}>
                        {article.summary}
                      </p>
                    )}
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span className={`font-medium ${
                        article.featured ? 'text-purple-700' : 'text-blue-600'
                      }`}>
                        {article.source}
                      </span>
                      {article.published_date && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{new Date(article.published_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium ${
                        article.featured 
                          ? 'text-purple-600 hover:text-purple-800' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Read →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
