'use client';

import { useState } from 'react';
import Link from 'next/link';
import investigationalData from '@/data/investigational-providers.json';

interface Provider {
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
  evidenceLevel: string;
  notes: string;
}

const providers = investigationalData as Provider[];

const CATEGORIES = ['All', 'HBOT', 'Stem Cell', 'Biomedical', 'Integrative Medicine', 'Research'];

export default function InvestigationalPage() {
  const [category, setCategory] = useState('All');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const filtered = category === 'All' 
    ? providers 
    : providers.filter(p => p.category === category);

  const formatPhone = (phone: string) => {
    if (!phone || phone.length !== 10) return phone;
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔬 Investigational & Emerging Therapies
          </h1>
          <p className="text-xl text-gray-600">
            Experimental treatments being researched for autism spectrum disorder
          </p>
        </div>

        {/* Critical Disclaimer */}
        {showDisclaimer && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6 relative">
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              ⚠️ IMPORTANT: Read Before Proceeding
            </h2>
            <div className="text-red-700 space-y-2 text-sm">
              <p><strong>These therapies are NOT FDA-approved for autism.</strong> Evidence is limited, mixed, or still being researched.</p>
              <p><strong>Stem cell therapy for autism</strong> has very limited scientific evidence and significant risks. The FDA has warned against unproven stem cell treatments.</p>
              <p><strong>Hyperbaric oxygen therapy (HBOT)</strong> shows some promising research but is not proven effective for autism. Insurance typically does not cover it for ASD.</p>
              <p><strong>Costs can be extremely high</strong> ($10,000-$50,000+) and are rarely covered by insurance.</p>
              <p><strong>Always consult with your child&apos;s medical team</strong> before pursuing any investigational therapy.</p>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                category === cat
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 shadow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Evidence Level Legend */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Evidence Levels:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <strong>Investigational</strong> - Limited/mixed evidence, not FDA-approved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <strong>Research</strong> - Academic/clinical trial stage
            </span>
          </div>
        </div>

        {/* Provider Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {filtered.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-400"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{provider.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  provider.evidenceLevel === 'investigational' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {provider.evidenceLevel}
                </span>
              </div>

              <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full mb-2">
                {provider.category}
              </span>

              <p className="text-sm text-gray-600 mb-3">{provider.description}</p>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                {provider.address && provider.city && (
                  <p>📍 {provider.address}, {provider.city}, {provider.state} {provider.zip}</p>
                )}
                {provider.phone && (
                  <p>
                    📞{' '}
                    <a href={`tel:${provider.phone}`} className="text-blue-600 hover:underline">
                      {formatPhone(provider.phone)}
                    </a>
                  </p>
                )}
                {provider.website && (
                  <p>
                    🌐{' '}
                    <a 
                      href={provider.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </p>
                )}
              </div>

              {provider.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>⚠️ Note:</strong> {provider.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Provider CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Know an Investigational Therapy Provider?</h3>
          <p className="mb-4">Help other families by submitting providers offering HBOT, stem cell, or other emerging therapies.</p>
          <a
            href="https://forms.gle/gbrgKGSuAPfFPTSK9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Submit a Provider →
          </a>
        </div>

        {/* Research Resources */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Research Resources</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <a
              href="https://clinicaltrials.gov/ct2/results?cond=Autism&term=hyperbaric"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <strong>ClinicalTrials.gov - HBOT Studies</strong>
              <p className="text-gray-600">Find active clinical trials for hyperbaric oxygen therapy in autism</p>
            </a>
            <a
              href="https://clinicaltrials.gov/ct2/results?cond=Autism&term=stem+cell"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <strong>ClinicalTrials.gov - Stem Cell Studies</strong>
              <p className="text-gray-600">Find active clinical trials for stem cell therapy in autism</p>
            </a>
            <a
              href="https://www.fda.gov/consumers/consumer-updates/fda-warns-about-stem-cell-therapies"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <strong>FDA Warnings on Stem Cell Therapies</strong>
              <p className="text-gray-600">Important safety information from the FDA</p>
            </a>
            <a
              href="https://www.autism.org/hyperbaric-oxygen-therapy/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <strong>Autism Research Institute - HBOT</strong>
              <p className="text-gray-600">Overview of HBOT research for autism</p>
            </a>
          </div>
        </div>

        {/* Back to Directory */}
        <div className="mt-8 text-center">
          <Link
            href="/directory"
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Back to Main Provider Directory (Evidence-Based Therapies)
          </Link>
        </div>
      </div>
    </main>
  );
}
