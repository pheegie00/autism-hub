import Link from 'next/link';

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🏥</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Provider Directory</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find evidence-based autism service providers in Maryland
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">🚧 Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re building a comprehensive directory with hundreds of verified providers including ABA, Speech Therapy, Occupational Therapy, and more.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">ABA Therapy</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Speech Therapy</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Occupational Therapy</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Physical Therapy</span>
          </div>
        </div>
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
