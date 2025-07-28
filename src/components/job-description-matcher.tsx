import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Target, TrendingUp, AlertCircle, CheckCircle, Copy, 
  FileText, Zap, Eye, EyeOff, ArrowRight, Plus, 
  Lightbulb, Award, Users, Brain, Briefcase 
} from 'lucide-react';

// Type definitions
interface TabConfig {
  id: 'input' | 'analysis' | 'suggestions';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: number;
}

interface ParsedJobData {
  technical: string[];
  softSkills: string[];
  experience: string[];
  education: string[];
  actionVerbs: string[];
  requirements: string[];
  responsibilities: string[];
  allKeywords: string[];
}

// Define the weight categories type for consistent typing
type WeightCategory = keyof Pick<ParsedJobData, 'technical' | 'softSkills' | 'actionVerbs' | 'experience' | 'education'>;

interface MatchAnalysis {
  percentage: number;
  matches: Record<WeightCategory, string[]>;
  missing: Record<WeightCategory, string[]>;
  totalKeywords: number;
  matchedKeywords: number;
}

interface Suggestion {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: 'high' | 'medium' | 'low';
  action: string;
  keywords: string[];
  section: string;
}

// Job description parsing utilities
const parseJobDescription = (jobDescription: string): ParsedJobData => {
  const text = jobDescription.toLowerCase();
  
  // Common technical keywords patterns
  const technicalPatterns = [
    // Programming languages
    /\b(javascript|python|java|react|node\.?js|angular|vue\.?js|typescript|php|ruby|go|rust|swift|kotlin|scala|c\+\+|c#|html|css|sql)\b/g,
    // Frameworks and libraries
    /\b(express\.?js|django|flask|spring|laravel|rails|next\.?js|nuxt\.?js|svelte|bootstrap|tailwind)\b/g,
    // Databases
    /\b(mongodb|postgresql|mysql|redis|elasticsearch|cassandra|dynamodb|oracle|sqlite)\b/g,
    // Cloud and DevOps - Fixed: escaped space in "google cloud"
    /\b(aws|azure|gcp|google\s+cloud|docker|kubernetes|jenkins|terraform|ansible|gitlab|github)\b/g,
    // Tools and methodologies
    /\b(agile|scrum|kanban|jira|confluence|git|webpack|babel|jest|cypress|figma|sketch)\b/g
  ];

  // Soft skills patterns
  const softSkillsPatterns = [
    /\b(leadership|management|communication|collaboration|teamwork|problem[\s-]solving|analytical|creative|adaptable|detail[\s-]oriented)\b/g,
    /\b(project\s+management|time\s+management|critical\s+thinking|decision\s+making|conflict\s+resolution|mentoring|coaching)\b/g
  ];

  // Experience level patterns
  const experiencePatterns = [
    /(\d+)[\s-]*(?:to[\s-]*(\d+))?[\s-]*years?[\s-]*(?:of[\s-]*)?experience/g,
    /(\d+)\+[\s-]*years?/g,
    /(entry[\s-]?level|junior|senior|lead|principal|staff|director|manager)/g
  ];

  // Education patterns
  const educationPatterns = [
    /\b(bachelor'?s?|master'?s?|phd|doctorate|degree|diploma|certification|certificate)\b/g,
    /\b(computer\s+science|engineering|mathematics|business|marketing|design|finance)\b/g
  ];

  // Extract all matches
  const extractMatches = (patterns: RegExp[]): string[] => {
    const matches = new Set<string>();
    patterns.forEach(pattern => {
      const found = text.match(pattern);
      if (found) {
        found.forEach(match => matches.add(match.trim()));
      }
    });
    return Array.from(matches);
  };

  const technical = extractMatches(technicalPatterns);
  const softSkills = extractMatches(softSkillsPatterns);
  const experience = extractMatches(experiencePatterns);
  const education = extractMatches(educationPatterns);

  // Extract requirements and responsibilities - Fixed: improved regex for multi-sentence capture
  const requirementSections = text.match(/(?:requirements?|qualifications?|skills?)[\s:]*([^\.]+(?:\.[^\.]*)*)/gi) || [];
  const responsibilitySections = text.match(/(?:responsibilities?|duties|role)[\s:]*([^\.]+(?:\.[^\.]*)*)/gi) || [];

  // Extract key action verbs
  const actionVerbs = text.match(/\b(develop|build|create|design|implement|manage|lead|analyze|optimize|maintain|collaborate|coordinate|execute|deliver|improve|scale|architect|deploy|test|debug|monitor)\b/g) || [];

  return {
    technical: [...new Set(technical)],
    softSkills: [...new Set(softSkills)],
    experience: [...new Set(experience)],
    education: [...new Set(education)],
    actionVerbs: [...new Set(actionVerbs)],
    requirements: requirementSections,
    responsibilities: responsibilitySections,
    allKeywords: [...new Set([...technical, ...softSkills, ...actionVerbs])]
  };
};

// Calculate match score between resume and job description
const calculateMatchScore = (resumeData: any, jobKeywords: ParsedJobData): MatchAnalysis => {
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  
  // Weight different types of matches - Fixed: Keys match ParsedJobData interface exactly
  type WeightCategory = keyof Pick<ParsedJobData, 'technical' | 'softSkills' | 'actionVerbs' | 'experience' | 'education'>;
  
  const weights: Record<WeightCategory, number> = {
    technical: 0.4,
    softSkills: 0.2,
    actionVerbs: 0.2,
    experience: 0.1,
    education: 0.1
  };

  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // Fixed: Proper typing for dynamic property access with exact key matching
  const matches: Record<WeightCategory, string[]> = {
    technical: [],
    softSkills: [],
    actionVerbs: [],
    experience: [],
    education: []
  };

  const missing: Record<WeightCategory, string[]> = {
    technical: [],
    softSkills: [],
    actionVerbs: [],
    experience: [],
    education: []
  };

  // Check each category with type safety
  (Object.keys(weights) as WeightCategory[]).forEach(category => {
    const keywords = jobKeywords[category] || [];
    const weight = weights[category];
    
    keywords.forEach(keyword => {
      const found = resumeText.includes(keyword.toLowerCase());
      maxPossibleScore += weight;
      
      if (found) {
        totalScore += weight;
        matches[category].push(keyword);
      } else {
        missing[category].push(keyword);
      }
    });
  });

  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  return {
    percentage,
    matches,
    missing,
    totalKeywords: jobKeywords.allKeywords.length,
    matchedKeywords: Object.values(matches).flat().length
  };
};

// Generate improvement suggestions - Fixed: Explicit return type with proper typing
const generateSuggestions = (missing: Record<WeightCategory, string[]>, resumeData: any): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  // Technical skills suggestions
  if (missing.technical && missing.technical.length > 0) {
    suggestions.push({
      category: 'Technical Skills',
      icon: Brain,
      priority: 'high',
      action: 'Add missing technical skills to your Skills section',
      keywords: missing.technical.slice(0, 5),
      section: 'skills'
    });
  }

  // Soft skills suggestions
  if (missing.softSkills && missing.softSkills.length > 0) {
    suggestions.push({
      category: 'Soft Skills',
      icon: Users,
      priority: 'medium',
      action: 'Include soft skills in your Professional Summary or Experience descriptions',
      keywords: missing.softSkills.slice(0, 3),
      section: 'personalInfo'
    });
  }

  // Action verbs suggestions
  if (missing.actionVerbs && missing.actionVerbs.length > 0) {
    suggestions.push({
      category: 'Action Verbs',
      icon: Zap,
      priority: 'high',
      action: 'Use these action verbs in your Experience section descriptions',
      keywords: missing.actionVerbs.slice(0, 5),
      section: 'experience'
    });
  }

  // Experience level suggestions
  if (missing.experience && missing.experience.length > 0) {
    suggestions.push({
      category: 'Experience Level',
      icon: Briefcase,
      priority: 'low',
      action: 'Consider highlighting your experience level if it matches requirements',
      keywords: missing.experience.slice(0, 2),
      section: 'personalInfo'
    });
  }

  // Education suggestions
  if (missing.education && missing.education.length > 0) {
    suggestions.push({
      category: 'Education',
      icon: Award,
      priority: 'low',
      action: 'Consider highlighting relevant education or certifications',
      keywords: missing.education.slice(0, 2),
      section: 'education'
    });
  }

  return suggestions.sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

interface JobDescriptionMatcherProps {
  resumeData: any;
  onNavigateToSection?: (section: string) => void;
  onAddKeyword?: (keyword: string, section: string) => void;
  className?: string;
}

export default function JobDescriptionMatcher({ 
  resumeData, 
  onNavigateToSection = () => {}, 
  onAddKeyword = () => {},
  className = "" 
}: JobDescriptionMatcherProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'analysis' | 'suggestions'>('input');
  
  // Parsed job description data
  const jobData = useMemo(() => {
    if (!jobDescription.trim()) return null;
    return parseJobDescription(jobDescription);
  }, [jobDescription]);

  // Match analysis
  const matchAnalysis = useMemo(() => {
    if (!jobData || !resumeData) return null;
    return calculateMatchScore(resumeData, jobData);
  }, [jobData, resumeData]);

  // Improvement suggestions
  const suggestions = useMemo(() => {
    if (!matchAnalysis) return [];
    return generateSuggestions(matchAnalysis.missing, resumeData);
  }, [matchAnalysis, resumeData]);

  // Fixed: Added activeTab to dependencies
  useEffect(() => {
    if (jobDescription.length > 100) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        if (activeTab === 'input') {
          setActiveTab('analysis');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [jobDescription, activeTab]);

  // Handle paste functionality with error handling
  const handlePaste = useCallback(async () => {
    try {
      // Check if clipboard API is available (secure context required)
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      // Fallback: show instruction to paste manually
      alert('Please paste the job description manually using Ctrl+V or Cmd+V');
    }
  }, []);

  // Handle keyword addition
  const handleAddKeyword = useCallback((keyword: string, section: string) => {
    onAddKeyword(keyword, section);
  }, [onAddKeyword]);

  // Handle section navigation
  const handleNavigateToSection = useCallback((section: string) => {
    onNavigateToSection(section);
  }, [onNavigateToSection]);

  // Sample job description for demo
  const sampleJobDescription = `Software Engineer - Full Stack Developer

We are seeking a talented Full Stack Developer to join our engineering team. 

Responsibilities:
- Develop and maintain web applications using React, Node.js, and TypeScript
- Collaborate with cross-functional teams to deliver high-quality software
- Write clean, maintainable code and participate in code reviews
- Implement responsive designs and optimize application performance
- Work with databases including PostgreSQL and MongoDB
- Deploy applications using Docker and AWS

Requirements:
- 3+ years of experience in software development
- Strong proficiency in JavaScript, React, and Node.js
- Experience with SQL and NoSQL databases
- Knowledge of Git, Docker, and cloud platforms
- Excellent problem-solving and communication skills
- Bachelor's degree in Computer Science or related field

Nice to have:
- Experience with TypeScript, GraphQL, and microservices
- Knowledge of CI/CD pipelines and DevOps practices
- Agile development experience`;

  // Fixed: Proper typing for tab configuration
  const tabConfigs: TabConfig[] = [
    { id: 'input', label: 'Job Description', icon: FileText, disabled: false },
    { id: 'analysis', label: 'Match Analysis', icon: TrendingUp, disabled: !matchAnalysis },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb, disabled: false, badge: suggestions.length }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Job Description Matcher</h3>
              <p className="text-sm text-gray-600">Paste a job description to see how well your resume matches</p>
            </div>
          </div>
          
          {matchAnalysis && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              matchAnalysis.percentage >= 80 ? 'bg-green-100 text-green-700' :
              matchAnalysis.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
              matchAnalysis.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {matchAnalysis.percentage}% Match
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabConfigs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : tab.disabled
                ? 'border-transparent text-gray-400 cursor-not-allowed'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Paste Job Description
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Paste</span>
                </button>
                <button
                  onClick={() => setJobDescription(sampleJobDescription)}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span>Try Sample</span>
                </button>
              </div>
            </div>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{jobDescription.length} characters</span>
              {jobDescription.length > 100 && (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Ready for analysis</span>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Best Results:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Include the complete job description with requirements and responsibilities</li>
                <li>• Copy from the original job posting for accurate keyword detection</li>
                <li>• The analysis works best with descriptions over 200 words</li>
                <li>• Multiple job descriptions can help identify common requirements</li>
              </ul>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && matchAnalysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-2xl font-bold ${
                matchAnalysis.percentage >= 80 ? 'bg-green-100 text-green-700' :
                matchAnalysis.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                matchAnalysis.percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {matchAnalysis.percentage}%
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-3">Match Score</h3>
              <p className="text-sm text-gray-600">
                {matchAnalysis.matchedKeywords} of {matchAnalysis.totalKeywords} keywords found
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Keywords Found</h4>
                </div>
                
                {Object.entries(matchAnalysis.matches).map(([category, keywords]) => 
                  keywords.length > 0 && (
                    <div key={category} className="mb-3">
                      <h5 className="text-sm font-medium text-green-800 mb-1 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {keywords.slice(0, 5).map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {keyword}
                          </span>
                        ))}
                        {keywords.length > 5 && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            +{keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Missing Keywords */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Missing Keywords</h4>
                </div>
                
                {Object.entries(matchAnalysis.missing).map(([category, keywords]) => 
                  keywords.length > 0 && (
                    <div key={category} className="mb-3">
                      <h5 className="text-sm font-medium text-red-800 mb-1 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {keywords.slice(0, 5).map((keyword, index) => (
                          <button
                            key={index}
                            onClick={() => handleAddKeyword(keyword, category === 'technical' ? 'skills' : 'personalInfo')}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                            title={`Click to add "${keyword}" to your resume`}
                          >
                            {keyword}
                          </button>
                        ))}
                        {keywords.length > 5 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            +{keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Detailed Analysis Toggle */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showDetailedAnalysis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis</span>
              </button>

              {showDetailedAnalysis && jobData && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Job Requirements</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        {jobData.requirements.slice(0, 3).map((req, index) => (
                          <div key={index} className="truncate">{req.substring(0, 100)}...</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Key Responsibilities</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        {jobData.responsibilities.slice(0, 3).map((resp, index) => (
                          <div key={index} className="truncate">{resp.substring(0, 100)}...</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing job description...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">🚀 Optimization Suggestions</h4>
                  <p className="text-sm text-purple-700">
                    Follow these suggestions to improve your resume match score and increase your chances of getting past ATS filters.
                  </p>
                </div>

                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            suggestion.priority === 'high' ? 'bg-red-100' :
                            suggestion.priority === 'medium' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <suggestion.icon className={`w-4 h-4 ${
                              suggestion.priority === 'high' ? 'text-red-600' :
                              suggestion.priority === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-900">{suggestion.category}</h5>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {suggestion.priority} priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{suggestion.action}</p>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {suggestion.keywords.map((keyword, keywordIndex) => (
                                <button
                                  key={keywordIndex}
                                  onClick={() => handleAddKeyword(keyword, suggestion.section)}
                                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-purple-100 hover:text-purple-700 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>{keyword}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleNavigateToSection(suggestion.section)}
                          className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors"
                        >
                          <span>Edit Section</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Great job!</h4>
                <p className="text-gray-600">Your resume already matches well with this job description.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}