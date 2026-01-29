'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary?: string;
  published_date?: string;
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <article key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {article.title}
                    </a>
                    {article.summary && (
                      <p className="mt-2 text-gray-600 text-sm">{article.summary}</p>
                    )}
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span className="font-medium text-blue-600">{article.source}</span>
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
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
