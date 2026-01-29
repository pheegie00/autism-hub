'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Provider {
  id: number;
  practice_name: string;
  city: string;
  phone?: string;
  website?: string;
  provider_services: any[];
}

export default function DirectoryPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const [city, setCity] = useState('');
  const [evidenceLevel, setEvidenceLevel] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (evidenceLevel) params.append('evidence_level', evidenceLevel);

      const response = await fetch(`/api/providers?${params}`);
      const data = await response.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Failed to search providers:', error);
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
            🏥 Maryland Provider Directory
          </h1>
          <p className="mt-2 text-gray-600">
            Find evidence-based autism service providers in Maryland
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Baltimore, Annapolis..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Level
              </label>
              <select
                value={evidenceLevel}
                onChange={(e) => setEvidenceLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="table1">Table 1: Evidence-Based</option>
                <option value="table2">Table 2: Investigational</option>
                <option value="table3">Table 3: Low-Risk Adjuncts</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : searched && providers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                No providers found. Try adjusting your search criteria.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Note: Directory is being populated. Check back soon!
              </p>
            </div>
          ) : providers.length > 0 ? (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {provider.practice_name}
                  </h3>
                  <p className="text-gray-600 mt-1">{provider.city}, MD</p>
                  
                  {provider.provider_services && provider.provider_services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {provider.provider_services.map((service: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {service.intervention_categories?.name || 'Service'}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex gap-4 text-sm">
                    {provider.phone && (
                      <a href={`tel:${provider.phone}`} className="text-blue-600 hover:text-blue-800">
                        📞 {provider.phone}
                      </a>
                    )}
                    {provider.website && (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
