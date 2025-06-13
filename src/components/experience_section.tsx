import React, { useState, useEffect } from 'react';
import { 
  Plus, Sparkles, BookOpen, ArrowLeft, ArrowRight, Briefcase, 
  Calendar, MapPin, Building, Lightbulb, ChevronDown, ChevronUp, 
  GripVertical, Target, AlertCircle, CheckCircle, TrendingUp, Users, 
  Award, Zap, X, BarChart3, DollarSign, Trophy
} from 'lucide-react';

/**
 * ExperienceSection.tsx - Work Experience Form Component
 * 
 * Updated to integrate with Builder.tsx and ProgressIndicator:
 * - Uses centralized SectionComponentProps interface
 * - Implements centralized validation error system
 * - Integrates with ProgressIndicator completion tracking
 * - Follows exact data structure expectations
 */

// Experience phrases database by job title
const experiencePhrases = {
  'Software Engineer': {
    achievements: [
      'Increased application performance by 40% through database optimization and caching strategies',
      'Led migration of legacy systems to cloud infrastructure, reducing costs by $50K annually',
      'Developed automated testing framework that reduced bug reports by 60%',
      'Built scalable microservices architecture supporting 100K+ daily active users',
      'Implemented CI/CD pipeline that decreased deployment time from 2 hours to 15 minutes',
      'Optimized SQL queries resulting in 70% faster data retrieval and improved user experience',
      'Created RESTful APIs that improved data processing efficiency by 35%',
      'Led code review process that improved code quality metrics by 45%'
    ],
    responsibilities: [
      'Developed and maintained web applications using React, Node.js, and PostgreSQL',
      'Collaborated with cross-functional teams to design and implement new features',
      'Participated in agile development process including sprint planning and daily standups',
      'Mentored junior developers on best practices and coding standards',
      'Wrote comprehensive unit and integration tests to ensure code reliability',
      'Debugged and resolved complex technical issues in production environments',
      'Contributed to technical documentation and architecture decisions',
      'Conducted code reviews to maintain high-quality codebase standards'
    ]
  },
  'Electrician': {
    achievements: [
      'Completed 200+ residential installations with 100% safety record and zero code violations',
      'Reduced project completion time by 25% through improved workflow and tool organization',
      'Achieved Master Electrician certification ahead of schedule with 95% exam score',
      'Led electrical team of 5 technicians on $2M commercial construction project',
      'Implemented new safety protocols that decreased workplace incidents by 80%',
      'Diagnosed and resolved complex electrical issues saving clients average of $3K per repair',
      'Maintained 98% customer satisfaction rating across 500+ service calls',
      'Trained 15+ apprentices with 90% program completion rate'
    ],
    responsibilities: [
      'Installed, maintained, and repaired electrical systems in residential and commercial buildings',
      'Read and interpreted blueprints, schematics, and electrical code specifications',
      'Performed electrical troubleshooting and diagnostic testing using specialized equipment',
      'Ensured all work complied with local electrical codes and safety regulations',
      'Collaborated with contractors, engineers, and project managers on construction projects',
      'Maintained accurate records of work performed and materials used',
      'Provided electrical estimates and consulted with clients on project requirements',
      'Conducted regular safety inspections and equipment maintenance'
    ]
  },
  'Marketing Manager': {
    achievements: [
      'Increased brand awareness by 150% through integrated digital marketing campaigns',
      'Generated $2M in revenue through strategic lead generation and conversion optimization',
      'Grew social media following by 300% and engagement rates by 85% within 12 months',
      'Launched successful product campaign that exceeded sales targets by 40%',
      'Reduced customer acquisition cost by 30% through A/B testing and optimization',
      'Managed $500K marketing budget with 95% efficiency and ROI tracking',
      'Developed content strategy that increased organic traffic by 200%',
      'Led rebranding initiative that improved brand recognition by 60%'
    ],
    responsibilities: [
      'Developed and executed comprehensive marketing strategies for product launches',
      'Managed multi-channel campaigns across digital and traditional media platforms',
      'Analyzed market trends and competitor activities to identify growth opportunities',
      'Collaborated with sales team to align marketing efforts with revenue goals',
      'Created compelling content for websites, social media, and marketing materials',
      'Monitored campaign performance using analytics tools and KPI dashboards',
      'Built relationships with media partners, influencers, and industry stakeholders',
      'Coordinated with design and creative teams to ensure brand consistency'
    ]
  },
  'Nurse': {
    achievements: [
      'Maintained 99% patient satisfaction score across 1,000+ patient interactions',
      'Reduced medication errors by 85% through implementation of double-check protocols',
      'Led quality improvement initiative that decreased hospital readmission rates by 20%',
      'Achieved Stroke Certification and improved patient outcomes by 35%',
      'Mentored 25+ nursing students with 95% NCLEX pass rate',
      'Implemented new patient education program increasing compliance by 50%',
      'Received Employee of the Month award 5 times for exceptional patient care',
      'Successfully managed caseload of 12+ patients while maintaining quality standards'
    ],
    responsibilities: [
      'Provided comprehensive nursing care to patients in acute care medical-surgical unit',
      'Administered medications and treatments according to physician orders and protocols',
      'Monitored patient vital signs and documented changes in electronic health records',
      'Collaborated with interdisciplinary healthcare team to develop patient care plans',
      'Educated patients and families about medical conditions and discharge instructions',
      'Responded to medical emergencies and provided critical care interventions',
      'Maintained accurate patient documentation and ensured regulatory compliance',
      'Participated in quality assurance initiatives and continuing education programs'
    ]
  },
  'Project Manager': {
    achievements: [
      'Successfully delivered 50+ projects on time and 15% under budget totaling $10M value',
      'Improved team productivity by 40% through implementation of agile methodologies',
      'Reduced project timeline by 30% while maintaining quality standards and stakeholder satisfaction',
      'Led cross-functional team of 25+ members across multiple departments and locations',
      'Achieved 98% client satisfaction rating across all managed projects',
      'Implemented new project management tools that increased efficiency by 50%',
      'Saved company $500K annually through process optimization and resource allocation',
      'Earned PMP certification and trained 20+ team members on project management best practices'
    ],
    responsibilities: [
      'Managed end-to-end project lifecycle from initiation to closure and post-project review',
      'Developed detailed project plans, timelines, and resource allocation strategies',
      'Coordinated with stakeholders to define project scope, requirements, and deliverables',
      'Conducted regular project status meetings and provided updates to executive leadership',
      'Identified and mitigated project risks while maintaining contingency planning',
      'Managed project budgets and tracked expenses against approved financial plans',
      'Facilitated communication between team members, clients, and vendor partners',
      'Ensured projects met quality standards and regulatory compliance requirements'
    ]
  },
  'Sales Representative': {
    achievements: [
      'Exceeded annual sales quota by 135% generating $2.5M in revenue',
      'Grew territory by 200% and acquired 150+ new clients within first year',
      'Achieved #1 sales performer ranking for 3 consecutive quarters',
      'Increased average deal size by 45% through consultative selling approach',
      'Maintained 90% client retention rate and 85% upsell success rate',
      'Generated 300+ qualified leads monthly through networking and referral programs',
      'Closed largest deal in company history worth $500K in annual recurring revenue',
      'Won Sales Excellence Award and President\'s Club recognition'
    ],
    responsibilities: [
      'Prospected and qualified potential clients through cold calling and networking',
      'Conducted product demonstrations and presentations to key decision makers',
      'Developed and maintained relationships with existing clients to ensure satisfaction',
      'Negotiated contracts and pricing agreements while maintaining profit margins',
      'Collaborated with marketing team to develop lead generation strategies',
      'Maintained accurate sales forecasts and pipeline reporting in CRM system',
      'Attended trade shows and industry events to generate leads and build brand awareness',
      'Provided product feedback to development team based on customer requirements'
    ]
  }
};

// Action verbs by category for better writing
const actionVerbsByCategory = {
  leadership: ['Led', 'Managed', 'Supervised', 'Directed', 'Coordinated', 'Guided', 'Mentored', 'Trained'],
  achievement: ['Achieved', 'Exceeded', 'Delivered', 'Generated', 'Increased', 'Improved', 'Reduced', 'Saved'],
  technical: ['Developed', 'Built', 'Implemented', 'Designed', 'Created', 'Optimized', 'Automated', 'Integrated'],
  collaboration: ['Collaborated', 'Partnered', 'Facilitated', 'Communicated', 'Negotiated', 'Presented', 'Consulted'],
  problemSolving: ['Resolved', 'Diagnosed', 'Analyzed', 'Identified', 'Troubleshot', 'Investigated', 'Streamlined']
};

// ATS keywords by job title
const atsKeywords = {
  'Software Engineer': ['developed', 'built', 'implemented', 'optimized', 'automated', 'scalable', 'performance', 'architecture'],
  'Electrician': ['installed', 'maintained', 'repaired', 'troubleshot', 'safety', 'compliance', 'electrical systems', 'code'],
  'Marketing Manager': ['campaign', 'strategy', 'brand awareness', 'ROI', 'analytics', 'lead generation', 'content', 'digital marketing'],
  'Nurse': ['patient care', 'clinical', 'healthcare', 'medical', 'documentation', 'compliance', 'quality improvement', 'education'],
  'Project Manager': ['managed', 'delivered', 'stakeholder', 'budget', 'timeline', 'scope', 'risk management', 'methodology'],
  'Sales Representative': ['sales', 'revenue', 'quota', 'clients', 'negotiation', 'CRM', 'lead generation', 'relationship building']
};

interface SectionComponentProps {
  resumeData: any; // Your resume data object
  updateResumeData: (section: string, data: any) => void;
  addArrayItem: (section: string, item: any) => void;
  removeArrayItem: (section: string, index: number) => void;
  updateArrayItem: (section: string, index: number, data: any) => void;
  setShowPhraseLibrary: (show: boolean) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  currentStep: number;
  totalSteps: number;
  validationErrors?: any;
  setValidationErrors?: (errors: any) => void;
}

export default function ExperienceSection({
  resumeData,
  updateResumeData,
  addArrayItem,
  removeArrayItem,
  updateArrayItem,
  setShowPhraseLibrary,
  goToNextStep,
  goToPrevStep,
  currentStep = 0,
  totalSteps = 1,
  validationErrors = {},
  setValidationErrors = () => {}
}: SectionComponentProps) {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showBulletSuggestions, setShowBulletSuggestions] = useState<Record<number, boolean>>({});
  const [showAchievementHelper, setShowAchievementHelper] = useState<Record<number, boolean>>({});
  const [atsAnalysis, setAtsAnalysis] = useState<Record<number, any>>({});
  const [showExperienceHelper, setShowExperienceHelper] = useState(false);
  const [showMetricsHelper, setShowMetricsHelper] = useState<Record<number, boolean>>({});

  // Validation function
  const validateExperience = (experience: any, index: number) => {
    const errors: any = {};
    const errorKey = `experience_${index}`;
    
    if (!experience.title?.trim()) {
      errors.title = 'Job title is required';
    }
    
    if (!experience.company?.trim()) {
      errors.company = 'Company name is required';
    }
    
    if (!experience.description?.trim()) {
      errors.description = 'Job description is required';
    } else if (experience.description.length < 150) {
      errors.description = 'Description should be at least 150 characters for better ATS scoring';
    }
    
    if (!experience.startDate?.trim()) {
      errors.startDate = 'Start date is required';
    }
    
    if (!experience.current && !experience.endDate?.trim()) {
      errors.endDate = 'End date is required (or mark as current position)';
    }
    
    // Update centralized validation errors
    const currentErrors = { ...validationErrors };
    if (Object.keys(errors).length > 0) {
      currentErrors[errorKey] = errors;
    } else {
      delete currentErrors[errorKey];
    }
    setValidationErrors(currentErrors);
    
    return Object.keys(errors).length === 0;
  };

  // ATS Analysis function
  const analyzeATS = (experience: any, index: number) => {
    const jobTitle = experience.title?.toLowerCase() || '';
    const description = experience.description?.toLowerCase() || '';
    
    // Find relevant keywords based on job title
    let relevantKeywords: string[] = [];
    Object.entries(atsKeywords).forEach(([title, keywords]) => {
      if (jobTitle.includes(title.toLowerCase()) || title.toLowerCase().includes(jobTitle)) {
        relevantKeywords = keywords;
      }
    });
    
    // Fallback to general business keywords if no match
    if (relevantKeywords.length === 0) {
      relevantKeywords = ['managed', 'led', 'developed', 'improved', 'increased', 'achieved', 'implemented', 'collaborated'];
    }
    
    // Additional safeguard against empty arrays
    if (relevantKeywords.length === 0) {
      relevantKeywords = ['managed'];
    }
    
    const foundKeywords = relevantKeywords.filter(keyword => 
      description.includes(keyword.toLowerCase())
    );
    
    const missingKeywords = relevantKeywords.filter(keyword => 
      !description.includes(keyword.toLowerCase())
    );

    // Improved metrics detection - must have numbers AND impact words
    const hasMetrics = /(\d+%|\$[\d,]+|\d+\+|[0-9]+[KMB]|\d+x)\s*(increase|decrease|improve|reduc|save|generat|growth|revenue|profit|efficiency)/i.test(description) ||
                     /(?:increase|decrease|improve|reduc|save|generat|growth|revenue|profit|efficiency).*?(\d+%|\$[\d,]+|\d+\+|[0-9]+[KMB]|\d+x)/i.test(description);
    
    const hasActionVerbs = Object.values(actionVerbsByCategory).flat().some(verb => 
      description.includes(verb.toLowerCase())
    );

    // Calculate score with safeguards
    let score = 0;
    score += (foundKeywords.length / Math.max(relevantKeywords.length, 1)) * 40; // 40% for keywords
    score += hasMetrics ? 30 : 0; // 30% for metrics
    score += hasActionVerbs ? 20 : 0; // 20% for action verbs
    score += experience.description && experience.description.length > 200 ? 10 : 0; // 10% for content length

    setAtsAnalysis(prev => ({
      ...prev,
      [index]: {
        score: Math.min(100, Math.round(score)),
        foundKeywords,
        missingKeywords: missingKeywords.slice(0, 5),
        hasMetrics,
        hasActionVerbs,
        suggestions: generateATSSuggestions(experience, foundKeywords, hasMetrics, hasActionVerbs)
      }
    }));
  };

  // Generate ATS improvement suggestions
  const generateATSSuggestions = (experience: any, foundKeywords: string[], hasMetrics: boolean, hasActionVerbs: boolean) => {
    const suggestions = [];
    
    if (!hasMetrics) {
      suggestions.push('Add quantifiable achievements (percentages, dollar amounts, timeframes)');
    }
    
    if (!hasActionVerbs) {
      suggestions.push('Start bullet points with strong action verbs (Led, Developed, Achieved, etc.)');
    }
    
    if (foundKeywords.length < 3) {
      suggestions.push('Include more industry-specific keywords and technical skills');
    }
    
    if (!experience.description || experience.description.length < 200) {
      suggestions.push('Expand descriptions to 200+ characters for better keyword density');
    }
    
    return suggestions;
  };

  // Add new experience
  const addExperience = () => {
    const newExperience = {
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
    const currentLength = experiences.length;
    addArrayItem('experience', newExperience);
    setExpandedIndex(currentLength); // Set to the new item's index
  };

  // Generate AI suggestions
  const generateAISuggestions = async (jobTitle: string, index: number) => {
    setIsGeneratingAI(true);
    setShowBulletSuggestions({ ...showBulletSuggestions, [index]: true });
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGeneratingAI(false);
  };

  // Insert suggestion with category
  const insertSuggestion = (text: string, category: string, index: number) => {
    const experience = resumeData.experience[index];
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
  const toggleCurrent = (index: number) => {
    const experience = resumeData.experience[index];
    updateArrayItem('experience', index, { 
      current: !experience.current,
      endDate: !experience.current ? '' : experience.endDate
    });
  };

  // Handle field updates with validation
  const handleFieldUpdate = (index: number, field: string, value: string) => {
    updateArrayItem('experience', index, { [field]: value });
    
    // Validate after update
    const experience = resumeData?.experience?.[index] || {};
    const updatedExperience = { ...experience, [field]: value };
    validateExperience(updatedExperience, index);
    
    // Run ATS analysis for description changes
    if (field === 'description' && value.length > 50) {
      analyzeATS(updatedExperience, index);
    }
  };

  // Initialize validation for existing experiences
  useEffect(() => {
    const experiences = resumeData?.experience || [];
    experiences.forEach((exp, index) => {
      validateExperience(exp, index);
      if (exp.description && exp.description.length > 50) {
        analyzeATS(exp, index);
      }
    });
  }, [resumeData?.experience]);

  // Helper function to get validation errors for a specific experience
  const getExperienceErrors = (index: number) => {
    return validationErrors[`experience_${index}`] || {};
  };

  // Get experiences array safely
  const experiences = resumeData?.experience || [];

  // Get job title suggestions for helper
  const getJobTitleSuggestions = () => {
    return Object.keys(experiencePhrases);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your work history with quantified achievements and strong action verbs for maximum impact
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowExperienceHelper(!showExperienceHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Writing Guide</span>
          </button>
          <button
            onClick={() => setShowPhraseLibrary(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Phrase Library</span>
          </button>
        </div>
      </div>

      {/* Experience Writing Helper */}
      {showExperienceHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3">
            📝 Work Experience Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">Content Structure:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Start with achievements and quantifiable results</li>
                <li>• Use strong action verbs (Led, Developed, Achieved)</li>
                <li>• Include specific metrics and percentages</li>
                <li>• Focus on impact, not just responsibilities</li>
                <li>• Use bullet points for better readability</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">ATS Optimization:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Include industry-specific keywords</li>
                <li>• Use exact job title keywords from postings</li>
                <li>• Mention relevant technologies and tools</li>
                <li>• Include measurable accomplishments</li>
                <li>• Write 150+ characters per description</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-1">✨ Example Achievement:</p>
            <p className="text-sm text-green-700">
              "Led cross-functional team of 8 developers to deliver customer portal 2 weeks ahead of schedule, 
              resulting in 40% increase in user engagement and $200K annual cost savings."
            </p>
          </div>
        </div>
      )}

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
        {experiences.map((exp: any, index: number) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Experience Header */}
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedIndex === index}
              aria-controls={`experience-details-${index}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedIndex(expandedIndex === index ? -1 : index);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <Briefcase className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {exp.title || 'Job Title'} {exp.company && `at ${exp.company}`}
                    </h4>
                    {validationErrors && Object.keys(validationErrors).some(key => key.startsWith(`experience_${index}`)) && (
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
                  <X className="w-4 h-4" />
                </button>
                {expandedIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Experience Details */}
            {expandedIndex === index && (
              <div id={`experience-details-${index}`} className="p-6 space-y-6">
                {/* ATS Analysis */}
                {atsAnalysis[index] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-blue-900 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        ATS Optimization Score: {atsAnalysis[index].score}%
                      </h5>
                      <div className="flex items-center space-x-2">
                        {atsAnalysis[index].hasMetrics && <DollarSign className="w-4 h-4 text-green-600" />}
                        {atsAnalysis[index].hasActionVerbs && <Zap className="w-4 h-4 text-blue-600" />}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">✓ Found Keywords:</p>
                        <p className="text-blue-600">{atsAnalysis[index].foundKeywords.join(', ') || 'None detected'}</p>
                      </div>
                      <div>
                        <p className="text-orange-700 font-medium">⚠ Missing Keywords:</p>
                        <p className="text-orange-600">{atsAnalysis[index].missingKeywords.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Quick Improvements:</p>
                        <div className="text-gray-600">
                          {!atsAnalysis[index].hasMetrics && <p>• Add metrics/numbers</p>}
                          {!atsAnalysis[index].hasActionVerbs && <p>• Use action verbs</p>}
                          {atsAnalysis[index].foundKeywords.length < 3 && <p>• Add more keywords</p>}
                        </div>
                      </div>
                    </div>

                    {atsAnalysis[index].suggestions && atsAnalysis[index].suggestions.length > 0 && (
                      <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                        <p className="text-xs font-medium text-blue-800 mb-1">💡 Suggestions:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {atsAnalysis[index].suggestions.map((suggestion: string, i: number) => (
                            <li key={i}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                        getExperienceErrors(index)?.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {getExperienceErrors(index)?.title && (
                      <p className="text-red-500 text-xs mt-1">{getExperienceErrors(index).title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleFieldUpdate(index, 'company', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        getExperienceErrors(index)?.company ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Tech Company Inc."
                    />
                    {getExperienceErrors(index)?.company && (
                      <p className="text-red-500 text-xs mt-1">{getExperienceErrors(index).company}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location || ''}
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
                        checked={exp.current || false}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="month"
                      value={exp.startDate || ''}
                      onChange={(e) => handleFieldUpdate(index, 'startDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        getExperienceErrors(index)?.startDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 2020-01"
                    />
                    {getExperienceErrors(index)?.startDate && (
                      <p className="text-red-500 text-xs mt-1">{getExperienceErrors(index).startDate}</p>
                    )}
                  </div>
                  
                  {!exp.current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={exp.endDate || ''}
                        onChange={(e) => handleFieldUpdate(index, 'endDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          getExperienceErrors(index)?.endDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 2023-12"
                      />
                      {getExperienceErrors(index)?.endDate && (
                        <p className="text-red-500 text-xs mt-1">{getExperienceErrors(index).endDate}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description & Achievements <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowMetricsHelper({ ...showMetricsHelper, [index]: !showMetricsHelper[index] })}
                        className="flex items-center space-x-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-xs"
                      >
                        <BarChart3 className="w-3 h-3" />
                        <span>Metrics Guide</span>
                      </button>
                      
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
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs disabled:opacity-50"
                      >
                        <Sparkles className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                        <span>AI Suggest</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Metrics Helper */}
                  {showMetricsHelper[index] && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h6 className="font-medium text-yellow-900 mb-2">📊 Adding Quantifiable Metrics:</h6>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-yellow-800 mb-1">Numbers to Include:</p>
                          <ul className="text-yellow-700 space-y-1">
                            <li>• Percentages (increased by 40%)</li>
                            <li>• Dollar amounts ($500K savings)</li>
                            <li>• Time periods (2 weeks ahead)</li>
                            <li>• Team sizes (led team of 8)</li>
                            <li>• Volume (processed 1000+ orders)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-yellow-800 mb-1">Example Phrases:</p>
                          <ul className="text-yellow-700 space-y-1">
                            <li>• "Increased efficiency by 35%"</li>
                            <li>• "Saved company $200K annually"</li>
                            <li>• "Managed team of 12 developers"</li>
                            <li>• "Delivered 50+ projects on time"</li>
                            <li>• "Improved customer satisfaction by 25%"</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Achievement Helper */}
                  {showAchievementHelper[index] && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h6 className="font-medium text-green-900 mb-2">🏆 Achievement vs. Responsibility:</h6>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-red-800 mb-1">❌ Weak (Just Responsibilities):</p>
                          <ul className="text-red-700 space-y-1">
                            <li>• "Responsible for managing projects"</li>
                            <li>• "Worked on customer service"</li>
                            <li>• "Handled sales activities"</li>
                            <li>• "Participated in team meetings"</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-green-800 mb-1">✅ Strong (Impact & Results):</p>
                          <ul className="text-green-700 space-y-1">
                            <li>• "Led 15 projects, delivering 90% on time"</li>
                            <li>• "Achieved 98% customer satisfaction rating"</li>
                            <li>• "Generated $2M in new business revenue"</li>
                            <li>• "Streamlined processes, reducing costs by 30%"</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => handleFieldUpdate(index, 'description', e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      getExperienceErrors(index)?.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={`• Start with strong action verbs (Achieved, Led, Developed...)
• Include specific metrics and numbers (increased sales by 25%)
• Focus on achievements and impact, not just duties
• Use bullet points for better readability
• Aim for 150+ characters for optimal ATS scoring`}
                  />
                  
                  <div className="mt-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500">
                        💡 Lead with achievements, then responsibilities. Use numbers and metrics when possible.
                      </div>
                      <div className={`${
                        !exp.description ? 'text-red-600' : 
                        exp.description.length < 150 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {exp.description?.length || 0} characters
                        {!exp.description ? ' (description required)' :
                         exp.description.length < 150 ? ' (aim for 150+ for better ATS score)' :
                         ' (excellent length)'}
                      </div>
                    </div>
                    {getExperienceErrors(index)?.description && (
                      <p className="text-red-500 mt-1">{getExperienceErrors(index).description}</p>
                    )}
                  </div>
                </div>

                {/* AI Suggestions */}
                {showBulletSuggestions[index] && exp.title && experiencePhrases[exp.title as keyof typeof experiencePhrases] && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h5 className="font-medium text-purple-900 mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI-Powered Content for {exp.title}:
                    </h5>
                    
                    {/* Achievements */}
                    <div className="mb-4">
                      <h6 className="flex items-center text-sm font-medium text-purple-800 mb-2">
                        <Trophy className="w-4 h-4 mr-1" />
                        Achievements (lead with these):
                      </h6>
                      <div className="space-y-2">
                        {experiencePhrases[exp.title as keyof typeof experiencePhrases]?.achievements?.map((phrase: string, phraseIndex: number) => (
                          <button
                            key={phraseIndex}
                            onClick={() => insertSuggestion(phrase, 'achievements', index)}
                            className="block w-full p-3 text-left bg-white hover:bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors text-sm"
                          >
                            <div className="flex items-start justify-between">
                              <span>{phrase}</span>
                              <Plus className="w-4 h-4 text-purple-600 flex-shrink-0 ml-2" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-4">
                      <h6 className="flex items-center text-sm font-medium text-purple-800 mb-2">
                        <Users className="w-4 h-4 mr-1" />
                        Key Responsibilities:
                      </h6>
                      <div className="space-y-2">
                        {experiencePhrases[exp.title as keyof typeof experiencePhrases]?.responsibilities?.map((phrase: string, phraseIndex: number) => (
                          <button
                            key={phraseIndex}
                            onClick={() => insertSuggestion(phrase, 'responsibilities', index)}
                            className="block w-full p-3 text-left bg-white hover:bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors text-sm"
                          >
                            <div className="flex items-start justify-between">
                              <span>{phrase}</span>
                              <Plus className="w-4 h-4 text-purple-600 flex-shrink-0 ml-2" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBulletSuggestions({ ...showBulletSuggestions, [index]: false })}
                      className="mt-3 text-sm text-purple-600 hover:text-purple-700"
                    >
                      Hide suggestions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No work experience added yet</h4>
          <p className="text-sm mb-4">Add your work history to showcase your professional background and achievements</p>
          <button
            onClick={addExperience}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Job</span>
          </button>
        </div>
      )}

      {/* Section Summary */}
      {resumeData?.experience && resumeData.experience.length > 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Experience Section Summary
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{resumeData.experience.length}</div>
              <div className="text-xs text-gray-600">Positions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {resumeData.experience.filter((exp: any) => atsAnalysis[resumeData.experience.indexOf(exp)]?.score >= 80).length}
              </div>
              <div className="text-xs text-gray-600">High ATS Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {resumeData.experience.filter((exp: any) => exp.description && exp.description.length > 200).length}
              </div>
              <div className="text-xs text-gray-600">Detailed Descriptions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(resumeData.experience.reduce((acc: number, exp: any, idx: number) => 
                  acc + (atsAnalysis[idx]?.score || 0), 0) / resumeData.experience.length) || 0}%
              </div>
              <div className="text-xs text-gray-600">Avg ATS Score</div>
            </div>
          </div>
        </div>
      )}

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