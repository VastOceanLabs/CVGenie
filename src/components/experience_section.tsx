import React, { useState } from 'react';
import { Plus, Minus, Sparkles, BookOpen, ArrowLeft, ArrowRight, Briefcase, Lightbulb, ChevronDown, ChevronUp, GripVertical, Target, AlertCircle, CheckCircle, TrendingUp, Users, Award, Zap } from 'lucide-react';

// TypeScript Interfaces
interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string[];
  responsibilities?: string[];
  skills?: string[];
}

interface ExperiencePhrases {
  achievements: string[];
  responsibilities: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

interface ATSAnalysisResult {
  score: number;
  foundKeywords: string[];
  missingKeywords: string[];
  hasMetrics: boolean;
  hasActionVerbs: boolean;
}

interface ExperienceSectionProps {
  resumeData?: { experience?: Experience[] };
  addArrayItem?: (section: string, item: Experience) => void;
  removeArrayItem?: (section: string, index: number) => void;
  updateArrayItem?: (section: string, index: number, data: Partial<Experience>) => void;
  setShowPhraseLibrary?: (show: boolean) => void;
  goToNextStep?: () => void;
  goToPrevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Enhanced experience phrases by job title with categories
const experiencePhrases: Record<string, ExperiencePhrases> = {
  'Software Engineer': {
    achievements: [
      'Increased application performance by 50% through database optimization and code refactoring',
      'Led migration of legacy systems to cloud infrastructure, reducing operational costs by 40%',
      'Delivered features that increased user engagement by 35% based on A/B testing results',
      'Reduced bug reports by 60% by implementing comprehensive automated testing procedures',
      'Architected microservices solution that improved system scalability by 300%',
      'Optimized database queries resulting in 45% faster page load times'
    ],
    responsibilities: [
      'Developed and maintained web applications using React, Node.js, and MongoDB',
      'Collaborated with cross-functional teams including designers, product managers, and QA',
      'Mentored junior developers and conducted thorough code reviews',
      'Integrated third-party APIs and services to extend application functionality',
      'Implemented automated testing and CI/CD pipelines for reliable deployments',
      'Participated in agile development processes and sprint planning sessions'
    ]
  },
  'Electrician': {
    achievements: [
      'Reduced electrical downtime by 30% for industrial clients through proactive maintenance',
      'Completed 200+ residential and commercial electrical installations ahead of schedule',
      'Achieved 100% safety compliance rating across all projects over 2 years',
      'Mentored 5 apprentices who successfully obtained journeyman licenses',
      'Implemented energy-efficient solutions that saved clients 25% on utility costs',
      'Troubleshot complex electrical systems reducing repair time by 40%'
    ],
    responsibilities: [
      'Installed and maintained electrical systems in residential and commercial properties',
      'Diagnosed and repaired complex electrical faults using advanced diagnostic equipment',
      'Ensured all work complied with local electrical codes and safety regulations',
      'Coordinated with project managers and other trades to complete installations',
      'Performed routine maintenance on industrial electrical equipment',
      'Read and interpreted electrical blueprints and schematics'
    ]
  },
  'Marketing Manager': {
    achievements: [
      'Increased brand awareness by 45% within 12 months through integrated campaigns',
      'Achieved 25% reduction in cost per acquisition while managing $500K marketing budget',
      'Drove 200% increase in organic website traffic through content marketing strategy',
      'Grew social media follower base by 150% across multiple platforms',
      'Generated 40% more qualified leads through targeted digital campaigns',
      'Improved customer retention rate by 30% through loyalty program implementation'
    ],
    responsibilities: [
      'Developed and executed integrated marketing campaigns across multiple channels',
      'Led team of 6 marketing professionals in product launches and promotions',
      'Implemented data analytics tools to track campaign performance and ROI',
      'Established partnerships with influencers and media outlets',
      'Managed marketing budget allocation across digital and traditional channels',
      'Conducted market research to identify customer trends and opportunities'
    ]
  },
  'Nurse': {
    achievements: [
      'Maintained 98% patient satisfaction score while caring for 20-30 patients per shift',
      'Reduced medication errors by 40% through implementation of double-check protocols',
      'Successfully precepted 12 new graduate nurses with 100% retention rate',
      'Led quality improvement initiative that decreased patient readmission rates by 15%',
      'Achieved Joint Commission compliance in all areas during facility inspections',
      'Developed patient education program that improved treatment adherence by 35%'
    ],
    responsibilities: [
      'Provided compassionate patient care in fast-paced hospital environment',
      'Administered medications and monitored patient responses for optimal outcomes',
      'Collaborated with interdisciplinary team to develop comprehensive care plans',
      'Educated patients and families on treatment procedures and post-discharge care',
      'Documented patient information accurately in electronic health records',
      'Responded to medical emergencies and provided critical care interventions'
    ]
  },
  'Project Manager': {
    achievements: [
      'Delivered $2M+ projects on time and 15% under budget for three consecutive years',
      'Improved project delivery speed by 40% through implementation of agile methodologies',
      'Achieved 95% stakeholder satisfaction rating across all managed projects',
      'Prevented $500K in potential cost overruns through proactive risk management',
      'Successfully managed portfolio of 8 concurrent projects worth $5M total value',
      'Reduced project timeline by 25% while maintaining quality standards'
    ],
    responsibilities: [
      'Led cross-functional teams of 10-15 members to deliver complex projects',
      'Managed project scope, timeline, and resources while maintaining stakeholder communication',
      'Facilitated daily stand-ups, sprint planning, and retrospective meetings',
      'Created detailed project documentation and reporting for executive leadership',
      'Identified and mitigated project risks to ensure successful delivery',
      'Coordinated with vendors and external partners to achieve project objectives'
    ]
  },
  'Sales Representative': {
    achievements: [
      'Exceeded sales targets by 125% for three consecutive years',
      'Generated $1.5M in annual revenue with 95% customer retention rate',
      'Expanded market reach by 30% through identification of new business opportunities',
      'Closed 15 high-value deals worth $100K+ each within first year',
      'Increased territory revenue by 80% within 18 months of assignment',
      'Achieved top performer status in region for customer satisfaction ratings'
    ],
    responsibilities: [
      'Built and maintained relationships with 200+ clients across diverse industries',
      'Conducted product demonstrations and presentations to potential clients',
      'Negotiated contracts and pricing agreements to close strategic deals',
      'Collaborated with marketing team to develop targeted sales campaigns',
      'Maintained detailed records of customer interactions in CRM system',
      'Participated in trade shows and industry events to generate leads'
    ]
  },
  'Registered Nurse': {
    achievements: [
      'Maintained 98% patient satisfaction score while caring for 20-30 patients per shift',
      'Reduced medication errors by 40% through implementation of double-check protocols',
      'Successfully precepted 12 new graduate nurses with 100% retention rate',
      'Led quality improvement initiative that decreased patient readmission rates by 15%',
      'Achieved Joint Commission compliance in all areas during facility inspections',
      'Developed patient education program that improved treatment adherence by 35%'
    ],
    responsibilities: [
      'Provided comprehensive nursing care to patients in medical-surgical unit',
      'Administered medications and monitored patient responses for adverse reactions',
      'Collaborated with physicians and healthcare team to optimize patient outcomes',
      'Educated patients and families on treatment plans and discharge instructions',
      'Maintained accurate documentation in electronic health records system',
      'Responded to code blue situations and provided emergency nursing interventions'
    ]
  }
};

// Industry-specific action verbs
const actionVerbsByCategory: Record<string, string[]> = {
  leadership: ['Led', 'Managed', 'Supervised', 'Directed', 'Coordinated', 'Guided', 'Mentored', 'Facilitated', 'Oversaw', 'Spearheaded'],
  achievement: ['Achieved', 'Exceeded', 'Delivered', 'Increased', 'Improved', 'Reduced', 'Optimized', 'Enhanced', 'Maximized', 'Accelerated'],
  creation: ['Developed', 'Created', 'Built', 'Designed', 'Established', 'Implemented', 'Launched', 'Initiated', 'Pioneered', 'Innovated'],
  collaboration: ['Collaborated', 'Partnered', 'Supported', 'Assisted', 'Contributed', 'Participated', 'Engaged', 'Coordinated', 'Communicated', 'Facilitated']
};

// ATS keywords by industry
const atsKeywords: Record<string, string[]> = {
  'Software Engineer': ['agile', 'scrum', 'API', 'database', 'cloud', 'CI/CD', 'microservices', 'testing', 'javascript', 'python', 'react', 'node.js'],
  'Electrician': ['electrical codes', 'safety compliance', 'troubleshooting', 'installation', 'maintenance', 'blueprints', 'OSHA', 'wiring', 'circuits'],
  'Marketing Manager': ['ROI', 'KPI', 'conversion rate', 'brand awareness', 'digital marketing', 'analytics', 'SEO', 'SEM', 'campaign management'],
  'Nurse': ['patient care', 'clinical skills', 'medical records', 'healthcare', 'bedside manner', 'protocols', 'medication administration', 'electronic health records'],
  'Registered Nurse': ['patient care', 'clinical skills', 'medical records', 'healthcare', 'bedside manner', 'protocols', 'medication administration', 'electronic health records'],
  'Project Manager': ['project lifecycle', 'stakeholder management', 'risk assessment', 'budget management', 'deliverables', 'agile', 'scrum', 'project planning'],
  'Sales Representative': ['quota', 'revenue', 'client relations', 'CRM', 'lead generation', 'sales funnel', 'prospecting', 'account management']
};

export default function ExperienceSection({ 
  resumeData = { experience: [] }, 
  addArrayItem = () => {}, 
  removeArrayItem = () => {}, 
  updateArrayItem = () => {},
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}: ExperienceSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [showBulletSuggestions, setShowBulletSuggestions] = useState<Record<number, boolean>>({});
  const [showAchievementHelper, setShowAchievementHelper] = useState<Record<number, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<number, ValidationErrors>>({});
  const [atsAnalysis, setAtsAnalysis] = useState<Record<number, ATSAnalysisResult>>({});

  // Validation function
  const validateExperience = (experience: Experience, index: number): boolean => {
    const errors: ValidationErrors = {};
    if (!experience.title?.trim()) errors.title = 'Job title is required';
    if (!experience.company?.trim()) errors.company = 'Company name is required';
    if (!experience.description?.trim()) errors.description = 'Job description is required';
    if (experience.description && experience.description.length < 100) {
      errors.description = 'Description should be at least 100 characters for better ATS scoring';
    }
    
    setValidationErrors(prev => ({ ...prev, [index]: errors }));
    return Object.keys(errors).length === 0;
  };

  // ATS Analysis function
  const analyzeATS = (experience: Experience, index: number): void => {
    const description = experience.description?.toLowerCase() || '';
    const keywords = atsKeywords[experience.title] || [];
    
    const foundKeywords = keywords.filter((keyword: string) => 
      description.includes(keyword.toLowerCase())
    );
    
    const score = Math.min(100, (foundKeywords.length / Math.max(keywords.length, 1)) * 100);
    const missingKeywords = keywords.filter((keyword: string) => 
      !description.includes(keyword.toLowerCase())
    );

    setAtsAnalysis(prev => ({
      ...prev,
      [index]: {
        score: Math.round(score),
        foundKeywords,
        missingKeywords,
        hasMetrics: /\d+%|\$\d+|\d+\+/.test(description),
        hasActionVerbs: Object.values(actionVerbsByCategory).flat().some((verb: string) => 
          description.includes(verb.toLowerCase())
        )
      }
    }));
  };

  // Add new experience
  const addExperience = (): void => {
    const newExperience: Experience = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      responsibilities: [],
      skills: []
    };
    addArrayItem('experience', newExperience);
    setExpandedIndex((resumeData?.experience || []).length);
  };

  // Generate AI suggestions
  const generateAISuggestions = async (jobTitle: string, index: number): Promise<ExperiencePhrases> => {
    setIsGeneratingAI(true);
    setShowBulletSuggestions({ ...showBulletSuggestions, [index]: true });
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGeneratingAI(false);
    return experiencePhrases[jobTitle] || experiencePhrases['Software Engineer'] || { achievements: [], responsibilities: [] };
  };

  // Insert suggestion with category
  const insertSuggestion = (text: string, category: string, index: number): void => {
    const experience = resumeData.experience?.[index];
    if (!experience) return;
    
    const prefix = '• ';
    const currentDescription = experience.description || '';
    const newDescription = currentDescription 
      ? `${currentDescription}\n${prefix}${text}`
      : `${prefix}${text}`;
    
    updateArrayItem('experience', index, { description: newDescription });
    
    // Run ATS analysis after adding content
    setTimeout(() => analyzeATS({ ...experience, description: newDescription }, index), 100);
  };

  // Toggle current position
  const toggleCurrent = (index: number): void => {
    const experience = resumeData.experience?.[index];
    if (!experience) return;
    
    updateArrayItem('experience', index, { 
      current: !experience.current,
      endDate: !experience.current ? '' : experience.endDate
    });
  };

  // Handle field updates with validation
  const handleFieldUpdate = (index: number, field: keyof Experience, value: string): void => {
    updateArrayItem('experience', index, { [field]: value });
    
    // Validate after update
    const experience = resumeData?.experience?.[index];
    if (!experience) return;
    
    const updatedExperience = { ...experience, [field]: value };
    validateExperience(updatedExperience, index);
    
    // Run ATS analysis for description changes
    if (field === 'description' && value.length > 50) {
      analyzeATS(updatedExperience, index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your work history with quantified achievements and strong action verbs
          </p>
        </div>
        <button
          onClick={() => setShowPhraseLibrary(true)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>Phrase Library</span>
        </button>
      </div>

      {/* Add Experience Button */}
      <button
        onClick={addExperience}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add Work Experience</span>
      </button>

      {/* Experience List */}
      <div className="space-y-4">
        {(resumeData?.experience || []).map((exp: Experience, index: number) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Experience Header */}
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <Briefcase className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {exp.title || 'Job Title'} {exp.company && `at ${exp.company}`}
                    </h4>
                    {validationErrors[index] && Object.keys(validationErrors[index]).length > 0 && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {atsAnalysis[index]?.score >= 80 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} {exp.endDate && `- ${exp.endDate}`} {exp.current && '- Present'}
                    {atsAnalysis[index] && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        atsAnalysis[index].score >= 80 ? 'bg-green-100 text-green-700' :
                        atsAnalysis[index].score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        ATS: {atsAnalysis[index].score}%
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeArrayItem('experience', index);
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
                {expandedIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Experience Details */}
            {expandedIndex === index && (
              <div className="p-6 space-y-6">
                {/* ATS Analysis */}
                {atsAnalysis[index] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-blue-900 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        ATS Optimization Score: {atsAnalysis[index].score}%
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">✓ Found Keywords:</p>
                        <p className="text-blue-600">{atsAnalysis[index].foundKeywords.join(', ') || 'None'}</p>
                      </div>
                      <div>
                        <p className="text-orange-700 font-medium">⚠ Missing Keywords:</p>
                        <p className="text-orange-600">{atsAnalysis[index].missingKeywords.slice(0, 3).join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Improvements:</p>
                        <div className="text-gray-600">
                          {!atsAnalysis[index].hasMetrics && <p>• Add metrics/numbers</p>}
                          {!atsAnalysis[index].hasActionVerbs && <p>• Use action verbs</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp?.title || ''}
                      onChange={(e) => handleFieldUpdate(index, 'title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {validationErrors[index]?.title && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleFieldUpdate(index, 'company', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.company ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Tech Company Inc."
                    />
                    {validationErrors[index]?.company && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].company}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => handleFieldUpdate(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current}
                        onChange={() => toggleCurrent(index)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-${index}`} className="text-sm font-medium text-gray-700">
                        I currently work here
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleFieldUpdate(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., January 2020"
                    />
                  </div>
                  {!exp.current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => handleFieldUpdate(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., December 2023"
                      />
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description &amp; Achievements <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAchievementHelper({ ...showAchievementHelper, [index]: !showAchievementHelper[index] })}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs"
                      >
                        <Award className="w-3 h-3" />
                        <span>Achievement Helper</span>
                      </button>
                      <button
                        onClick={() => generateAISuggestions(exp.title, index)}
                        disabled={isGeneratingAI}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs"
                      >
                        <Sparkles className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                        <span>AI Suggest</span>
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleFieldUpdate(index, 'description', e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[index]?.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="• Start with strong action verbs (Achieved, Led, Developed...)&#10;• Include specific metrics and numbers (increased sales by 25%)&#10;• Focus on achievements and impact, not just duties&#10;• Use bullet points for better readability"
                  />
                  
                  <div className="mt-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500">
                        💡 Lead with achievements, then responsibilities. Use numbers and metrics when possible.
                      </div>
                      <div className={`${exp.description?.length > 150 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {exp.description?.length || 0} characters
                        {(!exp.description || exp.description.length < 150) && ' (aim for 150+ for better ATS score)'}
                      </div>
                    </div>
                    {validationErrors[index]?.description && (
                      <p className="text-red-500 mt-1">{validationErrors[index].description}</p>
                    )}
                  </div>
                </div>

                {/* Achievement Helper */}
                {showAchievementHelper[index] && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-3">
                      🏆 Achievement Writing Helper:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-green-800 mb-2">Use this formula:</p>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-gray-700">
                            <strong>Action Verb</strong> + <strong>What you did</strong> + <strong>Metric/Result</strong>
                          </p>
                          <p className="text-gray-600 mt-1 text-xs">
                            Example: &ldquo;Increased sales by 25% through implementation of new customer retention program&rdquo;
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-green-800 mb-2">Good metrics to include:</p>
                        <ul className="text-green-700 space-y-1">
                          <li>• Percentages (increased by 30%)</li>
                          <li>• Dollar amounts ($500K budget)</li>
                          <li>• Time saved (reduced by 2 hours)</li>
                          <li>• Team size (led team of 8)</li>
                          <li>• Volume (processed 200+ cases)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                {showBulletSuggestions[index] && exp.title && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-3">
                      💡 Suggested content for {exp.title}:
                    </h5>
                    
                    {/* Achievements */}
                    <div className="mb-4">
                      <h6 className="flex items-center text-sm font-medium text-blue-800 mb-2">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Achievements (lead with these):
                      </h6>
                      <div className="space-y-2">
                        {(experiencePhrases[exp.title]?.achievements || []).map((phrase: string, phraseIndex: number) => (
                          <button
                            key={phraseIndex}
                            onClick={() => insertSuggestion(phrase, 'achievements', index)}
                            className="block w-full p-3 text-left bg-white hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-sm"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-4">
                      <h6 className="flex items-center text-sm font-medium text-blue-800 mb-2">
                        <Users className="w-4 h-4 mr-1" />
                        Key Responsibilities:
                      </h6>
                      <div className="space-y-2">
                        {(experiencePhrases[exp.title]?.responsibilities || []).map((phrase: string, phraseIndex: number) => (
                          <button
                            key={phraseIndex}
                            onClick={() => insertSuggestion(phrase, 'responsibilities', index)}
                            className="block w-full p-3 text-left bg-white hover:bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-sm"
                          >
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBulletSuggestions({ ...showBulletSuggestions, [index]: false })}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Hide suggestions
                    </button>
                  </div>
                )}

                {/* Action Verbs Helper */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    💪 Strong Action Verbs by Category:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(actionVerbsByCategory).map(([category, verbs]) => (
                      <div key={category}>
                        <h6 className="text-xs font-medium text-gray-700 mb-2 capitalize">{category}:</h6>
                        <div className="flex flex-wrap gap-1">
                          {verbs.map((verb: string) => (
                            <span 
                              key={verb}
                              className="px-2 py-1 bg-white text-gray-700 text-xs rounded border hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                navigator.clipboard?.writeText(verb);
                              }}
                              title="Click to copy"
                            >
                              {verb}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Click any verb to copy it</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!resumeData?.experience || resumeData.experience.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added yet</h4>
          <p className="text-sm mb-4">Add your work history to showcase your professional background</p>
          <button
            onClick={addExperience}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Job</span>
          </button>
        </div>
      )}

      {/* Enhanced Tips Panel */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">💡 Professional Experience Best Practices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Writing Tips:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Lead with achievements, not just responsibilities</li>
                  <li>• Use strong action verbs (Achieved, Led, Increased)</li>
                  <li>• Include specific numbers and percentages</li>
                  <li>• Tailor content to target job requirements</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">ATS Optimization:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Include industry keywords naturally</li>
                  <li>• Use standard job titles when possible</li>
                  <li>• Aim for 150+ characters per description</li>
                  <li>• Avoid fancy formatting in text</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </span>

        <button
          onClick={goToNextStep}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}