import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Download, Eye, Zap, Users, Briefcase, GraduationCap, Heart, Globe, Shield, Target, TrendingUp, Award, Palette, Clock, CheckCircle } from 'lucide-react';

// Types and Interfaces
interface Template {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  atsScore: number;
  popularity: number;
  downloads: number; // Store as number, format on display
  downloadsDisplay: string;
  layout: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  tags: string[];
  industries: string[];
  features: string[];
  seoKeywords: string[];
  previewImage: string;
  available: boolean;
  featured?: boolean;
  comingSoon?: boolean;
}

type CategoryId = 'all' | 'Professional & Business' | 'Industry-Specific' | 'Creative & Specialized' | 'ATS-Optimized';

type SortOption = 'popularity' | 'ats-score' | 'downloads' | 'newest' | 'name';

interface TemplateCategory {
  id: CategoryId;
  name: string;
  icon: React.ElementType;
  count: number;
}

interface SortOptionConfig {
  id: SortOption;
  name: string;
  icon: React.ElementType;
}

interface TemplateCardProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
  onPreview: (template: Template) => void;
}

// Utility function to parse download numbers correctly
const parseDownloadCount = (downloadStr: string): number => {
  const num = parseFloat(downloadStr.replace(/[^\d.]/g, ''));
  if (downloadStr.includes('K')) return num * 1000;
  if (downloadStr.includes('M')) return num * 1000000;
  return num;
};

// Format numbers for display
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
  return num.toString();
};

// Template data with proper typing
const templates: Template[] = [
  // Tier 1: Critical Templates
  {
    id: 'ats-friendly',
    name: 'ATS-Friendly',
    category: 'ATS-Optimized',
    description: 'Ultra-clean design optimized for Applicant Tracking Systems with 99% parsing success rate',
    atsScore: 99,
    popularity: 95,
    downloads: 50000,
    downloadsDisplay: '50K+',
    layout: 'single-column',
    colors: { primary: '#000000', secondary: '#333333', accent: '#666666' },
    tags: ['ATS-Safe', 'Corporate', 'Traditional', 'High-Parsing'],
    industries: ['All Industries', 'Corporate', 'Government', 'Healthcare'],
    features: ['ATS-Optimized', 'Clean Layout', 'Standard Fonts', 'High Compatibility'],
    seoKeywords: ['ats friendly resume template', 'applicant tracking system resume'],
    previewImage: '/images/templates/ats-friendly-preview.jpg',
    available: true,
    featured: true
  },
  {
    id: 'two-column',
    name: 'Two-Column Professional',
    category: 'Professional & Business',
    description: 'Modern two-column layout that maximizes space while maintaining ATS compatibility',
    atsScore: 85,
    popularity: 88,
    downloads: 35000,
    downloadsDisplay: '35K+',
    layout: 'two-column',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    tags: ['Space-Efficient', 'Modern', 'Professional', 'Organized'],
    industries: ['Business', 'Marketing', 'Finance', 'Consulting'],
    features: ['Two-Column Design', 'Skills Sidebar', 'Professional', 'ATS-Compatible'],
    seoKeywords: ['two column resume template', 'modern professional resume'],
    previewImage: '/images/templates/two-column-preview.jpg',
    available: true,
    featured: true
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Professional & Business',
    description: 'Premium template designed for C-level executives and senior leadership positions',
    atsScore: 94,
    popularity: 82,
    downloads: 20000,
    downloadsDisplay: '20K+',
    layout: 'executive',
    colors: { primary: '#1e3a8a', secondary: '#1e40af', accent: '#3b82f6' },
    tags: ['Executive', 'Premium', 'Leadership', 'Senior-Level'],
    industries: ['Executive', 'C-Level', 'Director', 'VP'],
    features: ['Executive Summary', 'Achievement Focus', 'Premium Design', 'Leadership'],
    seoKeywords: ['executive resume template', 'ceo resume template'],
    previewImage: '/images/templates/executive-preview.jpg',
    available: true,
    featured: true
  },
  {
    id: 'entry-level',
    name: 'Entry-Level & Student',
    category: 'Professional & Business',
    description: 'Perfect for recent graduates and career starters with limited experience',
    atsScore: 90,
    popularity: 92,
    downloads: 45000,
    downloadsDisplay: '45K+',
    layout: 'education-focused',
    colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
    tags: ['Student', 'Graduate', 'Entry-Level', 'Education-Focused'],
    industries: ['Student', 'Graduate', 'Intern', 'Entry-Level'],
    features: ['Education Emphasis', 'Skills Focus', 'Internship Ready', 'Clean Design'],
    seoKeywords: ['entry level resume template', 'student resume template'],
    previewImage: '/images/templates/entry-level-preview.jpg',
    available: true,
    featured: true
  },

  // Tier 2: Industry-Specific Templates
  {
    id: 'software-engineer',
    name: 'Software Engineer & Tech',
    category: 'Industry-Specific',
    description: 'Designed for developers with technical skills showcase and project portfolio integration',
    atsScore: 93,
    popularity: 89,
    downloads: 30000,
    downloadsDisplay: '30K+',
    layout: 'tech-focused',
    colors: { primary: '#6366f1', secondary: '#4f46e5', accent: '#8b5cf6' },
    tags: ['Tech', 'Developer', 'Programming', 'Projects'],
    industries: ['Software Development', 'Technology', 'Engineering', 'Startups'],
    features: ['Technical Skills', 'GitHub Integration', 'Project Showcase', 'Modern Design'],
    seoKeywords: ['software engineer resume template', 'developer resume template'],
    previewImage: '/images/templates/software-engineer-preview.jpg',
    available: false, // Change to true when ready
    featured: true,
    comingSoon: true
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Nursing',
    category: 'Industry-Specific',
    description: 'Specialized for healthcare professionals with certifications and clinical experience focus',
    atsScore: 95,
    popularity: 78,
    downloads: 25000,
    downloadsDisplay: '25K+',
    layout: 'healthcare',
    colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
    tags: ['Healthcare', 'Nursing', 'Medical', 'Clinical'],
    industries: ['Healthcare', 'Nursing', 'Medical', 'Clinical'],
    features: ['Certifications Focus', 'Clinical Experience', 'License Numbers', 'Patient Care'],
    seoKeywords: ['nursing resume template', 'healthcare resume template'],
    previewImage: '/images/templates/healthcare-preview.jpg',
    available: true
  },
  {
    id: 'trades',
    name: 'Skilled Trades & Blue-Collar',
    category: 'Industry-Specific',
    description: 'Built for electricians, plumbers, and skilled trades with safety certifications',
    atsScore: 88,
    popularity: 71,
    downloads: 15000,
    downloadsDisplay: '15K+',
    layout: 'trades',
    colors: { primary: '#d97706', secondary: '#b45309', accent: '#f59e0b' },
    tags: ['Trades', 'Blue-Collar', 'Safety', 'Certifications'],
    industries: ['Electrical', 'Plumbing', 'Construction', 'Manufacturing'],
    features: ['Safety Training', 'Trade Licenses', 'Apprenticeships', 'Hands-On Skills'],
    seoKeywords: ['electrician resume template', 'trades resume template'],
    previewImage: '/images/templates/trades-preview.jpg',
    available: true
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    category: 'Industry-Specific',
    description: 'Results-focused template highlighting metrics, achievements, and revenue generation',
    atsScore: 91,
    popularity: 85,
    downloads: 22000,
    downloadsDisplay: '22K+',
    layout: 'metrics-focused',
    colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
    tags: ['Sales', 'Marketing', 'Metrics', 'Results'],
    industries: ['Sales', 'Marketing', 'Business Development', 'Account Management'],
    features: ['Metrics Focus', 'Achievement Emphasis', 'Revenue Tracking', 'Goal-Oriented'],
    seoKeywords: ['sales resume template', 'marketing resume template'],
    previewImage: '/images/templates/sales-marketing-preview.jpg',
    available: true
  },

  // Tier 3: Creative & Specialized
  {
    id: 'creative',
    name: 'Creative Professional',
    category: 'Creative & Specialized',
    description: 'Artistic design for creatives with portfolio integration and visual elements',
    atsScore: 75,
    popularity: 76,
    downloads: 18000,
    downloadsDisplay: '18K+',
    layout: 'creative',
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
    tags: ['Creative', 'Design', 'Portfolio', 'Visual'],
    industries: ['Graphic Design', 'Marketing', 'Advertising', 'Media'],
    features: ['Portfolio Integration', 'Visual Elements', 'Creative Layout', 'Brand Focus'],
    seoKeywords: ['creative resume template', 'graphic designer resume'],
    previewImage: '/images/templates/creative-preview.jpg',
    available: true
  },
  {
    id: 'academic',
    name: 'Academic & Research',
    category: 'Creative & Specialized',
    description: 'Comprehensive format for academics with publications, research, and conferences',
    atsScore: 92,
    popularity: 65,
    downloads: 12000,
    downloadsDisplay: '12K+',
    layout: 'academic',
    colors: { primary: '#374151', secondary: '#1f2937', accent: '#6b7280' },
    tags: ['Academic', 'Research', 'Publications', 'PhD'],
    industries: ['Academia', 'Research', 'Education', 'Science'],
    features: ['Publications List', 'Research Focus', 'Conference Papers', 'Academic Format'],
    seoKeywords: ['academic resume template', 'phd resume template'],
    previewImage: '/images/templates/academic-preview.jpg',
    available: true
  },
  {
    id: 'federal',
    name: 'Federal & Government',
    category: 'Creative & Specialized',
    description: 'Compliant with federal resume requirements and government position standards',
    atsScore: 96,
    popularity: 58,
    downloads: 8000,
    downloadsDisplay: '8K+',
    layout: 'federal',
    colors: { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6' },
    tags: ['Federal', 'Government', 'Compliance', 'Detailed'],
    industries: ['Government', 'Federal', 'Contractor', 'Military'],
    features: ['Federal Format', 'Security Clearance', 'Pay Grades', 'Compliance'],
    seoKeywords: ['federal resume template', 'government resume template'],
    previewImage: '/images/templates/federal-preview.jpg',
    available: true
  },
  {
    id: 'european',
    name: 'European CV & International',
    category: 'Creative & Specialized',
    description: 'International format with photo options and European CV standards',
    atsScore: 89,
    popularity: 52,
    downloads: 10000,
    downloadsDisplay: '10K+',
    layout: 'international',
    colors: { primary: '#0d9488', secondary: '#0f766e', accent: '#14b8a6' },
    tags: ['International', 'European', 'Global', 'CV-Format'],
    industries: ['International', 'European', 'Global', 'Consulting'],
    features: ['Photo Option', 'European Format', 'International', 'Multi-Language'],
    seoKeywords: ['european cv template', 'international resume template'],
    previewImage: '/images/templates/european-preview.jpg',
    available: true
  },

  // Core Templates
  {
    id: 'professional',
    name: 'Professional Classic',
    category: 'Professional & Business',
    description: 'Timeless professional design suitable for all industries and experience levels',
    atsScore: 95,
    popularity: 90,
    downloads: 60000,
    downloadsDisplay: '60K+',
    layout: 'single-column',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    tags: ['Classic', 'Professional', 'Versatile', 'Clean'],
    industries: ['All Industries', 'Corporate', 'Business', 'Finance'],
    features: ['Classic Design', 'Professional', 'ATS-Friendly', 'Versatile'],
    seoKeywords: ['professional resume template', 'classic resume template'],
    previewImage: '/images/templates/professional-preview.jpg',
    available: true,
    featured: true
  },
  {
    id: 'modern',
    name: 'Modern Contemporary',
    category: 'Professional & Business',
    description: 'Contemporary design with subtle modern elements and clean typography',
    atsScore: 88,
    popularity: 87,
    downloads: 40000,
    downloadsDisplay: '40K+',
    layout: 'modern',
    colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    tags: ['Modern', 'Contemporary', 'Clean', 'Stylish'],
    industries: ['Technology', 'Startups', 'Creative', 'Marketing'],
    features: ['Modern Design', 'Clean Typography', 'Contemporary', 'Professional'],
    seoKeywords: ['modern resume template', 'contemporary resume template'],
    previewImage: '/images/templates/modern-preview.jpg',
    available: true,
    featured: true
  }
];

// Template categories with calculated counts
const getCategories = (templates: Template[]): TemplateCategory[] => [
  { id: 'all', name: 'All Templates', icon: Briefcase, count: templates.length },
  { id: 'Professional & Business', name: 'Professional & Business', icon: Briefcase, count: templates.filter(t => t.category === 'Professional & Business').length },
  { id: 'Industry-Specific', name: 'Industry-Specific', icon: Users, count: templates.filter(t => t.category === 'Industry-Specific').length },
  { id: 'Creative & Specialized', name: 'Creative & Specialized', icon: Palette, count: templates.filter(t => t.category === 'Creative & Specialized').length },
  { id: 'ATS-Optimized', name: 'ATS-Optimized', icon: Target, count: templates.filter(t => t.category === 'ATS-Optimized').length }
];

// Sort options
const sortOptions: SortOptionConfig[] = [
  { id: 'popularity', name: 'Most Popular', icon: TrendingUp },
  { id: 'ats-score', name: 'Highest ATS Score', icon: Target },
  { id: 'downloads', name: 'Most Downloaded', icon: Download },
  { id: 'newest', name: 'Newest First', icon: Clock },
  { id: 'name', name: 'Alphabetical', icon: Filter }
];

// Template Card Component
function TemplateCard({ template, onUseTemplate, onPreview }: TemplateCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleUseTemplate = async () => {
    if (isNavigating || !template.available) return;
    
    setIsNavigating(true);
    try {
      await onUseTemplate(template);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Template Preview */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <img 
          src={template.previewImage} 
          alt={`${template.name} resume template preview`}
          role="img"
          aria-label={`Preview of ${template.name} resume template`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onPreview(template)}
              className="flex items-center space-x-1 px-3 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors text-sm font-medium"
              aria-label={`Preview ${template.name} template`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            {template.available ? (
              <button
                onClick={handleUseTemplate}
                disabled={isNavigating}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                aria-label={`Use ${template.name} template`}
              >
                <Zap className="w-4 h-4" />
                <span>{isNavigating ? 'Loading...' : 'Use Template'}</span>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center space-x-1 px-3 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed"
                aria-label={`${template.name} template coming soon`}
              >
                <Clock className="w-4 h-4" />
                <span>Coming Soon</span>
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {template.featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
          {!!template.comingSoon && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
              Coming Soon
            </span>
          )}
          {template.atsScore >= 95 && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              ATS Optimized
            </span>
          )}
        </div>

        {/* ATS Score */}
        <div className="absolute top-3 right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            template.atsScore >= 95 ? 'bg-green-500 text-white' :
            template.atsScore >= 85 ? 'bg-blue-500 text-white' :
            template.atsScore >= 75 ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            ATS {template.atsScore}%
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{template.name}</h3>
          <p className="text-gray-600 text-sm overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {template.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              {formatNumber(template.downloads)}
            </span>
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {template.popularity}%
            </span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {template.category}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {template.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{template.tags.length - 3} more</span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {template.available ? (
            <button
              onClick={handleUseTemplate}
              disabled={isNavigating}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              aria-label={`Use ${template.name} template`}
            >
              <Zap className="w-4 h-4" />
              <span>{isNavigating ? 'Loading...' : 'Use This Template'}</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center space-x-2 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed font-medium"
              aria-label={`${template.name} template coming soon`}
            >
              <Clock className="w-4 h-4" />
              <span>Coming Soon</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Templates Gallery Component
export default function TemplatesGallery() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Memoized categories to avoid recalculation
  const categories = useMemo(() => getCategories(templates), []);

  // Memoized filtered and sorted templates for performance
  const filteredTemplates = useMemo(() => {
    return templates
      .filter(template => {
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesSearch = searchTerm === '' || 
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          template.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popularity':
            return b.popularity - a.popularity;
          case 'ats-score':
            return b.atsScore - a.atsScore;
          case 'downloads':
            return b.downloads - a.downloads;
          case 'newest':
            return b.id.localeCompare(a.id); // Placeholder for actual dates
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [selectedCategory, searchTerm, sortBy]);

  // Handle template actions with React Router
  const handleUseTemplate = async (template: Template) => {
    navigate(`/builder?template=${template.id}`);
  };

  const handlePreview = (template: Template) => {
    window.open(`/templates/${template.id}/preview`, '_blank');
  };

  // SEO Meta Tags - properly handled with useEffect
  useEffect(() => {
    document.title = 'Free Resume Templates | Professional & ATS-Optimized | FreeResume Builder';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Browse 14+ free professional resume templates. ATS-optimized designs for all industries. Download instantly, no credit card required.');

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'free resume templates, professional resume templates, ATS resume templates, resume builder templates');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://freeresume-builder.pages.dev/templates');

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Free Resume Templates | Professional & ATS-Optimized' },
      { property: 'og:description', content: 'Browse 14+ free professional resume templates. ATS-optimized designs for all industries.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://freeresume-builder.pages.dev/templates' }
    ];

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Free Resume Templates | Professional & ATS-Optimized' },
      { name: 'twitter:description', content: 'Browse 14+ free professional resume templates. ATS-optimized designs for all industries.' }
    ];

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Structured Data
    let structuredData = document.querySelector('script[type="application/ld+json"]#templates-gallery');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.setAttribute('type', 'application/ld+json');
      structuredData.setAttribute('id', 'templates-gallery');
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Free Resume Templates",
      "description": "Professional resume templates for all industries",
      "url": "https://freeresume-builder.pages.dev/templates",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": templates.length,
        "itemListElement": templates.map((template, index) => ({
          "@type": "CreativeWork",
          "position": index + 1,
          "name": template.name,
          "description": template.description,
          "author": {
            "@type": "Organization",
            "name": "FreeResume"
          }
        }))
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Free Resume Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Choose from {templates.length} professional, ATS-optimized resume templates. 
              All templates are 100% free with no hidden costs or credit card required.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span>ATS-Optimized</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4 text-purple-500" />
                <span>Instant PDF Download</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>No Sign-Up Required</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates by name, industry, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search templates"
              />
            </div>
            
            <div className="flex gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                aria-label="Sort templates"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
                aria-label="Toggle filters"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Template categories">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    role="tab"
                    aria-selected={selectedCategory === category.id}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
          
          {/* Featured Templates Count */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              {templates.filter(t => t.featured).length} Featured
            </span>
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-1 text-green-500" />
              {templates.filter(t => t.atsScore >= 95).length} ATS-Optimized
            </span>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUseTemplate={handleUseTemplate}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
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

      {/* CTA Section */}
      <div className="bg-blue-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose any template above and start building your resume in minutes. 
              All templates are completely free with no hidden costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/builder')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Start Building Now
              </button>
              <button
                onClick={() => navigate('/resume-examples')}
                className="px-8 py-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
              >
                View Resume Examples
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}