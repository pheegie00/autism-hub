import Link from 'next/link';
import EmailModal from '@/components/EmailModal';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <EmailModal />
      
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Maryland Autism Hub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Evidence-based autism services, research, and news for Maryland families
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link
                href="/directory"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Find Services
              </Link>
              <Link
                href="/research"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all shadow-lg"
              >
                Explore Research
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Latest News */}
          <Link href="/news" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-t-4 border-blue-500 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600">
                Latest News
              </h2>
              <p className="text-gray-600 mb-4">
                Real-time autism research discoveries and breakthroughs
              </p>
              <span className="text-blue-600 font-semibold group-hover:underline">
                View News →
              </span>
            </div>
          </Link>

          {/* Provider Directory */}
          <Link href="/directory" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-t-4 border-green-500 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600">
                Provider Directory
              </h2>
              <p className="text-gray-600 mb-4">
                Evidence-based autism services in Maryland
              </p>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">ABA</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Speech</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">OT</span>
              </div>
              <span className="text-green-600 font-semibold group-hover:underline">
                Search Directory →
              </span>
            </div>
          </Link>

          {/* Research Search */}
          <Link href="/research" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-t-4 border-purple-500 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🔬</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600">
                Research Search
              </h2>
              <p className="text-gray-600 mb-4">
                Medical research translated to plain English
              </p>
              <span className="text-purple-600 font-semibold group-hover:underline">
                Search PubMed →
              </span>
            </div>
          </Link>

          {/* Organizations */}
          <Link href="/organizations" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full border-t-4 border-orange-500 transform hover:-translate-y-1">
              <div className="text-5xl mb-4">🏛️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600">
                Organizations
              </h2>
              <p className="text-gray-600 mb-4">
                Nonprofits & foundations leading autism research
              </p>
              <span className="text-orange-600 font-semibold group-hover:underline">
                Explore Orgs →
              </span>
            </div>
          </Link>

        </div>

        {/* AI Recommendations CTA */}
        <Link href="/ai-recommendations">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-2xl p-12 mb-16 text-center text-white hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="text-6xl mb-6 animate-pulse">🤖</div>
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ NEW AI-POWERED TOOL
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Get Personalized Therapy Recommendations
            </h3>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Tell us about your child&apos;s symptoms and our AI will analyze research to suggest evidence-based therapy combinations - from ABA + speech therapy to dietary interventions and supplements.
            </p>
            <div className="inline-block bg-white text-purple-600 font-bold px-10 py-4 rounded-xl hover:bg-purple-50 transition-colors shadow-xl text-lg">
              Try AI Recommendations →
            </div>
            <p className="text-purple-200 mt-4 text-sm">
              Free • Research-backed • Takes 2 minutes • Not medical advice - always consult your doctor
            </p>
          </div>
        </Link>

        {/* Provider CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-12 mb-16 text-center text-white">
          <div className="text-6xl mb-6">🏥</div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Are you an autism service provider?
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our evidence-based directory and connect with families seeking quality autism services in Maryland.
          </p>
          <a
            href="https://forms.gle/gbrgKGSuAPfFPTSK9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-purple-600 font-bold px-10 py-4 rounded-xl hover:bg-purple-50 transition-colors shadow-xl text-lg"
          >
            Submit Your Practice →
          </a>
          <p className="text-purple-200 mt-4">
            Takes 3 minutes • Free listing • Google Form
          </p>
        </div>

        {/* Evidence-Based Guide */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Evidence-Based Treatment Guide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">✅</span>
                <h4 className="text-xl font-bold text-green-900">Evidence-Based</h4>
              </div>
              <p className="text-green-800 text-sm mb-3">Insurance covered, proven effective</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• ABA Therapy (DTT, NET)</li>
                <li>• Speech Therapy</li>
                <li>• Occupational Therapy</li>
                <li>• Physical Therapy</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">🔬</span>
                <h4 className="text-xl font-bold text-yellow-900">Investigational</h4>
              </div>
              <p className="text-yellow-800 text-sm mb-3">Emerging evidence, discuss with specialists</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Hyperbaric oxygen (HBOT)</li>
                <li>• Social skills groups</li>
                <li>• Sensory integration</li>
                <li>• Music therapy</li>
                <li>• Animal therapy</li>
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-3">⚠️</span>
                <h4 className="text-xl font-bold text-red-900">Avoid</h4>
              </div>
              <p className="text-red-800 text-sm mb-3 font-semibold">Dangerous or fraudulent</p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• MMS/Chlorine dioxide</li>
                <li>• Chelation therapy</li>
                <li>• Lupron protocol</li>
                <li>• Fake/fraudulent &quot;cures&quot;</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support This Resource */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-2xl shadow-2xl p-10 text-center text-white">
          <div className="text-5xl mb-4">☕</div>
          <h3 className="text-3xl font-bold mb-3">
            Support This Free Resource
          </h3>
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            Maryland Autism Hub is 100% free for families. Help us keep it running and expand our resources.
          </p>
          <a
            href="https://buymeacoffee.com/arthurpheda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-orange-600 font-bold px-10 py-4 rounded-xl hover:bg-orange-50 transition-colors shadow-xl text-lg"
          >
            Buy Me a Coffee ☕
          </a>
          <p className="text-white/80 mt-4 text-sm">
            Every donation helps maintain the site and add new features ❤️
          </p>
        </div>

      </div>
    </main>
  );
}
