'use client';

import { useState, useEffect } from 'react';

export default function EmailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if user already submitted
    const hasSubmitted = localStorage.getItem('autism-hub-email-submitted');
    if (hasSubmitted) return;

    // Show modal after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        localStorage.setItem('autism-hub-email-submitted', 'true');
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all animate-scaleIn">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light"
          aria-label="Close"
        >
          ×
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Stay Updated on Autism News
              </h2>
              <p className="text-gray-600">
                Get the latest research, breakthroughs, and resources delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">You're subscribed!</h3>
            <p className="text-gray-600">Thanks for staying connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
