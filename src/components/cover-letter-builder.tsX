import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Target, 
  Eye, 
  EyeOff,
  Building, 
  Copy,
  Download,
  CheckCircle,
  LucideIcon
} from 'lucide-react';

// Proper TypeScript interfaces
interface ResumeData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    jobTitle?: string;
    yearsExperience?: string;
  };
  experience?: Array<{
    title?: string;
    company?: string;
    description?: string;
  }>;
  skills?: Array<{
    name?: string;
  } | string>;
}

interface JobDetails {
  position: string;
  company: string;
  companyAddress: string;
  hiringManager: string;
  jobSource: string;
  applicationDeadline: string;
}

interface LetterCustomization {
  experience: string;
  technologies: string;
  achievement: string;
  metrics: string;
  skills: string;
}

interface LetterContent {
  opening: string;
  body: string;
  closing: string;
  customization: LetterCustomization;
}

interface FormattingOptions {
  template: string;
  fontSize: string;
  spacing: string;
  margins: string;
}

interface UserPreferences {
  includeDate: boolean;
  includeAddress: boolean;
  formalTone: boolean;
  wordTarget: number;
}

interface CoverLetterData {
  jobDetails: JobDetails;
  letterContent: LetterContent;
  formatting: FormattingOptions;
  preferences: UserPreferences;
}

interface ATSAnalysis {
  score: number;
  keywords: string[];
  missing: string[];
}

interface Step {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  required: boolean;
}

// Cover letter templates by industry
const coverLetterTemplates: Record<string, Record<string, string[]>> = {
  'Software Engineer': {
    opening: [
      "I am writing to express my strong interest in the {position} role at {company}. With {experience} years of experience in software development and a proven track record of delivering scalable solutions, I am excited about the opportunity to contribute to your innovative team.",
      "As a passionate software engineer with expertise in {technologies}, I was thrilled to discover the {position} opening at {company}. Your commitment to cutting-edge technology and innovation aligns perfectly with my career goals and technical expertise.",
      "Having followed {company}'s groundbreaking work in technology, I am excited to apply for the {position} role. My background in full-stack development and experience with modern frameworks make me an ideal candidate for this position."
    ],
    body: [
      "In my current role at {currentCompany}, I have successfully {achievement}. My technical skills include proficiency in {skills}, and I have consistently delivered projects on time while maintaining high code quality standards.",
      "Throughout my career, I have demonstrated the ability to solve complex technical challenges and work collaboratively in agile environments. My experience includes developing scalable web applications, optimizing database performance, and implementing best practices for code maintainability.",
      "What sets me apart is my combination of technical expertise and business acumen. I have led cross-functional teams, mentored junior developers, and contributed to architectural decisions that have improved system performance and user experience."
    ],
    closing: [
      "I am eager to bring my technical skills and passion for innovation to {company}. I would welcome the opportunity to discuss how my experience aligns with your team's goals and contribute to {company}'s continued success.",
      "I am excited about the possibility of joining {company} and contributing to your mission. I look forward to hearing from you and discussing how I can add value to your development team.",
      "Thank you for considering my application. I am confident that my technical expertise and enthusiasm for {company}'s vision make me a strong candidate for this role. I look forward to the opportunity to discuss my qualifications further."
    ]
  },
  'Marketing Manager': {
    opening: [
      "I am excited to apply for the {position} role at {company}. With {experience} years of experience in digital marketing and a track record of driving {metrics}% growth in brand awareness, I am confident I can help {company} achieve its marketing objectives.",
      "As a results-driven marketing professional with expertise in digital marketing, I was immediately drawn to the {position} opportunity at {company}. Your innovative approach to customer engagement aligns perfectly with my strategic marketing philosophy.",
      "Having admired {company}'s creative marketing campaigns and brand positioning, I am thrilled to apply for the {position} role. My experience in developing integrated marketing strategies and managing cross-channel campaigns makes me an ideal fit for your team."
    ],
    body: [
      "In my current position, I have successfully increased lead generation by {percentage}% through strategic digital marketing initiatives. My expertise spans content marketing, social media management, SEO optimization, and marketing automation platforms.",
      "My approach to marketing combines data-driven insights with creative storytelling. I have managed marketing budgets exceeding $500K, led teams of marketing professionals, and consistently exceeded KPI targets across multiple channels.",
      "What distinguishes my marketing approach is my focus on customer journey optimization and ROI measurement. I have implemented analytics frameworks that provide actionable insights, enabling data-driven decision making and continuous campaign improvement."
    ],
    closing: [
      "I am excited about the opportunity to contribute to {company}'s marketing success and help drive continued growth. I would welcome the chance to discuss how my strategic approach and proven results can benefit your marketing team.",
      "I look forward to the possibility of joining {company} and contributing to your marketing vision. Thank you for considering my application, and I hope to discuss how I can help {company} achieve its ambitious marketing goals.",
      "Thank you for your consideration. I am passionate about {company}'s mission and confident that my marketing expertise and results-oriented approach make me a valuable addition to your team."
    ]
  },
  'Project Manager': {
    opening: [
      "I am writing to express my interest in the {position} role at {company}. With {experience} years of project management experience and a proven track record of delivering complex projects on time and under budget, I am excited about the opportunity to contribute to your organization.",
      "As a certified PMP with extensive experience in agile methodologies, I was delighted to learn about the {position} opening at {company}. Your reputation for operational excellence and innovation makes this an ideal opportunity for my career growth.",
      "Having successfully managed projects with budgets exceeding $500K and teams of 10+ members, I am confident in my ability to excel as {position} at {company}. Your commitment to project excellence aligns perfectly with my professional standards."
    ],
    body: [
      "In my current role, I have successfully managed 15+ projects with a 98% on-time delivery rate. My expertise includes stakeholder management, risk mitigation, resource allocation, and cross-functional team leadership across diverse industries.",
      "My project management approach emphasizes clear communication, proactive problem-solving, and continuous process improvement. I have implemented project management frameworks that have reduced delivery times by {percentage}% while maintaining quality standards.",
      "What sets me apart is my ability to bridge technical and business requirements while fostering collaborative team environments. I have experience with both traditional waterfall and agile methodologies, adapting my approach based on project needs and organizational culture."
    ],
    closing: [
      "I am eager to bring my project management expertise and leadership skills to {company}. I would welcome the opportunity to discuss how my experience can contribute to your project success and organizational objectives.",
      "I look forward to the possibility of joining {company} and contributing to your project management excellence. Thank you for considering my application, and I hope to discuss how I can help drive successful project outcomes.",
      "Thank you for your consideration. I am confident that my project management expertise and commitment to excellence make me a strong candidate for this role. I look forward to contributing to {company}'s continued success."
    ]
  },
  'Sales Representative': {
    opening: [
      "I am excited to apply for the {position} role at {company}. With {experience} years of sales experience and a consistent track record of exceeding quotas by {percentage}%, I am confident I can drive significant revenue growth for your organization.",
      "As a top-performing sales professional with expertise in consultative sales, I was immediately interested in the {position} opportunity at {company}. Your innovative products and market leadership make this an exciting career opportunity.",
      "Having consistently ranked in the top 10% of sales representatives in my current organization, I am eager to bring my relationship-building skills and sales expertise to the {position} role at {company}."
    ],
    body: [
      "In my current position, I have generated over $2M in annual revenue and maintained a {percentage}% client retention rate. My approach combines consultative selling with deep product knowledge to identify customer needs and deliver tailored solutions.",
      "My sales methodology focuses on building long-term client relationships and providing exceptional customer service. I have successfully managed accounts worth $1M and consistently exceeded quarterly targets through strategic prospecting and effective pipeline management.",
      "What distinguishes my sales approach is my ability to understand complex client requirements and translate them into customized solutions. I have experience with CRM systems, sales analytics, and territory management across diverse market segments."
    ],
    closing: [
      "I am excited about the opportunity to contribute to {company}'s sales success and help drive revenue growth. I would welcome the chance to discuss how my proven sales track record can benefit your team.",
      "I look forward to the possibility of joining {company} and contributing to your sales objectives. Thank you for considering my application, and I hope to discuss how I can help {company} achieve its ambitious revenue goals.",
      "Thank you for your consideration. I am passionate about sales excellence and confident that my track record and client-focused approach make me a valuable addition to your sales team."
    ]
  },
  'General': {
    opening: [
      "I am writing to express my strong interest in the {position} role at {company}. With my background in {field} and {experience} years of professional experience, I am excited about the opportunity to contribute to your team.",
      "I was delighted to learn about the {position} opening at {company}. Your organization's commitment to excellence aligns perfectly with my professional values and career aspirations.",
      "As a dedicated professional with expertise in my field, I am eager to apply for the {position} role at {company}. I am impressed by your company's reputation and would welcome the opportunity to contribute to your continued success."
    ],
    body: [
      "Throughout my career, I have developed strong skills in {skills} and have consistently delivered results that exceed expectations. My experience includes {achievements}, and I am known for my ability to collaborate effectively.",
      "In my current role, I have successfully {accomplishment} and have been recognized for my dedication and results. I bring a unique combination of technical skills and leadership that would be valuable to your organization.",
      "What sets me apart is my commitment to continuous learning and my ability to adapt to new challenges. I have a proven track record of success and am excited about the opportunity to bring these skills to {company}."
    ],
    closing: [
      "I am excited about the possibility of joining {company} and contributing to your team's success. I would welcome the opportunity to discuss how my skills and experience align with your needs.",
      "Thank you for considering my application. I am confident that my dedication and passion make me a strong candidate for this role. I look forward to hearing from you.",
      "I appreciate your time and consideration. I am eager to contribute to {company}'s mission and would welcome the opportunity to discuss how I can add value to your organization."
    ]
  }
};

// Industry-specific keywords for ATS optimization
const industryKeywords: Record<string, string[]> = {
  'Software Engineer': ['software development', 'programming', 'web applications', 'full-stack', 'agile', 'technical skills', 'problem-solving'],
  'Marketing Manager': ['digital marketing', 'brand management', 'lead generation', 'ROI', 'analytics', 'customer acquisition', 'campaign management'],
  'Project Manager': ['project management', 'stakeholder management', 'risk management', 'budget management', 'team leadership', 'methodology'],
  'Sales Representative': ['sales', 'revenue generation', 'client relationships', 'quota achievement', 'account management', 'consultative selling'],
  'General': ['leadership', 'communication', 'problem-solving', 'team collaboration', 'project management', 'customer service']
};

// Default cover letter data structure
const defaultCoverLetterData: CoverLetterData = {
  jobDetails: {
    position: '',
    company: '',
    companyAddress: '',
    hiringManager: '',
    jobSource: '',
    applicationDeadline: ''
  },
  letterContent: {
    opening: '',
    body: '',
    closing: '',
    customization: {
      experience: '',
      technologies: '',
      achievement: '',
      metrics: '',
      skills: ''
    }
  },
  formatting: {
    template: 'professional',
    fontSize: '11',
    spacing: 'normal',
    margins: 'normal'
  },
  preferences: {
    includeDate: true,
    includeAddress: true,
    formalTone: true,
    wordTarget: 300
  }
};

interface CoverLetterBuilderProps {
  resumeData?: ResumeData;
  onSave?: (data: CoverLetterData) => void;
  onDownload?: () => void;
  initialData?: CoverLetterData;
}

// Utility function to safely escape regex special characters
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Utility function for accurate word counting
const calculateWordCount = (text: string): number => {
  const cleanText = text.trim().replace(/\s+/g, ' ');
  return cleanText ? cleanText.split(' ').length : 0;
};

export default function CoverLetterBuilder({ 
  resumeData = {}, 
  onSave,
  onDownload = () => {},
  initialData
}: CoverLetterBuilderProps) {
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(
    initialData || defaultCoverLetterData
  );
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis>({ score: 0, keywords: [], missing: [] });
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Ref to track if component is mounted (prevents memory leaks)
  const mountedRef = useRef<boolean>(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Steps configuration with proper typing
  const steps: Step[] = useMemo(() => [
    {
      key: 'jobDetails',
      title: 'Job Details',
      description: 'Position and company information',
      icon: Building,
      required: true
    },
    {
      key: 'content',
      title: 'Letter Content',
      description: 'Write your cover letter',
      icon: FileText,
      required: true
    },
    {
      key: 'customize',
      title: 'Customize',
      description: 'Personalize and optimize',
      icon: Sparkles,
      required: false
    },
    {
      key: 'review',
      title: 'Review',
      description: 'Final review and download',
      icon: CheckCircle,
      required: false
    }
  ], []);

  // Memoized callback for onSave to prevent useEffect issues
  const memoizedOnSave = useCallback((data: CoverLetterData) => {
    onSave?.(data);
  }, [onSave]);

  // Auto-save with proper dependency management and memory leak prevention
  useEffect(() => {
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setAutoSaveStatus('saved');
        memoizedOnSave(coverLetterData);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [coverLetterData, memoizedOnSave]);

  // Calculate word count with memoization for performance
  const wordCount = useMemo(() => {
    const content = `${coverLetterData.letterContent.opening} ${coverLetterData.letterContent.body} ${coverLetterData.letterContent.closing}`;
    return calculateWordCount(content);
  }, [coverLetterData.letterContent]);

  // ATS Analysis with performance optimization and proper error handling
  const analyzeATS = useCallback(() => {
    const content = `${coverLetterData.letterContent.opening} ${coverLetterData.letterContent.body} ${coverLetterData.letterContent.closing}`.toLowerCase();
    const position = coverLetterData.jobDetails.position?.toLowerCase() || '';
    const company = coverLetterData.jobDetails.company?.toLowerCase() || '';
    
    // Determine industry keywords with fallback
    let relevantKeywords = industryKeywords['General'];
    Object.keys(industryKeywords).forEach(industry => {
      if (position.includes(industry.toLowerCase()) || industry.toLowerCase().includes(position)) {
        relevantKeywords = industryKeywords[industry];
      }
    });

    // Improved keyword matching with word boundaries
    const foundKeywords = relevantKeywords.filter(keyword => {
      const regex = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, 'i');
      return regex.test(content);
    });
    
    const missingKeywords = relevantKeywords.filter(keyword => {
      const regex = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`, 'i');
      return !regex.test(content);
    });
    
    // Calculate score based on various factors
    let score = 0;
    if (foundKeywords.length > 0) score += (foundKeywords.length / relevantKeywords.length) * 40;
    if (wordCount >= 250 && wordCount <= 400) score += 20;
    if (company && content.includes(company)) score += 15;
    if (position && content.includes(position)) score += 15;
    if (/\d+%|\$\d+|\d+ years|\d+\+/.test(content)) score += 10; // Has metrics

    setAtsAnalysis({
      score: Math.min(100, Math.round(score)),
      keywords: foundKeywords,
      missing: missingKeywords.slice(0, 5)
    });
  }, [coverLetterData, wordCount]);

  // Debounced ATS analysis for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeATS();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [analyzeATS]);

  // Navigation functions with bounds checking
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  }, [steps.length]);

  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Update functions with proper typing
  const updateJobDetails = useCallback((field: keyof JobDetails, value: string) => {
    setCoverLetterData(prev => ({
      ...prev,
      jobDetails: { ...prev.jobDetails, [field]: value }
    }));
  }, []);

  const updateLetterContent = useCallback((field: keyof Omit<LetterContent, 'customization'>, value: string) => {
    setCoverLetterData(prev => ({
      ...prev,
      letterContent: { ...prev.letterContent, [field]: value }
    }));
  }, []);

  const updateCustomization = useCallback((field: keyof LetterCustomization, value: string) => {
    setCoverLetterData(prev => ({
      ...prev,
      letterContent: {
        ...prev.letterContent,
        customization: { ...prev.letterContent.customization, [field]: value }
      }
    }));
  }, []);

  // Template generation with improved type safety
  const generateFromTemplate = useCallback((section: 'opening' | 'body' | 'closing', templateIndex: number = 0) => {
    const position = coverLetterData.jobDetails.position || resumeData?.personalInfo?.jobTitle || 'Professional';
    const industry = Object.keys(coverLetterTemplates).find(key => 
      position.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(position.toLowerCase())
    ) || 'General';
    
    const sectionTemplates = coverLetterTemplates[industry]?.[section];
    if (!sectionTemplates || templateIndex >= sectionTemplates.length) return;

    let template = sectionTemplates[templateIndex];
    
    // Safe replacement with proper escaping
    const replacements: Record<string, string> = {
      '{position}': coverLetterData.jobDetails.position || position,
      '{company}': coverLetterData.jobDetails.company || 'the company',
      '{experience}': coverLetterData.letterContent.customization.experience || '3',
      '{technologies}': coverLetterData.letterContent.customization.technologies || 'modern technologies',
      '{achievement}': coverLetterData.letterContent.customization.achievement || 'improved team efficiency',
      '{metrics}': coverLetterData.letterContent.customization.metrics || '25',
      '{skills}': coverLetterData.letterContent.customization.skills || 'relevant skills',
      '{currentCompany}': resumeData?.experience?.[0]?.company || 'my current company',
      '{field}': resumeData?.personalInfo?.jobTitle || 'the field',
      '{percentage}': coverLetterData.letterContent.customization.metrics || '20'
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      const escapedPlaceholder = escapeRegExp(placeholder);
      template = template.replace(new RegExp(escapedPlaceholder, 'g'), value);
    });

    updateLetterContent(section, template);
  }, [coverLetterData, resumeData, updateLetterContent]);

  // Copy from resume data with improved safety
  const copyFromResume = useCallback(() => {
    if (resumeData?.personalInfo) {
      const skills = resumeData.skills?.slice(0, 5).map(skill => 
        typeof skill === 'string' ? skill : skill.name || 'skill'
      ).join(', ') || 'key skills';

      const customization: LetterCustomization = {
        experience: resumeData.personalInfo.yearsExperience || '3',
        technologies: resumeData.skills?.slice(0, 3).map(skill => 
          typeof skill === 'string' ? skill : skill.name || 'skill'
        ).join(', ') || 'relevant technologies',
        skills,
        achievement: 'improved team efficiency and delivered successful projects',
        metrics: '25'
      };
      
      setCoverLetterData(prev => ({
        ...prev,
        letterContent: { ...prev.letterContent, customization }
      }));
    }
  }, [resumeData]);

  // Copy to clipboard with error handling
  const copyToClipboard = useCallback(async () => {
    try {
      const content = `${coverLetterData.letterContent.opening}\n\n${coverLetterData.letterContent.body}\n\n${coverLetterData.letterContent.closing}`;
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${coverLetterData.letterContent.opening}\n\n${coverLetterData.letterContent.body}\n\n${coverLetterData.letterContent.closing}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  }, [coverLetterData.letterContent]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            goToPrevStep();
            break;
          case 'ArrowRight':
            event.preventDefault();
            goToNextStep();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextStep, goToPrevStep]);

  // Render current step content
  const renderStepContent = () => {
    switch (steps[currentStep].key) {
      case 'jobDetails':
        return (
          <div className="space-y-6">
            {/* Job Details Form with proper accessibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position Title <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="position"
                  type="text"
                  value={coverLetterData.jobDetails.position}
                  onChange={(e) => updateJobDetails('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Software Engineer"
                  aria-describedby="position-help"
                />
                <div id="position-help" className="text-xs text-gray-500 mt-1">
                  Enter the exact job title from the posting
                </div>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="company"
                  type="text"
                  value={coverLetterData.jobDetails.company}
                  onChange={(e) => updateJobDetails('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>

              <div>
                <label htmlFor="hiringManager" className="block text-sm font-medium text-gray-700 mb-1">
                  Hiring Manager
                </label>
                <input
                  id="hiringManager"
                  type="text"
                  value={coverLetterData.jobDetails.hiringManager}
                  onChange={(e) => updateJobDetails('hiringManager', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sarah Johnson or Hiring Manager"
                />
              </div>

              <div>
                <label htmlFor="jobSource" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Source
                </label>
                <select
                  id="jobSource"
                  value={coverLetterData.jobDetails.jobSource}
                  onChange={(e) => updateJobDetails('jobSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">How did you find this job?</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Referral">Employee Referral</option>
                  <option value="Job Fair">Job Fair</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address (Optional)
                </label>
                <textarea
                  id="companyAddress"
                  rows={2}
                  value={coverLetterData.jobDetails.companyAddress}
                  onChange={(e) => updateJobDetails('companyAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Business St, City, State 12345"
                />
              </div>
            </div>

            {/* Resume Integration */}
            {resumeData?.personalInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">Resume Integration</h4>
                  <button
                    onClick={copyFromResume}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    aria-describedby="resume-integration-help"
                  >
                    <Copy className="w-3 h-3" aria-hidden="true" />
                    <span>Copy from Resume</span>
                  </button>
                </div>
                <p id="resume-integration-help" className="text-blue-700 text-sm">
                  We found your resume data! Click &quot;Copy from Resume&quot; to automatically fill in your experience and skills.
                </p>
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            {/* Content Helper */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-green-900">Writing Assistant</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    aria-expanded={showTemplates}
                    aria-controls="template-suggestions"
                  >
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>Templates</span>
                  </button>
                </div>
              </div>
              <p className="text-green-700 text-sm">
                Use our AI-powered templates to get started, then customize to match your experience and the specific role.
              </p>
            </div>

            {/* Template Suggestions */}
            {showTemplates && (
              <div id="template-suggestions" className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-3">Template Suggestions</h5>
                <div className="space-y-4">
                  {(['opening', 'body', 'closing'] as const).map(section => (
                    <div key={section}>
                      <div className="flex items-center justify-between mb-2">
                        <h6 className="text-sm font-medium text-purple-800 capitalize">{section} Paragraph</h6>
                        <button
                          onClick={() => generateFromTemplate(section, 0)}
                          className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                          aria-label={`Generate ${section} paragraph template`}
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Letter Content with improved accessibility */}
            <div className="space-y-4">
              {/* Opening Paragraph */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="opening" className="block text-sm font-medium text-gray-700">
                    Opening Paragraph <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <button
                    onClick={() => generateFromTemplate('opening', 0)}
                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                    aria-label="Generate opening paragraph"
                  >
                    Generate
                  </button>
                </div>
                <textarea
                  id="opening"
                  rows={3}
                  value={coverLetterData.letterContent.opening}
                  onChange={(e) => updateLetterContent('opening', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Start with a strong opening that mentions the position and company..."
                  aria-describedby="opening-help"
                />
                <div id="opening-help" className="text-xs text-gray-500 mt-1">
                  Introduce yourself and express interest in the specific position
                </div>
              </div>

              {/* Body Paragraph */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                    Body Paragraph(s) <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <button
                    onClick={() => generateFromTemplate('body', 0)}
                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                    aria-label="Generate body paragraph"
                  >
                    Generate
                  </button>
                </div>
                <textarea
                  id="body"
                  rows={6}
                  value={coverLetterData.letterContent.body}
                  onChange={(e) => updateLetterContent('body', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Highlight your relevant experience, achievements, and skills..."
                  aria-describedby="body-help"
                />
                <div id="body-help" className="text-xs text-gray-500 mt-1">
                  Focus on specific achievements and quantifiable results
                </div>
              </div>

              {/* Closing Paragraph */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="closing" className="block text-sm font-medium text-gray-700">
                    Closing Paragraph <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <button
                    onClick={() => generateFromTemplate('closing', 0)}
                    className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
                    aria-label="Generate closing paragraph"
                  >
                    Generate
                  </button>
                </div>
                <textarea
                  id="closing"
                  rows={3}
                  value={coverLetterData.letterContent.closing}
                  onChange={(e) => updateLetterContent('closing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="End with a call to action and professional closing..."
                  aria-describedby="closing-help"
                />
                <div id="closing-help" className="text-xs text-gray-500 mt-1">
                  Express enthusiasm and request an interview or meeting
                </div>
              </div>
            </div>

            {/* Word Count & Stats with color accessibility */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div 
                    className={`text-2xl font-bold ${
                      wordCount >= 250 && wordCount <= 400 
                        ? 'text-green-600' 
                        : wordCount < 250 
                        ? 'text-orange-600' 
                        : 'text-red-600'
                    }`}
                    aria-label={`Word count: ${wordCount}. ${
                      wordCount >= 250 && wordCount <= 400 
                        ? 'Optimal length' 
                        : wordCount < 250 
                        ? 'Too short' 
                        : 'Too long'
                    }`}
                  >
                    {wordCount}
                  </div>
                  <div className="text-xs text-gray-600">Words</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {[coverLetterData.letterContent.opening, coverLetterData.letterContent.body, coverLetterData.letterContent.closing].filter(Boolean).length}/3
                  </div>
                  <div className="text-xs text-gray-600">Paragraphs</div>
                </div>
                <div>
                  <div 
                    className={`text-2xl font-bold ${
                      atsAnalysis.score >= 80 
                        ? 'text-green-600' 
                        : atsAnalysis.score >= 60 
                        ? 'text-orange-600' 
                        : 'text-red-600'
                    }`}
                    aria-label={`ATS score: ${atsAnalysis.score}%. ${
                      atsAnalysis.score >= 80 
                        ? 'Excellent' 
                        : atsAnalysis.score >= 60 
                        ? 'Good' 
                        : 'Needs improvement'
                    }`}
                  >
                    {atsAnalysis.score}%
                  </div>
                  <div className="text-xs text-gray-600">ATS Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {atsAnalysis.keywords.length}
                  </div>
                  <div className="text-xs text-gray-600">Keywords</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-6">
            {/* Customization Fields */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Personalization Fields</h4>
              <p className="text-blue-700 text-sm mb-4">
                Fill in these details to make your templates more specific and relevant.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    type="text"
                    value={coverLetterData.letterContent.customization.experience}
                    onChange={(e) => updateCustomization('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5+ or 'over 5'"
                  />
                </div>

                <div>
                  <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Technologies/Skills
                  </label>
                  <input
                    id="technologies"
                    type="text"
                    value={coverLetterData.letterContent.customization.technologies}
                    onChange={(e) => updateCustomization('technologies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React, Node.js, Python"
                  />
                </div>

                <div>
                  <label htmlFor="achievement" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Achievement
                  </label>
                  <input
                    id="achievement"
                    type="text"
                    value={coverLetterData.letterContent.customization.achievement}
                    onChange={(e) => updateCustomization('achievement', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., increased sales by 30%"
                  />
                </div>

                <div>
                  <label htmlFor="metrics" className="block text-sm font-medium text-gray-700 mb-1">
                    Metrics/Numbers
                  </label>
                  <input
                    id="metrics"
                    type="text"
                    value={coverLetterData.letterContent.customization.metrics}
                    onChange={(e) => updateCustomization('metrics', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 25%, $2M, 10+"
                  />
                </div>
              </div>
            </div>

            {/* Regenerate with customization */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-3">Regenerate with Customization</h4>
              <p className="text-purple-700 text-sm mb-4">
                Update your letter content with the personalization details above.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => generateFromTemplate('opening', 0)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Update Opening
                </button>
                <button
                  onClick={() => generateFromTemplate('body', 0)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Update Body
                </button>
                <button
                  onClick={() => generateFromTemplate('closing', 0)}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Update Closing
                </button>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            {/* Final Review */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3">📝 Cover Letter Complete!</h4>
              <p className="text-green-700 text-sm">
                Your cover letter is ready! Review the preview below and download when satisfied.
              </p>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Show preview of cover letter"
              >
                <Eye className="w-5 h-5 text-gray-600" aria-hidden="true" />
                <span className="font-medium">Preview</span>
              </button>
              
              <button
                onClick={onDownload}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Download cover letter as PDF"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">Download PDF</span>
              </button>

              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                  copySuccess ? 'bg-green-50 border-green-200 text-green-700' : ''
                }`}
                aria-label="Copy cover letter text to clipboard"
              >
                <Copy className="w-5 h-5 text-gray-600" aria-hidden="true" />
                <span className="font-medium">{copySuccess ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cover Letter Builder</h1>
          <p className="text-gray-600 mt-1">Create a compelling cover letter that complements your resume</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div 
              className={`w-2 h-2 rounded-full ${
                autoSaveStatus === 'saved' 
                  ? 'bg-green-500' 
                  : autoSaveStatus === 'saving'
                  ? 'bg-yellow-500 animate-pulse' 
                  : 'bg-red-500'
              }`}
              aria-label={`Auto-save status: ${autoSaveStatus}`}
            ></div>
            <span>{autoSaveStatus === 'saved' ? 'Saved' : autoSaveStatus === 'saving' ? 'Saving...' : 'Error'}</span>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            aria-expanded={showPreview}
            aria-controls="preview-panel"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : ''}`}>
          {/* Progress Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Progress</h3>
              <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
            </div>
            <div className="flex space-x-2 mb-4" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
              {steps.map((step, index) => (
                <button
                  key={step.key}
                  onClick={() => goToStep(index)}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.key}
                    onClick={() => goToStep(index)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                      currentStep === index
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                    aria-current={currentStep === index ? 'step' : undefined}
                  >
                    <StepIcon className="w-4 h-4" aria-hidden="true" />
                    <span className="font-medium">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ATS Analysis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900 flex items-center">
                <Target className="w-4 h-4 mr-2" aria-hidden="true" />
                ATS Optimization Score: {atsAnalysis.score}%
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-medium mb-1">✓ Keywords Found ({atsAnalysis.keywords.length}):</p>
                <p className="text-blue-600">
                  {atsAnalysis.keywords.length > 0 ? atsAnalysis.keywords.join(', ') : 'Add relevant keywords'}
                </p>
              </div>
              <div>
                <p className="text-orange-700 font-medium mb-1">⚠ Consider Adding ({atsAnalysis.missing.length}):</p>
                <p className="text-orange-600">
                  {atsAnalysis.missing.length > 0 ? atsAnalysis.missing.join(', ') : 'All keywords found! 🎉'}
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600">
              💡 Target: 250-400 words | Include metrics | Mention company and position specifically
            </div>
          </div>

          {/* Current Step Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === steps.findIndex(s => s.key === steps[currentStep].key)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {React.createElement(steps[currentStep].icon, { className: 'w-5 h-5', 'aria-hidden': true })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
                <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
              </div>
            </div>

            {renderStepContent()}

            {/* Navigation with improved accessibility */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous step"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </button>

              <span className="text-sm text-gray-500" aria-live="polite">
                Step {currentStep + 1} of {steps.length}
                <span className="sr-only"> - Use Alt + Arrow keys to navigate</span>
              </span>

              <button
                onClick={goToNextStep}
                disabled={currentStep === steps.length - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next step"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div id="preview-panel" className={`space-y-4 ${!showPreview ? 'hidden lg:block' : ''}`}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            
            {/* Cover Letter Preview */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="max-w-full mx-auto bg-white p-8 shadow-sm min-h-[600px]" style={{ fontFamily: 'Georgia, serif' }}>
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-gray-900">
                    {resumeData?.personalInfo?.firstName || 'Your Name'} {resumeData?.personalInfo?.lastName || ''}
                  </h1>
                  <div className="text-gray-600 text-sm mt-2">
                    {resumeData?.personalInfo?.email && <div>{resumeData.personalInfo.email}</div>}
                    <div className="flex justify-center space-x-4">
                      {resumeData?.personalInfo?.phone && <span>{resumeData.personalInfo.phone}</span>}
                      {resumeData?.personalInfo?.location && <span>{resumeData.personalInfo.location}</span>}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="text-right text-sm text-gray-600 mb-6">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>

                {/* Company Address */}
                {coverLetterData.jobDetails.companyAddress && (
                  <div className="text-sm text-gray-700 mb-6">
                    <div className="font-medium">{coverLetterData.jobDetails.company}</div>
                    <div className="whitespace-pre-line">{coverLetterData.jobDetails.companyAddress}</div>
                  </div>
                )}

                {/* Salutation */}
                <div className="mb-6">
                  <p className="text-gray-700">
                    Dear {coverLetterData.jobDetails.hiringManager || 'Hiring Manager'},
                  </p>
                </div>

                {/* Letter Content */}
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {coverLetterData.letterContent.opening && (
                    <p>{coverLetterData.letterContent.opening}</p>
                  )}
                  {coverLetterData.letterContent.body && (
                    <p>{coverLetterData.letterContent.body}</p>
                  )}
                  {coverLetterData.letterContent.closing && (
                    <p>{coverLetterData.letterContent.closing}</p>
                  )}
                </div>

                {/* Sign-off */}
                <div className="mt-8">
                  <p className="text-gray-700">Sincerely,</p>
                  <div className="mt-4 text-gray-900 font-medium">
                    {resumeData?.personalInfo?.firstName || 'Your Name'} {resumeData?.personalInfo?.lastName || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats with improved accessibility */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div 
                  className={`text-lg font-bold ${
                    wordCount >= 250 && wordCount <= 400 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`}
                  aria-label={`Word count: ${wordCount}`}
                >
                  {wordCount}
                </div>
                <div className="text-xs text-gray-600">Words</div>
              </div>
              <div>
                <div 
                  className={`text-lg font-bold ${
                    atsAnalysis.score >= 80 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`}
                  aria-label={`ATS score: ${atsAnalysis.score} percent`}
                >
                  {atsAnalysis.score}%
                </div>
                <div className="text-xs text-gray-600">ATS Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600" aria-label={`${atsAnalysis.keywords.length} keywords found`}>
                  {atsAnalysis.keywords.length}
                </div>
                <div className="text-xs text-gray-600">Keywords</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}