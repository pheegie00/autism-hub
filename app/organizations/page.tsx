import Link from 'next/link';

export default function OrganizationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🏛️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Organizations</h1>
        <p className="text-xl text-gray-600 mb-8">
          Nonprofits & foundations leading autism research
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">🚧 Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Discover leading autism research organizations, nonprofits, and foundations making a difference for the autism community.
          </p>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-orange-800 text-sm">
              ✨ Features: Research foundations • Advocacy groups • Support organizations • Local resources
            </p>
          </div>
        </div>
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
