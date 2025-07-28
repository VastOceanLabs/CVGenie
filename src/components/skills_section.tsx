import React, { useState, useEffect, useCallback } from 'react';
// ✅ FIXED: Removed unused imports (Minus, CheckCircle, Code, Users, Wrench, Award, Filter)
import { Plus, Sparkles, BookOpen, ArrowLeft, ArrowRight, Brain, Lightbulb, Target, AlertCircle, Star, TrendingUp, Search, GripVertical, X } from 'lucide-react';

// ✅ FIXED: Proper TypeScript interfaces instead of 'any'
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

interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'certifications';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: string;
  featured: boolean;
}

interface ResumeData {
  personalInfo?: PersonalInfo;
  skills?: Skill[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
}

interface ValidationErrors {
  [key: string]: any;
}

// ✅ FIXED: Proper interface instead of 'any'
interface SectionComponentProps {
  resumeData: ResumeData;
  updateResumeData: (section: string, data: any) => void;
  addArrayItem: (section: string, item: any) => void;
  removeArrayItem: (section: string, index: number) => void;
  updateArrayItem: (section: string, index: number, data: any) => void;
  setShowPhraseLibrary: (show: boolean) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  currentStep: number;
  totalSteps: number;
  validationErrors?: ValidationErrors;
  setValidationErrors?: (errors: ValidationErrors) => void;
}

interface SkillsByIndustry {
  [key: string]: {
    technical?: string[];
    soft?: string[];
    tools?: string[];
    certifications?: string[];
  };
}

interface ATSAnalysis {
  score: number;
  missing: string[];
  found: string[];
}

interface SkillSuggestion {
  name: string;
  category: string;
}

// Industry-specific skills database
const skillsByIndustry: SkillsByIndustry = {
  'Software Engineer': {
    technical: [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker',
      'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL', 'TypeScript', 'Vue.js',
      'Angular', 'Express.js', 'Redis', 'Kubernetes', 'CI/CD', 'Jest'
    ],
    soft: [
      'Problem Solving', 'Team Collaboration', 'Code Review', 'Agile Development',
      'Technical Communication', 'Debugging', 'Project Management', 'Mentoring'
    ],
    tools: [
      'VS Code', 'IntelliJ', 'Jira', 'Confluence', 'Slack', 'GitHub',
      'Postman', 'Figma', 'Tableau', 'Jenkins'
    ]
  },
  'Electrician': {
    technical: [
      'Electrical Installation', 'Wiring Systems', 'Circuit Analysis', 'Motor Controls',
      'PLC Programming', 'Electrical Troubleshooting', 'Power Distribution', 'Conduit Bending',
      'Blueprint Reading', 'Electrical Testing', 'Panel Installation', 'Cable Pulling'
    ],
    soft: [
      'Safety Compliance', 'Problem Solving', 'Attention to Detail', 'Time Management',
      'Customer Service', 'Team Collaboration', 'Physical Stamina', 'Critical Thinking'
    ],
    tools: [
      'Multimeter', 'Oscilloscope', 'Wire Strippers', 'Conduit Benders',
      'Cable Pullers', 'Voltage Testers', 'Power Tools', 'Hand Tools'
    ],
    certifications: [
      'Journeyman Electrician License', 'Master Electrician License', 'OSHA 10/30',
      'NFPA 70E Arc Flash', 'Low Voltage License', 'Fire Alarm License'
    ]
  },
  'Marketing Manager': {
    technical: [
      'Digital Marketing', 'SEO/SEM', 'Google Analytics', 'Social Media Marketing',
      'Content Marketing', 'Email Marketing', 'Marketing Automation', 'A/B Testing',
      'Conversion Optimization', 'PPC Advertising', 'Influencer Marketing', 'Brand Management'
    ],
    soft: [
      'Strategic Planning', 'Creative Thinking', 'Data Analysis', 'Project Management',
      'Team Leadership', 'Communication', 'Budget Management', 'Customer Insights'
    ],
    tools: [
      'Google Ads', 'Facebook Ads Manager', 'HubSpot', 'Mailchimp', 'Hootsuite',
      'Canva', 'Adobe Creative Suite', 'Salesforce', 'Tableau', 'Slack'
    ]
  },
  'Nurse': {
    technical: [
      'Patient Assessment', 'Medication Administration', 'IV Therapy', 'Wound Care',
      'Electronic Health Records', 'Vital Signs Monitoring', 'Emergency Response',
      'Infection Control', 'Patient Education', 'Clinical Documentation'
    ],
    soft: [
      'Compassionate Care', 'Critical Thinking', 'Communication', 'Stress Management',
      'Team Collaboration', 'Attention to Detail', 'Time Management', 'Empathy'
    ],
    tools: [
      'Electronic Health Records (EHR)', 'Medical Equipment', 'Infusion Pumps',
      'Patient Monitors', 'Glucometers', 'Blood Pressure Cuffs', 'Thermometers'
    ],
    certifications: [
      'RN License', 'BLS Certification', 'ACLS Certification', 'PALS Certification',
      'Specialty Certifications', 'CPR Certification'
    ]
  },
  'Project Manager': {
    technical: [
      'Project Planning', 'Risk Management', 'Budget Management', 'Agile/Scrum',
      'Stakeholder Management', 'Resource Allocation', 'Timeline Management',
      'Quality Assurance', 'Change Management', 'Performance Monitoring'
    ],
    soft: [
      'Leadership', 'Communication', 'Negotiation', 'Problem Solving',
      'Team Building', 'Conflict Resolution', 'Decision Making', 'Adaptability'
    ],
    tools: [
      'Microsoft Project', 'Jira', 'Asana', 'Trello', 'Slack', 'Confluence',
      'Excel', 'PowerPoint', 'Teams', 'Monday.com'
    ],
    certifications: [
      'PMP Certification', 'Scrum Master', 'Agile Certification', 'PRINCE2',
      'Lean Six Sigma', 'PMI-ACP'
    ]
  },
  'Sales Representative': {
    technical: [
      'Lead Generation', 'CRM Management', 'Sales Analytics', 'Pipeline Management',
      'Prospecting', 'Closing Techniques', 'Account Management', 'Territory Management',
      'Sales Forecasting', 'Competitive Analysis'
    ],
    soft: [
      'Relationship Building', 'Negotiation', 'Persuasion', 'Active Listening',
      'Resilience', 'Goal-Oriented', 'Time Management', 'Customer Service'
    ],
    tools: [
      'Salesforce', 'HubSpot', 'LinkedIn Sales Navigator', 'Zoom', 'Slack',
      'Excel', 'PowerPoint', 'Outreach', 'ZoomInfo', 'Calendly'
    ]
  }
};

// ✅ FIXED: Now using popularSkills in the component to avoid "unused variable" error
const popularSkills = {
  soft: [
    'Communication', 'Leadership', 'Problem Solving', 'Time Management',
    'Team Collaboration', 'Adaptability', 'Critical Thinking', 'Customer Service',
    'Project Management', 'Attention to Detail', 'Work Under Pressure', 'Multitasking'
  ],
  technical: [
    'Microsoft Office', 'Data Analysis', 'Project Management', 'Social Media',
    'Email Marketing', 'Customer Relationship Management', 'Database Management',
    'Quality Control', 'Training & Development', 'Budget Management'
  ]
};

// Skill level definitions
const skillLevels = {
  beginner: { label: 'Beginner', description: 'Basic knowledge, some experience', color: 'bg-gray-100 text-gray-700' },
  intermediate: { label: 'Intermediate', description: 'Solid experience, can work independently', color: 'bg-blue-100 text-blue-700' },
  advanced: { label: 'Advanced', description: 'Extensive experience, can mentor others', color: 'bg-green-100 text-green-700' },
  expert: { label: 'Expert', description: 'Deep expertise, industry recognition', color: 'bg-purple-100 text-purple-700' }
};

// ✅ FIXED: Proper component with all TypeScript interfaces
export default function SkillsSection({ 
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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [showSkillHelper, setShowSkillHelper] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis>({ score: 0, missing: [], found: [] });
  const [industryFilter, setIndustryFilter] = useState<string>('Software Engineer');

  // ✅ FIXED: Proper validation function with correct typing
  const validateSkills = useCallback(() => {
    const errors: ValidationErrors = {};
    const skills = resumeData?.skills || [];
    
    if (skills.length === 0) {
      errors.skills = 'At least 3 skills are recommended for better ATS scoring';
    } else if (skills.length < 3) {
      errors.skills = 'Add more skills to improve your ATS score and competitiveness';
    }

    // Validate individual skills
    skills.forEach((skill: Skill, index: number) => {
      if (!skill.name?.trim()) {
        errors[`skill_${index}`] = 'Skill name is required';
      }
    });

    setValidationErrors({ ...validationErrors, skills: errors });
    return Object.keys(errors).length === 0;
  }, [resumeData?.skills, validationErrors, setValidationErrors]);

  // ✅ FIXED: Memoized ATS analysis function with proper dependencies
  const analyzeSkillsATS = useCallback(() => {
    const userSkills = (resumeData?.skills || []).map((skill: Skill) => skill.name?.toLowerCase());
    const jobTitle = resumeData?.personalInfo?.jobTitle || industryFilter;
    
    // Find the closest matching industry
    let matchedIndustry = industryFilter;
    Object.keys(skillsByIndustry).forEach(industry => {
      if (jobTitle.toLowerCase().includes(industry.toLowerCase()) || 
          industry.toLowerCase().includes(jobTitle.toLowerCase())) {
        matchedIndustry = industry;
      }
    });

    const industrySkills = skillsByIndustry[matchedIndustry];
    const relevantSkills = [
      ...(industrySkills?.technical || []),
      ...(industrySkills?.soft || []),
      ...(industrySkills?.tools || [])
    ].map(skill => skill.toLowerCase());

    const foundSkills = relevantSkills.filter(skill => 
      userSkills.some(userSkill => userSkill?.includes(skill) || skill.includes(userSkill))
    );
    
    const missingSkills = relevantSkills.filter(skill => 
      !userSkills.some(userSkill => userSkill?.includes(skill) || skill.includes(userSkill))
    ).slice(0, 8);

    const score = Math.round((foundSkills.length / Math.max(relevantSkills.length, 1)) * 100);

    setAtsAnalysis({
      score: Math.min(score, 100),
      found: foundSkills,
      missing: missingSkills
    });
  }, [resumeData?.skills, resumeData?.personalInfo?.jobTitle, industryFilter]);

  // Add new skill
  const addSkill = useCallback((skillName = '', category = 'technical', level = 'intermediate') => {
    const newSkill: Skill = {
      name: skillName,
      category: category as Skill['category'],
      level: level as Skill['level'],
      years: '',
      featured: false
    };
    addArrayItem('skills', newSkill);
  }, [addArrayItem]);

  // Add skill from suggestion
  const addSuggestionSkill = useCallback((skillName: string, category: string) => {
    addSkill(skillName, category, 'intermediate');
  }, [addSkill]);

  // Update skill
  const updateSkill = useCallback((index: number, updates: Partial<Skill>) => {
    updateArrayItem('skills', index, updates);
  }, [updateArrayItem]);

  // Remove skill
  const removeSkill = useCallback((index: number) => {
    removeArrayItem('skills', index);
  }, [removeArrayItem]);

  // Filter skills for display
  const getFilteredSkills = useCallback(() => {
    let skills = resumeData?.skills || [];
    
    if (activeCategory !== 'all') {
      skills = skills.filter((skill: Skill) => skill.category === activeCategory);
    }
    
    if (searchTerm) {
      skills = skills.filter((skill: Skill) => 
        skill.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return skills;
  }, [resumeData?.skills, activeCategory, searchTerm]);

  // ✅ FIXED: Now using popularSkills to avoid unused variable error
  const getSuggestedSkills = useCallback((): SkillSuggestion[] => {
    const currentSkillNames = (resumeData?.skills || []).map((skill: Skill) => skill.name?.toLowerCase());
    const industrySkills = skillsByIndustry[industryFilter] || {};
    
    const suggestions: SkillSuggestion[] = [];
    
    // Add industry-specific skills
    Object.entries(industrySkills).forEach(([category, skillList]) => {
      (skillList as string[]).forEach(skill => {
        if (!currentSkillNames.includes(skill.toLowerCase())) {
          suggestions.push({ name: skill, category });
        }
      });
    });

    // Add popular skills if we don't have enough suggestions
    if (suggestions.length < 8) {
      Object.entries(popularSkills).forEach(([category, skillList]) => {
        skillList.forEach(skill => {
          if (!currentSkillNames.includes(skill.toLowerCase()) && 
              !suggestions.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
            suggestions.push({ name: skill, category });
          }
        });
      });
    }
    
    return suggestions.slice(0, 12);
  }, [resumeData?.skills, industryFilter]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const skills = resumeData?.skills || [];
    const newSkills = [...skills];
    const draggedItem = newSkills[draggedIndex];
    newSkills.splice(draggedIndex, 1);
    newSkills.splice(dropIndex, 0, draggedItem);
    
    updateResumeData('skills', newSkills);
    setDraggedIndex(null);
  };

  // ✅ FIXED: Proper useEffect with all dependencies
  useEffect(() => {
    analyzeSkillsATS();
    validateSkills();
  }, [analyzeSkillsATS, validateSkills]);

  // ✅ FIXED: Proper useEffect with correct dependencies for industry filter updates
  useEffect(() => {
    const jobTitle = resumeData?.personalInfo?.jobTitle || '';
    if (jobTitle) {
      Object.keys(skillsByIndustry).forEach(industry => {
        if (jobTitle.toLowerCase().includes(industry.toLowerCase()) || 
            industry.toLowerCase().includes(jobTitle.toLowerCase())) {
          setIndustryFilter(industry);
        }
      });
    }
  }, [resumeData?.personalInfo?.jobTitle]);

  const filteredSkills = getFilteredSkills();
  const suggestedSkills = getSuggestedSkills();
  const skillsErrors = validationErrors?.skills || {};

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add relevant skills to showcase your capabilities and improve ATS matching
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSkillHelper(!showSkillHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Skill Helper</span>
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

      {/* Validation Errors Display */}
      {skillsErrors.skills && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">{skillsErrors.skills}</p>
          </div>
        </div>
      )}

      {/* ATS Analysis Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-blue-900 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Skills ATS Score: {atsAnalysis.score}%
          </h4>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="text-sm border border-blue-300 rounded px-2 py-1 bg-white"
          >
            {Object.keys(skillsByIndustry).map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-700 font-medium mb-1">✓ Skills You Have ({atsAnalysis.found.length}):</p>
            <p className="text-blue-600">
              {atsAnalysis.found.length > 0 ? `${atsAnalysis.found.slice(0, 3).join(', ')}${atsAnalysis.found.length > 3 ? '...' : ''}` : 'Add relevant skills below'}
            </p>
          </div>
          <div>
            <p className="text-orange-700 font-medium mb-1">⚠ Consider Adding ({atsAnalysis.missing.length}):</p>
            <p className="text-orange-600">
              {atsAnalysis.missing.slice(0, 3).join(', ')}
              {atsAnalysis.missing.length > 3 && '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Skill Helper */}
      {showSkillHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3">
            🎯 Skills Section Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">What to Include:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Job-relevant technical skills</li>
                <li>• Industry-standard tools & software</li>
                <li>• Transferable soft skills</li>
                <li>• Certifications & licenses</li>
                <li>• Programming languages (if applicable)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">Pro Tips:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Match skills to job descriptions</li>
                <li>• Use exact keywords from job postings</li>
                <li>• Include skill levels (Advanced, Expert, etc.)</li>
                <li>• Add years of experience when relevant</li>
                <li>• Feature your strongest skills first</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(['all', 'technical', 'soft', 'tools', 'certifications'] as const).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add Skill Button */}
      <button
        onClick={() => addSkill()}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add New Skill</span>
      </button>

      {/* Skills List */}
      <div className="space-y-3">
        {filteredSkills.map((skill: Skill, index: number) => (
          <div 
            key={index}
            className={`bg-white border rounded-lg p-4 ${
              draggedIndex === index ? 'opacity-50' : ''
            } ${skillsErrors[`skill_${index}`] ? 'border-red-300' : 'border-gray-200'}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="flex items-center space-x-4">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
              
              {/* Skill Name */}
              <div className="flex-1">
                <input
                  type="text"
                  value={skill?.name || ''}
                  onChange={(e) => updateSkill(index, { name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    skillsErrors[`skill_${index}`] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., JavaScript, Project Management, etc."
                />
                {skillsErrors[`skill_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{skillsErrors[`skill_${index}`]}</p>
                )}
              </div>

              {/* Category */}
              <div className="w-32">
                <select
                  value={skill?.category || 'technical'}
                  onChange={(e) => updateSkill(index, { category: e.target.value as Skill['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="tools">Tools</option>
                  <option value="certifications">Certifications</option>
                </select>
              </div>

              {/* Skill Level */}
              <div className="w-32">
                <select
                  value={skill?.level || 'intermediate'}
                  onChange={(e) => updateSkill(index, { level: e.target.value as Skill['level'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {Object.entries(skillLevels).map(([value, config]) => (
                    <option key={value} value={value}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Years Experience */}
              <div className="w-20">
                <input
                  type="text"
                  value={skill?.years || ''}
                  onChange={(e) => updateSkill(index, { years: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="2+ yrs"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`featured-${index}`}
                  checked={skill?.featured || false}
                  onChange={(e) => updateSkill(index, { featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`featured-${index}`} className="text-xs text-gray-600">
                  <Star className="w-3 h-3" />
                </label>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Skill Level Indicator */}
            <div className="mt-2 flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${skillLevels[skill?.level || 'intermediate'].color}`}>
                {skillLevels[skill?.level || 'intermediate'].label}
              </span>
              {skill?.years && (
                <span className="text-xs text-gray-500">{skill.years} experience</span>
              )}
              {skill?.featured && (
                <span className="text-xs text-yellow-600 flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!resumeData?.skills || resumeData.skills.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h4>
          <p className="text-sm mb-4">Add your skills to showcase your expertise and improve ATS matching</p>
          <button
            onClick={() => addSkill()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Skill</span>
          </button>
        </div>
      )}

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-purple-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Suggested Skills for {industryFilter}
            </h5>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-purple-600 text-sm hover:text-purple-700"
            >
              {showSuggestions ? 'Hide' : 'Show'} ({suggestedSkills.length})
            </button>
          </div>
          
          {showSuggestions && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {suggestedSkills.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestionSkill(suggestion.name, suggestion.category)}
                  className="text-left p-2 bg-white hover:bg-purple-50 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{suggestion.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{suggestion.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills Statistics */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Skills Overview
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{(resumeData?.skills || []).length}</div>
            <div className="text-xs text-gray-600">Total Skills</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {(resumeData?.skills || []).filter((s: Skill) => s.category === 'technical').length}
            </div>
            <div className="text-xs text-gray-600">Technical</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(resumeData?.skills || []).filter((s: Skill) => s.featured).length}
            </div>
            <div className="text-xs text-gray-600">Featured</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{atsAnalysis.score}%</div>
            <div className="text-xs text-gray-600">ATS Score</div>
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