import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Mail, 
  Lightbulb, 
  Sparkles, 
  Target, 
  CheckCircle, 
  Eye, 
  FileText, 
  BookOpen 
} from 'lucide-react';

// TypeScript interfaces
interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  jobTitle?: string;
  yearsExperience?: string;
}

interface ResumeData {
  personalInfo?: PersonalInfo;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  summary?: string;
}

interface ATSAnalysis {
  score: number;
  keywords: string[];
  missing: string[];
}

interface PersonalInfoSectionProps {
  resumeData?: ResumeData;
  updateResumeData?: (section: string, data: PersonalInfo) => void;
  setShowPhraseLibrary?: (show: boolean) => void;
  goToNextStep?: () => void;
  goToPrevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Professional summary templates by industry
const summaryTemplates: Record<string, string[]> = {
  'Software Engineer': [
    "Experienced software engineer with {years}+ years developing scalable web applications using modern technologies. Proven track record of delivering high-quality code and collaborating effectively with cross-functional teams.",
    "Full-stack developer specializing in {technologies} with expertise in building user-friendly applications that drive business growth. Strong problem-solving skills and passion for clean, maintainable code.",
    "Results-driven software engineer with expertise in {technologies}. Successfully delivered {number}+ projects, improving application performance and user experience across diverse industries."
  ],
  'Electrician': [
    "Licensed journeyman electrician with {years}+ years of experience in residential and commercial electrical systems. Committed to safety excellence and delivering quality workmanship on every project.",
    "Skilled electrician specializing in {specialization} with extensive experience in troubleshooting, installation, and maintenance. Strong safety record and dedication to exceeding customer expectations.",
    "Professional electrician with expertise in {specialization} and {years}+ years in the field. Proven ability to complete complex installations on time and within budget while maintaining highest safety standards."
  ],
  'Marketing Manager': [
    "Strategic marketing professional with {years}+ years driving brand growth and customer acquisition. Expertise in digital marketing, campaign management, and data-driven decision making to achieve measurable results.",
    "Results-oriented marketing manager with proven track record of increasing brand awareness by {percentage}% and driving revenue growth. Skilled in multi-channel campaigns and team leadership.",
    "Creative marketing leader specializing in {specialization} with {years}+ years building successful campaigns. Strong analytical skills and passion for connecting brands with their target audiences."
  ],
  'Nurse': [
    "Compassionate registered nurse with {years}+ years providing exceptional patient care in {setting} environments. Dedicated to patient advocacy and maintaining the highest standards of clinical excellence.",
    "Experienced healthcare professional specializing in {specialization} with strong clinical skills and patient-centered approach. Committed to delivering quality care and supporting positive patient outcomes.",
    "Licensed registered nurse with expertise in {specialization} and {years}+ years of clinical experience. Proven ability to work effectively in fast-paced environments while maintaining attention to detail."
  ],
  'Project Manager': [
    "Certified project manager with {years}+ years successfully delivering complex projects on time and under budget. Expertise in Agile methodologies and stakeholder management across diverse industries.",
    "Results-driven project management professional with proven track record managing ${budget}+ budgets and leading cross-functional teams. Strong communication skills and commitment to project excellence.",
    "Strategic project manager specializing in {specialization} with {years}+ years driving successful project outcomes. Skilled in risk management, resource allocation, and process improvement."
  ],
  'Sales Representative': [
    "High-performing sales professional with {years}+ years exceeding quotas and building lasting client relationships. Proven track record of generating ${revenue}+ in annual revenue through consultative selling.",
    "Results-oriented sales representative specializing in {industry} with consistent record of surpassing targets. Strong relationship-building skills and expertise in solution-based selling.",
    "Dynamic sales professional with {years}+ years driving revenue growth and market expansion. Skilled in lead generation, negotiation, and account management with focus on customer satisfaction."
  ]
};

// Industry-specific keywords for ATS optimization
const industryKeywords: Record<string, string[]> = {
  'Software Engineer': ['software development', 'programming', 'web applications', 'database', 'API', 'agile', 'full-stack', 'problem-solving'],
  'Electrician': ['electrical systems', 'installation', 'troubleshooting', 'safety compliance', 'maintenance', 'licensed', 'residential', 'commercial'],
  'Marketing Manager': ['digital marketing', 'brand management', 'campaign management', 'analytics', 'lead generation', 'ROI', 'growth', 'customer acquisition'],
  'Nurse': ['patient care', 'clinical experience', 'healthcare', 'medical', 'registered nurse', 'patient advocacy', 'clinical excellence', 'bedside manner'],
  'Project Manager': ['project management', 'agile', 'stakeholder management', 'budget management', 'team leadership', 'deliverables', 'process improvement'],
  'Sales Representative': ['sales', 'revenue generation', 'client relationships', 'quota achievement', 'account management', 'lead generation', 'negotiation', 'CRM']
};

// Common job titles by category
const jobTitleSuggestions: Record<string, string[]> = {
  technology: ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer'],
  healthcare: ['Registered Nurse', 'Licensed Practical Nurse', 'Medical Assistant', 'Physical Therapist', 'Healthcare Administrator', 'Medical Technologist'],
  trades: ['Electrician', 'Plumber', 'HVAC Technician', 'Carpenter', 'Welder', 'Automotive Technician', 'Construction Foreman', 'Heavy Equipment Operator'],
  business: ['Project Manager', 'Business Analyst', 'Account Manager', 'Operations Manager', 'Human Resources Manager', 'Financial Analyst'],
  sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development Representative', 'Customer Success Manager'],
  marketing: ['Marketing Manager', 'Digital Marketing Specialist', 'Content Marketing Manager', 'Social Media Manager', 'Brand Manager']
};

const EnhancedPersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  resumeData = { personalInfo: {} }, 
  updateResumeData = () => {}, 
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}) => {
  const [showSummaryHelper, setShowSummaryHelper] = useState(false);
  const [showJobTitleSuggestions, setShowJobTitleSuggestions] = useState(false);
  const [selectedJobCategory, setSelectedJobCategory] = useState('technology');
  const [summaryTemplateIndex, setSummaryTemplateIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis>({ score: 0, keywords: [], missing: [] });

  const personalInfo = resumeData?.personalInfo || {};

  // Validation function
  const validatePersonalInfo = useCallback(() => {
    const errors: ValidationErrors = {};
    
    if (!personalInfo.firstName?.trim()) errors.firstName = 'First name is required';
    if (!personalInfo.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!personalInfo.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!personalInfo.phone?.trim()) errors.phone = 'Phone number is required';
    if (!personalInfo.summary?.trim()) {
      errors.summary = 'Professional summary is required';
    } else if (personalInfo.summary.length < 100) {
      errors.summary = 'Summary should be at least 100 characters for better impact';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [personalInfo]);

  // ATS Analysis for summary
  const analyzeSummaryATS = useCallback(() => {
    const summary = (personalInfo.summary || '').toLowerCase();
    const jobTitle = (personalInfo.jobTitle || '').toLowerCase();
    
    // Get relevant keywords based on job title
    let relevantKeywords: string[] = [];
    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      if (jobTitle.includes(industry.toLowerCase()) || industry.toLowerCase().includes(jobTitle)) {
        relevantKeywords = keywords;
      }
    });
    
    // Fallback to general business keywords if no match
    if (relevantKeywords.length === 0) {
      relevantKeywords = ['leadership', 'management', 'experience', 'professional', 'skilled', 'results', 'team', 'customer'];
    }

    const foundKeywords = relevantKeywords.filter(keyword => 
      summary.includes(keyword.toLowerCase())
    );
    
    const missingKeywords = relevantKeywords.filter(keyword => 
      !summary.includes(keyword.toLowerCase())
    ).slice(0, 5);

    const score = Math.min(100, Math.round((foundKeywords.length / relevantKeywords.length) * 100));

    setAtsAnalysis({
      score,
      keywords: foundKeywords,
      missing: missingKeywords
    });
  }, [personalInfo.summary, personalInfo.jobTitle]);

  // Update personal info
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    const updatedInfo = { ...personalInfo, [field]: value };
    updateResumeData('personalInfo', updatedInfo);
  }, [personalInfo, updateResumeData]);

  // Generate summary from template
  const generateSummaryFromTemplate = useCallback((templateIndex = 0) => {
    const jobTitle = personalInfo.jobTitle || 'Professional';
    let templates = summaryTemplates[jobTitle] || summaryTemplates['Software Engineer'];
    
    if (templateIndex >= templates.length) templateIndex = 0;
    
    let template = templates[templateIndex];
    
    // Replace placeholders with user data or defaults
    template = template.replace('{years}', personalInfo.yearsExperience || '3');
    template = template.replace('{technologies}', 'modern technologies');
    template = template.replace('{specialization}', 'various specializations');
    template = template.replace('{number}', '10');
    template = template.replace('{percentage}', '25');
    template = template.replace('{setting}', 'healthcare');
    template = template.replace('{budget}', '500K');
    template = template.replace('{revenue}', '1M');
    template = template.replace('{industry}', 'B2B');
    
    updatePersonalInfo('summary', template);
    setSummaryTemplateIndex(templateIndex);
  }, [personalInfo.jobTitle, personalInfo.yearsExperience, updatePersonalInfo]);

  // Run validations when data changes
  useEffect(() => {
    if (Object.keys(personalInfo).length > 0) {
      validatePersonalInfo();
      if (personalInfo.summary && personalInfo.summary.length > 50) {
        analyzeSummaryATS();
      }
    }
  }, [personalInfo, validatePersonalInfo, analyzeSummaryATS]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your contact details and professional summary to make a strong first impression
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSummaryHelper(!showSummaryHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Summary Helper</span>
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

      {/* ATS Analysis for Summary */}
      {personalInfo.summary && atsAnalysis.score > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Summary ATS Score: {atsAnalysis.score}%
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-medium mb-1">✓ Keywords Found ({atsAnalysis.keywords.length}):</p>
              <p className="text-blue-600">{atsAnalysis.keywords.join(', ') || 'Add industry keywords'}</p>
            </div>
            <div>
              <p className="text-orange-700 font-medium mb-1">⚠ Consider Adding ({atsAnalysis.missing.length}):</p>
              <p className="text-orange-600">{atsAnalysis.missing.slice(0, 3).join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Helper */}
      {showSummaryHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3">
            📝 Professional Summary Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">What to Include:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Your professional title and years of experience</li>
                <li>• Key skills and areas of expertise</li>
                <li>• Notable achievements or metrics</li>
                <li>• What value you bring to employers</li>
                <li>• Career goals or specializations</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">Writing Tips:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Write in 3rd person (avoid &quot;I&quot;)</li>
                <li>• Keep it to 3-4 sentences (100-150 words)</li>
                <li>• Use industry keywords naturally</li>
                <li>• Focus on your unique value proposition</li>
                <li>• Tailor it to your target role</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Basic Information
          </h4>
          
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.firstName || ''}
                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={personalInfo.lastName || ''}
                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Smith"
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Job Title with Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Professional Title
              </label>
              <button
                onClick={() => setShowJobTitleSuggestions(!showJobTitleSuggestions)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {showJobTitleSuggestions ? 'Hide' : 'Show'} Suggestions
              </button>
            </div>
            <input
              type="text"
              value={personalInfo.jobTitle || ''}
              onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior Software Engineer"
            />
            
            {showJobTitleSuggestions && (
              <div className="mt-2 bg-gray-50 rounded-lg p-3">
                <div className="flex space-x-2 mb-3">
                  {Object.keys(jobTitleSuggestions).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedJobCategory(category)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        selectedJobCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {jobTitleSuggestions[selectedJobCategory].map((title, index) => (
                    <button
                      key={index}
                      onClick={() => updatePersonalInfo('jobTitle', title)}
                      className="text-left p-2 bg-white hover:bg-blue-50 rounded border hover:border-blue-300 transition-colors text-sm"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <select
              value={personalInfo.yearsExperience || ''}
              onChange={(e) => updatePersonalInfo('yearsExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select experience level</option>
              <option value="Entry Level">Entry Level (0-1 years)</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
              <option value="7">7 years</option>
              <option value="10">10+ years</option>
              <option value="15">15+ years</option>
              <option value="20">20+ years</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Contact Details
          </h4>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={personalInfo.email || ''}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="john.smith@email.com"
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={personalInfo.phone || ''}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationErrors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={personalInfo.location || ''}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, State"
            />
            <p className="text-xs text-gray-500 mt-1">City and state are usually sufficient for privacy</p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website/Portfolio
            </label>
            <input
              type="url"
              value={personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourportfolio.com"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Professional Summary <span className="text-red-500">*</span>
            </h4>
            <p className="text-sm text-gray-600">A compelling summary that highlights your key strengths and experience</p>
          </div>
          <div className="flex space-x-2">
            {personalInfo.jobTitle && summaryTemplates[personalInfo.jobTitle] && (
              <button
                onClick={() => generateSummaryFromTemplate(summaryTemplateIndex + 1)}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate Template</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          value={personalInfo.summary || ''}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validationErrors.summary ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Write a compelling 3-4 sentence summary that highlights your experience, key skills, and what value you bring to employers. Focus on your achievements and what makes you unique in your field."
        />
        
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-500">
            💡 Tip: Include 2-3 key achievements with numbers when possible (e.g., &quot;increased efficiency by 30%&quot;)
          </div>
          <div className={`${personalInfo.summary?.length > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
            {personalInfo.summary?.length || 0} characters
            {(!personalInfo.summary || personalInfo.summary.length < 100) && ' (aim for 100+ characters)'}
          </div>
        </div>
        
        {validationErrors.summary && (
          <p className="text-red-500 text-xs">{validationErrors.summary}</p>
        )}

        {/* Summary Templates */}
        {personalInfo.jobTitle && summaryTemplates[personalInfo.jobTitle] && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 className="font-medium text-purple-900 mb-3">
              ✨ Summary Templates for {personalInfo.jobTitle}:
            </h5>
            <div className="space-y-2">
              {summaryTemplates[personalInfo.jobTitle].map((template, index) => (
                <button
                  key={index}
                  onClick={() => generateSummaryFromTemplate(index)}
                  className="block w-full p-3 text-left bg-white hover:bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors text-sm"
                >
                  {template.replace(/{[^}]+}/g, '[customize]')}
                </button>
              ))}
            </div>
            <p className="text-xs text-purple-600 mt-2">Click any template to use it, then customize with your specific details</p>
          </div>
        )}
      </div>

      {/* Privacy & Tips Panel */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">🔒 Privacy &amp; Professional Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Privacy Best Practices:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use city and state instead of full address</li>
                  <li>• Consider a professional email address</li>
                  <li>• Include LinkedIn for professional networking</li>
                  <li>• Only add relevant social links</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Professional Summary Tips:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Lead with your years of experience</li>
                  <li>• Include 2-3 key skills or specializations</li>
                  <li>• Mention quantifiable achievements</li>
                  <li>• Keep it concise but impactful</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          Section Completion
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${personalInfo.firstName && personalInfo.lastName ? 'text-green-600' : 'text-gray-400'}`}>
              {personalInfo.firstName && personalInfo.lastName ? '✓' : '○'}
            </div>
            <div className="text-xs text-gray-600">Name</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${personalInfo.email && personalInfo.phone ? 'text-green-600' : 'text-gray-400'}`}>
              {personalInfo.email && personalInfo.phone ? '✓' : '○'}
            </div>
            <div className="text-xs text-gray-600">Contact</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${personalInfo.jobTitle ? 'text-green-600' : 'text-gray-400'}`}>
              {personalInfo.jobTitle ? '✓' : '○'}
            </div>
            <div className="text-xs text-gray-600">Title</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${personalInfo.summary && personalInfo.summary.length > 100 ? 'text-green-600' : 'text-gray-400'}`}>
              {personalInfo.summary && personalInfo.summary.length > 100 ? '✓' : '○'}
            </div>
            <div className="text-xs text-gray-600">Summary</div>
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
          disabled={currentStep === totalSteps - 1 || Object.keys(validationErrors).length > 0}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EnhancedPersonalInfoSection;