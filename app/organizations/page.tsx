'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import orgsData from '@/data/organizations.json';

interface Organization {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  services: string[];
  featured: boolean;
}

const organizations = orgsData as Organization[];

const CATEGORIES = [
  { name: 'All', emoji: '🏛️' },
  { name: 'Advocacy & Support', emoji: '💪' },
  { name: 'Medical & Research', emoji: '🔬' },
  { name: 'Government Services', emoji: '🏛️' },
  { name: 'Schools', emoji: '🏫' },
  { name: 'Recreation', emoji: '⚽' },
];

const categoryColors: Record<string, string> = {
  'Advocacy & Support': 'bg-purple-100 text-purple-800 border-purple-300',
  'Medical & Research': 'bg-blue-100 text-blue-800 border-blue-300',
  'Government Services': 'bg-green-100 text-green-800 border-green-300',
  'Schools': 'bg-orange-100 text-orange-800 border-orange-300',
  'Recreation': 'bg-pink-100 text-pink-800 border-pink-300',
};

export default function OrganizationsPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const featured = organizations.filter(o => o.featured);
  
  const filtered = useMemo(() => {
    return organizations.filter(org => {
      const matchesCategory = category === 'All' || org.category === category;
      const matchesSearch = search === '' || 
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.description.toLowerCase().includes(search.toLowerCase()) ||
        org.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏛️ Maryland Autism Organizations</h1>
          <p className="text-xl text-gray-600">
            Support groups, advocacy organizations, schools, and government services
          </p>
        </div>

        {/* Featured Organizations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ Key Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map(org => (
              <a
                key={org.id}
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 border-2 border-yellow-300 hover:-translate-y-1"
              >
                <div className="text-2xl mb-2">⭐</div>
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{org.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{org.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search organizations, services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  category === cat.name
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-teal-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filtered.length} of {organizations.length} organizations
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {CATEGORIES.filter(c => c.name !== 'All').map(cat => {
            const count = organizations.filter(o => o.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`p-3 rounded-lg text-center transition-all ${
                  category === cat.name
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-white hover:bg-teal-50 text-gray-700 shadow'
                }`}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-xs font-medium">{cat.name.split(' & ')[0]}</div>
                <div className="text-lg font-bold">{count}</div>
              </button>
            );
          })}
        </div>

        {/* Organizations Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {filtered.map(org => (
            <div
              key={org.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                categoryColors[org.category]?.split(' ')[2] || 'border-gray-300'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{org.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[org.category] || 'bg-gray-100 text-gray-800'}`}>
                    {org.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{org.description}</p>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {org.services.map(service => (
                    <span
                      key={service}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="text-sm text-gray-600 space-y-1">
                  {org.address && org.city && (
                    <p>📍 {org.city}, {org.state}</p>
                  )}
                  {org.phone && (
                    <p>
                      📞{' '}
                      <a href={`tel:${org.phone.replace(/\D/g, '')}`} className="text-blue-600 hover:underline">
                        {formatPhone(org.phone)}
                      </a>
                    </p>
                  )}
                  {org.website && (
                    <p>
                      🌐{' '}
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website →
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links by Category */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🔗 Quick Links</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-purple-700 mb-2">💪 Get Support</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="https://www.pathfindersforautism.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Pathfinders for Autism</a></li>
                <li><a href="https://www.ppmd.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Parents' Place of MD</a></li>
                <li><a href="https://autisticadvocacy.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ASAN</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-2">🏛️ State Services</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="https://health.maryland.gov/dda/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MD DDA / Autism Waiver</a></li>
                <li><a href="https://marylandpublicschools.org/programs/Pages/Special-Education/Infants-Toddlers.aspx" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Infants & Toddlers Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">🔬 Research & Medical</h4>
              <ul className="space-y-1 text-sm">
                <li><a href="https://www.kennedykrieger.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Kennedy Krieger Institute</a></li>
                <li><a href="https://www.hussmanautism.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hussman Institute</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Organization */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Know an Organization We're Missing?</h3>
          <p className="text-teal-100 mb-6">
            Help us build the most complete resource for Maryland autism families.
          </p>
          <a
            href="https://forms.gle/gbrgKGSuAPfFPTSK9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-teal-600 font-bold px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors"
          >
            Submit an Organization →
          </a>
        </div>
      </div>
    </main>
  );
}
