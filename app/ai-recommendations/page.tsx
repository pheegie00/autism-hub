'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Symptoms {
  stemming: boolean;
  walkingInCircles: boolean;
  limitedSpeech: boolean;
  sensoryIssues: boolean;
  feedingDifficulties: boolean;
  sleepProblems: boolean;
  aggression: boolean;
  anxious: boolean;
  socialChallenges: boolean;
  motorDelays: boolean;
  customSymptoms: string;
}

interface Recommendation {
  category: string;
  therapies: string[];
  rationale: string;
  evidenceLevel: string;
}

export default function AIRecommendationsPage() {
  const [symptoms, setSymptoms] = useState<Symptoms>({
    stemming: false,
    walkingInCircles: false,
    limitedSpeech: false,
    sensoryIssues: false,
    feedingDifficulties: false,
    sleepProblems: false,
    aggression: false,
    anxious: false,
    socialChallenges: false,
    motorDelays: false,
    customSymptoms: ''
  });

  const [childAge, setChildAge] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCheckboxChange = (key: keyof Symptoms) => {
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(true);

    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, childAge })
      });

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="text-white hover:text-indigo-100 text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            🤖 AI Therapy Recommendations
          </h1>
          <p className="text-lg text-indigo-100">
            Get personalized, evidence-based therapy suggestions powered by research analysis
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Disclaimer Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Important: Not Medical Advice</h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                This tool provides <strong>educational recommendations only</strong> based on published research. These are NOT treatment plans or prescriptions. <strong>Always consult with qualified healthcare providers</strong> (pediatrician, neurologist, developmental specialist) before starting any therapy or intervention. Every child is unique and requires individualized assessment.
              </p>
            </div>
          </div>
        </div>

        {!submitted ? (
          /* Symptom Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tell us about your child
            </h2>

            {/* Age */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Child's Age
              </label>
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="e.g., 4 years old"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>

            {/* Symptoms Checklist */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Select observed behaviors and challenges:
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'stemming', label: 'Repetitive movements (stimming, hand flapping)' },
                  { key: 'walkingInCircles', label: 'Walking in circles or repetitive pacing' },
                  { key: 'limitedSpeech', label: 'Limited or no speech' },
                  { key: 'sensoryIssues', label: 'Sensory sensitivities (sounds, textures, lights)' },
                  { key: 'feedingDifficulties', label: 'Feeding difficulties or food aversions' },
                  { key: 'sleepProblems', label: 'Sleep difficulties' },
                  { key: 'aggression', label: 'Aggressive or self-injurious behavior' },
                  { key: 'anxious', label: 'Anxiety or emotional regulation challenges' },
                  { key: 'socialChallenges', label: 'Social interaction difficulties' },
                  { key: 'motorDelays', label: 'Gross or fine motor delays' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={symptoms[key as keyof Symptoms] as boolean}
                      onChange={() => handleCheckboxChange(key as keyof Symptoms)}
                      className="mt-1 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-800">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Symptoms */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional observations or concerns:
              </label>
              <textarea
                value={symptoms.customSymptoms}
                onChange={(e) => setSymptoms(prev => ({ ...prev, customSymptoms: e.target.value }))}
                placeholder="Describe any other behaviors, concerns, or symptoms..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:bg-gray-400 shadow-lg text-lg"
            >
              {loading ? 'Analyzing Research...' : 'Get AI Recommendations'}
            </button>
          </form>
        ) : loading ? (
          /* Loading State */
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Research...</h3>
            <p className="text-gray-600">
              Our AI is reviewing evidence-based interventions and creating personalized recommendations
            </p>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recommended Therapy Protocol
              </h2>
              <p className="text-gray-600 mb-6">
                Based on the symptoms and age you provided, here are evidence-based therapy combinations to discuss with your healthcare team:
              </p>

              {recommendations.map((rec, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <div className="flex items-start mb-4">
                    <span className="text-3xl mr-4">{idx === 0 ? '🎯' : idx === 1 ? '💊' : '🔬'}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{rec.category}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          rec.evidenceLevel === 'Evidence-Based' ? 'bg-green-100 text-green-800' :
                          rec.evidenceLevel === 'Investigational' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.evidenceLevel}
                        </span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {rec.therapies.map((therapy, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            <span className="text-gray-800">{therapy}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong className="text-purple-900">Why this helps:</strong> {rec.rationale}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
              <ol className="space-y-3 text-indigo-100">
                <li className="flex items-start">
                  <span className="font-bold mr-3">1.</span>
                  <span>Schedule a consultation with your child's pediatrician or developmental specialist to discuss these recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3">2.</span>
                  <span>Use our <Link href="/directory" className="underline font-semibold text-white">Provider Directory</Link> to find qualified therapists in Maryland</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3">3.</span>
                  <span>Explore the <Link href="/research" className="underline font-semibold text-white">Research section</Link> to learn more about each therapy</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setRecommendations([]);
                setSymptoms({
                  stemming: false,
                  walkingInCircles: false,
                  limitedSpeech: false,
                  sensoryIssues: false,
                  feedingDifficulties: false,
                  sleepProblems: false,
                  aggression: false,
                  anxious: false,
                  socialChallenges: false,
                  motorDelays: false,
                  customSymptoms: ''
                });
                setChildAge('');
              }}
              className="w-full bg-white text-purple-600 font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start New Assessment
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
