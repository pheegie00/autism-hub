'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Organization {
  name: string;
  url: string;
  description: string;
  focus: string[];
  liveContent?: string;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async (query?: string) => {
    setLoading(true);
    try {
      const url = query 
        ? `/api/organizations?q=${encodeURIComponent(query)}`
        : '/api/organizations';
      
      const response = await fetch(url);
      const data = await response.json();
      setOrgs(data.organizations || []);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrganizations(searchQuery);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">
            🏛️ Autism Research Organizations
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Nonprofits and foundations leading autism research and advocacy
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organizations by name, focus area..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-6xl mb-4">🔄</div>
            <p className="text-gray-600">Loading organizations...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {orgs.map((org) => (
              <div
                key={org.url}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {org.name}
                </h2>
                <p className="text-gray-600 mb-4">{org.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Focus Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {org.focus.map((focus) => (
                      <span
                        key={focus}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium transition-colors"
                >
                  Visit Website →
                </a>
              </div>
            ))}
          </div>
        )}

        {!loading && orgs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">No organizations found. Try a different search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
