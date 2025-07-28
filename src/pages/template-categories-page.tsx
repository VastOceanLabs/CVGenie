import React, { useState } from 'react';
import { ArrowRight, Download, Eye, Star, Target, Users, Briefcase, Palette, Zap, CheckCircle, TrendingUp, Award, Search, Filter, FileText, Sparkles } from 'lucide-react';

// Extended template data with comprehensive categories
const templateCategories = {
  corporate: {
    id: 'corporate',
    name: 'Corporate & Professional',
    description: 'Traditional, ATS-friendly templates perfect for corporate environments',
    icon: Briefcase,
    color: 'blue',
    templates: [
      {
        id: 'executive',
        name: 'Executive Professional',
        preview: '/templates/executive-preview.jpg',
        atsScore: 98,
        downloads: '45K+',
        description: 'Premium design for C-level and senior management positions',
        features: ['ATS Optimized', 'Print Ready', 'Single Column'],
        industries: ['Finance', 'Consulting', 'Management']
      },
      {
        id: 'corporate-classic',
        name: 'Corporate Classic',
        preview: '/templates/corporate-preview.jpg',
        atsScore: 96,
        downloads: '120K+',
        description: 'Timeless design that works in any corporate setting',
        features: ['Traditional Layout', 'Conservative Design', 'High ATS Score'],
        industries: ['Banking', 'Legal', 'Government']
      },
      {
        id: 'business-formal',
        name: 'Business Formal',
        preview: '/templates/business-preview.jpg',
        atsScore: 94,
        downloads: '78K+',
        description: 'Formal structure ideal for business professionals',
        features: ['Clean Layout', 'Professional Fonts', 'Structured Sections'],
        industries: ['Corporate', 'Real Estate', 'Insurance']
      }
    ]
  },
  modern: {
    id: 'modern',
    name: 'Modern & Contemporary',
    description: 'Sleek, modern designs that stand out while remaining professional',
    icon: Zap,
    color: 'green',
    templates: [
      {
        id: 'modern-professional',
        name: 'Modern Professional',
        preview: '/templates/modern-preview.jpg',
        atsScore: 88,
        downloads: '95K+',
        description: 'Contemporary design with subtle color accents',
        features: ['Two Column', 'Color Accents', 'Modern Typography'],
        industries: ['Tech', 'Marketing', 'Startups']
      },
      {
        id: 'contemporary',
        name: 'Contemporary Edge',
        preview: '/templates/contemporary-preview.jpg',
        atsScore: 85,
        downloads: '67K+',
        description: 'Bold, contemporary styling for forward-thinking professionals',
        features: ['Unique Layout', 'Visual Elements', 'Progressive Design'],
        industries: ['Digital Marketing', 'UX/UI Design', 'Innovation']
      },
      {
        id: 'tech-modern',
        name: 'Tech Modern',
        preview: '/templates/tech-preview.jpg',
        atsScore: 90,
        downloads: '112K+',
        description: 'Perfect for tech professionals and developers',
        features: ['Tech-Focused', 'Skills Emphasis', 'Project Showcase'],
        industries: ['Software', 'Data Science', 'DevOps']
      }
    ]
  },
  creative: {
    id: 'creative',
    name: 'Creative & Design',
    description: 'Artistic templates that showcase creativity while maintaining professionalism',
    icon: Palette,
    color: 'purple',
    templates: [
      {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        preview: '/templates/creative-preview.jpg',
        atsScore: 75,
        downloads: '43K+',
        description: 'Showcase your creativity with this artistic design',
        features: ['Visual Portfolio', 'Creative Layout', 'Color Flexibility'],
        industries: ['Graphic Design', 'Photography', 'Art Direction']
      },
      {
        id: 'designer-pro',
        name: 'Designer Pro',
        preview: '/templates/designer-preview.jpg',
        atsScore: 78,
        downloads: '56K+',
        description: 'Professional template designed by designers, for designers',
        features: ['Design-Focused', 'Portfolio Integration', 'Typography Excellence'],
        industries: ['Web Design', 'Brand Design', 'Creative Director']
      },
      {
        id: 'artistic-flair',
        name: 'Artistic Flair',
        preview: '/templates/artistic-preview.jpg',
        atsScore: 72,
        downloads: '34K+',
        description: 'Bold artistic elements for creative professionals',
        features: ['Artistic Elements', 'Creative Freedom', 'Unique Structure'],
        industries: ['Fine Arts', 'Creative Writing', 'Media Production']
      }
    ]
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal & Clean',
    description: 'Simple, elegant designs that let your content shine',
    icon: FileText,
    color: 'gray',
    templates: [
      {
        id: 'minimal-elegant',
        name: 'Minimal Elegant',
        preview: '/templates/minimal-preview.jpg',
        atsScore: 92,
        downloads: '87K+',
        description: 'Sophisticated minimalism with maximum impact',
        features: ['Clean Design', 'High Readability', 'ATS Friendly'],
        industries: ['Consulting', 'Academia', 'Research']
      },
      {
        id: 'simple-professional',
        name: 'Simple Professional',
        preview: '/templates/simple-preview.jpg',
        atsScore: 95,
        downloads: '134K+',
        description: 'Straightforward design that works everywhere',
        features: ['Universal Appeal', 'Maximum Compatibility', 'Focus on Content'],
        industries: ['Healthcare', 'Education', 'Non-Profit']
      },
      {
        id: 'clean-slate',
        name: 'Clean Slate',
        preview: '/templates/clean-preview.jpg',
        atsScore: 93,
        downloads: '76K+',
        description: 'Pristine, uncluttered design for any profession',
        features: ['Minimal Styling', 'Perfect Typography', 'Timeless Appeal'],
        industries: ['Any Industry', 'Career Change', 'Entry Level']
      }
    ]
  }
};

// Industry-specific template recommendations
const industryTemplates = {
  'Software Engineer': ['tech-modern', 'modern-professional', 'minimal-elegant'],
  'Marketing Manager': ['modern-professional', 'contemporary', 'creative-portfolio'],
  'Project Manager': ['corporate-classic', 'business-formal', 'simple-professional'],
  'Graphic Designer': ['creative-portfolio', 'designer-pro', 'artistic-flair'],
  'Sales Representative': ['business-formal', 'modern-professional', 'corporate-classic'],
  'Nurse': ['simple-professional', 'minimal-elegant', 'clean-slate'],
  'Electrician': ['clean-slate', 'simple-professional', 'minimal-elegant'],
  'Teacher': ['simple-professional', 'clean-slate', 'minimal-elegant']
};

export default function TemplateCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('corporate');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter templates based on search and industry
  const getFilteredTemplates = () => {
    const category = templateCategories[selectedCategory];
    if (!category) return [];

    let templates = category.templates;

    if (selectedIndustry) {
      const recommendedIds = industryTemplates[selectedIndustry] || [];
      templates = templates.filter(template => 
        recommendedIds.includes(template.id) || 
        template.industries.includes(selectedIndustry)
      );
    }

    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.industries.some(industry => 
          industry.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return templates;
  };

  const handleStartBuilding = (templateId) => {
    // Navigate to builder with selected template
    window.location.href = `/builder?template=${templateId}`;
  };

  const handlePreviewTemplate = (templateId) => {
    // Open template preview
    window.open(`/templates/${templateId}/preview`, '_blank');
  };

  const currentCategory = templateCategories[selectedCategory];
  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Optimized Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Free Resume Templates
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Choose from professional, ATS-optimized resume templates that are completely free. 
              No hidden costs, no credit card required, instant download.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Target className="w-4 h-4" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <Download className="w-4 h-4" />
                <span>Instant PDF Download</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" />
                <span>500K+ Downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Industry Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">All Industries</option>
                {Object.keys(industryTemplates).map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Quick Start Button */}
            <button
              onClick={() => window.location.href = '/builder'}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Building Now</span>
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(templateCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? `bg-${category.color}-600 text-white`
                    : `bg-white border border-gray-300 text-gray-700 hover:bg-${category.color}-50 hover:border-${category.color}-300`
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Current Category Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {currentCategory.name} Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentCategory.description}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Template Preview */}
              <div className="relative group">
                <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm">Template Preview</p>
                  </div>
                </div>
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handlePreviewTemplate(template.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleStartBuilding(template.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Use Template</span>
                  </button>
                </div>

                {/* ATS Score Badge */}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ATS: {template.atsScore}%
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{template.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  {template.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Best for:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePreviewTemplate(template.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleStartBuilding(template.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Use Free</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('');
                setSelectedCategory('corporate');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Why Choose Our Templates Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Our Free Resume Templates?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Free</h3>
              <p className="text-sm text-gray-600">
                No hidden costs, no premium plans. All templates are completely free forever.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ATS Optimized</h3>
              <p className="text-sm text-gray-600">
                Built to pass Applicant Tracking Systems with proven high ATS scores.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Quality</h3>
              <p className="text-sm text-gray-600">
                Designed by professionals for professionals. Stand out from the competition.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-sm text-gray-600">
                500K+ successful downloads. Join job seekers who landed their dream jobs.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Start with any template and customize it to match your experience. 
            It's free, fast, and designed to get you hired.
          </p>
          <button
            onClick={() => window.location.href = '/builder'}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Building for Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}