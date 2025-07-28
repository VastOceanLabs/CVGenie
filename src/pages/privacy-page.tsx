import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server, Globe, Mail, Calendar, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// SEO: Add these meta tags to the HTML head in the actual implementation:
// <title>Privacy Policy | FreeResume Builder - Your Data Stays Private</title>
// <meta name="description" content="FreeResume Builder's privacy policy. Your resume data stays in your browser - we never store or share your personal information. GDPR compliant.">
// <meta name="robots" content="index, follow">

// Structured Data: Add this JSON-LD script to the head:
// {
//   "@context": "https://schema.org",
//   "@type": "WebPage",
//   "name": "Privacy Policy",
//   "description": "FreeResume Builder Privacy Policy",
//   "url": "https://freeresume-builder.pages.dev/privacy",
//   "isPartOf": {
//     "@type": "WebSite",
//     "name": "FreeResume Builder",
//     "url": "https://freeresume-builder.pages.dev"
//   }
// }

export default function PrivacyPage() {
  // Use ISO date format for better maintainability
  const lastUpdatedISO = "2025-01-15";
  const lastUpdated = new Date(lastUpdatedISO).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const policies = [
    {
      icon: Lock,
      title: "Your Data Stays Private",
      description: "All resume processing happens in your browser. We never see or store your personal information.",
      color: "text-green-600"
    },
    {
      icon: Server,
      title: "No Server Storage",
      description: "Your resume data is never uploaded to our servers. Everything is processed locally on your device.",
      color: "text-blue-600"
    },
    {
      icon: Eye,
      title: "No Content Tracking",
      description: "We don't analyze, read, or store any content you enter into your resume.",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "We follow strict European privacy standards to protect your rights and data.",
      color: "text-orange-600"
    }
  ];

  const dataTypes = [
    {
      category: "Resume Content",
      items: ["Personal information", "Work experience", "Education details", "Skills and certifications"],
      storage: "Local browser only",
      retention: "Until you clear browser data",
      icon: FileText,
      color: "bg-blue-50 text-blue-700"
    },
    {
      category: "Usage Analytics",
      items: ["Page views", "Feature usage", "Performance metrics", "Error reports"],
      storage: "Google Analytics (anonymized)",
      retention: "26 months (Google&apos;s standard)",
      icon: Users,
      color: "bg-green-50 text-green-700"
    },
    {
      category: "Technical Data",
      items: ["Browser type", "Device information", "IP address (anonymized)", "Page load times"],
      storage: "Cloudflare (hosting provider)",
      retention: "30 days maximum",
      icon: Globe,
      color: "bg-purple-50 text-purple-700"
    }
  ];

  const userRights = [
    {
      right: "Access Your Data",
      description: "Since we don't store your resume data, you have complete access to it in your browser.",
      action: "Available anytime in your browser"
    },
    {
      right: "Delete Your Data",
      description: "Clear your browser data or use incognito mode to ensure no traces remain.",
      action: "Clear browser storage"
    },
    {
      right: "Data Portability",
      description: "Download your resume as PDF or export data anytime without restrictions.",
      action: "Download/export features"
    },
    {
      right: "Opt-out of Analytics",
      description: "Disable analytics tracking through your browser or our settings.",
      action: "Browser privacy settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <a 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              <span>Back to FreeResume</span>
            </a>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">
              Last updated: {lastUpdated} • Clear, honest privacy practices
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Privacy Promise Banner - Uses bg-gradient-to-r with proper to- color utilities */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Privacy Promise</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>FreeResume Builder is designed with privacy first.</strong> Your resume data never leaves your device. 
                We built our service to process everything locally in your browser, ensuring your personal information 
                stays completely private and secure.
              </p>
            </div>
          </div>
        </div>

        {/* Key Privacy Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {policies.map((policy) => {
            const IconComponent = policy.icon;
            return (
              <div key={policy.title} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${policy.color}`}>
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{policy.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{policy.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Privacy Information */}
        <div className="space-y-12">
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            <div className="space-y-6">
              {dataTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <div key={type.category} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{type.category}</h3>
                        <ul className="text-gray-600 text-sm space-y-1 mb-3">
                          {type.items.map((item) => (
                            <li key={item} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" aria-hidden="true"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Storage:</span>
                            <span className="text-gray-600 ml-2">{type.storage}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Retention:</span>
                            <span className="text-gray-600 ml-2">{type.retention}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" aria-hidden="true" />
                    Resume Data (Local Only)
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Generate and format your resume in real-time</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Provide ATS optimization suggestions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Save your progress in your browser&apos;s local storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Export to PDF format</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" aria-hidden="true" />
                    Analytics Data (Anonymized)
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Improve our service performance and user experience</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Understand which features are most helpful</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Fix bugs and technical issues</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Make data-driven decisions for new features</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Sharing & Third Parties</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">We Never Share Your Resume Data</h3>
                      <p className="text-red-700 text-sm">
                        Your personal information, work history, and resume content are never shared with anyone. 
                        This data stays in your browser and is never transmitted to our servers.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Third-Party Services We Use:</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Google Analytics</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Analytics Only</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Provides anonymized usage statistics to help us improve the service.
                      </p>
                      <p className="text-xs text-gray-500">
                        Data: Page views, session duration, general location (country/region)
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Cloudflare</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Hosting Provider</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Hosts our website and provides security, performance, and analytics.
                      </p>
                      <p className="text-xs text-gray-500">
                        Data: IP addresses (for security), technical logs, performance metrics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
            <div className="space-y-4">
              {userRights.map((right) => (
                <div key={right.right} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{right.right}</h3>
                      <p className="text-gray-600 text-sm mb-3">{right.description}</p>
                      <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {right.action}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookies & Local Storage</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Session management</li>
                    <li>• Security features</li>
                    <li>• Basic functionality</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Help us understand how visitors use our website (can be disabled).
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Google Analytics tracking</li>
                    <li>• Performance monitoring</li>
                    <li>• Usage statistics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Local Storage</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Saves your resume data locally in your browser.
                  </p>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Resume content and formatting</li>
                    <li>• User preferences</li>
                    <li>• Draft saves</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-green-600" aria-hidden="true" />
                    Technical Security
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• HTTPS encryption for all data transmission</li>
                    <li>• Cloudflare security and DDoS protection</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Client-side processing (no server storage)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" aria-hidden="true" />
                    Privacy by Design
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Data minimization principles</li>
                    <li>• Local processing architecture</li>
                    <li>• No unnecessary data collection</li>
                    <li>• Transparent privacy practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">International Users</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">GDPR Compliance (EU)</h3>
                  <p className="text-gray-600 text-sm">
                    We comply with the General Data Protection Regulation for all EU users. You have specific rights including 
                    access, rectification, erasure, and data portability. Since we don't store your personal data on our servers, 
                    you maintain complete control over your information.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">CCPA Compliance (California)</h3>
                  <p className="text-gray-600 text-sm">
                    California residents have the right to know what personal information is collected, request deletion of 
                    personal information, and opt-out of the sale of personal information. We do not sell personal information.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Global Privacy Standards</h3>
                  <p className="text-gray-600 text-sm">
                    We apply the highest privacy standards globally, ensuring all users receive the same level of protection 
                    regardless of location.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Updates</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <Calendar className="w-6 h-6 text-blue-600 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How We Handle Changes</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We may update this privacy policy occasionally to reflect changes in our practices or for legal reasons. 
                    When we make significant changes, we&apos;ll notify users by prominently posting the changes on our website.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 text-sm">
                      <strong>Current Version:</strong> {lastUpdated} | 
                      <strong> Previous Version:</strong> December 1, 2024
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Privacy Questions or Concerns</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    If you have any questions about this privacy policy or our privacy practices, please contact us:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-blue-600 ml-2">privacy@freeresume-builder.com</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Response Time:</span>
                      <span className="text-gray-600 ml-2">Within 48 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <a 
              href="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Return to Resume Builder</span>
            </a>
            
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="/faq" className="hover:text-gray-900 transition-colors">FAQ</a>
              <a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}