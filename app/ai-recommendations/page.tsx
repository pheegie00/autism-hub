'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateRecommendations, ChildProfile, Recommendation } from '@/lib/recommendations';

const CONCERN_OPTIONS = [
  { value: 'communication', label: 'Communication / Language' },
  { value: 'speech_delay', label: 'Speech Delay' },
  { value: 'nonverbal', label: 'Nonverbal / Limited Speech' },
  { value: 'behavior', label: 'Challenging Behaviors' },
  { value: 'aggression', label: 'Aggression' },
  { value: 'self_injury', label: 'Self-Injury' },
  { value: 'tantrums', label: 'Tantrums / Meltdowns' },
  { value: 'sensory', label: 'Sensory Sensitivities' },
  { value: 'motor_skills', label: 'Motor Skills / Coordination' },
  { value: 'social', label: 'Social Skills / Making Friends' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'depression', label: 'Depression / Low Mood' },
  { value: 'sleep', label: 'Sleep Problems' },
  { value: 'eating', label: 'Eating / Feeding Issues' },
  { value: 'attention', label: 'Attention / Focus (ADHD-like)' },
  { value: 'daily_living', label: 'Daily Living Skills' },
];

const CURRENT_THERAPY_OPTIONS = [
  'ABA Therapy',
  'Speech Therapy',
  'Occupational Therapy',
  'Physical Therapy',
  'Social Skills Group',
  'CBT / Talk Therapy',
  'Psychiatry / Medication',
  'None currently',
];

export default function AIRecommendationsPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<ChildProfile>>({
    primaryConcerns: [],
    currentTherapies: [],
    hasGIIssues: false,
    hasSensoryIssues: false,
    hasSleepIssues: false,
    interestedInBiomedical: false,
    budgetConcern: false,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleConcernToggle = (concern: string) => {
    const current = profile.primaryConcerns || [];
    if (current.includes(concern)) {
      setProfile({ ...profile, primaryConcerns: current.filter(c => c !== concern) });
    } else {
      setProfile({ ...profile, primaryConcerns: [...current, concern] });
    }
  };

  const handleTherapyToggle = (therapy: string) => {
    const current = profile.currentTherapies || [];
    if (therapy === 'None currently') {
      setProfile({ ...profile, currentTherapies: [] });
      return;
    }
    if (current.includes(therapy)) {
      setProfile({ ...profile, currentTherapies: current.filter(t => t !== therapy) });
    } else {
      setProfile({ ...profile, currentTherapies: [...current.filter(t => t !== 'None currently'), therapy] });
    }
  };

  const handleSubmit = () => {
    const fullProfile: ChildProfile = {
      age: profile.age || 5,
      primaryConcerns: profile.primaryConcerns || [],
      currentTherapies: profile.currentTherapies || [],
      supportLevel: profile.supportLevel || 'unsure',
      hasGIIssues: profile.hasGIIssues || false,
      hasSensoryIssues: profile.hasSensoryIssues || false,
      hasSleepIssues: profile.hasSleepIssues || false,
      interestedInBiomedical: profile.interestedInBiomedical || false,
      insuranceType: profile.insuranceType || 'private',
      budgetConcern: profile.budgetConcern || false,
    };
    
    const recs = generateRecommendations(fullProfile);
    setRecommendations(recs);
    setStep(4);
  };

  const priorityColors = {
    high: 'border-green-500 bg-green-50',
    medium: 'border-blue-500 bg-blue-50',
    low: 'border-gray-300 bg-gray-50',
  };

  const evidenceColors = {
    strong: 'bg-green-100 text-green-800',
    moderate: 'bg-blue-100 text-blue-800',
    emerging: 'bg-yellow-100 text-yellow-800',
    investigational: 'bg-orange-100 text-orange-800',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🤖 AI Therapy Recommendations
          </h1>
          <p className="text-xl text-gray-600">
            Personalized suggestions based on your child&apos;s unique profile
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 text-sm">
          <p className="font-semibold text-amber-800">⚠️ This is NOT medical advice</p>
          <p className="text-amber-700">
            These suggestions are educational only. Always consult with qualified healthcare professionals 
            before starting any therapy or treatment.
          </p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className={step >= 1 ? 'text-purple-600 font-medium' : ''}>1. Basic Info</span>
              <span className={step >= 2 ? 'text-purple-600 font-medium' : ''}>2. Concerns</span>
              <span className={step >= 3 ? 'text-purple-600 font-medium' : ''}>3. Current Care</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-600 rounded-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your child</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child&apos;s Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter age in years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Level (if known)
                </label>
                <select
                  value={profile.supportLevel || 'unsure'}
                  onChange={(e) => setProfile({ ...profile, supportLevel: e.target.value as ChildProfile['supportLevel'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="unsure">Not sure / Not diagnosed</option>
                  <option value="level1">Level 1 - Requiring Support</option>
                  <option value="level2">Level 2 - Requiring Substantial Support</option>
                  <option value="level3">Level 3 - Requiring Very Substantial Support</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This is from the DSM-5 diagnosis. It&apos;s okay if you don&apos;t know.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Type
                </label>
                <select
                  value={profile.insuranceType || 'private'}
                  onChange={(e) => setProfile({ ...profile, insuranceType: e.target.value as ChildProfile['insuranceType'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="private">Private Insurance</option>
                  <option value="medicaid">Medicaid</option>
                  <option value="mixed">Both / Mixed</option>
                  <option value="selfpay">Self-Pay / No Insurance</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="budget"
                  checked={profile.budgetConcern}
                  onChange={(e) => setProfile({ ...profile, budgetConcern: e.target.checked })}
                  className="w-5 h-5 text-purple-600"
                />
                <label htmlFor="budget" className="text-gray-700">
                  Budget is a significant concern (prioritize covered services)
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!profile.age}
              className="mt-8 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Concerns */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Primary Concerns</h2>
            <p className="text-gray-600 mb-6">Select all areas where your child needs support:</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {CONCERN_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleConcernToggle(option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    profile.primaryConcerns?.includes(option.value)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <p className="font-medium text-gray-700">Additional factors:</p>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="gi"
                  checked={profile.hasGIIssues}
                  onChange={(e) => setProfile({ ...profile, hasGIIssues: e.target.checked })}
                  className="w-5 h-5 text-purple-600"
                />
                <label htmlFor="gi" className="text-gray-700">
                  GI issues (constipation, diarrhea, stomach pain)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="biomedical"
                  checked={profile.interestedInBiomedical}
                  onChange={(e) => setProfile({ ...profile, interestedInBiomedical: e.target.checked })}
                  className="w-5 h-5 text-purple-600"
                />
                <label htmlFor="biomedical" className="text-gray-700">
                  Interested in supplements / biomedical approaches
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={(profile.primaryConcerns?.length || 0) === 0}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Current Therapies */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Therapies</h2>
            <p className="text-gray-600 mb-6">What therapies is your child already receiving?</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {CURRENT_THERAPY_OPTIONS.map(option => (
                <button
                  key={option}
                  onClick={() => handleTherapyToggle(option)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    profile.currentTherapies?.includes(option) || 
                    (option === 'None currently' && profile.currentTherapies?.length === 0)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                Get Recommendations 🎯
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Personalized Recommendations
              </h2>
              <p className="text-gray-600">
                Based on a {profile.age}-year-old with{' '}
                {profile.primaryConcerns?.slice(0, 3).join(', ')}
                {(profile.primaryConcerns?.length || 0) > 3 && ` and ${(profile.primaryConcerns?.length || 0) - 3} more concerns`}
              </p>
              
              {profile.currentTherapies && profile.currentTherapies.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Currently receiving: {profile.currentTherapies.join(', ')}
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
              <p className="font-medium text-gray-700 mb-2">Priority & Evidence Levels:</p>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span> High Priority
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Medium Priority
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-400 rounded-full"></span> Consider
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center">
                  <p className="text-gray-600">No specific recommendations based on your selections.</p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 text-purple-600 font-medium hover:underline"
                  >
                    Try again with different inputs
                  </button>
                </div>
              ) : (
                recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl p-5 border-l-4 ${priorityColors[rec.priority]}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{rec.therapy}</h3>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${evidenceColors[rec.evidenceLevel]}`}>
                          {rec.evidenceLevel} evidence
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-purple-600 font-medium mb-2">{rec.category}</p>
                    
                    <p className="text-gray-700 mb-3">{rec.reasoning}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">💰 Cost:</span> {rec.estimatedCost}
                      </div>
                      <div>
                        <span className="font-medium">🏥 Insurance:</span> {rec.insuranceCoverage}
                      </div>
                    </div>

                    {rec.researchLink && (
                      <a
                        href={rec.researchLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        📚 View Research →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setStep(1);
                  setRecommendations([]);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Start Over
              </button>
              <Link
                href="/directory"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 text-center"
              >
                Find Providers →
              </Link>
            </div>

            {/* Final Disclaimer */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
              <p className="font-semibold">⚠️ Important Reminder</p>
              <p>
                These recommendations are generated by an algorithm, not a medical professional. 
                Every child is unique. Please discuss these options with your pediatrician, 
                developmental pediatrician, or other qualified healthcare providers before making 
                any treatment decisions.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
