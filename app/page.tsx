import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Maryland Autism Hub
          </h1>
          <p className="mt-2 text-gray-600">
            Evidence-based autism services, research, and news for Maryland families
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Latest News */}
          <Link href="/news">
            <section className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">📰</span>
                <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Real-time autism research and discoveries
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Live news feed</p>
                  <p className="text-xs text-gray-500">Firecrawl-powered aggregation from The Transmitter, Autism Speaks, NIH</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="text-blue-600 font-medium text-sm hover:text-blue-800">
                  View News →
                </span>
              </div>
            </section>
          </Link>

          {/* Provider Directory */}
          <Link href="/directory">
            <section className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🏥</span>
                <h2 className="text-xl font-semibold text-gray-900">Provider Directory</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Evidence-based autism services in Maryland
              </p>
              <div className="space-y-2">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm font-semibold text-green-900">✅ Table 1: Evidence-Based</p>
                  <p className="text-xs text-green-700">ABA, Speech, OT, PT</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm font-semibold text-yellow-900">🔬 Table 2: Investigational</p>
                  <p className="text-xs text-yellow-700">Emerging treatments</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm font-semibold text-red-900">☠️ Table 4: DANGER</p>
                  <p className="text-xs text-red-700">Avoid fraudulent treatments</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="text-blue-600 font-medium text-sm hover:text-blue-800">
                  Search Directory →
                </span>
              </div>
            </section>
          </Link>

          {/* Research Search */}
          <Link href="/research">
            <section className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🔬</span>
                <h2 className="text-xl font-semibold text-gray-900">Research Search</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Medical research in plain English
              </p>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm font-medium text-gray-900">Features:</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• PubMed database access</li>
                  <li>• AI plain-English translations</li>
                  <li>• Filter by year & relevance</li>
                </ul>
              </div>
              <div className="mt-6">
                <span className="text-blue-600 font-medium text-sm hover:text-blue-800">
                  Search Research →
                </span>
              </div>
            </section>
          </Link>

        </div>

        {/* Google Form CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-8">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🏥</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Are you an autism service provider in Maryland?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join our evidence-based directory and connect with families seeking quality autism services.
              All submissions are reviewed for evidence level and safety.
            </p>
            <a
              href="https://forms.gle/gbrgKGSuAPfFPTSK9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              Submit Your Practice →
            </a>
            <p className="text-sm text-gray-500 mt-3">
              Takes 3 minutes • Google Form • Free listing
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Iteration 2 Complete!</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✅ Google Form linked for provider submissions</li>
                <li>✅ News aggregation with Firecrawl (6-hour cache)</li>
                <li>✅ Provider directory with search filters</li>
                <li>✅ PubMed research search integration</li>
                <li>🔄 Next: Populate directory, add AI translations, SEO automation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
