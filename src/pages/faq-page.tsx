import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Shield, 
  Download, 
  Zap, 
  Target, 
  Users, 
  FileText, 
  Star,
  ArrowRight,
  HelpCircle,
  Clock,
  Palette
} from 'lucide-react';

/* 
  Performance & Accessibility Optimizations:
  - useCallback for toggleFAQ to prevent unnecessary re-renders
  - useMemo for popularFAQs to avoid recomputation 
  - ARIA attributes for screen reader accessibility
  - Unique keys with context prefixes to prevent React confusion
  - Smooth scrolling on category changes
  - Color map guards for robustness
  - Transition animations for polished UX
  - Type guards with (category as any)?.property for safe property access

  TypeScript interfaces (if converting to .tsx):
  interface FAQ {
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    popular?: boolean;
    categoryTitle?: string;
    category?: string;
  }
  
  type CategoryKey = keyof typeof faqCategories;
  
  Note: Using (category as any)?.property pattern to safely access 
  dynamic object properties while maintaining TypeScript compatibility.
*/

// FAQ Data with categories and SEO-optimized content
const faqCategories = {
  general: {
    title: "General Questions",
    icon: HelpCircle,
    color: "blue",
    faqs: [
      {
        id: "really-free",
        question: "Is FreeResume Builder really free forever?",
        answer: "Yes! FreeResume Builder is completely free with no hidden costs, premium plans, or credit card requirements. You can create unlimited resumes, access all templates, and download PDFs without any charges. We believe everyone deserves access to professional resume building tools.",
        keywords: ["free resume builder", "no hidden costs", "no credit card"],
        popular: true
      },
      {
        id: "no-signup",
        question: "Do I need to create an account or sign up?",
        answer: "No account required! You can start building your resume immediately without any registration. Your resume data is stored locally in your browser, giving you complete privacy and control over your information.",
        keywords: ["no sign up", "no registration", "no account"]
      },
      {
        id: "how-it-works",
        question: "How does the resume builder work?",
        answer: "Our step-by-step builder guides you through each section: Personal Info, Work Experience, Education, Skills, and Certifications. Real-time ATS analysis helps optimize your content while you type. Once complete, download your professional resume as a PDF instantly.",
        keywords: ["how to use", "step by step", "resume building process"]
      },
      {
        id: "browser-compatibility",
        question: "Which browsers are supported?",
        answer: "FreeResume Builder works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser. The builder is fully responsive and works on desktop, tablet, and mobile devices.",
        keywords: ["browser support", "compatibility", "mobile friendly"]
      }
    ]
  },
  ats: {
    title: "ATS Optimization",
    icon: Target,
    color: "green",
    faqs: [
      {
        id: "what-is-ats",
        question: "What is ATS and why does it matter?",
        answer: "ATS (Applicant Tracking System) is software used by 90% of large companies to automatically scan and filter resumes. Our ATS optimization ensures your resume gets past these systems by using proper formatting, relevant keywords, and standard section headers that ATS software can easily read.",
        keywords: ["ATS optimization", "applicant tracking system", "resume scanning"],
        popular: true
      },
      {
        id: "ats-score",
        question: "What does the ATS score mean?",
        answer: "Your ATS score (0-100%) indicates how well your resume will perform with ATS systems. Scores above 80% are excellent, 60-80% are good, and below 60% need improvement. The score considers keyword density, formatting, content completeness, and industry-specific requirements.",
        keywords: ["ATS score", "resume optimization", "ATS rating"]
      },
      {
        id: "improve-ats",
        question: "How can I improve my ATS score?",
        answer: "To boost your ATS score: 1) Include relevant keywords from job descriptions, 2) Use standard section headers, 3) Add quantified achievements with numbers, 4) Include industry-specific skills, 5) Use simple formatting without graphics or tables, 6) Ensure your contact information is easily readable.",
        keywords: ["improve ATS score", "ATS tips", "resume optimization tips"]
      },
      {
        id: "ats-keywords",
        question: "How do I find the right keywords for my resume?",
        answer: "Copy keywords directly from job descriptions you're applying to. Focus on: technical skills, soft skills, job titles, industry terms, certifications, and tools mentioned. Our builder suggests industry-specific keywords based on your job title and provides real-time keyword analysis.",
        keywords: ["resume keywords", "job description keywords", "ATS keywords"]
      }
    ]
  },
  templates: {
    title: "Templates & Design",
    icon: Palette,
    color: "purple",
    faqs: [
      {
        id: "template-selection",
        question: "Which resume template should I choose?",
        answer: "Choose based on your industry: Professional template for corporate/finance roles, Modern for tech/startups, Creative for design/marketing, and ATS-Friendly for maximum compatibility. All templates are optimized for ATS systems while maintaining visual appeal.",
        keywords: ["best resume template", "template selection", "resume design"],
        popular: true
      },
      {
        id: "customize-templates",
        question: "Can I customize the template colors and fonts?",
        answer: "Yes! You can customize colors to match your personal brand or industry preferences. All fonts are carefully selected for both visual appeal and ATS compatibility. Changes are applied instantly to your live preview.",
        keywords: ["customize resume", "template customization", "resume colors"]
      },
      {
        id: "template-switching",
        question: "Can I switch templates after adding content?",
        answer: "Absolutely! Your content is preserved when switching between templates. You can try different designs and see how your information looks in various layouts without losing any data.",
        keywords: ["switch templates", "change resume design", "template compatibility"]
      },
      {
        id: "print-optimization",
        question: "Are templates optimized for printing?",
        answer: "Yes, all templates are designed for both digital viewing and high-quality printing. They use print-safe colors, proper margins, and formatting that looks professional on paper. PDF downloads maintain perfect print quality.",
        keywords: ["print resume", "print optimization", "print quality"]
      }
    ]
  },
  download: {
    title: "Download & File Formats",
    icon: Download,
    color: "orange",
    faqs: [
      {
        id: "file-formats",
        question: "What file formats are available for download?",
        answer: "Currently, we offer high-quality PDF downloads, which is the preferred format for job applications. PDFs maintain consistent formatting across all devices and are accepted by all ATS systems. Additional formats may be added in the future.",
        keywords: ["PDF download", "file formats", "resume formats"],
        popular: true
      },
      {
        id: "download-quality",
        question: "What's the quality of the PDF download?",
        answer: "Our PDFs are generated at 300 DPI for crisp, professional quality suitable for both digital submission and printing. File sizes are optimized for email attachments while maintaining visual excellence.",
        keywords: ["PDF quality", "download quality", "high resolution"]
      },
      {
        id: "download-limits",
        question: "Are there limits on how many times I can download?",
        answer: "No limits! Download your resume as many times as needed. Update your content and generate new PDFs whenever you apply for different positions or want to make improvements.",
        keywords: ["download limits", "unlimited downloads", "multiple downloads"]
      },
      {
        id: "mobile-download",
        question: "Can I download my resume on mobile devices?",
        answer: "Yes! Our mobile-responsive builder allows you to create and download resumes on smartphones and tablets. The PDF generation works seamlessly across all devices.",
        keywords: ["mobile download", "smartphone resume", "mobile PDF"]
      }
    ]
  },
  privacy: {
    title: "Privacy & Security",
    icon: Shield,
    color: "red",
    faqs: [
      {
        id: "data-storage",
        question: "Where is my resume data stored?",
        answer: "Your resume data is stored locally in your browser only. We don't upload, store, or access your personal information on our servers. This ensures complete privacy and gives you full control over your data.",
        keywords: ["data privacy", "local storage", "data security"],
        popular: true
      },
      {
        id: "data-sharing",
        question: "Do you share my information with third parties?",
        answer: "Never! We don&apos;t collect, store, or share any personal information from your resumes. No data is sent to our servers, and we don&apos;t track the content you enter. Your privacy is our priority.",
        keywords: ["data sharing", "privacy policy", "personal information"]
      },
      {
        id: "gdpr-compliance",
        question: "Are you GDPR compliant?",
        answer: "Yes, we're fully GDPR compliant. Since we don't collect or store personal data, there's minimal privacy risk. European users have complete control over their data, which never leaves their browser.",
        keywords: ["GDPR", "EU privacy", "data protection"]
      },
      {
        id: "data-deletion",
        question: "How do I delete my resume data?",
        answer: "Simply clear your browser's local storage or use an incognito/private browsing session. Since data is stored locally, you have complete control over deletion. We provide clear instructions in our help section.",
        keywords: ["delete data", "remove resume", "clear data"]
      }
    ]
  },
  technical: {
    title: "Technical Support",
    icon: Zap,
    color: "indigo",
    faqs: [
      {
        id: "not-loading",
        question: "What if the resume builder won't load?",
        answer: "Try refreshing the page, clearing your browser cache, or using an incognito window. Ensure JavaScript is enabled and you&apos;re using a supported browser. If issues persist, try a different browser or contact our support team.",
        keywords: ["not loading", "technical issues", "troubleshooting"]
      },
      {
        id: "lost-data",
        question: "What if I lose my resume data?",
        answer: "Data is automatically saved as you type. However, clearing browser data or switching devices will remove local storage. We recommend downloading your PDF frequently and keeping backups of important versions.",
        keywords: ["lost data", "auto save", "data recovery"]
      },
      {
        id: "slow-performance",
        question: "Why is the builder running slowly?",
        answer: "Slow performance can result from: too many browser tabs, outdated browser, low device memory, or poor internet connection. Close unnecessary tabs, update your browser, and ensure stable internet connectivity.",
        keywords: ["slow performance", "speed issues", "optimization"]
      },
      {
        id: "mobile-issues",
        question: "I'm having issues on mobile. What should I do?",
        answer: "Ensure you&apos;re using a supported mobile browser (Chrome, Safari, Firefox). Rotate your device to landscape mode for easier editing. If typing is difficult, consider starting on desktop and making final edits on mobile.",
        keywords: ["mobile issues", "smartphone problems", "mobile editing"]
      }
    ]
  }
};

// Search functionality with validation
const searchFAQs = (searchTerm, categories) => {
  // Input validation
  if (!searchTerm || typeof searchTerm !== 'string') {
    console.warn('searchFAQs: searchTerm must be a non-empty string');
    return [];
  }
  
  if (!categories || typeof categories !== 'object') {
    console.warn('searchFAQs: categories must be an object');
    return [];
  }

  const results = [];
  Object.entries(categories).forEach(([categoryKey, category]) => {
    if (!category || !Array.isArray((category as any)?.faqs)) {
      console.warn(`searchFAQs: Invalid category structure for ${categoryKey}`);
      return;
    }
    
    (category as any).faqs.forEach(faq => {
      if (!faq || typeof faq.question !== 'string' || typeof faq.answer !== 'string') {
        console.warn('searchFAQs: Invalid FAQ structure');
        return;
      }
      
      const keywords = Array.isArray(faq.keywords) ? faq.keywords : [];
      
      if (
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keywords.some(keyword => 
          typeof keyword === 'string' && keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        results.push({ ...faq, category: categoryKey, categoryTitle: (category as any)?.title });
      }
    });
  });
  return results;
};

// FAQ Item Component
function FAQItem({ faq, isOpen, onToggle, showCategory = false }) {
  // Prop validation
  if (!faq || typeof faq.question !== 'string' || typeof faq.answer !== 'string') {
    console.warn('FAQItem: Invalid faq prop structure');
    return null;
  }
  
  if (typeof isOpen !== 'boolean') {
    console.warn('FAQItem: isOpen must be a boolean');
    return null;
  }
  
  if (typeof onToggle !== 'function') {
    console.warn('FAQItem: onToggle must be a function');
    return null;
  }

  const panelId = `panel-${faq.id}-${faq.category || 'global'}`;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 text-lg">{faq.question}</h3>
            {faq.popular && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Popular
              </span>
            )}
          </div>
          {showCategory && faq.categoryTitle && (
            <p className="text-sm text-gray-500 mt-1">{faq.categoryTitle}</p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div 
          id={panelId}
          className="px-6 py-4 bg-gray-50 border-t border-gray-200 transition-all duration-300"
        >
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
          </div>
          
          {/* Related links */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a 
              href="/builder" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Try Resume Builder
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
            <a 
              href="/templates" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Templates
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Category Card Component
function CategoryCard({ categoryKey, category, onCategorySelect }) {
  // Prop validation
  if (!categoryKey || typeof categoryKey !== 'string') {
    console.warn('CategoryCard: categoryKey must be a non-empty string');
    return null;
  }
  
  if (!category || typeof category !== 'object') {
    console.warn('CategoryCard: category must be an object');
    return null;
  }
  
  if (!(category as any)?.icon || !(category as any)?.title || !Array.isArray((category as any)?.faqs)) {
    console.warn('CategoryCard: category must have icon, title, and faqs array');
    return null;
  }
  
  if (typeof onCategorySelect !== 'function') {
    console.warn('CategoryCard: onCategorySelect must be a function');
    return null;
  }

  const IconComponent = (category as any)?.icon;
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  // Guard against missing color mappings
  const className = colorClasses[(category as any)?.color] ?? 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <button
      onClick={() => onCategorySelect(categoryKey)}
      aria-label={`View ${(category as any)?.title} questions`}
      className={`p-6 rounded-lg border-2 transition-all hover:shadow-md text-left w-full ${className}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <IconComponent className="w-8 h-8" />
        <h3 className="text-lg font-semibold text-gray-900">{(category as any)?.title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-3">
        {(category as any)?.faqs?.length || 0} frequently asked questions
      </p>
      <div className="flex items-center text-sm font-medium">
        <span>View Questions</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </button>
  );
}

export default function FAQPage() {
  const [openFAQs, setOpenFAQs] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Validate faqCategories data structure
  useEffect(() => {
    if (!faqCategories || typeof faqCategories !== 'object') {
      console.error('FAQPage: faqCategories is not properly defined');
      return;
    }
    
    Object.entries(faqCategories).forEach(([key, category]) => {
      if (!category || !(category as any)?.title || !(category as any)?.icon || !Array.isArray((category as any)?.faqs)) {
        console.warn(`FAQPage: Invalid category structure for ${key}`);
      }
    });
  }, []);

  // Optimized toggle function with useCallback and validation
  const toggleFAQ = useCallback((faqId) => {
    if (!faqId || typeof faqId !== 'string') {
      console.warn('toggleFAQ: faqId must be a non-empty string');
      return;
    }
    
    setOpenFAQs(prev => {
      const next = new Set(prev);
      next.has(faqId) ? next.delete(faqId) : next.add(faqId);
      return next;
    });
  }, []);

  // Handle search with validation
  useEffect(() => {
    if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
      const results = searchFAQs(searchTerm, faqCategories);
      setSearchResults(Array.isArray(results) ? results : []);
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Smooth scroll to top when category changes
  useEffect(() => {
    if (selectedCategory && typeof selectedCategory === 'string') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  // Memoized popular FAQs to avoid recomputation with validation
  const popularFAQs = useMemo(() => {
    if (!faqCategories || typeof faqCategories !== 'object') {
      console.warn('popularFAQs: faqCategories not available');
      return [];
    }
    
    return Object.entries(faqCategories)
      .flatMap(([categoryKey, category]) => {
        if (!category || !Array.isArray((category as any)?.faqs)) {
          console.warn(`popularFAQs: Invalid category structure for ${categoryKey}`);
          return [];
        }
        
        return (category as any).faqs
          .filter(faq => faq && faq.popular === true)
          .map(faq => ({ ...faq, category: categoryKey, categoryTitle: (category as any)?.title }));
      });
  }, []);

  // Safe category selection handler
  const handleCategorySelect = useCallback((categoryKey) => {
    if (!categoryKey || typeof categoryKey !== 'string') {
      console.warn('handleCategorySelect: categoryKey must be a non-empty string');
      return;
    }
    
    if (!(faqCategories as any)?.[categoryKey]) {
      console.warn(`handleCategorySelect: Category ${categoryKey} does not exist`);
      return;
    }
    
    setSelectedCategory(categoryKey);
  }, []);

  // Safe search term handler
  const handleSearchChange = useCallback((e) => {
    const value = e?.target?.value || '';
    setSearchTerm(value);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 
        SEO Implementation Notes for index.html:
        
        <title>FAQ - Free Resume Builder | Common Questions Answered</title>
        <meta name="description" content="Get answers to frequently asked questions about our free resume builder. Learn about ATS optimization, templates, downloads, and privacy." />
        <meta name="robots" content="index, follow" />
        
        FAQ Schema Markup for rich snippets:
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question", 
              "name": "Is FreeResume Builder really free forever?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! FreeResume Builder is completely free with no hidden costs..."
              }
            }
            // ... more FAQ items
          ]
        }
        </script>
      */}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about using our free resume builder. 
              Can&apos;t find your answer? <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact us</a>.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Search frequently asked questions..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results */}
        {showSearch && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSearch(false);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Clear Search
              </button>
            </div>
            
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((faq) => (
                  <FAQItem
                    key={`search-${faq.id}-${faq.category || 'global'}`}
                    faq={faq}
                    isOpen={openFAQs.has(faq.id)}
                    onToggle={() => toggleFAQ(faq.id)}
                    showCategory={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try different keywords or browse categories below.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Popular Questions */}
        {!showSearch && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Most Popular Questions
            </h2>
            <div className="space-y-4">
              {Array.isArray(popularFAQs) && popularFAQs.map((faq) => (
                <FAQItem
                  key={`popular-${faq.id}-${faq.category || 'global'}`}
                  faq={faq}
                  isOpen={openFAQs.has(faq.id)}
                  onToggle={() => toggleFAQ(faq.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Selection */}
        {!showSearch && !selectedCategory && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(faqCategories).map(([categoryKey, category]) => (
                <CategoryCard
                  key={categoryKey}
                  categoryKey={categoryKey}
                  category={category}
                  onCategorySelect={handleCategorySelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Selected Category */}
        {!showSearch && selectedCategory && (faqCategories as any)?.[selectedCategory] && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                {React.createElement((faqCategories as any)[selectedCategory]?.icon, { className: "w-6 h-6 mr-2" })}
                {(faqCategories as any)[selectedCategory]?.title}
              </h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Categories
              </button>
            </div>
            
            <div className="space-y-4">
              {Array.isArray((faqCategories as any)[selectedCategory]?.faqs) && 
                (faqCategories as any)[selectedCategory].faqs.map((faq) => (
                  <FAQItem
                    key={`category-${selectedCategory}-${faq.id}`}
                    faq={faq}
                    isOpen={openFAQs.has(faq.id)}
                    onToggle={() => toggleFAQ(faq.id)}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/builder"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FileText className="w-4 h-4 mr-2" />
              Start Building Your Resume
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/templates"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Palette className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Browse Templates</h3>
            <p className="text-gray-600 text-sm">
              Explore our collection of ATS-optimized resume templates.
            </p>
          </a>

          <a
            href="/resume-examples"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Users className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Resume Examples</h3>
            <p className="text-gray-600 text-sm">
              See industry-specific resume examples and get inspired.
            </p>
          </a>

          <a
            href="/blog/resume-tips"
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <Clock className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Resume Tips</h3>
            <p className="text-gray-600 text-sm">
              Learn best practices for writing effective resumes.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}