import React from 'react';
import { Mail, Heart, Star, Award, Shield, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Signals Bar */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-green-400" />
              <span>ATS-Optimized Templates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Trusted by 100,000+ Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">FreeResume Builder</h3>
            <p className="text-gray-300 mb-4">
              Create professional resumes with our free, ATS-optimized resume builder. 
              No hidden fees, no credit card required. Build your perfect resume in minutes.
            </p>
            <div className="flex items-center space-x-2 text-green-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Made with love for job seekers worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/builder" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Resume Builder</a></li>
              <li><a href="/templates" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Free Templates</a></li>
              <li><a href="/resume-examples" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Resume Examples</a></li>
              <li><a href="/cover-letter" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Cover Letter Builder</a></li>
              <li><a href="/blog" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Career Tips</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/blog/resume-tips" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Resume Writing Tips</a></li>
              <li><a href="/blog/ats-optimization" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">ATS Optimization</a></li>
              <li><a href="/faq" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">FAQ</a></li>
              <li><a href="/about" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">About Us</a></li>
              <li><a href="/contact" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Contact</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/privacy" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Terms of Service</a></li>
              <li><a href="/cookies" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Cookie Policy</a></li>
              <li><a href="/help" className="hover:text-white hover:underline transition-colors focus:outline-none focus:underline">Help Center</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 FreeResume Builder. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-gray-400 text-sm">Made for job seekers worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FreeResume Builder",
            "url": "https://freeresume-builder.pages.dev",
            "description": "Free online resume builder with professional templates",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://freeresume-builder.pages.dev/contact"
              }
            ]
          })
        }}
      />
    </footer>
  );
}