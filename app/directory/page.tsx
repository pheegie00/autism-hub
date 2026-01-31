'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import providersData from '@/data/autism-providers.json';

interface Provider {
  npi: string;
  name: string;
  credential: string;
  specialty: string;
  category: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isOrganization: boolean;
  services: string[];
}

const providers = providersData as Provider[];

const CATEGORIES = [
  'All Categories',
  'ABA Therapy',
  'Speech Therapy',
  'Occupational Therapy',
  'Psychology',
  'Psychiatry',
  'Developmental Services',
];

const ITEMS_PER_PAGE = 50;

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [cityFilter, setCityFilter] = useState('');
  const [page, setPage] = useState(1);

  // Get unique cities
  const cities = useMemo(() => {
    const citySet = new Set(providers.map(p => p.city).filter(Boolean));
    return ['All Cities', ...Array.from(citySet).sort()];
  }, []);

  // Filter providers
  const filtered = useMemo(() => {
    return providers.filter(p => {
      const matchesSearch = search === '' || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.specialty.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = category === 'All Categories' || p.category === category;
      const matchesCity = cityFilter === '' || cityFilter === 'All Cities' || p.city === cityFilter;
      
      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [search, category, cityFilter]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatPhone = (phone: string) => {
    if (!phone || phone.length !== 10) return phone;
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏥 Maryland Provider Directory</h1>
          <p className="text-xl text-gray-600">
            {providers.length.toLocaleString()} autism service providers across Maryland
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Data sourced from NPPES (National Provider Registry). Updated January 2026.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name or Specialty
              </label>
              <input
                type="text"
                placeholder="e.g., 'Smith' or 'BCBA'"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category
              </label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginated.length} of {filtered.length.toLocaleString()} providers
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { name: 'ABA Therapy', count: providers.filter(p => p.category === 'ABA Therapy').length, emoji: '🧩' },
            { name: 'Speech Therapy', count: providers.filter(p => p.category === 'Speech Therapy').length, emoji: '🗣️' },
            { name: 'OT', count: providers.filter(p => p.category === 'Occupational Therapy').length, emoji: '✋' },
            { name: 'Psychology', count: providers.filter(p => p.category === 'Psychology').length, emoji: '🧠' },
            { name: 'Psychiatry', count: providers.filter(p => p.category === 'Psychiatry').length, emoji: '💊' },
            { name: 'Dev Services', count: providers.filter(p => p.category === 'Developmental Services').length, emoji: '🌱' },
          ].map(stat => (
            <button
              key={stat.name}
              onClick={() => { setCategory(stat.name === 'OT' ? 'Occupational Therapy' : stat.name === 'Dev Services' ? 'Developmental Services' : stat.name); setPage(1); }}
              className={`p-3 rounded-lg text-center transition-all ${
                category === stat.name || category === (stat.name === 'OT' ? 'Occupational Therapy' : stat.name === 'Dev Services' ? 'Developmental Services' : stat.name)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white hover:bg-blue-50 text-gray-700 shadow'
              }`}
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-xs font-medium">{stat.name}</div>
              <div className="text-lg font-bold">{stat.count.toLocaleString()}</div>
            </button>
          ))}
        </div>

        {/* Provider Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paginated.map((provider) => (
            <div
              key={provider.npi}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {provider.name}
                  {provider.credential && (
                    <span className="text-gray-500 font-normal text-sm ml-1">
                      , {provider.credential}
                    </span>
                  )}
                </h3>
                {provider.isOrganization && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    Org
                  </span>
                )}
              </div>

              <p className="text-sm text-blue-600 font-medium mb-2">
                {provider.specialty}
              </p>

              <div className="text-sm text-gray-600 space-y-1">
                {provider.address && (
                  <p>📍 {provider.address}, {provider.city}, {provider.state} {provider.zip}</p>
                )}
                {provider.phone && (
                  <p>
                    📞{' '}
                    <a 
                      href={`tel:${provider.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {formatPhone(provider.phone)}
                    </a>
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  provider.category === 'ABA Therapy' ? 'bg-green-100 text-green-700' :
                  provider.category === 'Speech Therapy' ? 'bg-blue-100 text-blue-700' :
                  provider.category === 'Occupational Therapy' ? 'bg-orange-100 text-orange-700' :
                  provider.category === 'Psychology' ? 'bg-purple-100 text-purple-700' :
                  provider.category === 'Psychiatry' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {provider.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <p className="font-semibold mb-1">⚠️ Disclaimer</p>
          <p>
            This directory is sourced from the NPPES national registry. Provider information may be outdated.
            Always verify credentials, insurance acceptance, and autism specialization directly with the provider.
            Listing does not constitute an endorsement.
          </p>
        </div>
      </div>
    </main>
  );
}
