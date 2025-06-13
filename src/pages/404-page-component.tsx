import React, { useState, useMemo, useCallback } from 'react';
import { 
  Home, 
  ArrowLeft, 
  ArrowRight,
  FileText, 
  Palette, 
  BookOpen, 
  Search,
  Lightbulb,
  Users,
  Star,
  Zap,
  Target,
  Award,
  Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';

// Constants moved outside component for performance
const DEFAULT_TITLE = 'FreeResume Builder - Create Professional Resumes for Free';
const DEFAULT_DESCRIPTION = 'Build professional resumes for free with ATS-optimized templates. No credit card required, instant PDF download.';

// SEO component with proper cleanup
function SEOHead() {
  React.useEffect(() => {
    // Store original values
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content') || DEFAULT_DESCRIPTION;
    
    // Set 404 page values
    document.title = '404 - Page Not Found | FreeResume Builder';
    
    // Create meta description if it doesn't exist
    if (!metaDescription) {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'Oops! This page doesn\'t exist. Get back to building your professional resume for free with our ATS-optimized templates.';
      document.head.appendChild(newMeta);
    } else {
      metaDescription.setAttribute('content', 'Oops! This page doesn\'t exist. Get back to building your professional resume for free with our ATS-optimized templates.');
    }

    // Cleanup function
    return () => {
      document.title = originalTitle || DEFAULT_TITLE;
      const currentMeta = document.querySelector('meta[name="description"]');
      if (currentMeta) {
        currentMeta.setAttribute('content', originalDescription);
      }
    };
  }, []);

  return null;
}

// Type for navigation function
type NavigateFunction = (path: string) => void;

// Popular suggestions component with proper keys
function PopularSuggestions({ onNavigate }: { onNavigate: NavigateFunction }) {
  // Memoized suggestions array
  const suggestions = useMemo(() => [
    {
      id: 'builder',
      title: 'Resume Builder',
      description: 'Create your professional resume',
      href: '/builder',
      icon: FileText,
      colorClasses: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300',
      popular: true
    },
    {
      id: 'templates',
      title: 'Resume Templates',
      description: 'Browse professional templates',
      href: '/templates',
      icon: Palette,
      colorClasses: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-300',
      popular: true
    },
    {
      id: 'examples',
      title: 'Resume Examples',
      description: 'Industry-specific examples',
      href: '/examples',
      icon: BookOpen,
      colorClasses: 'bg-green-50 text-green-600 border-green-200 hover:border-green-300',
      popular: true
    },
    {
      id: 'blog',
      title: 'Resume Tips',
      description: 'Expert career advice',
      href: '/blog',
      icon: Lightbulb,
      colorClasses: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-300',
      popular: false
    }
  ], []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {suggestions.map((suggestion) => {
        const IconComponent = suggestion.icon;
        return (
          <button
            key={suggestion.id}
            onClick={() => onNavigate(suggestion.href)}
            className={clsx(
              'relative p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer w-full',
              suggestion.colorClasses
            )}
            aria-label={`Go to ${suggestion.title}: ${suggestion.description}`}
          >
            {suggestion.popular && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                <Star className="w-3 h-3" aria-hidden="true" />
                <span>Popular</span>
              </div>
            )}
            <div className="flex flex-col items-center text-center space-y-3">
              <IconComponent className="w-8 h-8" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Quick links component with proper keys
function QuickLinks({ onNavigate }: { onNavigate: NavigateFunction }) {
  // Memoized links array
  const links = useMemo(() => [
    { id: 'professional-template', href: '/templates/professional', text: 'Professional Template', icon: Briefcase },
    { id: 'ats-template', href: '/templates/ats-friendly', text: 'ATS-Friendly Template', icon: Target },
    { id: 'software-example', href: '/examples/software-engineer', text: 'Software Engineer Resume', icon: Zap },
    { id: 'nurse-example', href: '/examples/nurse', text: 'Nursing Resume', icon: Users },
    { id: 'resume-tips', href: '/blog/resume-tips', text: 'Resume Writing Tips', icon: Lightbulb },
    { id: 'ats-guide', href: '/blog/ats-optimization', text: 'ATS Optimization Guide', icon: Award }
  ], []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {links.map((link) => {
        const IconComponent = link.icon;
        return (
          <button
            key={link.id}
            onClick={() => onNavigate(link.href)}
            className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors w-full text-left"
            aria-label={`Go to ${link.text}`}
          >
            <IconComponent className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-gray-700 hover:text-blue-600">{link.text}</span>
          </button>
        );
      })}
    </div>
  );
}

// Main 404 Page Component
export default function NotFoundPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock navigation function (replace with actual router in real app)
  const handleNavigate = useCallback((path: string) => {
    console.log(`Navigating to: ${path}`);
    // Reset search term when navigating
    setSearchTerm('');
    // In real app: navigate(path) or window.location.href = path
    alert(`Would navigate to: ${path}`);
  }, []);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleNavigate('/');
    }
  }, [handleNavigate]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const searchValue = searchTerm.toLowerCase().trim();
    
    if (!searchValue) return;
    
    // Smart routing based on search terms
    if (searchValue.includes('template')) {
      handleNavigate('/templates');
    } else if (searchValue.includes('example')) {
      handleNavigate('/examples');
    } else if (searchValue.includes('build') || searchValue.includes('create')) {
      handleNavigate('/builder');
    } else if (searchValue.includes('tip') || searchValue.includes('help')) {
      handleNavigate('/blog');
    } else {
      handleNavigate('/builder');
    }
  }, [searchTerm, handleNavigate]);

  return (
    <>
      <SEOHead />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button 
                onClick={() => handleNavigate('/')} 
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                aria-label="Go to homepage"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-gray-900">FreeResume Builder</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">100% FREE</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Go Back</span>
                </button>
                
                <button
                  onClick={() => handleNavigate('/')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label="Go to homepage"
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  <span>Home</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-8">
            {/* 404 Hero - Improved responsive design */}
            <div className="space-y-6">
              {/* Large 404 Display - Better responsive sizing */}
              <div className="relative min-h-[200px] sm:min-h-[300px] flex items-center justify-center">
                <h1 
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 opacity-20 select-none"
                  aria-hidden="true"
                >
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" aria-hidden="true" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Oops! Page Not Found</h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      This page seems to have wandered off, but don't worry - 
                      we'll help you find what you're looking for!
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar - Improved accessibility */}
              <div className="max-w-md mx-auto">
                <form 
                  onSubmit={handleSearch} 
                  className="relative"
                  role="search"
                  aria-label="Site search"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for templates, examples, tips..."
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    aria-label="Search for templates, examples, or tips"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-700"
                    aria-label="Submit search"
                  >
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>

            {/* Popular Destinations */}
            <section className="space-y-6" aria-labelledby="popular-heading">
              <div>
                <h3 id="popular-heading" className="text-xl font-semibold text-gray-900 mb-2">Popular Destinations</h3>
                <p className="text-gray-600">Quick access to our most popular features</p>
              </div>
              <PopularSuggestions onNavigate={handleNavigate} />
            </section>

            {/* Quick Links */}
            <section className="space-y-6" aria-labelledby="quicklinks-heading">
              <div>
                <h3 id="quicklinks-heading" className="text-xl font-semibold text-gray-900 mb-2">Quick Links</h3>
                <p className="text-gray-600">More helpful resources to get you started</p>
              </div>
              <QuickLinks onNavigate={handleNavigate} />
            </section>

            {/* CTA Section - Improved contrast */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white" aria-labelledby="cta-heading">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <h3 id="cta-heading" className="text-2xl font-bold">Ready to Build Your Resume?</h3>
                <p className="text-blue-100">
                  Don't let a missing page stop you from landing your dream job. 
                  Our resume builder is 100% free and requires no credit card.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleNavigate('/builder')}
                    className="inline-flex items-center justify-center space-x-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="w-5 h-5" aria-hidden="true" />
                    <span>Start Building Resume</span>
                  </button>
                  <button
                    onClick={() => handleNavigate('/templates')}
                    className="inline-flex items-center justify-center space-x-2 px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    <Palette className="w-5 h-5" aria-hidden="true" />
                    <span>Browse Templates</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Benefits Reminder */}
            <section className="bg-white rounded-xl border border-gray-200 p-6" aria-labelledby="benefits-heading">
              <h4 id="benefits-heading" className="font-semibold text-gray-900 mb-4">Why Choose FreeResume Builder?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" aria-hidden="true"></span>
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" aria-hidden="true"></span>
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" aria-hidden="true"></span>
                  <span>ATS-Optimized Templates</span>
                </div>
                <div className="flex items-center space-x-2 text-orange-600">
                  <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" aria-hidden="true"></span>
                  <span>Instant PDF Download</span>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p>&copy; 2024 FreeResume Builder. All rights reserved.</p>
              <nav className="flex justify-center space-x-6 mt-4" aria-label="Footer navigation">
                <button 
                  onClick={() => handleNavigate('/privacy')} 
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => handleNavigate('/terms')} 
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => handleNavigate('/contact')} 
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </button>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}