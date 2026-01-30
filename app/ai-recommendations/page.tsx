import Link from 'next/link';

export default function AIRecommendationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6 animate-pulse">🤖</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Therapy Recommendations</h1>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized, research-backed therapy suggestions
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">🚧 Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your child&apos;s symptoms and our AI will analyze research to suggest evidence-based therapy combinations tailored to your needs.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-4">
            <p className="text-purple-800 text-sm">
              ✨ Features: Personalized analysis • Research-backed • Evidence levels • Dietary recommendations
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Not medical advice - always consult your doctor before starting any treatment
          </p>
        </div>
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
