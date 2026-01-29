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
            Your comprehensive resource for autism services, research, and news
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Latest News */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">📰</span>
              <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest autism research and discoveries
            </p>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="text-sm font-medium text-gray-900">Coming soon...</p>
                <p className="text-xs text-gray-500">Daily autism news aggregation</p>
              </div>
            </div>
          </section>

          {/* Provider Directory */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🏥</span>
              <h2 className="text-xl font-semibold text-gray-900">Provider Directory</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Find evidence-based autism service providers in Maryland
            </p>
            <div className="space-y-2">
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm font-medium text-gray-900">Search by:</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>• Service Type (ABA, Speech, OT, PT)</li>
                  <li>• Location</li>
                  <li>• Evidence Level</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Research Search */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🔬</span>
              <h2 className="text-xl font-semibold text-gray-900">Research Search</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Medical research translated into plain English
            </p>
            <div className="bg-gray-50 rounded p-3">
              <p className="text-sm font-medium text-gray-900">Features:</p>
              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                <li>• Search PubMed database</li>
                <li>• AI plain-English translations</li>
                <li>• Filter by year & relevance</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Status Banner */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🚧</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Iteration 1 - In Progress</h3>
              <p className="text-sm text-blue-800">
                This site is actively being built. Features will be added iteratively.
                Current status: Foundation complete, connecting Supabase, building features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
