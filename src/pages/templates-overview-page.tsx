import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, Eye, Zap, Target, Users, Briefcase, Palette, Layout, CheckCircle, ArrowRight, Play, Award, TrendingUp, Clock, Heart, BookOpen, Sparkles } from 'lucide-react';

// Extended template database
const templates = {
  professional: {
    id: 'professional',
    name: 'Professional',
    category: 'Corporate',
    style: 'Traditional',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    layout: 'single-column',
    description: 'Clean, traditional design perfect for corporate roles and conservative industries',
    longDescription: 'Our Professional template features a timeless, conservative design that works perfectly for corporate environments, finance, law, healthcare, and government positions. The clean layout emphasizes readability and professionalism.',
    atsScore: 95,
    popularity: 4.9,
    downloads: 125000,
    features: ['ATS-Optimized', 'Print-Friendly', 'Professional Fonts', 'Conservative Layout'],
    bestFor: ['Corporate Jobs', 'Finance', 'Law', 'Healthcare', 'Government'],
    industries: ['Finance', 'Legal', 'Healthcare', 'Consulting', 'Government'],
    preview: '/templates/professional-preview.jpg'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    category: 'Creative',
    style: 'Contemporary',
    colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    layout: 'two-column',
    description: 'Contemporary design with striking color accents and modern typography',
    longDescription: 'The Modern template combines contemporary design principles with professional appeal. Features bold typography, strategic use of color, and a balanced two-column layout that stands out while remaining professional.',
    atsScore: 88,
    popularity: 4.8,
    downloads: 98000,
    features: ['Modern Design', 'Color Accents', 'Two-Column Layout', 'Contemporary Fonts'],
    bestFor: ['Tech Companies', 'Startups', 'Marketing', 'Design', 'Media'],
    industries: ['Technology', 'Marketing', 'Startups', 'Media', 'Design'],
    preview: '/templates/modern-preview.jpg'
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    category: 'Design',
    style: 'Artistic',
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
    layout: 'creative',
    description: 'Artistic design perfect for creative industries and portfolio-based roles',
    longDescription: 'Designed for creative professionals who want to showcase their design sensibility. Features unique layouts, creative typography, and visual elements that demonstrate your creative capabilities.',
    atsScore: 75,
    popularity: 4.6,
    downloads: 67000,
    features: ['Unique Layout', 'Creative Typography', 'Visual Elements', 'Portfolio Focus'],
    bestFor: ['Graphic Design', 'Art Direction', 'UX/UI Design', 'Photography', 'Marketing'],
    industries: ['Design', 'Advertising', 'Media', 'Arts', 'Fashion'],
    preview: '/templates/creative-preview.jpg'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    category: 'Classic',
    style: 'Clean',
    colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#9ca3af' },
    layout: 'minimal',
    description: 'Clean and simple design for timeless appeal and maximum readability',
    longDescription: 'The Minimal template focuses on content over decoration. Clean lines, excellent typography, and strategic white space create a sophisticated look that never goes out of style.',
    atsScore: 92,
    popularity: 4.7,
    downloads: 89000,
    features: ['Minimalist Design', 'Excellent Typography', 'High Readability', 'Timeless Appeal'],
    bestFor: ['Any Industry', 'Academic', 'Research', 'Consulting', 'Executive'],
    industries: ['Academic', 'Research', 'Consulting', 'Non-profit', 'Executive'],
    preview: '/templates/minimal-preview.jpg'
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    category: 'Leadership',
    style: 'Premium',
    colors: { primary: '#1f2937', secondary: '#111827', accent: '#374151' },
    layout: 'single-column',
    description: 'Premium design for senior leadership and executive positions',
    longDescription: 'Crafted for C-level executives and senior management. Features sophisticated typography, premium spacing, and a layout that commands attention while maintaining the gravitas expected at executive levels.',
    atsScore: 94,
    popularity: 4.8,
    downloads: 45000,
    features: ['Premium Design', 'Executive Focus', 'Sophisticated Layout', 'Leadership Emphasis'],
    bestFor: ['C-Level', 'VP Roles', 'Senior Management', 'Board Positions', 'Executive Search'],
    industries: ['Executive', 'Finance', 'Consulting', 'Manufacturing', 'Healthcare'],
    preview: '/templates/executive-preview.jpg'
  },
  tech: {
    id: 'tech',
    name: 'Tech Pro',
    category: 'Technology',
    style: 'Technical',
    colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' },
    layout: 'two-column',
    description: 'Designed specifically for software engineers and tech professionals',
    longDescription: 'Built for the tech industry with sections optimized for technical skills, programming languages, and project showcases. Clean code-like structure that resonates with technical hiring managers.',
    atsScore: 90,
    popularity: 4.9,
    downloads: 112000,
    features: ['Tech-Optimized', 'Skills Showcase', 'Project Focus', 'GitHub Integration'],
    bestFor: ['Software Engineers', 'Data Scientists', 'DevOps', 'Product Managers', 'Tech Leads'],
    industries: ['Software', 'Data Science', 'DevOps', 'Product', 'Cybersecurity'],
    preview: '/templates/tech-preview.jpg'
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    category: 'Medical',
    style: 'Professional',
    colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#f87171' },
    layout: 'single-column',
    description: 'Trusted design for medical professionals and healthcare workers',
    longDescription: 'Specifically designed for healthcare professionals with sections for certifications, clinical experience, and medical specializations. Professional appearance that builds trust with medical institutions.',
    atsScore: 93,
    popularity: 4.7,
    downloads: 78000,
    features: ['Medical Focus', 'Certification Emphasis', 'Clinical Layout', 'Trust-Building'],
    bestFor: ['Nurses', 'Doctors', 'Medical Assistants', 'Healthcare Admin', 'Therapists'],
    industries: ['Nursing', 'Medicine', 'Therapy', 'Healthcare Admin', 'Medical Tech'],
    preview: '/templates/healthcare-preview.jpg'
  },
  trades: {
    id: 'trades',
    name: 'Skilled Trades',
    category: 'Blue-Collar',
    style: 'Practical',
    colors: { primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c' },
    layout: 'single-column',
    description: 'Practical design highlighting certifications and hands-on experience',
    longDescription: 'Built for skilled tradespeople with emphasis on certifications, safety training, and hands-on experience. Straightforward design that highlights practical skills and reliability.',
    atsScore: 91,
    popularity: 4.6,
    downloads: 34000,
    features: ['Certification Focus', 'Safety Emphasis', 'Experience Highlight', 'Practical Layout'],
    bestFor: ['Electricians', 'Plumbers', 'HVAC', 'Construction', 'Mechanics'],
    industries: ['Electrical', 'Plumbing', 'HVAC', 'Construction', 'Automotive'],
    preview: '/templates/trades-preview.jpg'
  }
};

const categories = [
  { id: 'all', name: 'All Templates', count: Object.keys(templates).length },
  { id: 'Corporate', name: 'Corporate', count: 3 },
  { id: 'Creative', name: 'Creative', count: 2 },
  { id: 'Technology', name: 'Technology', count: 1 },
  { id: 'Medical', name: 'Healthcare', count: 1 },
  { id: 'Blue-Collar', name: 'Skilled Trades', count: 1 }
];

const sortOptions = [
  { id: 'popularity', name: 'Most Popular' },
  { id: 'ats-score', name: 'Highest ATS Score' },
  { id: 'downloads', name: 'Most Downloaded' },
  { id: 'newest', name: 'Newest First' }
];

// Template Card Component
function TemplateCard({ template, onPreview, onUseTemplate }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Template Preview */}
      <div className="relative aspect-[8.5/11] bg-gray-100">
        <div 
          className="w-full h-full bg-gradient-to-br"
          style={{ 
            background: `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.secondary}08)` 
          }}
        >
          {/* Mock Resume Preview */}
          <div className="p-6 h-full flex flex-col text-xs">
            <div className="text-center mb-4">
              <div className="h-2 bg-gray-800 rounded mb-1"></div>
              <div className="h-1 bg-gray-600 rounded mb-2 w-3/4 mx-auto"></div>
              <div className="h-1 bg-gray-500 rounded w-1/2 mx-auto"></div>
            </div>
            
            <div className="space-y-3 flex-1">
              <div>
                <div className="h-1 rounded mb-1" style={{ backgroundColor: template.colors.primary }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-400 rounded w-full"></div>
                  <div className="h-1 bg-gray-400 rounded w-4/5"></div>
                  <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                </div>
              </div>
              
              <div>
                <div className="h-1 rounded mb-1" style={{ backgroundColor: template.colors.primary }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-400 rounded w-full"></div>
                  <div className="h-1 bg-gray-400 rounded w-5/6"></div>
                </div>
              </div>
              
              <div>
                <div className="h-1 rounded mb-1" style={{ backgroundColor: template.colors.primary }}></div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="h-1 bg-gray-400 rounded"></div>
                  <div className="h-1 bg-gray-400 rounded"></div>
                  <div className="h-1 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex space-x-3">
            <button
              onClick={() => onPreview(template)}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onUseTemplate(template)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Use Template</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Template Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{template.popularity}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              {feature}
            </span>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span className={`font-medium ${
                template.atsScore >= 90 ? 'text-green-600' : 
                template.atsScore >= 80 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {template.atsScore}% ATS
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>{(template.downloads / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Use Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Templates Page Component
export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort templates
  const filteredTemplates = Object.values(templates).filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.bestFor.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'ats-score':
        return b.atsScore - a.atsScore;
      case 'downloads':
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const handlePreview = (template) => {
    // Navigate to template preview
    window.open(`/templates/${template.id}`, '_blank');
  };

  const handleUseTemplate = (template) => {
    // Navigate to builder with template
    window.location.href = `/builder?template=${template.id}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags would go in document head */}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Resume Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose from our collection of ATS-optimized, professionally designed resume templates. 
              All templates are completely free, customizable, and ready to download.
            </p>
            
            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">100% Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">ATS-Optimized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700">500k+ Downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">Fully Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Templates?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every template is designed with your success in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS-Optimized</h3>
              <p className="text-gray-600">
                All templates pass Applicant Tracking Systems with 85%+ compatibility scores
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fully Customizable</h3>
              <p className="text-gray-600">
                Customize colors, fonts, sections, and layouts to match your personal brand
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry-Tested</h3>
              <p className="text-gray-600">
                Designed by HR professionals and tested with hiring managers across industries
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Download</h3>
              <p className="text-gray-600">
                Create and download your resume in PDF or Word format in just minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose a template and start building your resume in minutes. No sign-up required, completely free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/builder'}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Building Now</span>
            </button>
            <button
              onClick={() => window.location.href = '/resume-examples'}
              className="inline-flex items-center space-x-2 px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>View Examples</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}