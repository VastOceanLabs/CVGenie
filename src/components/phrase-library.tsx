import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Copy, CheckCircle, Sparkles, TrendingUp, Users, Zap, Award, Target, BookOpen, Star, ArrowRight, Trophy } from 'lucide-react';

// TypeScript interfaces
interface IndustryData {
  achievements: readonly string[];
  responsibilities: readonly string[];
  skills: readonly string[];
}

interface ActionVerbCategories {
  leadership: readonly string[];
  achievement: readonly string[];
  improvement: readonly string[];
  creation: readonly string[];
  analysis: readonly string[];
  communication: readonly string[];
}

// Job title to industry mapping
const jobTitleToIndustry = {
  'software engineer': 'Software Engineer',
  'frontend developer': 'Software Engineer', 
  'backend developer': 'Software Engineer',
  'full stack developer': 'Software Engineer',
  'web developer': 'Software Engineer',
  'senior software engineer': 'Software Engineer',
  'lead developer': 'Software Engineer',
  'engineering manager': 'Software Engineer',
  'marketing manager': 'Marketing Manager',
  'digital marketing manager': 'Marketing Manager',
  'marketing coordinator': 'Marketing Manager',
  'brand manager': 'Marketing Manager',
  'content marketing manager': 'Marketing Manager',
  'project manager': 'Project Manager',
  'program manager': 'Project Manager',
  'product manager': 'Project Manager',
  'scrum master': 'Project Manager',
  'sales representative': 'Sales Representative',
  'account executive': 'Sales Representative',
  'business development': 'Sales Representative',
  'sales manager': 'Sales Representative',
  'account manager': 'Sales Representative',
  'nurse': 'Nurse',
  'registered nurse': 'Nurse',
  'licensed practical nurse': 'Nurse',
  'charge nurse': 'Nurse',
  'nurse practitioner': 'Nurse',
  'electrician': 'Electrician',
  'electrical technician': 'Electrician',
  'master electrician': 'Electrician',
  'journeyman electrician': 'Electrician',
  'electrical engineer': 'Electrician'
} as const;

// Helper function to map job title to industry
const getIndustryFromJobTitle = (jobTitle: string): keyof typeof phraseLibraryData => {
  const normalizedTitle = jobTitle.toLowerCase().trim();
  const mappedIndustry = jobTitleToIndustry[normalizedTitle as keyof typeof jobTitleToIndustry];
  return mappedIndustry || 'Software Engineer'; // Default fallback
};

// Industry-specific phrase data
const phraseLibraryData = {
  'Software Engineer': {
    achievements: [
      'Improved application performance by 45% through database optimization and caching strategies',
      'Led migration of legacy systems to cloud infrastructure, reducing operational costs by 30%',
      'Developed and deployed 15+ microservices using Docker and Kubernetes',
      'Increased test coverage from 60% to 95% by implementing comprehensive testing strategies',
      'Reduced bug reports by 40% through implementation of automated testing and CI/CD pipelines',
      'Mentored 5 junior developers, improving team velocity by 25%',
      'Built real-time data processing system handling 1M+ events per day',
      'Architected scalable REST APIs serving 100K+ daily active users'
    ],
    responsibilities: [
      'Develop and maintain web applications using React, Node.js, and TypeScript',
      'Collaborate with cross-functional teams to deliver high-quality software solutions',
      'Participate in code reviews and maintain coding standards across the team',
      'Design and implement database schemas and optimize query performance',
      'Write comprehensive unit and integration tests to ensure code quality',
      'Troubleshoot and debug complex technical issues in production environments',
      'Contribute to architectural decisions and technical documentation',
      'Mentor junior developers and conduct technical knowledge sharing sessions'
    ],
    skills: [
      'Full-stack web development', 'Agile methodologies', 'Test-driven development',
      'Performance optimization', 'Database design', 'API development',
      'Cloud computing (AWS/Azure)', 'DevOps practices', 'Code review',
      'Technical mentoring', 'Problem-solving', 'System architecture'
    ]
  },
  'Marketing Manager': {
    achievements: [
      'Increased brand awareness by 60% through multi-channel digital marketing campaigns',
      'Generated $2M+ in qualified leads through content marketing and SEO optimization',
      'Grew social media following by 300% and engagement rates by 150%',
      'Launched successful product campaign resulting in 40% increase in sales',
      'Reduced customer acquisition cost by 25% through conversion rate optimization',
      'Managed $500K marketing budget across 10+ campaigns with 95% on-time delivery',
      'Developed marketing automation workflows that increased conversion rates by 35%',
      'Built strategic partnerships that expanded market reach by 50%'
    ],
    responsibilities: [
      'Develop and execute comprehensive marketing strategies across digital and traditional channels',
      'Manage end-to-end campaign lifecycle from planning to performance analysis',
      'Collaborate with sales teams to align marketing efforts with revenue goals',
      'Analyze market trends and consumer behavior to inform strategic decisions',
      'Oversee content creation and brand messaging across all marketing materials',
      'Manage marketing budget allocation and track ROI across all initiatives',
      'Lead cross-functional projects involving creative, sales, and product teams',
      'Monitor competitor activities and industry trends to maintain competitive advantage'
    ],
    skills: [
      'Digital marketing strategy', 'Campaign management', 'Data analysis',
      'Content marketing', 'SEO/SEM', 'Social media marketing',
      'Marketing automation', 'Budget management', 'Team leadership',
      'Brand management', 'Customer segmentation', 'Performance tracking'
    ]
  },
  'Project Manager': {
    achievements: [
      'Successfully delivered 20+ projects on time and 15% under budget over 2-year period',
      'Managed cross-functional teams of up to 15 members across multiple time zones',
      'Implemented Agile methodologies that improved team productivity by 30%',
      'Reduced project delivery time by 25% through process optimization and automation',
      'Achieved 98% stakeholder satisfaction rating across all managed projects',
      'Led digital transformation initiative affecting 500+ employees organization-wide',
      'Recovered 3 at-risk projects worth $2M+ through strategic replanning and resource reallocation',
      'Established PMO practices that standardized project delivery across the organization'
    ],
    responsibilities: [
      'Lead project planning, execution, and delivery from initiation to closure',
      'Coordinate cross-functional teams and manage stakeholder communications',
      'Develop comprehensive project schedules, budgets, and resource allocation plans',
      'Monitor project progress and implement corrective actions to ensure on-time delivery',
      'Facilitate regular status meetings and maintain project documentation',
      'Identify and mitigate project risks while managing scope changes effectively',
      'Ensure project deliverables meet quality standards and stakeholder expectations',
      'Report project status to senior leadership and key stakeholders regularly'
    ],
    skills: [
      'Project lifecycle management', 'Agile/Scrum methodologies', 'Risk management',
      'Stakeholder management', 'Budget management', 'Team leadership',
      'Strategic planning', 'Process improvement', 'Quality assurance',
      'Communication', 'Problem-solving', 'Change management'
    ]
  },
  'Sales Representative': {
    achievements: [
      'Exceeded annual sales quota by 125% for three consecutive years',
      'Generated $1.5M+ in new business revenue through strategic prospecting',
      'Maintained 95% client retention rate through exceptional relationship management',
      'Closed 50+ deals with average contract value of $25K',
      'Ranked #1 sales performer in region of 25+ representatives',
      'Developed new territory that became top-performing region within 18 months',
      'Increased average deal size by 40% through consultative selling approach',
      'Built pipeline worth $3M+ through networking and referral programs'
    ],
    responsibilities: [
      'Prospect and qualify potential clients through cold calling and networking',
      'Conduct product demonstrations and presentations to decision-makers',
      'Develop and maintain relationships with key accounts and stakeholders',
      'Negotiate contract terms and pricing to close deals effectively',
      'Maintain accurate sales forecasts and pipeline reporting in CRM system',
      'Collaborate with marketing teams to develop lead generation strategies',
      'Provide post-sale support to ensure customer satisfaction and retention',
      'Attend industry events and trade shows to generate new business opportunities'
    ],
    skills: [
      'Consultative selling', 'Relationship building', 'Negotiation',
      'Territory management', 'Pipeline management', 'CRM proficiency',
      'Presentation skills', 'Market analysis', 'Customer retention',
      'Goal achievement', 'Communication', 'Networking'
    ]
  },
  'Nurse': {
    achievements: [
      'Maintained 100% medication administration accuracy record over 2-year period',
      'Reduced patient readmission rates by 20% through comprehensive discharge planning',
      'Received Patient Care Excellence Award for outstanding bedside manner',
      'Led implementation of new patient safety protocols reducing incidents by 30%',
      'Mentored 10+ new nurses during orientation and continuing education programs',
      'Achieved 98% patient satisfaction scores consistently across all quarters',
      'Completed advanced certifications in critical care and emergency response',
      'Contributed to quality improvement initiatives that enhanced patient outcomes'
    ],
    responsibilities: [
      'Provide direct patient care including assessment, planning, and implementation',
      'Administer medications and treatments according to physician orders',
      'Monitor patient vital signs and document changes in condition',
      'Educate patients and families about treatment plans and discharge instructions',
      'Collaborate with physicians and healthcare team members for optimal patient care',
      'Maintain accurate patient records and ensure compliance with regulations',
      'Respond to medical emergencies and provide life-saving interventions',
      'Participate in quality improvement initiatives and continuing education programs'
    ],
    skills: [
      'Patient assessment', 'Clinical documentation', 'Medication administration',
      'Emergency response', 'Patient education', 'Team collaboration',
      'Critical thinking', 'Compassionate care', 'Time management',
      'Attention to detail', 'Stress management', 'Cultural sensitivity'
    ]
  },
  'Electrician': {
    achievements: [
      'Completed 200+ electrical installations with zero safety incidents over 3-year period',
      'Reduced project completion time by 15% through efficient planning and execution',
      'Achieved Master Electrician certification ahead of schedule',
      'Led team of 5 apprentices on commercial construction project worth $500K',
      'Identified and corrected 50+ code violations during safety inspections',
      'Saved clients $100K+ annually through energy-efficient lighting upgrades',
      'Maintained 100% safety compliance rating across all job sites',
      'Earned recognition for exceptional workmanship from general contractors'
    ],
    responsibilities: [
      'Install, maintain, and repair electrical systems in residential and commercial buildings',
      'Read and interpret blueprints, schematics, and technical diagrams',
      'Ensure all work complies with national and local electrical codes',
      'Troubleshoot electrical problems and implement effective solutions',
      'Install and connect wiring, outlets, switches, and circuit breakers',
      'Test electrical systems using multimeters and other diagnostic equipment',
      'Collaborate with other trades and follow safety protocols on job sites',
      'Maintain accurate records of work performed and materials used'
    ],
    skills: [
      'Electrical installation', 'Code compliance', 'Blueprint reading',
      'Troubleshooting', 'Safety protocols', 'Hand and power tools',
      'Electrical testing', 'Problem-solving', 'Attention to detail',
      'Physical stamina', 'Time management', 'Customer service'
    ]
  }
} as const satisfies Record<string, IndustryData>;

// Action verbs categorized by impact
const actionVerbs: ActionVerbCategories = {
  leadership: [
    'Led', 'Managed', 'Directed', 'Supervised', 'Orchestrated', 'Spearheaded',
    'Guided', 'Coordinated', 'Oversaw', 'Facilitated', 'Mentored', 'Motivated'
  ],
  achievement: [
    'Achieved', 'Exceeded', 'Delivered', 'Accomplished', 'Attained', 'Surpassed',
    'Earned', 'Won', 'Secured', 'Captured', 'Obtained', 'Realized'
  ],
  improvement: [
    'Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Upgraded', 'Transformed',
    'Modernized', 'Refined', 'Strengthened', 'Revitalized', 'Accelerated', 'Maximized'
  ],
  creation: [
    'Developed', 'Created', 'Built', 'Designed', 'Established', 'Founded',
    'Launched', 'Implemented', 'Initiated', 'Pioneered', 'Introduced', 'Instituted'
  ],
  analysis: [
    'Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Examined',
    'Reviewed', 'Audited', 'Monitored', 'Measured', 'Studied', 'Diagnosed'
  ],
  communication: [
    'Presented', 'Communicated', 'Collaborated', 'Negotiated', 'Consulted', 'Advised',
    'Influenced', 'Persuaded', 'Educated', 'Trained', 'Coached', 'Counseled'
  ]
} as const;

// Power phrases with metrics templates
const powerPhrases = [
  'Increased [metric] by [percentage]% through [specific action]',
  'Reduced [problem] by [amount] resulting in [benefit]',
  'Generated $[amount] in [time period] through [strategy]',
  'Managed team of [number] [role] across [scope]',
  'Delivered [number] [projects/initiatives] on time and [percentage]% under budget',
  'Achieved [percentage]% [metric] rate over [time period]',
  'Led implementation of [system/process] affecting [number] [people/processes]',
  'Saved $[amount] annually by [specific improvement]',
  'Grew [metric] from [starting point] to [end point] in [timeframe]',
  'Maintained [percentage]% [quality metric] across [scope]'
] as const;

interface PhraseLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  currentSection?: string;
}

// Local storage key for favorites
const FAVORITES_STORAGE_KEY = 'resumeBuilder_favoritesPhrases';

// Load favorites from localStorage
const loadFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

// Save favorites to localStorage
const saveFavorites = (favorites: Set<string>) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
  } catch {
    // Ignore localStorage errors
  }
};

export default function PhraseLibrary({ isOpen, onClose, jobTitle = 'Software Engineer', currentSection = 'all' }: PhraseLibraryProps) {
  const [activeTab, setActiveTab] = useState('achievements');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(() => getIndustryFromJobTitle(jobTitle));
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(() => loadFavorites());

  // Update industry when jobTitle changes
  useEffect(() => {
    setSelectedIndustry(getIndustryFromJobTitle(jobTitle));
  }, [jobTitle]);

  // Reset tab when section changes
  useEffect(() => {
    if (currentSection && currentSection !== 'all') {
      switch (currentSection) {
        case 'personalInfo':
          setActiveTab('achievements');
          break;
        case 'experience':
          setActiveTab('achievements');
          break;
        case 'skills':
          setActiveTab('skills');
          break;
        default:
          setActiveTab('achievements');
      }
    }
  }, [currentSection]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    saveFavorites(favoriteItems);
  }, [favoriteItems]);

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Toggle favorite
  const toggleFavorite = (text: string) => {
    setFavoriteItems(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(text)) {
        newFavorites.delete(text);
      } else {
        newFavorites.add(text);
      }
      return newFavorites;
    });
  };

  // Memoized content filtering
  const filterContent = useMemo(() => {
    return (items: readonly string[]) => {
      if (!searchTerm) return [...items];
      return items.filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };
  }, [searchTerm]);

  // Get current industry data (memoized)
  const currentIndustryData = useMemo(() => {
    return phraseLibraryData[selectedIndustry] || phraseLibraryData['Software Engineer'];
  }, [selectedIndustry]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Phrase Library</h2>
              <p className="text-sm text-gray-600">Professional phrases and content suggestions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-4">
          {/* Industry Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Industry:</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.keys(phraseLibraryData).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search phrases and suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'responsibilities', label: 'Responsibilities', icon: Users },
              { id: 'skills', label: 'Skills', icon: Zap },
              { id: 'action-verbs', label: 'Action Verbs', icon: Target },
              { id: 'power-phrases', label: 'Power Phrases', icon: Sparkles }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Achievement Examples for {selectedIndustry}
                </h3>
                <span className="text-sm text-gray-500">
                  {filterContent(currentIndustryData.achievements).length} phrases
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Quantified achievements that show your impact and value. Include specific numbers, percentages, and metrics.
              </p>
              <div className="grid gap-3">
                {filterContent(currentIndustryData.achievements).map((achievement, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="text-gray-800 flex-1 pr-4">{achievement}</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(achievement)}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            favoriteItems.has(achievement) ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(achievement)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          {copiedText === achievement ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities Tab */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Responsibility Examples for {selectedIndustry}
                </h3>
                <span className="text-sm text-gray-500">
                  {filterContent(currentIndustryData.responsibilities).length} phrases
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Professional responsibilities that demonstrate your core competencies and daily contributions.
              </p>
              <div className="grid gap-3">
                {filterContent(currentIndustryData.responsibilities).map((responsibility, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="text-gray-800 flex-1 pr-4">{responsibility}</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(responsibility)}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            favoriteItems.has(responsibility) ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(responsibility)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          {copiedText === responsibility ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Relevant Skills for {selectedIndustry}
                </h3>
                <span className="text-sm text-gray-500">
                  {filterContent(currentIndustryData.skills).length} skills
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Industry-relevant skills that are commonly sought after by employers in your field.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filterContent(currentIndustryData.skills).map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-medium">{skill}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleFavorite(skill)}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            favoriteItems.has(skill) ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                        >
                          <Star className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(skill)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                          {copiedText === skill ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Verbs Tab */}
          {activeTab === 'action-verbs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-red-600" />
                  Power Action Verbs
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Start your bullet points with these powerful action verbs to create impact and demonstrate leadership.
              </p>
              
              {Object.entries(actionVerbs).map(([category, verbs]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-gray-900 capitalize flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                    {category} Verbs
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {filterContent(verbs).map((verb, index) => (
                      <button
                        key={index}
                        onClick={() => copyToClipboard(verb)}
                        className="px-3 py-2 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        {copiedText === verb ? '✓' : verb}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Power Phrases Tab */}
          {activeTab === 'power-phrases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
                  Power Phrase Templates
                </h3>
                <span className="text-sm text-gray-500">
                  {filterContent(powerPhrases).length} templates
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Proven templates for creating impactful statements. Replace the bracketed placeholders with your specific details.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">💡 How to Use Templates:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Replace [metric] with specific measurements (sales, performance, etc.)</li>
                  <li>• Replace [percentage] with actual numbers (25%, 150%, etc.)</li>
                  <li>• Replace [amount] with dollar figures or quantities</li>
                  <li>• Replace [time period] with specific timeframes (6 months, 2 years, etc.)</li>
                </ul>
              </div>
              <div className="grid gap-4">
                {filterContent(powerPhrases).map((phrase, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <p className="text-gray-800 mb-2">{phrase}</p>
                        <p className="text-xs text-gray-500">
                          Example: {phrase
                            .replace('[metric]', 'sales revenue')
                            .replace('[percentage]', '45')
                            .replace('[specific action]', 'implementing new CRM system')
                            .replace('[problem]', 'customer response time')
                            .replace('[amount]', '2 hours')
                            .replace('[benefit]', '25% increase in satisfaction')
                            .replace('[time period]', 'Q4 2023')
                            .replace('[strategy]', 'targeted email campaigns')
                            .replace('[number]', '12')
                            .replace('[role]', 'sales representatives')
                            .replace('[scope]', 'North American region')
                            .replace('[projects/initiatives]', 'projects')
                            .replace('[people/processes]', 'employees')
                            .replace('[system/process]', 'automated reporting system')
                            .replace('[specific improvement]', 'streamlining procurement process')
                            .replace('[starting point]', '10K')
                            .replace('[end point]', '25K')
                            .replace('[timeframe]', '18 months')
                            .replace('[quality metric]', 'customer satisfaction')
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(phrase)}
                          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                            favoriteItems.has(phrase) ? 'text-yellow-500' : 'text-gray-400'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(phrase)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          {copiedText === phrase ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 Tip: Customize these phrases with your specific achievements and metrics for maximum impact
            </div>
            <div className="flex items-center space-x-3">
              {favoriteItems.size > 0 && (
                <span className="text-sm text-gray-500">
                  {favoriteItems.size} favorites saved
                </span>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}