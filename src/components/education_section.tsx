import React, { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen, ArrowLeft, ArrowRight, GraduationCap, Lightbulb, Target, AlertCircle, CheckCircle, TrendingUp, GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react';

// TypeScript interfaces to replace 'any' types
interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  coursework?: string;
  honors?: string;
  location?: string;
  current: boolean;
  type: string;
}

interface ValidationErrors {
  institution?: string;
  degree?: string;
  field?: string;
  graduationDate?: string;
  gpa?: string;
}

interface ATSAnalysis {
  score: number;
  foundKeywords: string[];
  missingKeywords: string[];
  hasGpa: boolean;
  hasHonors: boolean;
  hasRelevantField: boolean;
}

interface ResumeData {
  education?: EducationEntry[];
  personalInfo?: {
    jobTitle?: string;
  };
}

// Education level definitions
const educationLevels = {
  'High School': {
    label: 'High School Diploma',
    category: 'secondary',
    atsKeywords: ['high school', 'diploma', 'secondary education'],
    commonFields: ['General Studies', 'College Prep', 'Vocational Track']
  },
  'Associate': {
    label: 'Associate Degree',
    category: 'undergraduate',
    atsKeywords: ['associate degree', 'AA', 'AS', 'AAS'],
    commonFields: ['Business', 'Liberal Arts', 'Applied Science', 'Nursing']
  },
  'Bachelor': {
    label: "Bachelor's Degree",
    category: 'undergraduate',
    atsKeywords: ['bachelor', 'BA', 'BS', 'BBA', 'undergraduate'],
    commonFields: ['Computer Science', 'Business Administration', 'Engineering', 'Psychology']
  },
  'Master': {
    label: "Master's Degree",
    category: 'graduate',
    atsKeywords: ['master', 'MA', 'MS', 'MBA', 'graduate'],
    commonFields: ['Business Administration', 'Computer Science', 'Engineering', 'Education']
  },
  'Doctorate': {
    label: 'Doctoral Degree',
    category: 'graduate',
    atsKeywords: ['doctorate', 'PhD', 'doctoral', 'doctor'],
    commonFields: ['Philosophy', 'Education', 'Medicine', 'Engineering']
  },
  'Certificate': {
    label: 'Professional Certificate',
    category: 'professional',
    atsKeywords: ['certificate', 'certification', 'professional development'],
    commonFields: ['Project Management', 'Digital Marketing', 'Data Analysis', 'Web Development']
  },
  'Bootcamp': {
    label: 'Bootcamp/Intensive Program',
    category: 'professional',
    atsKeywords: ['bootcamp', 'intensive', 'coding bootcamp', 'training program'],
    commonFields: ['Software Development', 'Data Science', 'UX/UI Design', 'Digital Marketing']
  },
  'Trade School': {
    label: 'Trade/Vocational School',
    category: 'vocational',
    atsKeywords: ['trade school', 'vocational', 'technical training'],
    commonFields: ['Electrical Technology', 'Automotive Technology', 'HVAC', 'Plumbing']
  }
};

// Field of study suggestions by industry
const fieldSuggestionsByIndustry = {
  'Software Engineer': [
    'Computer Science', 'Software Engineering', 'Computer Engineering', 'Information Technology',
    'Mathematics', 'Electrical Engineering', 'Data Science', 'Cybersecurity'
  ],
  'Electrician': [
    'Electrical Technology', 'Electrical Engineering', 'Electronics Technology', 'Industrial Maintenance',
    'Renewable Energy Technology', 'Automotive Technology', 'HVAC Technology'
  ],
  'Marketing Manager': [
    'Marketing', 'Business Administration', 'Communications', 'Advertising',
    'Digital Marketing', 'Public Relations', 'Psychology', 'Graphic Design'
  ],
  'Nurse': [
    'Nursing', 'Healthcare Administration', 'Biology', 'Pre-Med',
    'Health Sciences', 'Medical Technology', 'Public Health', 'Psychology'
  ],
  'Project Manager': [
    'Business Administration', 'Project Management', 'Operations Management', 'Engineering',
    'Information Systems', 'Construction Management', 'Industrial Engineering'
  ],
  'Sales Representative': [
    'Business Administration', 'Marketing', 'Communications', 'Psychology',
    'Economics', 'Sales Management', 'Hospitality Management', 'Public Relations'
  ]
};

// Popular institutions by type
const institutionSuggestions = {
  university: [
    'University of California', 'Arizona State University', 'Penn State University',
    'University of Florida', 'University of Texas', 'University of Michigan'
  ],
  community: [
    'City College', 'Community College', 'County Community College',
    'Metropolitan Community College', 'Technical Community College'
  ],
  trade: [
    'Technical Institute', 'Vocational School', 'Trade School',
    'Career College', 'Professional Institute', 'Training Center'
  ],
  online: [
    'Southern New Hampshire University', 'Arizona State University Online',
    'Penn State World Campus', 'University of Maryland Global Campus'
  ]
};

// Honors and achievements suggestions
const honorsSuggestions = [
  'Summa Cum Laude (GPA 3.9+)',
  'Magna Cum Laude (GPA 3.7+)',
  'Cum Laude (GPA 3.5+)',
  "Dean's List",
  'Honor Roll',
  'Academic Excellence Award',
  'Outstanding Student Award',
  'Valedictorian',
  'Salutatorian',
  'Phi Beta Kappa',
  'National Honor Society',
  'Academic Scholarship Recipient'
];

// Required interface for Builder integration
interface SectionComponentProps {
  resumeData: ResumeData;
  updateResumeData: (section: string, data: EducationEntry[]) => void;
  addArrayItem: (section: string, item: EducationEntry) => void;
  removeArrayItem: (section: string, index: number) => void;
  updateArrayItem: (section: string, index: number, data: Partial<EducationEntry>) => void;
  setShowPhraseLibrary: (show: boolean) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  currentStep: number;
  totalSteps: number;
  validationErrors?: Record<string, ValidationErrors>;
  setValidationErrors?: (errors: Record<string, ValidationErrors> | ((prev: Record<string, ValidationErrors>) => Record<string, ValidationErrors>)) => void;
}

export default function EducationSection({ 
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
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});
  const [showEducationHelper, setShowEducationHelper] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localValidationErrors, setLocalValidationErrors] = useState<Record<number, ValidationErrors>>({});
  const [atsAnalysis, setAtsAnalysis] = useState<Record<number, ATSAnalysis>>({});
  const [industryFilter, setIndustryFilter] = useState('Software Engineer');

  // Validation function - integrates with Builder's validation system
  const validateEducation = useCallback((education: EducationEntry, index: number): boolean => {
    const errors: ValidationErrors = {};
    
    if (!education.institution?.trim()) errors.institution = 'Institution name is required';
    if (!education.degree?.trim()) errors.degree = 'Degree/Program is required';
    if (!education.field?.trim()) errors.field = 'Field of study is required';
    if (!education.graduationDate?.trim() && !education.current) {
      errors.graduationDate = 'Graduation date is required';
    }
    
    // GPA validation (optional but if provided, should be valid)
    if (education.gpa && education.gpa.trim()) {
      // Handle both dot and comma as decimal separator for international users
      const normalizedGpa = education.gpa.replace(',', '.');
      const gpa = parseFloat(normalizedGpa);
      if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
        errors.gpa = 'GPA should be between 0.0 and 4.0';
      }
    }
    
    // Update both local and global validation state
    const hasErrors = Object.keys(errors).length > 0;
    const errorKey = `education_${index}`;
    
    setLocalValidationErrors(prev => ({ ...prev, [index]: errors }));
    
    // Update Builder's validation state
    if (setValidationErrors) {
      setValidationErrors((prev: Record<string, ValidationErrors>) => ({
        ...prev,
        [errorKey]: hasErrors ? errors : {}
      }));
    }
    
    return !hasErrors;
  }, [setValidationErrors]);

  // ATS Analysis function
  const analyzeEducationATS = useCallback((education: EducationEntry, index: number): void => {
    const degree = education.degree?.toLowerCase() || '';
    const field = education.field?.toLowerCase() || '';
    const institution = education.institution?.toLowerCase() || '';
    
    // Check for relevant keywords
    const educationKeywords = [
      'bachelor', 'master', 'doctorate', 'degree', 'university', 'college',
      'gpa', 'honors', 'summa cum laude', 'magna cum laude', 'cum laude'
    ];
    
    const industryKeywords = fieldSuggestionsByIndustry[industryFilter]?.map(f => f.toLowerCase()) || [];
    
    const allRelevantKeywords = [...educationKeywords, ...industryKeywords];
    const content = `${degree} ${field} ${institution} ${education.honors || ''}`.toLowerCase();
    
    const foundKeywords = allRelevantKeywords.filter(keyword => 
      content.includes(keyword)
    );
    
    const missingKeywords = industryKeywords.filter(keyword => 
      !content.includes(keyword)
    ).slice(0, 3);

    // Base score from keyword matching (max 70 points)
    const baseScore = Math.min(70, (foundKeywords.length / Math.max(allRelevantKeywords.length, 1)) * 70);
    
    // Bonus points (max 30 points total)
    const normalizedGpa = education.gpa ? parseFloat(education.gpa.replace(',', '.')) : 0;
    const gpaBonus = (normalizedGpa >= 3.5) ? 15 : 0;
    const honorsBonus = education.honors ? 15 : 0;
    
    const totalScore = Math.min(100, Math.round(baseScore + gpaBonus + honorsBonus));

    const analysis: ATSAnalysis = {
      score: totalScore,
      foundKeywords,
      missingKeywords,
      hasGpa: !!education.gpa,
      hasHonors: !!education.honors,
      hasRelevantField: industryKeywords.some(keyword => field.includes(keyword))
    };

    setAtsAnalysis(prev => ({
      ...prev,
      [index]: analysis
    }));
  }, [industryFilter]);

  // Add new education
  const addEducation = (): void => {
    const newEducation: EducationEntry = {
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
      coursework: '',
      honors: '',
      location: '',
      current: false,
      type: 'Bachelor'
    };
    const currentLength = (resumeData?.education || []).length;
    addArrayItem('education', newEducation);
    
    // Expand the new item after it's added
    setTimeout(() => setExpandedIndex(currentLength), 0);
  };

  // Toggle current status
  const toggleCurrent = (index: number): void => {
    const education = (resumeData?.education || [])[index];
    if (education) {
      updateArrayItem('education', index, { 
        current: !education.current,
        graduationDate: !education.current ? '' : education.graduationDate
      });
    }
  };

  // Handle field updates with validation
  const handleFieldUpdate = useCallback((index: number, field: string, value: string): void => {
    updateArrayItem('education', index, { [field]: value } as Partial<EducationEntry>);
    
    // Validate after update
    const education = resumeData?.education?.[index];
    if (education) {
      const updatedEducation = { ...education, [field]: value };
      validateEducation(updatedEducation, index);
      analyzeEducationATS(updatedEducation, index);
    }
  }, [updateArrayItem, resumeData?.education, validateEducation, analyzeEducationATS]);

  // Insert suggestion
  const insertSuggestion = useCallback((value: string, field: string, index: number): void => {
    handleFieldUpdate(index, field, value);
  }, [handleFieldUpdate]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number): void => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number): void => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const education = resumeData?.education || [];
    const newEducation = [...education];
    const draggedItem = newEducation[draggedIndex];
    newEducation.splice(draggedIndex, 1);
    newEducation.splice(dropIndex, 0, draggedItem);
    
    updateResumeData('education', newEducation);
    setDraggedIndex(null);
    
    // Reset state objects that are keyed by index since order changed
    setLocalValidationErrors({});
    setAtsAnalysis({});
    setShowSuggestions({});
    setExpandedIndex(-1);
    
    // Clear Builder's validation errors for education
    if (setValidationErrors) {
      setValidationErrors((prev: Record<string, ValidationErrors>) => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith('education_')) {
            delete newErrors[key];
          }
        });
        return newErrors;
      });
    }
  };

  // Initialize validation and ATS analysis
  useEffect(() => {
    const educationArray = resumeData?.education || [];
    educationArray.forEach((edu, index) => {
      validateEducation(edu, index);
      analyzeEducationATS(edu, index);
    });
  }, [resumeData?.education, industryFilter, validateEducation, analyzeEducationATS]);

  // Auto-detect industry from education field
  useEffect(() => {
    const education = resumeData?.education || [];
    if (education.length > 0 && industryFilter === 'Software Engineer') {
      const firstField = education[0]?.field?.toLowerCase() || '';
      
      // Try to match field to industry
      Object.entries(fieldSuggestionsByIndustry).forEach(([industry, fields]) => {
        const industryFields = fields.map(f => f.toLowerCase());
        if (industryFields.some(field => firstField.includes(field))) {
          setIndustryFilter(industry);
        }
      });
    }
  }, [resumeData?.education, industryFilter]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your educational background to showcase your qualifications and expertise
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEducationHelper(!showEducationHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Education Helper</span>
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

      {/* Education Helper */}
      {showEducationHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3">
            🎓 Education Section Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">What to Include:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Degree type and field of study</li>
                <li>• Institution name and location</li>
                <li>• Graduation date (month/year)</li>
                <li>• GPA if 3.5 or higher</li>
                <li>• Relevant honors and awards</li>
                <li>• Important coursework (if recent grad)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">Pro Tips:</p>
              <ul className="text-green-700 space-y-1">
                <li>• List most recent education first</li>
                <li>• Include incomplete degrees if relevant</li>
                <li>• Add certifications and bootcamps</li>
                <li>• Use consistent date formatting</li>
                <li>• Match field to your target industry</li>
                <li>• Include study abroad experiences</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Button */}
      <button
        onClick={addEducation}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add Education</span>
      </button>

      {/* Education List */}
      <div className="space-y-4">
        {(resumeData?.education || []).map((edu: EducationEntry, index: number) => (
          <div 
            key={index} 
            className={`border border-gray-200 rounded-lg overflow-hidden ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Education Header */}
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedIndex === index}
              aria-controls={`education-details-${index}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedIndex(expandedIndex === index ? -1 : index);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`} {edu.institution && `- ${edu.institution}`}
                    </h4>
                    {localValidationErrors[index] && Object.keys(localValidationErrors[index]).length > 0 && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {atsAnalysis[index]?.score >= 80 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {edu.graduationDate} {edu.current && '- Present'}
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
                    removeArrayItem('education', index);
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                  aria-label="Remove education entry"
                >
                  <X className="w-4 h-4" />
                </button>
                {expandedIndex === index ? 
                  <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </div>
            </div>

            {/* Education Details */}
            {expandedIndex === index && (
              <div id={`education-details-${index}`} className="p-6 space-y-6">
                {/* ATS Analysis */}
                {atsAnalysis[index] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-blue-900 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Education ATS Score: {atsAnalysis[index].score}%
                      </h5>
                      <select
                        value={industryFilter}
                        onChange={(e) => setIndustryFilter(e.target.value)}
                        className="text-sm border border-blue-300 rounded px-2 py-1 bg-white"
                      >
                        {Object.keys(fieldSuggestionsByIndustry).map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium">✓ Strengths:</p>
                        <div className="text-blue-600">
                          {atsAnalysis[index].hasRelevantField && <p>• Relevant field of study</p>}
                          {atsAnalysis[index].hasGpa && <p>• GPA included</p>}
                          {atsAnalysis[index].hasHonors && <p>• Academic honors</p>}
                        </div>
                      </div>
                      <div>
                        <p className="text-orange-700 font-medium">⚠ Consider Adding:</p>
                        <div className="text-orange-600">
                          {!atsAnalysis[index].hasGpa && <p>• GPA (if 3.5+)</p>}
                          {!atsAnalysis[index].hasHonors && <p>• Academic honors</p>}
                          {atsAnalysis[index].missingKeywords.length > 0 && (
                            <p>• Keywords: {atsAnalysis[index].missingKeywords.slice(0, 2).join(', ')}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Industry Match:</p>
                        <p className="text-gray-600">
                          {atsAnalysis[index].hasRelevantField ? 
                            '✓ Relevant to target role' : 
                            '⚠ Consider adding relevant coursework'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Education Type/Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={edu?.type || 'Bachelor'}
                      onChange={(e) => handleFieldUpdate(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(educationLevels).map(([key, level]) => (
                        <option key={key} value={key}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Degree/Program Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree/Program <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu?.degree || ''}
                      onChange={(e) => handleFieldUpdate(index, 'degree', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        localValidationErrors[index]?.degree ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Bachelor of Science, Associate of Arts"
                    />
                    {localValidationErrors[index]?.degree && (
                      <p className="text-red-500 text-xs mt-1">{localValidationErrors[index].degree}</p>
                    )}
                  </div>

                  {/* Field of Study */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Field of Study <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => setShowSuggestions(prev => ({ ...prev, [`field-${index}`]: !prev[`field-${index}`] }))}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        {showSuggestions[`field-${index}`] ? 'Hide' : 'Show'} Suggestions
                      </button>
                    </div>
                    <input
                      type="text"
                      value={edu?.field || ''}
                      onChange={(e) => handleFieldUpdate(index, 'field', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        localValidationErrors[index]?.field ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Computer Science, Business Administration"
                    />
                    {localValidationErrors[index]?.field && (
                      <p className="text-red-500 text-xs mt-1">{localValidationErrors[index].field}</p>
                    )}
                    
                    {/* Field Suggestions */}
                    {showSuggestions[`field-${index}`] && (
                      <div className="mt-2 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Suggested fields for {industryFilter}:</p>
                        <div className="grid grid-cols-1 gap-1">
                          {(fieldSuggestionsByIndustry[industryFilter] || []).map((field, fieldIndex) => (
                            <button
                              key={fieldIndex}
                              onClick={() => insertSuggestion(field, 'field', index)}
                              className="text-left p-2 bg-white hover:bg-blue-50 rounded border hover:border-blue-300 transition-colors text-sm"
                            >
                              {field}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Institution */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Institution <span className="text-red-500">*</span>
                      </label>
                      <button
                        onClick={() => setShowSuggestions(prev => ({ ...prev, [`institution-${index}`]: !prev[`institution-${index}`] }))}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        {showSuggestions[`institution-${index}`] ? 'Hide' : 'Show'} Examples
                      </button>
                    </div>
                    <input
                      type="text"
                      value={edu?.institution || ''}
                      onChange={(e) => handleFieldUpdate(index, 'institution', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        localValidationErrors[index]?.institution ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., University of California, Berkeley"
                    />
                    {localValidationErrors[index]?.institution && (
                      <p className="text-red-500 text-xs mt-1">{localValidationErrors[index].institution}</p>
                    )}
                    
                    {/* Institution Suggestions */}
                    {showSuggestions[`institution-${index}`] && (
                      <div className="mt-2 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Institution examples by type:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {Object.entries(institutionSuggestions).map(([type, institutions]) => (
                            <div key={type}>
                              <p className="text-xs font-medium text-gray-600 mb-1 capitalize">{type} Institutions:</p>
                              <div className="grid grid-cols-1 gap-1">
                                {institutions.map((institution, instIndex) => (
                                  <button
                                    key={instIndex}
                                    onClick={() => insertSuggestion(institution, 'institution', index)}
                                    className="text-left p-2 bg-white hover:bg-blue-50 rounded border hover:border-blue-300 transition-colors text-sm"
                                  >
                                    {institution}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={edu?.location || ''}
                      onChange={(e) => handleFieldUpdate(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Berkeley, CA"
                    />
                  </div>

                  {/* GPA */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA <span className="text-gray-500">(optional, include if 3.5+)</span>
                    </label>
                    <input
                      type="text"
                      value={edu?.gpa || ''}
                      onChange={(e) => handleFieldUpdate(index, 'gpa', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        localValidationErrors[index]?.gpa ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 3.8"
                    />
                    {localValidationErrors[index]?.gpa && (
                      <p className="text-red-500 text-xs mt-1">{localValidationErrors[index].gpa}</p>
                    )}
                  </div>
                </div>

                {/* Dates and Current Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={edu?.current || false}
                        onChange={() => toggleCurrent(index)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`current-${index}`} className="text-sm font-medium text-gray-700">
                        Currently enrolled
                      </label>
                    </div>
                  </div>

                  {!edu?.current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={edu?.graduationDate || ''}
                        onChange={(e) => handleFieldUpdate(index, 'graduationDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          localValidationErrors[index]?.graduationDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 2023-05"
                        aria-label="Graduation month and year"
                      />
                      {localValidationErrors[index]?.graduationDate && (
                        <p className="text-red-500 text-xs mt-1">{localValidationErrors[index].graduationDate}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Select the month and year of graduation
                      </p>
                    </div>
                  )}
                </div>

                {/* Honors and Awards */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Honors & Awards
                    </label>
                    <button
                      onClick={() => setShowSuggestions(prev => ({ ...prev, [`honors-${index}`]: !prev[`honors-${index}`] }))}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {showSuggestions[`honors-${index}`] ? 'Hide' : 'Show'} Examples
                    </button>
                  </div>
                  <input
                    type="text"
                    value={edu?.honors || ''}
                    onChange={(e) => handleFieldUpdate(index, 'honors', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Magna Cum Laude, Dean's List"
                  />
                  
                  {/* Honors Suggestions */}
                  {showSuggestions[`honors-${index}`] && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Common honors and awards:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {honorsSuggestions.map((honor, honorIndex) => (
                          <button
                            key={honorIndex}
                            onClick={() => insertSuggestion(honor, 'honors', index)}
                            className="text-left p-2 bg-white hover:bg-blue-50 rounded border hover:border-blue-300 transition-colors text-sm"
                          >
                            {honor}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Relevant Coursework */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relevant Coursework <span className="text-gray-500">(especially for recent graduates)</span>
                  </label>
                  <textarea
                    value={edu?.coursework || ''}
                    onChange={(e) => handleFieldUpdate(index, 'coursework', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List relevant courses separated by commas: Data Structures, Algorithms, Database Systems, Software Engineering..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Include 4-6 most relevant courses that align with your target job
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!resumeData?.education || resumeData.education.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No education added yet</h4>
          <p className="text-sm mb-4">Add your educational background to showcase your qualifications</p>
          <button
            onClick={addEducation}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Education</span>
          </button>
        </div>
      )}

      {/* Education Statistics */}
      {(resumeData?.education || []).length > 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Education Overview
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{(resumeData?.education || []).length}</div>
              <div className="text-xs text-gray-600">Total Education</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {(resumeData?.education || []).filter((e: EducationEntry) => e.gpa && parseFloat(e.gpa.replace(',', '.')) >= 3.5).length}
              </div>
              <div className="text-xs text-gray-600">High GPA (3.5+)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {(resumeData?.education || []).filter((e: EducationEntry) => e.honors).length}
              </div>
              <div className="text-xs text-gray-600">With Honors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  (resumeData?.education || []).reduce((acc, edu, idx) => 
                    acc + (atsAnalysis[idx]?.score || 0), 0) / 
                  Math.max((resumeData?.education || []).length, 1)
                )}%
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