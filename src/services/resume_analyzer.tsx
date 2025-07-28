import React, { useState, useEffect, useMemo } from 'react';
import { Target, AlertCircle, CheckCircle, TrendingUp, Brain, Eye, Download, Share2, RefreshCw, Zap, Award, Clock, DollarSign, FileText, Users, Lightbulb, BarChart3, Filter, Search, ArrowRight, ArrowUp, ArrowDown, Star, ExternalLink, BookOpen } from 'lucide-react';

// Analysis data interface
interface AnalysisData {
  overallScore: number;
  sectionScores: Record<string, any>;
  recommendations: any[];
  strengths: any[];
  warnings: any[];
  criticalIssues: any[];
  keywordAnalysis: {
    required: any[];
    preferred: any[];
    requiredFound: number;
    preferredFound: number;
  };
  salaryImpact: number;
  competitiveRanking: string;
}

// Component props interface
interface ResumeAnalyzerProps {
  resumeData?: any;
  industry?: string;
  onRecommendationClick?: (recommendation: any) => void;
  showDetailedView?: boolean;
  className?: string;
}

// Industry-specific ATS rules and keywords
const industryAnalysisRules = {
  'Software Engineer': {
    requiredKeywords: ['software', 'development', 'programming', 'code', 'technical', 'application', 'system'],
    preferredKeywords: ['agile', 'scrum', 'API', 'database', 'frontend', 'backend', 'full-stack', 'cloud', 'devops'],
    technicalSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker'],
    sectionWeights: { skills: 0.3, experience: 0.35, education: 0.15, summary: 0.2 },
    avgSalaryImpact: { 'React': 15000, 'AWS': 20000, 'Python': 12000, 'Docker': 18000 }
  },
  'Marketing Manager': {
    requiredKeywords: ['marketing', 'campaign', 'brand', 'digital', 'analytics', 'strategy', 'growth'],
    preferredKeywords: ['SEO', 'SEM', 'social media', 'content', 'email marketing', 'lead generation', 'ROI'],
    technicalSkills: ['Google Analytics', 'Google Ads', 'Facebook Ads', 'HubSpot', 'Mailchimp', 'Salesforce'],
    sectionWeights: { skills: 0.25, experience: 0.4, education: 0.1, summary: 0.25 },
    avgSalaryImpact: { 'Google Ads': 8000, 'HubSpot': 10000, 'Salesforce': 12000 }
  },
  'Project Manager': {
    requiredKeywords: ['project', 'management', 'planning', 'coordination', 'stakeholder', 'delivery', 'budget'],
    preferredKeywords: ['agile', 'scrum', 'waterfall', 'risk management', 'resource allocation', 'timeline'],
    technicalSkills: ['MS Project', 'Jira', 'Asana', 'Trello', 'Confluence', 'Slack'],
    sectionWeights: { skills: 0.2, experience: 0.45, education: 0.1, summary: 0.25 },
    avgSalaryImpact: { 'PMP': 15000, 'Scrum Master': 12000, 'Jira': 5000 }
  },
  'Nurse': {
    requiredKeywords: ['patient', 'care', 'medical', 'healthcare', 'clinical', 'nursing', 'treatment'],
    preferredKeywords: ['assessment', 'medication', 'documentation', 'safety', 'emergency', 'infection control'],
    technicalSkills: ['EHR', 'IV Therapy', 'Patient Assessment', 'Medication Administration', 'BLS', 'ACLS'],
    sectionWeights: { skills: 0.2, experience: 0.4, education: 0.2, summary: 0.2 },
    avgSalaryImpact: { 'ACLS': 3000, 'ICU Experience': 8000, 'BSN': 5000 }
  },
  'Electrician': {
    requiredKeywords: ['electrical', 'wiring', 'installation', 'maintenance', 'safety', 'code', 'circuits'],
    preferredKeywords: ['troubleshooting', 'blueprint', 'conduit', 'voltage', 'panel', 'motor controls'],
    technicalSkills: ['Electrical Installation', 'Blueprint Reading', 'Motor Controls', 'PLC Programming'],
    sectionWeights: { skills: 0.3, experience: 0.4, education: 0.1, summary: 0.2 },
    avgSalaryImpact: { 'Master License': 12000, 'PLC Programming': 8000, 'Industrial': 6000 }
  }
};

// Default section weights for industries not specifically configured
const DEFAULT_SECTION_WEIGHTS = {
  skills: 0.25,
  experience: 0.4, 
  education: 0.15,
  summary: 0.2
};

// Helper function to find salary impact with case-insensitive matching
const findSalaryImpact = (skillName, industryData) => {
  if (!industryData?.avgSalaryImpact || !skillName) return null;
  
  const skillNameLower = skillName.toLowerCase();
  const salaryImpactKey = Object.keys(industryData.avgSalaryImpact).find(
    key => key.toLowerCase() === skillNameLower
  );
  
  return salaryImpactKey ? {
    key: salaryImpactKey,
    impact: industryData.avgSalaryImpact[salaryImpactKey]
  } : null;
};

// Salary impact calculator
const calculateSalaryImpact = (skills, industry) => {
  const industryData = industryAnalysisRules[industry];
  if (!industryData?.avgSalaryImpact) return 0;
  
  return skills.reduce((total, skill) => {
    const salaryData = findSalaryImpact(skill.name, industryData);
    const impact = salaryData?.impact || 0;
    
    return total + (impact * (skill.level === 'expert' ? 1.2 : skill.level === 'advanced' ? 1.0 : 0.7));
  }, 0);
};

// Keyword density analyzer
const analyzeKeywordDensity = (text, keywords) => {
  const words = text.toLowerCase().split(/\s+/);
  const totalWords = words.length;
  
  return keywords.map(keyword => {
    const matches = words.filter(word => word.includes(keyword.toLowerCase())).length;
    const density = totalWords > 0 ? (matches / totalWords) * 100 : 0;
    return {
      keyword,
      count: matches,
      density: Math.round(density * 100) / 100,
      optimal: density >= 1 && density <= 3
    };
  });
};

// Main analyzer function
const analyzeResume = (resumeData: any, industry = 'Software Engineer'): AnalysisData => {
  const rules = industryAnalysisRules[industry] || industryAnalysisRules['Software Engineer'];
  const weights = rules.sectionWeights || DEFAULT_SECTION_WEIGHTS;
  
  const analysis: AnalysisData = {
    overallScore: 0,
    sectionScores: {},
    recommendations: [],
    strengths: [],
    warnings: [],
    criticalIssues: [],
    keywordAnalysis: {
      required: [],
      preferred: [],
      requiredFound: 0,
      preferredFound: 0
    },
    salaryImpact: 0,
    competitiveRanking: 'Average'
  };

  // Combine all text for keyword analysis
  const allText = [
    resumeData.personalInfo?.summary || '',
    ...(resumeData.experience || []).map(exp => `${exp.title} ${exp.company} ${exp.description}`),
    ...(resumeData.skills || []).map(skill => skill.name),
    ...(resumeData.education || []).map(edu => `${edu.degree} ${edu.field} ${edu.institution}`)
  ].join(' ');

  // Keyword Analysis
  const requiredKeywords = analyzeKeywordDensity(allText, rules.requiredKeywords);
  const preferredKeywords = analyzeKeywordDensity(allText, rules.preferredKeywords);
  
  analysis.keywordAnalysis = {
    required: requiredKeywords,
    preferred: preferredKeywords,
    requiredFound: requiredKeywords.filter(k => k.count > 0).length,
    preferredFound: preferredKeywords.filter(k => k.count > 0).length
  };

  // Section Analysis
  // Personal Info / Summary
  const summaryScore = analyzeSummarySection(resumeData.personalInfo, rules);
  (analysis.sectionScores as any).summary = summaryScore;

  // Experience
  const experienceScore = analyzeExperienceSection(resumeData.experience, rules);
  (analysis.sectionScores as any).experience = experienceScore;

  // Skills
  const skillsScore = analyzeSkillsSection(resumeData.skills, rules);
  (analysis.sectionScores as any).skills = skillsScore;

  // Education
  const educationScore = analyzeEducationSection(resumeData.education, rules);
  (analysis.sectionScores as any).education = educationScore;

  // Calculate weighted overall score with safety cap and extracted weights
  analysis.overallScore = Math.min(100, Math.round(
    summaryScore.score * weights.summary +
    experienceScore.score * weights.experience +
    skillsScore.score * weights.skills +
    educationScore.score * weights.education
  ));

  // Salary Impact
  analysis.salaryImpact = calculateSalaryImpact(resumeData.skills || [], industry);

  // Competitive Ranking
  if (analysis.overallScore >= 90) analysis.competitiveRanking = 'Excellent';
  else if (analysis.overallScore >= 80) analysis.competitiveRanking = 'Good';
  else if (analysis.overallScore >= 70) analysis.competitiveRanking = 'Average';
  else analysis.competitiveRanking = 'Needs Improvement';

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis, resumeData, rules);
  analysis.strengths = generateStrengths(analysis, resumeData);
  analysis.warnings = generateWarnings(analysis, resumeData);
  analysis.criticalIssues = generateCriticalIssues(analysis, resumeData);

  return analysis;
};

// Helper functions for section analysis
const analyzeSummarySection = (personalInfo: any, rules: any): { score: number; issues: string[] } => {
  let score = 0;
  const issues: string[] = [];
  
  if (!personalInfo?.summary) {
    return { score: 0, issues: ['Missing professional summary'] };
  }
  
  const summary = personalInfo.summary;
  const length = summary.length;
  
  // Length check
  if (length >= 100 && length <= 300) score += 30;
  else if (length < 100) issues.push('Summary too short (aim for 100-300 characters)');
  else issues.push('Summary too long (aim for 100-300 characters)');
  
  // Keyword presence
  const keywordCount = rules.requiredKeywords.filter((keyword: string) => 
    summary.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  score += (keywordCount / rules.requiredKeywords.length) * 40;
  
  // Action verbs and impact
  const actionVerbs = ['achieved', 'led', 'managed', 'developed', 'created', 'improved'];
  const hasActionVerbs = actionVerbs.some(verb => summary.toLowerCase().includes(verb));
  if (hasActionVerbs) score += 15;
  else issues.push('Include action verbs in summary');
  
  // Numbers/metrics
  const hasNumbers = /\d/.test(summary);
  if (hasNumbers) score += 15;
  else issues.push('Include quantifiable achievements');
  
  return { score: Math.min(100, score), issues };
};

const analyzeExperienceSection = (experience: any[], rules: any): { score: number; issues: string[] } => {
  if (!experience || experience.length === 0) {
    return { score: 0, issues: ['No work experience added'] };
  }
  
  let totalScore = 0;
  const issues: string[] = [];
  
  experience.forEach((exp, index) => {
    let expScore = 0;
    
    // Required fields
    if (exp.title && exp.company) expScore += 20;
    else issues.push(`Experience ${index + 1}: Missing title or company`);
    
    // Description quality
    if (exp.description && exp.description.length >= 150) expScore += 30;
    else issues.push(`Experience ${index + 1}: Description too short or missing`);
    
    // Keywords
    const keywordCount = rules.requiredKeywords.filter((keyword: string) => 
      exp.description?.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    expScore += (keywordCount / rules.requiredKeywords.length) * 25;
    
    // Quantifiable achievements - improved regex grouping
    const hasNumbers = /(\d+%|\$[\d,]+|\d+\+)/.test(exp.description || '');
    if (hasNumbers) expScore += 25;
    else issues.push(`Experience ${index + 1}: Add quantifiable achievements`);
    
    totalScore += expScore;
  });
  
  return { 
    score: Math.min(100, totalScore / experience.length), 
    issues: issues.slice(0, 5) // Limit issues shown
  };
};

const analyzeSkillsSection = (skills: any[], rules: any): { score: number; issues: string[] } => {
  if (!skills || skills.length === 0) {
    return { score: 0, issues: ['No skills added'] };
  }
  
  let score = 0;
  const issues: string[] = [];
  
  // Quantity check
  if (skills.length >= 8) score += 20;
  else issues.push(`Add more skills (current: ${skills.length}, recommended: 8+)`);
  
  // Technical skills match
  const techSkillMatches = skills.filter(skill => 
    rules.technicalSkills.some((techSkill: string) => 
      skill.name.toLowerCase().includes(techSkill.toLowerCase())
    )
  ).length;
  score += (techSkillMatches / Math.min(rules.technicalSkills.length, 10)) * 40;
  
  // Skill levels
  const hasLevels = skills.filter(skill => skill.level && skill.level !== 'beginner').length;
  score += (hasLevels / skills.length) * 20;
  
  // Category diversity
  const categories = [...new Set(skills.map(skill => skill.category))];
  if (categories.length >= 3) score += 20;
  else issues.push('Add skills from different categories (technical, soft, tools)');
  
  return { score: Math.min(100, score), issues };
};

const analyzeEducationSection = (education: any[], rules: any): { score: number; issues: string[] } => {
  let score = 50; // Base score for having any education
  const issues: string[] = [];
  
  if (!education || education.length === 0) {
    return { score: 30, issues: ['Consider adding education section'] };
  }
  
  education.forEach(edu => {
    if (edu.degree && edu.institution) score += 25;
    if (edu.field) score += 15;
    if (edu.graduationDate) score += 10;
  });
  
  return { score: Math.min(100, score), issues };
};

// Recommendation generators
const generateRecommendations = (analysis: AnalysisData, resumeData: any, rules: any): any[] => {
  const recommendations = [];
  
  // Overall score recommendations
  if (analysis.overallScore < 70) {
    recommendations.push({
      priority: 'high',
      category: 'Overall',
      title: 'Improve Overall ATS Score',
      description: 'Your resume needs significant improvements to pass ATS screening.',
      action: 'Focus on keyword optimization and content quality.',
      impact: 'High'
    });
  }
  
  // Keyword recommendations
  if (analysis.keywordAnalysis.requiredFound < rules.requiredKeywords.length * 0.8) {
    recommendations.push({
      priority: 'high',
      category: 'Keywords',
      title: 'Add Missing Industry Keywords',
      description: `Missing ${rules.requiredKeywords.length - analysis.keywordAnalysis.requiredFound} required keywords.`,
      action: `Include: ${rules.requiredKeywords.slice(0, 3).join(', ')}`,
      impact: 'High'
    });
  }
  
  // Section-specific recommendations
  Object.entries(analysis.sectionScores).forEach(([section, data]) => {
    if ((data as any)?.score < 70) {
      recommendations.push({
        priority: (data as any)?.score < 50 ? 'high' : 'medium',
        category: section.charAt(0).toUpperCase() + section.slice(1),
        title: `Improve ${section} Section`,
        description: (data as any)?.issues?.[0] || `${section} section needs improvement`,
        action: `Review and enhance ${section} content`,
        impact: 'Medium'
      });
    }
  });
  
  return recommendations.slice(0, 8); // Limit to top 8
};

const generateStrengths = (analysis: AnalysisData, resumeData: any): string[] => {
  const strengths = [];
  
  if (analysis.overallScore >= 80) {
    strengths.push('Strong overall ATS compatibility');
  }
  
  // Fix: Guard against zero-length required keywords array
  if (analysis.keywordAnalysis.required.length > 0 && 
      analysis.keywordAnalysis.requiredFound >= analysis.keywordAnalysis.required.length * 0.8) {
    strengths.push('Good keyword optimization');
  }
  
  if (resumeData.skills && resumeData.skills.length >= 8) {
    strengths.push('Comprehensive skills section');
  }
  
  if (analysis.salaryImpact > 10000) {
    strengths.push('High-value skill set');
  }
  
  return strengths;
};

const generateWarnings = (analysis: AnalysisData, resumeData: any): string[] => {
  const warnings = [];
  
  if (analysis.overallScore < 60) {
    warnings.push('Low ATS score may prevent resume from reaching hiring managers');
  }
  
  if (!resumeData.personalInfo?.summary || resumeData.personalInfo.summary.length < 100) {
    warnings.push('Missing or insufficient professional summary');
  }
  
  if (!resumeData.experience || resumeData.experience.length === 0) {
    warnings.push('No work experience listed');
  }
  
  return warnings;
};

const generateCriticalIssues = (analysis: AnalysisData, resumeData: any): string[] => {
  const issues = [];
  
  if (!resumeData.personalInfo?.firstName || !resumeData.personalInfo?.lastName) {
    issues.push('Missing contact information');
  }
  
  if (!resumeData.personalInfo?.email) {
    issues.push('Missing email address');
  }
  
  if (analysis.overallScore < 40) {
    issues.push('Resume unlikely to pass ATS screening');
  }
  
  return issues;
};

// Score color helper
const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

// Main component
export default function ResumeAnalyzer({ 
  resumeData = {},
  industry = 'Software Engineer',
  onRecommendationClick = () => {},
  showDetailedView = true,
  className = ''
}: ResumeAnalyzerProps) {
  // Initialize with safe default structure to prevent undefined references
  const [analysis, setAnalysis] = useState<AnalysisData>({
    overallScore: 0,
    sectionScores: {},
    recommendations: [],
    strengths: [],
    warnings: [],
    criticalIssues: [],
    keywordAnalysis: { required: [], preferred: [], requiredFound: 0, preferredFound: 0 },
    salaryImpact: 0,
    competitiveRanking: 'Analyzing...'
  });
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Check if sharing is supported
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  // Memoized analysis to prevent unnecessary recalculations
  const analysisData: AnalysisData = useMemo(() => {
    return analyzeResume(resumeData, industry);
  }, [resumeData, industry]);

  useEffect(() => {
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      setAnalysis(analysisData);
      setIsAnalyzing(false);
    }, 800); // Simulate analysis time
    
    return () => clearTimeout(timer);
  }, [analysisData]);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(analyzeResume(resumeData, industry));
      setIsAnalyzing(false);
    }, 800);
  };

  const handleShare = async () => {
    const shareText = `My resume scored ${analysis.overallScore}% for ATS compatibility`;
    
    if (canShare) {
      try {
        await navigator.share({
          title: 'My ATS Analysis Report',
          text: shareText
        });
      } catch (error) {
        // User cancelled or other error, try clipboard fallback
        handleClipboardCopy(shareText);
      }
    } else {
      handleClipboardCopy(shareText);
    }
  };

  const handleClipboardCopy = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      // Would be better with a toast notification instead of alert
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { message: 'Analysis summary copied to clipboard!', type: 'success' }
        }));
      }
    } catch (error) {
      // Fallback for very old browsers
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { message: 'Sharing not supported on this browser', type: 'error' }
        }));
      }
    }
  };

  const handleExportReport = () => {
    setShowExportModal(true);
  };

  if (isAnalyzing) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3 py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">Analyzing Resume...</h3>
            <p className="text-sm text-gray-600">Running advanced ATS compatibility check</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'sections', label: 'Section Scores', icon: BarChart3 },
    { id: 'keywords', label: 'Keywords', icon: Search },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'salary', label: 'Salary Impact', icon: DollarSign }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreColor(analysis.overallScore)}`}>
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ATS Compatibility Score</h3>
              <p className="text-sm text-gray-600">Advanced resume analysis for {industry}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className={`text-3xl font-bold ${analysis.overallScore >= 80 ? 'text-green-600' : analysis.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {analysis.overallScore}%
              </div>
              <div className="text-sm text-gray-600">{analysis.competitiveRanking}</div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={runAnalysis}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Re-analyze"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleExportReport}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Export report"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className={`p-2 transition-colors ${canShare || navigator.clipboard ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
                title={canShare ? "Share" : navigator.clipboard ? "Copy to clipboard" : "Sharing not supported"}
                disabled={!canShare && !navigator.clipboard}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            {analysis.keywordAnalysis.required.length > 0 ? (
              <>
                <div className="text-lg font-semibold text-gray-900">
                  {analysis.keywordAnalysis.requiredFound}/{analysis.keywordAnalysis.required.length}
                </div>
                <div className="text-xs text-gray-600">Required Keywords</div>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-gray-400">N/A</div>
                <div className="text-xs text-gray-500">Required Keywords</div>
              </>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">{analysis.strengths.length}</div>
            <div className="text-xs text-gray-600">Strengths Found</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">{analysis.recommendations.length}</div>
            <div className="text-xs text-gray-600">Recommendations</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-semibold text-gray-900">${Math.round(analysis.salaryImpact / 1000)}K</div>
            <div className="text-xs text-gray-600">Salary Impact</div>
          </div>
        </div>

        {/* Critical issues alert */}
        {analysis.criticalIssues.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Critical Issues Found</h4>
                <ul className="mt-1 text-sm text-red-700 space-y-1">
                  {analysis.criticalIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Score breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Score Breakdown</h4>
              <div className="space-y-3">
                {Object.entries(analysis.sectionScores).map(([section, data]) => (
                  <div key={section} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{section}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${data.score >= 80 ? 'bg-green-500' : data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, Math.max(0, data.score))}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{data.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Resume Strengths
                </h4>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-green-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  Areas for Improvement
                </h4>
                <div className="space-y-2">
                  {analysis.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-yellow-700">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'sections' && (
          <div className="space-y-6">
            {Object.entries(analysis.sectionScores).map(([section, data]) => (
              <div key={section} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 capitalize">{section}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                </div>
                {data.issues && data.issues.length > 0 && (
                  <div className="space-y-1">
                    {data.issues.map((issue, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'keywords' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Required Keywords</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.keywordAnalysis.required.map((kw, index) => (
                  <div key={`required-${kw.keyword}-${index}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{kw.keyword}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{kw.count}x</span>
                      {kw.count > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Preferred Keywords</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.keywordAnalysis.preferred.map((kw, index) => (
                  <div key={`preferred-${kw.keyword}-${index}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{kw.keyword}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{kw.count}x</span>
                      {kw.count > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'recommendations' && (
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div 
                key={`recommendation-${rec.category}-${rec.title}-${index}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => onRecommendationClick(rec)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{rec.category}</span>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-1">{rec.title}</h5>
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    <p className="text-sm font-medium text-blue-600">{rec.action}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-xs text-gray-500">Impact: {rec.impact}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'salary' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Estimated Salary Impact</h4>
                  <p className="text-sm text-green-700">Based on your current skill set in {industry}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-2">
                +${analysis.salaryImpact.toLocaleString()}
              </div>
              <p className="text-sm text-green-700">
                Annual salary increase potential compared to baseline position
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">High-Value Skills You Have</h4>
              <div className="space-y-3">
                {(resumeData.skills || [])
                  .map((skill, index) => ({
                    skill,
                    index,
                    salaryData: findSalaryImpact(skill.name, industryAnalysisRules[industry])
                  }))
                  .filter(({ salaryData }) => salaryData !== null)
                  .map(({ skill, index, salaryData }) => (
                    <div key={`salary-skill-${skill.name}-${index}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          skill.level === 'expert' ? 'bg-purple-100 text-purple-700' :
                          skill.level === 'advanced' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        +${salaryData.impact?.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">💡 Salary Optimization Tips</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Focus on high-demand skills in your industry</li>
                <li>• Quantify your achievements with specific metrics</li>
                <li>• Consider pursuing certifications that command salary premiums</li>
                <li>• Keep skills current with industry trends</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Analysis Report</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300">
                <span>PDF Report</span>
                <FileText className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300">
                <span>Email Report</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-6 flex space-x-3">
              <button 
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}