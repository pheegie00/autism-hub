'use client';

import { useState } from 'react';

export default function EmailBanner() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setIsDismissed(true), 3000);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slideUp">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {!submitted ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📰</span>
                <div>
                  <h3 className="font-bold text-lg">Stay Updated on Autism Research</h3>
                  <p className="text-sm text-blue-100">Get the latest news, breakthroughs, and resources.</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-2 rounded-lg border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white min-w-[250px]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors disabled:bg-gray-300 whitespace-nowrap"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              <button
                onClick={() => setIsDismissed(true)}
                className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 text-white/70 hover:text-white text-2xl font-light"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-2">
              <span className="text-3xl">✅</span>
              <p className="text-lg font-semibold">Thanks for subscribing! You're all set.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
