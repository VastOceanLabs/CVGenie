/**
 * ATS (Applicant Tracking System) Analyzer Utility
 * Analyzes resumes for ATS compatibility and provides optimization suggestions
 */

// Configuration constants
const SCORING_WEIGHTS = {
  PERSONAL_INFO: 0.25,    // 25%
  EXPERIENCE: 0.35,       // 35%
  SKILLS: 0.25,           // 25%
  EDUCATION: 0.10,        // 10%
  CERTIFICATIONS: 0.05    // 5%
} as const;

const SCORING_BONUSES = {
  SUMMARY_LENGTH: 30,
  KEYWORD_DENSITY: 40,
  ACTION_VERBS: 20,
  METRICS: 15,
  PROFESSIONAL_LINKS: 10,
  DIVERSE_SKILLS: 15,
  SKILL_LEVELS: 15,
  RELEVANT_EDUCATION: 20,
  HONORS_GPA: 10,
  RELEVANT_CERTIFICATIONS: 15
} as const;

const MINIMUM_LENGTHS = {
  SUMMARY: 100,
  EXPERIENCE_DESCRIPTION: 150,
  TOTAL_EXPERIENCE: 300,
  SKILLS_COUNT: 8,
  SECTION_COUNT: 4
} as const;

const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  NEEDS_IMPROVEMENT: 40
} as const;

// Types
interface ATSAnalysisResult {
  overallScore: number;
  sections: {
    personalInfo: SectionAnalysis;
    experience: SectionAnalysis;
    skills: SectionAnalysis;
    education: SectionAnalysis;
    certifications: SectionAnalysis;
  };
  suggestions: ATSSuggestion[];
  keywords: {
    found: string[];
    missing: string[];
    total: number;
  };
  metrics: {
    hasQuantifiedAchievements: boolean;
    quantifiedCount: number;
    actionVerbsCount: number;
    avgSectionLength: number;
  };
}

interface SectionAnalysis {
  score: number;
  completeness: number;
  keywordDensity: number;
  hasMetrics: boolean;
  suggestions: string[];
  status: 'excellent' | 'good' | 'needs-improvement' | 'missing';
}

interface ATSSuggestion {
  id: string;
  category: 'keywords' | 'formatting' | 'content' | 'structure' | 'metrics';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  section: string;
  impact: number; // Expected score improvement
}

interface IndustryData {
  technical: string[];
  skills: string[];
  action: string[];
}

interface ResumePersonalInfo {
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

interface ResumeExperienceEntry {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface ResumeEducationEntry {
  institution?: string;
  degree?: string;
  field?: string;
  graduationDate?: string;
  gpa?: string;
  honors?: string;
  coursework?: string;
  location?: string;
  current?: boolean;
  type?: string;
}

interface ResumeSkillEntry {
  name?: string;
  category?: 'technical' | 'soft' | 'tools' | 'certifications';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: string;
  featured?: boolean;
}

interface ResumeCertificationEntry {
  name?: string;
  issuer?: string;
  dateObtained?: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  status?: 'valid' | 'expired' | 'in-progress' | 'pending';
  description?: string;
}

interface ResumeData {
  personalInfo: ResumePersonalInfo;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  skills: ResumeSkillEntry[];
  certifications: ResumeCertificationEntry[];
}

// Fixed: Added proper interface for sections analysis
interface SectionsAnalysis {
  personalInfo: SectionAnalysis;
  experience: SectionAnalysis;
  skills: SectionAnalysis;
  education: SectionAnalysis;
  certifications: SectionAnalysis;
}

// Fixed: Added proper interface for keywords analysis
interface KeywordsAnalysis {
  found: string[];
  missing: string[];
  total: number;
}

// Fixed: Added proper interface for metrics analysis
interface MetricsAnalysis {
  hasQuantifiedAchievements: boolean;
  quantifiedCount: number;
  actionVerbsCount: number;
  avgSectionLength: number;
}

// Industry-specific keywords with proper typing
const industryKeywords: Record<string, IndustryData> = {
  'Software Engineer': {
    technical: [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker',
      'API', 'database', 'frontend', 'backend', 'full-stack', 'agile', 'scrum',
      'programming', 'development', 'coding', 'software', 'application'
    ],
    skills: [
      'problem-solving', 'debugging', 'code review', 'testing', 'optimization',
      'collaboration', 'mentoring', 'technical documentation', 'architecture'
    ],
    action: [
      'developed', 'built', 'implemented', 'designed', 'optimized', 'deployed',
      'maintained', 'integrated', 'automated', 'debugged', 'refactored'
    ]
  },
  'Marketing Manager': {
    technical: [
      'digital marketing', 'SEO', 'SEM', 'Google Analytics', 'social media',
      'content marketing', 'email marketing', 'PPC', 'conversion optimization',
      'brand management', 'campaign management', 'marketing automation'
    ],
    skills: [
      'strategic planning', 'data analysis', 'project management', 'creativity',
      'communication', 'leadership', 'budget management', 'customer insights'
    ],
    action: [
      'increased', 'improved', 'launched', 'managed', 'developed', 'executed',
      'analyzed', 'optimized', 'generated', 'grew', 'achieved'
    ]
  },
  'Project Manager': {
    technical: [
      'project management', 'Agile', 'Scrum', 'Kanban', 'PMP', 'risk management',
      'budget management', 'stakeholder management', 'resource allocation',
      'timeline management', 'quality assurance', 'change management'
    ],
    skills: [
      'leadership', 'communication', 'negotiation', 'problem-solving',
      'team building', 'conflict resolution', 'decision making', 'planning'
    ],
    action: [
      'led', 'managed', 'coordinated', 'delivered', 'planned', 'executed',
      'facilitated', 'organized', 'monitored', 'achieved', 'completed'
    ]
  },
  'Sales Representative': {
    technical: [
      'CRM', 'Salesforce', 'lead generation', 'pipeline management', 'forecasting',
      'account management', 'territory management', 'sales analytics', 'prospecting'
    ],
    skills: [
      'relationship building', 'negotiation', 'persuasion', 'communication',
      'customer service', 'goal-oriented', 'resilience', 'active listening'
    ],
    action: [
      'achieved', 'exceeded', 'generated', 'closed', 'prospected', 'built',
      'maintained', 'negotiated', 'presented', 'converted', 'grew'
    ]
  },
  'Nurse': {
    technical: [
      'patient care', 'medication administration', 'IV therapy', 'wound care',
      'vital signs', 'EHR', 'electronic health records', 'clinical documentation',
      'infection control', 'patient assessment', 'emergency response'
    ],
    skills: [
      'compassionate care', 'critical thinking', 'communication', 'attention to detail',
      'time management', 'teamwork', 'stress management', 'empathy'
    ],
    action: [
      'provided', 'administered', 'assessed', 'monitored', 'educated', 'supported',
      'collaborated', 'documented', 'implemented', 'maintained', 'ensured'
    ]
  },
  'Electrician': {
    technical: [
      'electrical installation', 'wiring', 'circuit analysis', 'troubleshooting',
      'electrical code', 'safety compliance', 'motor controls', 'panel installation',
      'conduit', 'voltage testing', 'blueprint reading', 'power distribution'
    ],
    skills: [
      'safety compliance', 'problem-solving', 'attention to detail', 'manual dexterity',
      'physical stamina', 'customer service', 'time management', 'reliability'
    ],
    action: [
      'installed', 'maintained', 'repaired', 'troubleshot', 'tested', 'inspected',
      'upgraded', 'replaced', 'configured', 'diagnosed', 'completed'
    ]
  }
};

// Common action verbs for all industries
const commonActionVerbs = [
  'achieved', 'improved', 'increased', 'reduced', 'managed', 'led', 'developed',
  'created', 'implemented', 'designed', 'built', 'established', 'launched',
  'delivered', 'executed', 'coordinated', 'supervised', 'trained', 'mentored',
  'collaborated', 'facilitated', 'organized', 'streamlined', 'optimized'
];

// Fixed: Removed unnecessary escape characters in regex patterns
const createMetricsPatterns = (): RegExp[] => [
  /\d+\s*%/g, // Percentages: 25%, 30 %
  /\$\s*\d+[\d,]*(?:\.\d+)?[KMB]?/g, // Money: $50K, $1.2M, $500
  /\d+[\d,]*\+?\s*(?:users?|customers?|clients?|people|employees?|team members?)/gi,
  /\d+[\d,]*\s*(?:hours?|days?|weeks?|months?|years?)/gi,
  /increased?.*?by\s*\d+/gi,
  /reduced?.*?by\s*\d+/gi,
  /improved?.*?by\s*\d+/gi,
  /grew.*?by\s*\d+/gi,
  /\d+[\d,]*\s*(?:projects?|initiatives?|campaigns?|products?)/gi,
  /save[ds]?\s*\$?\d+/gi,
  /revenue.*?\$?\d+/gi,
  /budget.*?\$?\d+/gi
];

/**
 * Main ATS Analyzer Class
 */
export class ATSAnalyzer {
  private resumeData: ResumeData;
  private jobTitle: string;
  private industryData: IndustryData;
  private cachedLowerText: string | null = null;

  constructor(resumeData: ResumeData, jobTitle?: string) {
    this.resumeData = resumeData;
    this.jobTitle = this.detectJobTitle(resumeData, jobTitle);
    this.industryData = this.getIndustryData(this.jobTitle);
  }

  /**
   * Perform complete ATS analysis
   */
  public analyze(): ATSAnalysisResult {
    const personalInfoAnalysis = this.analyzePersonalInfo();
    const experienceAnalysis = this.analyzeExperience();
    const skillsAnalysis = this.analyzeSkills();
    const educationAnalysis = this.analyzeEducation();
    const certificationsAnalysis = this.analyzeCertifications();

    const keywordAnalysis = this.analyzeKeywords();
    const metricsAnalysis = this.analyzeMetrics();
    
    // Calculate overall score with proper weights
    const sectionScores = [
      personalInfoAnalysis.score * SCORING_WEIGHTS.PERSONAL_INFO,    // 25%
      experienceAnalysis.score * SCORING_WEIGHTS.EXPERIENCE,        // 35%
      skillsAnalysis.score * SCORING_WEIGHTS.SKILLS,               // 25%
      educationAnalysis.score * SCORING_WEIGHTS.EDUCATION,         // 10%
      certificationsAnalysis.score * SCORING_WEIGHTS.CERTIFICATIONS // 5%
    ];

    const rawScore = sectionScores.reduce((sum, score) => sum + score, 0);
    const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    // Generate suggestions with proper typing
    const sectionsAnalysis: SectionsAnalysis = {
      personalInfo: personalInfoAnalysis,
      experience: experienceAnalysis,
      skills: skillsAnalysis,
      education: educationAnalysis,
      certifications: certificationsAnalysis
    };

    const suggestions = this.generateSuggestions(
      sectionsAnalysis,
      keywordAnalysis,
      metricsAnalysis
    );

    return {
      overallScore: clampedScore,
      sections: sectionsAnalysis,
      suggestions,
      keywords: keywordAnalysis,
      metrics: metricsAnalysis
    };
  }

  /**
   * Detect job title from resume data
   */
  private detectJobTitle(resumeData: ResumeData, providedTitle?: string): string {
    if (providedTitle) return providedTitle;
    if (resumeData.personalInfo?.jobTitle) return resumeData.personalInfo.jobTitle;
    
    // Try to detect from experience
    if (resumeData.experience?.length > 0) {
      return resumeData.experience[0]?.title || 'Software Engineer';
    }
    
    return 'Software Engineer'; // Default fallback
  }

  /**
   * Get industry-specific data with proper typing
   */
  private getIndustryData(jobTitle: string): IndustryData {
    // Find matching industry
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (jobTitle.toLowerCase().includes(industry.toLowerCase()) || 
          industry.toLowerCase().includes(jobTitle.toLowerCase())) {
        return keywords;
      }
    }
    
    // Default to software engineer if no match
    return industryKeywords['Software Engineer'];
  }

  /**
   * Analyze Personal Information section
   */
  private analyzePersonalInfo(): SectionAnalysis {
    const info = this.resumeData.personalInfo || {};
    const suggestions: string[] = [];
    let score = 0;
    let completeness = 0;

    // Required fields check
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const completedRequired = requiredFields.filter(field => info[field as keyof typeof info]).length;
    completeness = (completedRequired / requiredFields.length) * 100;
    score += completeness * 0.4; // 40% for basic completeness

    // Email format validation
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      suggestions.push('Use a professional email address format');
      score -= 10;
    }

    // Fixed: Improved phone format check without unnecessary escapes
    if (info.phone && !/^[\d\s\-()]{10,}$/.test(info.phone)) {
      suggestions.push('Format phone number clearly (e.g., (555) 123-4567)');
    }

    // Summary analysis
    const summaryScore = this.analyzeSummary(info.summary || '');
    score += summaryScore * 0.6; // 60% for summary quality

    if (!info.summary || info.summary.length < MINIMUM_LENGTHS.SUMMARY) {
      suggestions.push(`Add a professional summary (minimum ${MINIMUM_LENGTHS.SUMMARY} characters)`);
    }

    // Professional links
    if (info.linkedin || info.website) {
      score += SCORING_BONUSES.PROFESSIONAL_LINKS;
    } else {
      suggestions.push('Add LinkedIn profile or professional website');
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score: finalScore,
      completeness: Math.round(completeness),
      keywordDensity: this.calculateKeywordDensity(info.summary || ''),
      hasMetrics: this.hasMetrics(info.summary || ''),
      suggestions,
      status: this.getStatus(finalScore)
    };
  }

  /**
   * Analyze summary content
   */
  private analyzeSummary(summary: string): number {
    if (!summary) return 0;
    
    let score = 0;
    const length = summary.length;
    
    // Length scoring
    if (length >= MINIMUM_LENGTHS.SUMMARY) {
      score += SCORING_BONUSES.SUMMARY_LENGTH;
    } else {
      score += (length / MINIMUM_LENGTHS.SUMMARY) * SCORING_BONUSES.SUMMARY_LENGTH;
    }

    // Keyword density
    const keywordDensity = this.calculateKeywordDensity(summary);
    score += keywordDensity * 0.4; // Up to 40 points for keywords

    // Action verbs
    const actionVerbCount = this.countActionVerbs(summary);
    score += Math.min(actionVerbCount * 5, SCORING_BONUSES.ACTION_VERBS);

    // Metrics
    if (this.hasMetrics(summary)) {
      score += SCORING_BONUSES.METRICS - 5; // Slightly less for summary metrics
    }

    return score;
  }

  /**
   * Analyze Experience section
   */
  private analyzeExperience(): SectionAnalysis {
    const experience = this.resumeData.experience || [];
    const suggestions: string[] = [];
    let score = 0;
    let totalKeywordDensity = 0;
    let hasMetrics = false;

    if (experience.length === 0) {
      return {
        score: 0,
        completeness: 0,
        keywordDensity: 0,
        hasMetrics: false,
        suggestions: ['Add at least one work experience entry'],
        status: 'missing'
      };
    }

    // Analyze each experience entry
    experience.forEach((exp, index) => {
      const expSuggestions: string[] = [];
      let expScore = 0;

      // Required fields
      if (!exp.title) expSuggestions.push(`Add job title for position ${index + 1}`);
      if (!exp.company) expSuggestions.push(`Add company name for position ${index + 1}`);
      if (!exp.description) expSuggestions.push(`Add job description for position ${index + 1}`);

      // Description quality
      if (exp.description) {
        const descLength = exp.description.length;
        if (descLength >= MINIMUM_LENGTHS.EXPERIENCE_DESCRIPTION) {
          expScore += 25;
        } else {
          expScore += (descLength / MINIMUM_LENGTHS.EXPERIENCE_DESCRIPTION) * 25;
          expSuggestions.push(`Expand description for ${exp.title || 'position'} (minimum ${MINIMUM_LENGTHS.EXPERIENCE_DESCRIPTION} characters)`);
        }

        // Keyword analysis
        const keywordDensity = this.calculateKeywordDensity(exp.description);
        totalKeywordDensity += keywordDensity;
        expScore += keywordDensity * 0.3;

        // Metrics analysis
        if (this.hasMetrics(exp.description)) {
          hasMetrics = true;
          expScore += SCORING_BONUSES.METRICS;
        } else {
          expSuggestions.push(`Add quantified achievements to ${exp.title || 'position'} (e.g., percentages, dollar amounts, team sizes)`);
        }

        // Action verbs
        const actionVerbCount = this.countActionVerbs(exp.description);
        expScore += Math.min(actionVerbCount * 2, 10);
        
        if (actionVerbCount === 0) {
          expSuggestions.push(`Start bullet points with strong action verbs for ${exp.title || 'position'}`);
        }
      }

      // Date validation and formatting
      if (!exp.startDate) {
        expSuggestions.push(`Add start date for ${exp.title || 'position'}`);
      } else if (!this.isValidDate(exp.startDate)) {
        expSuggestions.push(`Use valid date format for start date of ${exp.title || 'position'}`);
      }

      if (!exp.current && !exp.endDate) {
        expSuggestions.push(`Add end date for ${exp.title || 'position'} or mark as current`);
      } else if (exp.endDate && !this.isValidDate(exp.endDate)) {
        expSuggestions.push(`Use valid date format for end date of ${exp.title || 'position'}`);
      }

      score += expScore;
      suggestions.push(...expSuggestions);
    });

    // Average the score
    score = score / experience.length;
    const avgKeywordDensity = totalKeywordDensity / experience.length;
    
    // Completeness based on required fields
    const totalRequiredFields = experience.length * 4; // title, company, description, dates
    const completedFields = experience.reduce((count, exp) => {
      let fieldCount = 0;
      if (exp.title) fieldCount++;
      if (exp.company) fieldCount++;
      if (exp.description) fieldCount++;
      if (exp.startDate && (exp.endDate || exp.current)) fieldCount++;
      return count + fieldCount;
    }, 0);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score: finalScore,
      completeness: Math.round((completedFields / totalRequiredFields) * 100),
      keywordDensity: Math.round(avgKeywordDensity),
      hasMetrics,
      suggestions,
      status: this.getStatus(finalScore)
    };
  }

  /**
   * Analyze Skills section
   */
  private analyzeSkills(): SectionAnalysis {
    const skills = this.resumeData.skills || [];
    const suggestions: string[] = [];
    let score = 0;

    if (skills.length === 0) {
      return {
        score: 0,
        completeness: 0,
        keywordDensity: 0,
        hasMetrics: false,
        suggestions: ['Add relevant skills to showcase your capabilities'],
        status: 'missing'
      };
    }

    // Quantity scoring
    const skillCount = skills.length;
    if (skillCount >= MINIMUM_LENGTHS.SKILLS_COUNT) {
      score += 30;
    } else {
      score += (skillCount / MINIMUM_LENGTHS.SKILLS_COUNT) * 30;
      suggestions.push(`Add more skills (recommended: ${MINIMUM_LENGTHS.SKILLS_COUNT}+, current: ${skillCount})`);
    }

    // Relevance scoring
    const skillNames = skills.map(skill => skill.name || '').filter(Boolean);
    const skillNamesText = skillNames.join(' ');
    const relevantSkills = this.findRelevantKeywords(skillNamesText);
    
    // Fixed: Handle division by zero
    const totalTechnicalSkills = this.industryData.technical?.length || 1;
    const relevanceScore = Math.min((relevantSkills.length / totalTechnicalSkills) * 40, 40);
    score += relevanceScore;

    if (relevantSkills.length < 3) {
      suggestions.push('Add more industry-relevant technical skills');
    }

    // Skill categorization
    const categories = new Set(skills.map(skill => skill.category).filter(Boolean));
    if (categories.size >= 2) {
      score += SCORING_BONUSES.DIVERSE_SKILLS;
    } else {
      suggestions.push('Categorize skills (technical, soft skills, tools, etc.)');
    }

    // Skill levels
    const skillsWithLevels = skills.filter(skill => skill.level).length;
    if (skillCount > 0 && skillsWithLevels / skillCount > 0.5) {
      score += SCORING_BONUSES.SKILL_LEVELS;
    } else {
      suggestions.push('Add proficiency levels to your skills');
    }

    // Fixed: Handle division by zero for keyword density
    const keywordDensity = skillNames.length > 0 ? 
      Math.round((relevantSkills.length / skillNames.length) * 100) : 0;

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score: finalScore,
      completeness: Math.round((skillNames.length / skillCount) * 100),
      keywordDensity,
      hasMetrics: false,
      suggestions,
      status: this.getStatus(finalScore)
    };
  }

  /**
   * Analyze Education section
   */
  private analyzeEducation(): SectionAnalysis {
    const education = this.resumeData.education || [];
    const suggestions: string[] = [];
    let score = 60; // Start with base score since education is often optional

    if (education.length === 0) {
      suggestions.push('Consider adding education background if relevant');
      return {
        score: 50, // Neutral score for missing education
        completeness: 0,
        keywordDensity: 0,
        hasMetrics: false,
        suggestions,
        status: 'missing'
      };
    }

    education.forEach((edu, index) => {
      if (!edu.institution) suggestions.push(`Add institution name for education ${index + 1}`);
      if (!edu.degree) suggestions.push(`Add degree type for education ${index + 1}`);
      if (!edu.field) suggestions.push(`Add field of study for education ${index + 1}`);
      if (!edu.graduationDate) {
        suggestions.push(`Add graduation date for education ${index + 1}`);
      } else if (!this.isValidDate(edu.graduationDate)) {
        suggestions.push(`Use valid date format for graduation date in education ${index + 1}`);
      }

      // Bonus for relevant education
      if (edu.field && this.isRelevantField(edu.field)) {
        score += SCORING_BONUSES.RELEVANT_EDUCATION;
      }

      // Bonus for honors/GPA if included
      if (edu.gpa || edu.honors) {
        score += SCORING_BONUSES.HONORS_GPA;
      }
    });

    const totalFields = education.length * 4;
    const completedFields = education.reduce((count, edu) => {
      let fieldCount = 0;
      if (edu.institution) fieldCount++;
      if (edu.degree) fieldCount++;
      if (edu.field) fieldCount++;
      if (edu.graduationDate) fieldCount++;
      return count + fieldCount;
    }, 0);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score: finalScore,
      completeness: Math.round((completedFields / totalFields) * 100),
      keywordDensity: 0,
      hasMetrics: false,
      suggestions,
      status: this.getStatus(finalScore)
    };
  }

  /**
   * Analyze Certifications section
   */
  private analyzeCertifications(): SectionAnalysis {
    const certifications = this.resumeData.certifications || [];
    const suggestions: string[] = [];
    let score = 70; // Base score since certifications are often optional

    if (certifications.length === 0) {
      suggestions.push('Add relevant professional certifications if you have them');
      return {
        score: 60,
        completeness: 0,
        keywordDensity: 0,
        hasMetrics: false,
        suggestions,
        status: 'missing'
      };
    }

    certifications.forEach((cert, index) => {
      if (!cert.name) suggestions.push(`Add certification name for entry ${index + 1}`);
      if (!cert.issuer) suggestions.push(`Add issuing organization for certification ${index + 1}`);
      if (!cert.dateObtained) {
        suggestions.push(`Add date obtained for certification ${index + 1}`);
      } else if (!this.isValidDate(cert.dateObtained)) {
        suggestions.push(`Use valid date format for certification ${index + 1} date obtained`);
      }

      // Bonus for relevant certifications
      if (cert.name && this.isRelevantCertification(cert.name)) {
        score += SCORING_BONUSES.RELEVANT_CERTIFICATIONS;
      }

      // Check for expired certifications with proper date validation
      if (cert.expirationDate && this.isValidDate(cert.expirationDate) && 
          new Date(cert.expirationDate) < new Date()) {
        suggestions.push(`Update or renew expired certification: ${cert.name}`);
        score -= 5;
      }
    });

    const totalFields = certifications.length * 3;
    const completedFields = certifications.reduce((count, cert) => {
      let fieldCount = 0;
      if (cert.name) fieldCount++;
      if (cert.issuer) fieldCount++;
      if (cert.dateObtained) fieldCount++;
      return count + fieldCount;
    }, 0);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score: finalScore,
      completeness: Math.round((completedFields / totalFields) * 100),
      keywordDensity: 0,
      hasMetrics: false,
      suggestions,
      status: this.getStatus(finalScore)
    };
  }

  /**
   * Analyze keywords across entire resume
   */
  private analyzeKeywords(): KeywordsAnalysis {
    const allText = this.getAllResumeText();
    const found = this.findRelevantKeywords(allText);
    const missing = this.findMissingKeywords(allText);
    
    return {
      found,
      missing,
      total: found.length + missing.length
    };
  }

  /**
   * Analyze metrics and quantified achievements
   */
  private analyzeMetrics(): MetricsAnalysis {
    const allText = this.getAllResumeText();
    const metrics = this.extractMetrics(allText);
    const actionVerbs = this.countActionVerbs(allText);
    
    // Fixed: Better calculation of average section length
    const sections = [
      this.resumeData.personalInfo?.summary || '',
      ...(this.resumeData.experience || []).map(exp => exp.description || ''),
      ...(this.resumeData.skills || []).map(skill => skill.name || ''),
      ...(this.resumeData.certifications || []).map(cert => cert.name || '')
    ].filter(section => section.length > 0);
    
    const avgSectionLength = sections.length > 0 ? 
      Math.round(sections.reduce((sum, section) => sum + section.length, 0) / sections.length) : 0;
    
    return {
      hasQuantifiedAchievements: metrics.length > 0,
      quantifiedCount: metrics.length,
      actionVerbsCount: actionVerbs,
      avgSectionLength
    };
  }

  /**
   * Fixed: Generate improvement suggestions with proper typing
   */
  private generateSuggestions(
    sections: SectionsAnalysis,
    keywords: KeywordsAnalysis,
    metrics: MetricsAnalysis
  ): ATSSuggestion[] {
    const suggestions: ATSSuggestion[] = [];
    let suggestionId = 1;

    // High priority suggestions
    if (sections.personalInfo.score < SCORE_THRESHOLDS.GOOD) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        category: 'content',
        priority: 'high',
        title: 'Improve Personal Information',
        description: 'Your contact information and summary need improvement',
        action: 'Complete all required fields and write a compelling professional summary',
        section: 'personalInfo',
        impact: 15
      });
    }

    if (sections.experience.score < SCORE_THRESHOLDS.GOOD) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        category: 'content',
        priority: 'high',
        title: 'Enhance Work Experience',
        description: 'Your work experience section needs more detail and better formatting',
        action: 'Add quantified achievements and use strong action verbs',
        section: 'experience',
        impact: 20
      });
    }

    // Keyword suggestions
    if (keywords.missing.length > 3) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        category: 'keywords',
        priority: 'high',
        title: 'Add Industry Keywords',
        description: `Missing ${keywords.missing.length} relevant keywords`,
        action: `Include these keywords: ${keywords.missing.slice(0, 3).join(', ')}`,
        section: 'skills',
        impact: 12
      });
    }

    // Metrics suggestions
    if (metrics.quantifiedCount < 3) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        category: 'metrics',
        priority: 'medium',
        title: 'Add Quantified Achievements',
        description: 'Include more numbers and percentages to show impact',
        action: 'Add metrics like "increased sales by 25%" or "managed team of 10"',
        section: 'experience',
        impact: 10
      });
    }

    // Skills suggestions
    if (sections.skills.score < SCORE_THRESHOLDS.GOOD) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        category: 'content',
        priority: 'medium',
        title: 'Expand Skills Section',
        description: 'Add more relevant technical and soft skills',
        action: 'Include industry-specific skills and tools you use',
        section: 'skills',
        impact: 8
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Helper methods
   */
  private getAllResumeText(): string {
    // Cache the lowercase text to avoid repeated conversions
    if (this.cachedLowerText === null) {
      const parts = [
        this.resumeData.personalInfo?.summary || '',
        ...(this.resumeData.experience || []).map(exp => exp.description || ''),
        ...(this.resumeData.skills || []).map(skill => skill.name || ''),
        ...(this.resumeData.certifications || []).map(cert => cert.name || '')
      ];
      this.cachedLowerText = parts.join(' ').toLowerCase();
    }
    return this.cachedLowerText;
  }

  private calculateKeywordDensity(text: string): number {
    if (!text) return 0;
    const found = this.findRelevantKeywords(text);
    const totalKeywords = [
      ...(this.industryData.technical || []),
      ...(this.industryData.skills || []),
      ...(this.industryData.action || [])
    ].length;
    
    // Fixed: Handle division by zero
    return totalKeywords > 0 ? Math.round((found.length / totalKeywords) * 100) : 0;
  }

  private findRelevantKeywords(text: string): string[] {
    const lowerText = text.toLowerCase();
    const allKeywords = [
      ...(this.industryData.technical || []),
      ...(this.industryData.skills || []),
      ...(this.industryData.action || [])
    ];
    
    return allKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
  }

  private findMissingKeywords(text: string): string[] {
    const lowerText = text.toLowerCase();
    const allKeywords = [
      ...(this.industryData.technical || []),
      ...(this.industryData.skills || [])
    ];
    
    return allKeywords.filter(keyword => 
      !lowerText.includes(keyword.toLowerCase())
    ).slice(0, 10); // Limit to top 10 missing
  }

  private hasMetrics(text: string): boolean {
    const patterns = createMetricsPatterns();
    return patterns.some(pattern => {
      pattern.lastIndex = 0; // Fixed: Reset to avoid sticky behavior
      return pattern.test(text);
    });
  }

  private extractMetrics(text: string): string[] {
    const metrics: string[] = [];
    const patterns = createMetricsPatterns();
    
    patterns.forEach(pattern => {
      pattern.lastIndex = 0; // Fixed: Reset to avoid sticky behavior
      const matches = text.match(pattern);
      if (matches) {
        metrics.push(...matches);
      }
    });
    
    // Fixed: Remove duplicates
    return Array.from(new Set(metrics));
  }

  private countActionVerbs(text: string): number {
    const lowerText = text.toLowerCase();
    const actionVerbs = [...(this.industryData.action || []), ...commonActionVerbs];
    
    // Fixed: Count actual occurrences, not just presence, removed unnecessary escapes
    return actionVerbs.reduce((count, verb) => {
      const regex = new RegExp(`\\b${verb.toLowerCase()}\\b`, 'gi');
      const matches = lowerText.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  private isRelevantField(field: string): boolean {
    const relevantFields = [
      'computer science', 'engineering', 'business', 'marketing', 'healthcare',
      'nursing', 'education', 'management', 'technology', 'science'
    ];
    return relevantFields.some(relevant => 
      field.toLowerCase().includes(relevant)
    );
  }

  private isRelevantCertification(certName: string): boolean {
    const lowerName = certName.toLowerCase();
    const techCerts = ['aws', 'microsoft', 'google', 'cisco', 'oracle', 'pmp'];
    return techCerts.some(cert => lowerName.includes(cert));
  }

  private isValidDate(dateString: string): boolean {
    // Fixed: Proper date validation
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.trim() !== '';
  }

  private getStatus(score: number): 'excellent' | 'good' | 'needs-improvement' | 'missing' {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) return 'excellent';
    if (score >= SCORE_THRESHOLDS.GOOD) return 'good';
    if (score >= SCORE_THRESHOLDS.NEEDS_IMPROVEMENT) return 'needs-improvement';
    return 'missing';
  }
}

/**
 * Convenience function for quick analysis
 */
export function analyzeResume(resumeData: ResumeData, jobTitle?: string): ATSAnalysisResult {
  const analyzer = new ATSAnalyzer(resumeData, jobTitle);
  return analyzer.analyze();
}

/**
 * Quick ATS score calculation
 */
export function calculateATSScore(resumeData: ResumeData, jobTitle?: string): number {
  const analyzer = new ATSAnalyzer(resumeData, jobTitle);
  return analyzer.analyze().overallScore;
}

/**
 * Get industry-specific keyword suggestions
 */
export function getKeywordSuggestions(jobTitle: string): string[] {
  const analyzer = new ATSAnalyzer({} as ResumeData, jobTitle);
  const industryData = (analyzer as any).industryData;
  return [
    ...(industryData.technical || []),
    ...(industryData.skills || [])
  ].slice(0, 15);
}

export default ATSAnalyzer;