'use client';

import { useState } from 'react';
import Link from 'next/link';
import newsData from '@/data/news.json';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceShort: string;
  url: string;
  date: string;
  category: string;
  featured: boolean;
  summary: string;
  image: string | null;
}

const news = newsData as NewsItem[];

const CATEGORIES = ['All', 'Policy', 'Research', 'Maryland', 'Resources'];

const categoryColors: Record<string, string> = {
  Policy: 'bg-purple-100 text-purple-800',
  Research: 'bg-blue-100 text-blue-800',
  Maryland: 'bg-green-100 text-green-800',
  Resources: 'bg-orange-100 text-orange-800',
};

const sourceEmojis: Record<string, string> = {
  HHS: '🏛️',
  CDC: '🔬',
  NIH: '🧬',
  MDH: '🦀',
  JAMA: '📚',
  AS: '🧩',
  APRC: '⚖️',
  Nature: '🌿',
};

export default function NewsPage() {
  const [category, setCategory] = useState('All');

  const featured = news.find(n => n.featured);
  const filtered = category === 'All' 
    ? news.filter(n => !n.featured)
    : news.filter(n => n.category === category && !n.featured);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateStr);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📰 Autism News & Updates</h1>
          <p className="text-xl text-gray-600">
            Latest news on autism research, policy, and resources
          </p>
        </div>

        {/* Featured Story */}
        {featured && (
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-8 group"
          >
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-6 group-hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    BREAKING
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[featured.category]}`}>
                    {featured.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getTimeAgo(featured.date)}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                  {featured.title}
                </h2>
                
                <p className="text-gray-600 mb-4 text-lg">
                  {featured.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-xl">{sourceEmojis[featured.sourceShort] || '📰'}</span>
                    <span className="font-medium">{featured.source}</span>
                  </div>
                  <span className="text-purple-600 font-medium group-hover:underline">
                    Read more →
                  </span>
                </div>
              </div>
            </div>
          </a>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filtered.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(item.date)}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.summary}
                </p>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span>{sourceEmojis[item.sourceShort] || '📰'}</span>
                  <span>{item.sourceShort}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* News Sources */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📡 Our News Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'HHS', full: 'Health & Human Services', url: 'https://www.hhs.gov/', emoji: '🏛️' },
              { name: 'CDC', full: 'Centers for Disease Control', url: 'https://www.cdc.gov/autism/', emoji: '🔬' },
              { name: 'NIH', full: 'National Institutes of Health', url: 'https://www.nichd.nih.gov/health/topics/autism', emoji: '🧬' },
              { name: 'Autism Speaks', full: 'Autism Speaks News', url: 'https://www.autismspeaks.org/news', emoji: '🧩' },
            ].map(source => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-2xl mb-1">{source.emoji}</div>
                <div className="font-medium text-gray-900">{source.name}</div>
                <div className="text-xs text-gray-500">{source.full}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">📬 Stay Updated</h3>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Get the latest autism news, research breakthroughs, and Maryland-specific updates delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Submit News Tip */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Have a news tip or story to share?</p>
          <a
            href="https://forms.gle/gbrgKGSuAPfFPTSK9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline"
          >
            Submit a News Tip →
          </a>
        </div>
      </div>
    </main>
  );
}
