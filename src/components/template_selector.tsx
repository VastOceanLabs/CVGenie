import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search, Filter, Target, Eye, Download, CheckCircle, Crown, Users, Briefcase, Heart, Code, Stethoscope, Wrench, TrendingUp, Award, Palette, Sparkles } from 'lucide-react';

// TypeScript interfaces
interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  colors: TemplateColors;
  layout: TemplateLayout;
  description: string;
  atsScore: number;
  popularity?: string;
  features: string[];
  industries: string[];
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string;
  previewImage?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Enums for better type safety
type TemplateCategory = 'corporate' | 'creative' | 'technology' | 'healthcare' | 'trades' | 'sales' | 'student' | 'classic';
type TemplateLayout = 'single-column' | 'two-column' | 'creative' | 'minimal' | 'executive' | 'student' | 'tech' | 'healthcare' | 'trades' | 'sales';

// Extended templates configuration with consistent data
const templates: Record<string, Template> = {
  professional: {
    id: 'professional',
    name: 'Professional',
    category: 'corporate',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    layout: 'single-column',
    description: 'Clean, traditional design perfect for corporate roles',
    atsScore: 95,
    popularity: 'Most Popular',
    features: ['ATS-Optimized', 'Print-Friendly', 'Classic Layout'],
    industries: ['Business', 'Finance', 'Corporate', 'Government'],
    icon: Briefcase,
    previewImage: '/templates/professional-preview.jpg'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    category: 'creative',
    colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    layout: 'two-column',
    description: 'Contemporary design with striking color accents',
    atsScore: 88,
    popularity: 'Trending',
    features: ['Two-Column Layout', 'Modern Design', 'Color Accents'],
    industries: ['Marketing', 'Design', 'Startups', 'Tech'],
    icon: Sparkles,
    previewImage: '/templates/modern-preview.jpg'
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    category: 'creative',
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
    layout: 'creative',
    description: 'Artistic design perfect for creative industries',
    atsScore: 75,
    popularity: 'Creative Choice',
    features: ['Visual Elements', 'Creative Layout', 'Portfolio Focus'],
    industries: ['Design', 'Media', 'Arts', 'Entertainment'],
    icon: Palette,
    previewImage: '/templates/creative-preview.jpg'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    category: 'classic',
    colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#9ca3af' },
    layout: 'minimal',
    description: 'Clean and simple for timeless appeal',
    atsScore: 92,
    popularity: 'Clean & Simple',
    features: ['Clean Design', 'Minimal Style', 'Easy Reading'],
    industries: ['Any Industry', 'Academic', 'Research', 'Consulting'],
    icon: Heart,
    previewImage: '/templates/minimal-preview.jpg'
  },
  ats_friendly: {
    id: 'ats_friendly',
    name: 'ATS-Friendly',
    category: 'corporate',
    colors: { primary: '#000000', secondary: '#333333', accent: '#666666' },
    layout: 'single-column',
    description: 'Ultra-clean design optimized for ATS systems',
    atsScore: 99,
    popularity: 'Highest ATS Score',
    features: ['99% ATS Compatible', 'Zero Graphics', 'Standard Fonts'],
    industries: ['All Industries', 'Corporate', 'Government', 'Healthcare'],
    icon: Target,
    badge: 'Highest ATS Score',
    previewImage: '/templates/ats-friendly-preview.jpg'
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    category: 'corporate',
    colors: { primary: '#1e3a8a', secondary: '#1e40af', accent: '#2563eb' },
    layout: 'executive',
    description: 'Premium design for senior leadership positions',
    atsScore: 94,
    popularity: 'Premium',
    features: ['Executive Summary', 'Leadership Focus', 'Premium Feel'],
    industries: ['Executive', 'C-Suite', 'Senior Management', 'Director'],
    icon: Crown,
    badge: 'Premium',
    previewImage: '/templates/executive-preview.jpg'
  },
  entry_level: {
    id: 'entry_level',
    name: 'Entry Level',
    category: 'student',
    colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' },
    layout: 'student',
    description: 'Perfect for new graduates and career starters',
    atsScore: 90,
    popularity: 'Student Favorite',
    features: ['Education Focus', 'Skills Emphasis', 'Internship Friendly'],
    industries: ['Student', 'Entry Level', 'Internships', 'New Graduate'],
    icon: Users,
    previewImage: '/templates/entry-level-preview.jpg'
  },
  tech_engineer: {
    id: 'tech_engineer',
    name: 'Tech & Engineering',
    category: 'technology',
    colors: { primary: '#1d4ed8', secondary: '#2563eb', accent: '#3b82f6' },
    layout: 'tech',
    description: 'Optimized for software engineers and tech professionals',
    atsScore: 93,
    popularity: 'Tech Popular',
    features: ['Technical Skills', 'GitHub Integration', 'Project Showcase'],
    industries: ['Software', 'Engineering', 'Technology', 'Data Science'],
    icon: Code,
    previewImage: '/templates/tech-preview.jpg'
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Nursing',
    category: 'healthcare',
    colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' },
    layout: 'healthcare',
    description: 'Specialized for healthcare and medical professionals',
    atsScore: 95,
    popularity: 'Healthcare Top',
    features: ['Certifications Focus', 'Clinical Experience', 'License Display'],
    industries: ['Healthcare', 'Nursing', 'Medical', 'Clinical'],
    icon: Stethoscope,
    previewImage: '/templates/healthcare-preview.jpg'
  },
  trades: {
    id: 'trades',
    name: 'Trades & Blue Collar',
    category: 'trades',
    colors: { primary: '#d97706', secondary: '#b45309', accent: '#f59e0b' },
    layout: 'trades',
    description: 'Built for skilled trades and blue-collar professionals',
    atsScore: 88,
    popularity: 'Trades Choice',
    features: ['Licenses & Certs', 'Safety Training', 'Hands-on Skills'],
    industries: ['Electrician', 'Plumbing', 'Construction', 'Manufacturing'],
    icon: Wrench,
    previewImage: '/templates/trades-preview.jpg'
  },
  sales_marketing: {
    id: 'sales_marketing',
    name: 'Sales & Marketing',
    category: 'sales',
    colors: { primary: '#7c3aed', secondary: '#6b21a8', accent: '#a855f7' },
    layout: 'sales',
    description: 'Results-focused design for sales and marketing pros',
    atsScore: 91,
    popularity: 'Results Driven',
    features: ['Metrics Focus', 'Achievement Emphasis', 'Results Driven'],
    industries: ['Sales', 'Marketing', 'Business Development', 'Account Management'],
    icon: TrendingUp,
    previewImage: '/templates/sales-preview.jpg'
  }
};

const categories: Category[] = [
  { id: 'all', name: 'All Templates', icon: Award },
  { id: 'corporate', name: 'Corporate', icon: Briefcase },
  { id: 'creative', name: 'Creative', icon: Palette },
  { id: 'technology', name: 'Technology', icon: Code },
  { id: 'healthcare', name: 'Healthcare', icon: Stethoscope },
  { id: 'trades', name: 'Trades', icon: Wrench },
  { id: 'sales', name: 'Sales', icon: TrendingUp },
  { id: 'student', name: 'Student', icon: Users }
];

interface TemplateSelectorProps {
  currentTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
}

export default function TemplateSelector({ 
  currentTemplate, 
  onSelectTemplate, 
  onClose
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Memoized filtered templates for performance
  const filteredTemplates = useMemo(() => {
    return Object.values(templates).filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
                           template.name.toLowerCase().includes(searchLower) ||
                           template.description.toLowerCase().includes(searchLower) ||
                           (template.industries || []).some(industry => 
                             industry.toLowerCase().includes(searchLower)
                           );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Memoized close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle template selection
  const handleSelectTemplate = useCallback((templateId: string) => {
    onSelectTemplate(templateId);
    onClose();
  }, [onSelectTemplate, onClose]);

  // Handle preview with proper state management
  const handlePreview = useCallback((templateId: string) => {
    setPreviewTemplateId(templateId);
    setShowPreview(true);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewTemplateId(null);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPreview) {
          closePreview();
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose, showPreview, closePreview]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Template</h2>
              <p className="text-gray-600 mt-1">Select a professional template that matches your industry and style</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              aria-label="Close template selector"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates by name, industry, or style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search templates"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                      aria-label={`Filter by ${category.name}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(template => {
                const Icon = template.icon;
                const isSelected = template.id === currentTemplate;
                const isHovered = hoveredTemplate === template.id;

                return (
                  <div
                    key={template.id}
                    className={`relative group cursor-pointer transition-all duration-300 will-change-transform ${
                      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                    } ${isHovered ? 'transform scale-105' : ''}`}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      {/* Template Preview */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {/* Background with explicit opacity */}
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${template.colors.primary}26, ${template.colors.secondary}26)` 
                          }}
                        >
                          <Icon 
                            className="w-16 h-16 opacity-20" 
                            style={{ color: template.colors.primary }} 
                            aria-hidden="true"
                          />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                          {template.badge && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                              {template.badge}
                            </span>
                          )}
                          {template.popularity && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                              {template.popularity}
                            </span>
                          )}
                        </div>

                        {/* ATS Score */}
                        <div className="absolute top-3 right-3">
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            template.atsScore >= 95 ? 'bg-green-500 text-white' :
                            template.atsScore >= 90 ? 'bg-blue-500 text-white' :
                            template.atsScore >= 85 ? 'bg-yellow-500 text-white' :
                            'bg-orange-500 text-white'
                          }`}>
                            ATS {template.atsScore}%
                          </div>
                        </div>

                        {/* Mobile-friendly action buttons (always visible on small screens) */}
                        <div className="absolute bottom-3 left-3 right-3 md:hidden">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(template.id);
                              }}
                              className="flex-1 px-3 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1 text-sm"
                              aria-label={`Preview ${template.name} template`}
                            >
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </button>
                          </div>
                        </div>

                        {/* Desktop hover actions */}
                        {isHovered && (
                          <div className="hidden md:flex absolute inset-0 bg-black bg-opacity-50 items-center justify-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(template.id);
                              }}
                              className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                              aria-label={`Preview ${template.name} template`}
                            >
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTemplate(template.id);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                              aria-label={`Use ${template.name} template`}
                            >
                              <Download className="w-4 h-4" />
                              <span>Use This</span>
                            </button>
                          </div>
                        )}

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-blue-600 text-white rounded-full p-2">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{template.atsScore}%</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        {/* Features with safe access */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(template.features || []).slice(0, 2).map(feature => (
                            <span 
                              key={feature}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                          {(template.features || []).length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{template.features.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* Industries with safe access */}
                        <div className="text-xs text-gray-500">
                          Best for: {(template.industries || []).slice(0, 2).join(', ')}
                          {(template.industries || []).length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-600">Try adjusting your search or selecting a different category</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredTemplates.length}</span> template{filteredTemplates.length !== 1 ? 's' : ''} available
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {currentTemplate && (
                  <button
                    onClick={() => handleSelectTemplate(currentTemplate)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Keep Current Template
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewTemplateId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Preview: {templates[previewTemplateId]?.name}
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSelectTemplate(previewTemplateId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Template
                </button>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium">Template Preview</h4>
                  <p className="text-sm">Full preview will show formatted resume layout</p>
                </div>
                {/* This would contain the actual template preview component */}
                <div className="text-xs text-gray-400 mt-4">
                  Preview functionality to be implemented with ResumePreview component
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}