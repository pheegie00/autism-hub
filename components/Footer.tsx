import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Maryland Autism Hub</h3>
            <p className="text-sm text-gray-400">
              Evidence-based autism services, research, and news for Maryland families.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/directory" className="hover:text-white">Provider Directory</Link></li>
              <li><Link href="/research" className="hover:text-white">Research Search</Link></li>
              <li><Link href="/news" className="hover:text-white">Latest News</Link></li>
              <li><Link href="/organizations" className="hover:text-white">Organizations</Link></li>
              <li><Link href="/ai-recommendations" className="hover:text-white text-purple-400">AI Therapy Recommendations</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://forms.gle/gbrgKGSuAPfFPTSK9" target="_blank" rel="noopener noreferrer" className="hover:text-white">Submit Your Practice</a></li>
              <li><a href="https://www.kennedykrieger.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">Kennedy Krieger Institute</a></li>
              <li><a href="https://www.autismspeaks.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">Autism Speaks</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support This Resource</h3>
            <p className="text-sm text-gray-400 mb-4">
              Help us keep this resource 100% free for Maryland families.
            </p>
            <a
              href="https://buymeacoffee.com/arthurpheda"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-white font-bold mb-3 flex items-center">
              <span className="text-2xl mr-2">⚕️</span>
              Medical Disclaimer
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">This is NOT medical advice.</strong> The information provided on this website is for educational and informational purposes only. It should not be construed as medical advice, diagnosis, or treatment recommendations.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Always consult with a qualified healthcare provider</strong> before starting, stopping, or changing any treatment, therapy, medication, or intervention for autism or any other medical condition. The information on this site does not replace professional medical judgment.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Evidence levels vary.</strong> Treatments listed as "investigational" have emerging but not yet conclusive evidence. Treatments in the "avoid" category have been identified as dangerous or fraudulent. Provider listings do not constitute endorsements.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-white">AI recommendations are not prescriptive.</strong> Our AI therapy suggestion tool uses published research to generate educational recommendations only. These are NOT treatment plans. Every child is unique - work with your medical team to develop an appropriate individualized plan.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Maryland Autism Hub. For educational purposes only. Not medical advice.</p>
          <p className="mt-2">Always consult with qualified healthcare professionals before starting any treatment.</p>
        </div>
      </div>
    </footer>
  );
}
