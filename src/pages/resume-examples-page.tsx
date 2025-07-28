import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, Eye, Star, TrendingUp, Users, 
  Briefcase, GraduationCap, Code, Stethoscope, Zap,
  ShoppingCart, Palette, Award, Clock, ArrowRight, CheckCircle,
  Target, FileText, ExternalLink, Copy, Heart
} from 'lucide-react';

// Color mapping for Tailwind classes (fixes dynamic class generation issue)
const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' }
};

// Industry data with example resumes
const industryExamples = {
  'software-engineer': {
    title: 'Software Engineer',
    icon: Code,
    description: 'Modern, tech-focused resume examples with emphasis on technical skills, projects, and achievements.',
    searchVolume: '30K+ monthly searches',
    avgSalary: '$95,000',
    growthRate: '+22%',
    color: 'blue',
    keywords: ['software engineer resume', 'developer resume', 'programming resume', 'tech resume'],
    examples: [
      {
        id: 'senior-fullstack',
        title: 'Senior Full-Stack Developer',
        level: 'Senior',
        yearsExp: '5-8 years',
        salary: '$120K-150K',
        popularity: 95,
        downloads: 15420,
        features: ['React/Node.js expertise', 'Leadership experience', 'System architecture'],
        preview: '/examples/software-engineer/senior-fullstack.jpg',
        atsScore: 94,
        data: {
          personalInfo: {
            firstName: 'Alex',
            lastName: 'Rodriguez',
            email: 'alex.rodriguez@email.com',
            phone: '(555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/alexrodriguez',
            website: 'alexrod.dev',
            summary: 'Experienced full-stack developer with 6+ years building scalable web applications using React, Node.js, and cloud technologies. Led development teams of 5+ engineers and delivered 20+ successful projects.',
            jobTitle: 'Senior Full-Stack Developer',
            yearsExperience: '6'
          }
        }
      },
      {
        id: 'entry-level-developer',
        title: 'Entry-Level Software Developer',
        level: 'Entry Level',
        yearsExp: '0-2 years',
        salary: '$65K-85K',
        popularity: 88,
        downloads: 12350,
        features: ['Strong foundation', 'Project portfolio', 'Internship experience'],
        preview: '/examples/software-engineer/entry-level.jpg',
        atsScore: 91,
        data: {
          personalInfo: {
            firstName: 'Jordan',
            lastName: 'Chen',
            email: 'jordan.chen@email.com',
            phone: '(555) 987-6543',
            location: 'Austin, TX',
            summary: 'Recent Computer Science graduate with strong programming fundamentals and hands-on experience through internships and personal projects.',
            jobTitle: 'Software Developer',
            yearsExperience: '1'
          }
        }
      }
    ]
  },
  'registered-nurse': {
    title: 'Registered Nurse',
    icon: Stethoscope,
    description: 'Healthcare-focused resume examples highlighting clinical experience, certifications, and patient care.',
    searchVolume: '20K+ monthly searches',
    avgSalary: '$75,000',
    growthRate: '+9%',
    color: 'green',
    keywords: ['nursing resume', 'RN resume', 'healthcare resume', 'nurse resume examples'],
    examples: [
      {
        id: 'icu-nurse',
        title: 'ICU Registered Nurse',
        level: 'Experienced',
        yearsExp: '3-5 years',
        salary: '$80K-95K',
        popularity: 92,
        downloads: 8750,
        features: ['Critical care expertise', 'Multiple certifications', 'Patient advocacy'],
        preview: '/examples/nursing/icu-nurse.jpg',
        atsScore: 96,
        data: {
          personalInfo: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            phone: '(555) 456-7890',
            location: 'Chicago, IL',
            summary: 'Dedicated ICU Registered Nurse with 4+ years of critical care experience. Specialized in advanced cardiac monitoring and emergency response.',
            jobTitle: 'ICU Registered Nurse',
            yearsExperience: '4'
          }
        }
      }
    ]
  },
  'electrician': {
    title: 'Electrician',
    icon: Zap,
    description: 'Trade-focused resume examples showcasing technical skills, certifications, and safety compliance.',
    searchVolume: '8K+ monthly searches',
    avgSalary: '$68,000',
    growthRate: '+8%',
    color: 'yellow',
    keywords: ['electrician resume', 'electrical technician resume', 'trades resume'],
    examples: [
      {
        id: 'journeyman-electrician',
        title: 'Journeyman Electrician',
        level: 'Journeyman',
        yearsExp: '4-7 years',
        salary: '$65K-80K',
        popularity: 85,
        downloads: 5420,
        features: ['Licensed journeyman', 'Commercial experience', 'Safety certified'],
        preview: '/examples/electrician/journeyman.jpg',
        atsScore: 89,
        data: {
          personalInfo: {
            firstName: 'Mike',
            lastName: 'Thompson',
            email: 'mike.thompson@email.com',
            phone: '(555) 321-0987',
            location: 'Denver, CO',
            summary: 'Licensed Journeyman Electrician with 5+ years of commercial and residential electrical experience.',
            jobTitle: 'Journeyman Electrician',
            yearsExperience: '5'
          }
        }
      }
    ]
  },
  'marketing-manager': {
    title: 'Marketing Manager',
    icon: TrendingUp,
    description: 'Marketing-focused resume examples emphasizing campaigns, analytics, and ROI achievements.',
    searchVolume: '15K+ monthly searches',
    avgSalary: '$85,000',
    growthRate: '+10%',
    color: 'purple',
    keywords: ['marketing manager resume', 'digital marketing resume', 'marketing resume examples'],
    examples: [
      {
        id: 'digital-marketing-manager',
        title: 'Digital Marketing Manager',
        level: 'Mid-Level',
        yearsExp: '3-6 years',
        salary: '$80K-100K',
        popularity: 89,
        downloads: 9830,
        features: ['ROI-focused metrics', 'Multi-channel campaigns', 'Team leadership'],
        preview: '/examples/marketing/digital-manager.jpg',
        atsScore: 93,
        data: {
          personalInfo: {
            firstName: 'Emma',
            lastName: 'Davis',
            email: 'emma.davis@email.com',
            phone: '(555) 654-3210',
            location: 'New York, NY',
            summary: 'Results-driven Digital Marketing Manager with 4+ years driving brand growth and customer acquisition.',
            jobTitle: 'Digital Marketing Manager',
            yearsExperience: '4'
          }
        }
      }
    ]
  }
};

// Filter options
const filterOptions = {
  industry: Object.keys(industryExamples),
  level: ['Entry Level', 'Mid-Level', 'Senior', 'Executive'],
  salary: ['Under $50K', '$50K-$75K', '$75K-$100K', '$100K+'],
  experience: ['0-2 years', '2-5 years', '5-8 years', '8+ years']
};

// Success stories component
function SuccessStories() {
  const stories = [
    {
      name: 'Sarah K.',
      role: 'Software Engineer',
      company: 'Google',
      story: 'Got 3 interviews in 2 weeks using the tech template',
      avatar: 'SK'
    },
    {
      name: 'Mike R.',
      role: 'Project Manager',
      company: 'Amazon',
      story: 'Landed my dream job with 25% salary increase',
      avatar: 'MR'
    },
    {
      name: 'Lisa M.',
      role: 'Marketing Manager',
      company: 'Spotify',
      story: 'ATS optimization helped me get past initial screening',
      avatar: 'LM'
    }
  ];

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Success Stories</h3>
      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story.name} className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {story.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{story.name}</span>
                  <span className="text-sm text-gray-500">→</span>
                  <span className="text-sm font-medium text-blue-600">{story.company}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{story.role}</p>
                <div className="text-sm text-gray-700 mt-2">&ldquo;{story.story}&rdquo;</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example card component
function ExampleCard({ example, industry, onPreview, onUseTemplate }) {
  const industryData = industryExamples[industry];
  const colors = colorClasses[industryData.color] || colorClasses.blue;
  
  // Safe formatting for downloads (handles both numbers and strings)
  const formattedDownloads = typeof example.downloads === 'number' 
    ? example.downloads.toLocaleString() 
    : example.downloads;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Preview Image */}
      <div className="relative">
        <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center text-gray-400">
          <FileText className="w-16 h-16" />
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <div className={`px-2 py-1 rounded text-xs font-medium ${colors.border} ${colors.bg}`}>
            ATS {example.atsScore}%
          </div>
          <div className="bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
            {formattedDownloads} downloads
          </div>
        </div>
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onPreview(example)}
              aria-label={`Preview ${example.title} resume example`}
              className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => onUseTemplate(example)}
              aria-label={`Use ${example.title} resume template`}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
            >
              <Copy className="w-4 h-4" />
              <span>Use This</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{example.title}</h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs text-gray-600">{example.popularity}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Level:</span>
            <span className="font-medium">{example.level}</span>
          </div>
          <div className="flex justify-between">
            <span>Experience:</span>
            <span className="font-medium">{example.yearsExp}</span>
          </div>
          <div className="flex justify-between">
            <span>Salary Range:</span>
            <span className="font-medium text-green-600">{example.salary}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {example.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {feature}
              </span>
            ))}
            {example.features.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{example.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onPreview(example)}
            aria-label={`Preview ${example.title} resume example`}
            className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Preview
          </button>
          <button
            onClick={() => onUseTemplate(example)}
            aria-label={`Use ${example.title} resume template`}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}

// Industry overview component
function IndustryOverview({ industryKey, industry }) {
  const IconComponent = industry.icon;
  const colors = colorClasses[industry.color] || colorClasses.blue;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <IconComponent className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{industry.title} Resume Examples</h2>
          <p className="text-gray-600 mb-4">{industry.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900">Search Volume</div>
              <div className="text-gray-600">{industry.searchVolume}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Avg. Salary</div>
              <div className="text-green-600 font-medium">{industry.avgSalary}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Growth Rate</div>
              <div className="text-blue-600 font-medium">{industry.growthRate}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Examples</div>
              <div className="text-gray-600">{industry.examples.length} available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Salary filtering helper function
function checkSalaryMatch(exampleSalary, filterSalary) {
  if (filterSalary === 'all' || !exampleSalary || !exampleSalary.includes('$')) {
    return true;
  }
  
  // Extract first number from salary range
  const salaryMatch = exampleSalary.match(/\$(\d+)K?/);
  if (!salaryMatch) return true;
  
  const amount = parseInt(salaryMatch[1]);
  if (isNaN(amount)) return true;
  
  switch (filterSalary) {
    case 'Under $50K':
      return amount < 50;
    case '$50K-$75K':
      return amount >= 50 && amount < 75;
    case '$75K-$100K':
      return amount >= 75 && amount < 100;
    case '$100K+':
      return amount >= 100;
    default:
      return true;
  }
}

// Main component
export default function ResumeExamples() {
  const { industry: industryParam } = useParams();
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState(industryParam || 'all');
  const [filters, setFilters] = useState({
    level: 'all',
    salary: 'all',
    experience: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Update URL when industry changes
  useEffect(() => {
    if (selectedIndustry === 'all') {
      navigate('/resume-examples', { replace: true });
    } else {
      navigate(`/resume-examples/${selectedIndustry}`, { replace: true });
    }
  }, [selectedIndustry, navigate]);

  // Handle direct navigation to industry pages
  useEffect(() => {
    if (industryParam && industryParam !== selectedIndustry && industryExamples[industryParam]) {
      setSelectedIndustry(industryParam);
    }
  }, [industryParam, selectedIndustry]);

  // Reset filters when industry changes
  useEffect(() => {
    setFilters({
      level: 'all',
      salary: 'all',
      experience: 'all'
    });
  }, [selectedIndustry]);

  // Filter examples based on current selection
  const filteredExamples = useMemo(() => {
    let allExamples = [];
    
    Object.entries(industryExamples).forEach(([key, industry]) => {
      if (selectedIndustry === 'all' || selectedIndustry === key) {
        industry.examples.forEach(example => {
          allExamples.push({ ...example, industry: key, industryData: industry });
        });
      }
    });

    return allExamples.filter(example => {
      const matchesSearch = searchTerm === '' || 
        example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.industryData.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = filters.level === 'all' || example.level === filters.level;
      const matchesExperience = filters.experience === 'all' || example.yearsExp === filters.experience;
      const matchesSalary = checkSalaryMatch(example.salary, filters.salary);
      
      return matchesSearch && matchesLevel && matchesExperience && matchesSalary;
    });
  }, [selectedIndustry, filters, searchTerm]);

  // Handle preview
  const handlePreview = (example) => {
    navigate(`/resume-examples/preview/${example.industry}/${example.id}`, {
      state: { example }
    });
  };

  // Handle use template
  const handleUseTemplate = (example) => {
    navigate('/builder', { 
      state: { 
        resumeData: example.data,
        template: 'professional' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedIndustry === 'all' 
                ? 'Resume Examples by Industry - Free Templates & Samples'
                : `${industryExamples[selectedIndustry]?.title} Resume Examples & Templates`
              }
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {selectedIndustry === 'all' 
                ? 'Browse professional resume examples from top industries. ATS-optimized templates with real-world examples to help you land your dream job.'
                : industryExamples[selectedIndustry]?.description
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search examples..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Industries</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedIndustry('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedIndustry === 'all' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Industries
                </button>
                {Object.entries(industryExamples).map(([key, industry]) => {
                  const IndustryIcon = industry.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedIndustry(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        selectedIndustry === key 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IndustryIcon className="w-4 h-4" />
                      <span>{industry.title}</span>
                      <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                        {industry.examples.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Filters */}
            <div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
              
              {showFilters && (
                <div className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                      value={filters.level}
                      onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Levels</option>
                      {filterOptions.level.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Any Experience</option>
                      {filterOptions.experience.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                    <select
                      value={filters.salary}
                      onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Any Salary</option>
                      {filterOptions.salary.map(salary => (
                        <option key={salary} value={salary}>{salary}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Success Stories */}
            <SuccessStories />

            {/* CTA */}
            <div className="bg-blue-600 text-white rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2">Ready to Build Your Resume?</h4>
              <p className="text-sm text-blue-100 mb-3">
                Use our free builder with professional templates
              </p>
              <Link
                to="/builder"
                className="inline-flex items-center space-x-1 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Industry Overview */}
            {selectedIndustry !== 'all' && industryExamples[selectedIndustry] && (
              <IndustryOverview 
                industryKey={selectedIndustry}
                industry={industryExamples[selectedIndustry]} 
              />
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredExamples.length} Resume Examples
                </h2>
                <p className="text-sm text-gray-600">
                  Professional templates with real-world examples
                </p>
              </div>
              
              {filteredExamples.length > 0 && (
                <div className="text-sm text-gray-500">
                  Showing {filteredExamples.length} results
                </div>
              )}
            </div>

            {/* Examples Grid */}
            {filteredExamples.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredExamples.map((example) => (
                  <ExampleCard
                    key={`${example.industry}-${example.id}`}
                    example={example}
                    industry={example.industry}
                    onPreview={handlePreview}
                    onUseTemplate={handleUseTemplate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No examples found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search term
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ level: 'all', salary: 'all', experience: 'all' });
                      setSelectedIndustry('all');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Don't See Your Industry?</h3>
              <p className="text-blue-100 mb-6">
                Our builder works for any profession. Start with a professional template and customize it for your field.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/builder"
                  className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Build My Resume</span>
                </Link>
                <Link
                  to="/templates"
                  className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
                >
                  <Palette className="w-5 h-5" />
                  <span>Browse Templates</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}