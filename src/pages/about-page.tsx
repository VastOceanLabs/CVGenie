import React from 'react';
import { ArrowLeft } from 'lucide-react';

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

// SEO Meta Tags (for production, add these to your HTML head or use your preferred SEO solution):
// <title>About CVGenie | Free Resume Builder - Our Mission & Features</title>
// <meta name="description" content="Learn about CVGenie, the completely free resume builder with no hidden costs." />
// <meta name="keywords" content="about CVGenie, free resume builder, ATS optimized, no hidden costs, privacy first" />

export function AboutPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <a 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-6 transition-colors"
              aria-label="Navigate back to homepage"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </a>
            <h1 className="text-xl font-bold text-gray-900">About CVGenie</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About CVGenie</h1>
          </header>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                CVGenie is a completely free resume builder designed to help job seekers create 
                professional, ATS-optimized resumes without any hidden costs or limitations.
              </p>
            </section>

            {/* Mission Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                We believe everyone deserves access to professional resume-building tools, 
                regardless of their budget. That&apos;s why CVGenie is and will always be 100% free. 
                No credit cards, no subscriptions, no premium upsells – just professional 
                resume building tools accessible to all.
              </p>
            </section>

            {/* Features Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Professional, ATS-optimized templates designed by career experts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Real-time preview as you build your resume</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Export to high-quality PDF format</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>No account registration required – start building immediately</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Your data stays completely private and secure</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Mobile-friendly design that works on all devices</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Industry-specific templates and guidance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true"></span>
                  <span>Built-in ATS compatibility checker</span>
                </li>
              </ul>
            </section>

            {/* Privacy Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy First</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-blue-900">Your privacy is our priority.</strong> Your resume data is 
                  processed entirely in your browser and never sent to our servers. We don't track your 
                  personal information, store your resume content, or share your data with third parties. 
                  What you build stays with you.
                </p>
              </div>
            </section>

            {/* Why Free Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Completely Free?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We&apos;ve seen too many talented individuals held back by expensive resume services. 
                Quality career tools shouldn&apos;t be a luxury – they should be accessible to everyone 
                looking to advance their career.
              </p>
              <p className="text-gray-700 leading-relaxed">
                CVGenie is supported by optional donations and ethical partnerships, but our core 
                mission remains unchanged: provide professional-grade resume building tools to 
                every job seeker, completely free of charge.
              </p>
            </section>

            {/* Contact/Support Section */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions or Feedback?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We&apos;re always looking to improve CVGenie and better serve the job seeking community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:support@cvgenie.com" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Send email to CVGenie support team"
                >
                  Get in Touch
                </a>
                <a 
                  href="/builder"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try CVGenie Now
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AboutPage;