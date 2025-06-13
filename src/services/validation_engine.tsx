import { ResumeData, PersonalInfo, Experience, Education, Skill, Certification } from '../types/resume';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

// Validation thresholds
const VALIDATION_THRESHOLDS = {
  SUMMARY_MIN_LENGTH: 100,
  SUMMARY_MAX_LENGTH: 400,
  DESCRIPTION_MIN_LENGTH: 150,
  DESCRIPTION_MAX_LENGTH: 1000,
  MINIMUM_SKILLS: 5,
  PHONE_MIN_DIGITS: 10,
  GPA_MIN: 0.0,
  GPA_MAX: 4.0,
  
  // ATS Scoring weights
  PERSONAL_INFO_WEIGHT: 0.25,
  EXPERIENCE_WEIGHT: 0.35,
  EDUCATION_WEIGHT: 0.15,
  SKILLS_WEIGHT: 0.20,
  CERTIFICATIONS_WEIGHT: 0.05,
  
  // Completion thresholds
  SECTION_COMPLETE_THRESHOLD: 80,
  EXPERIENCE_COMPLETE_THRESHOLD: 70,
} as const;

// Industry types for better type safety
type Industry = 
  | 'Software Engineer'
  | 'Electrician' 
  | 'Marketing Manager'
  | 'Nurse'
  | 'Project Manager'
  | 'Sales Representative';

// Validation patterns with improved regex
const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  PHONE: /^[\+]?[1-9][\d\s\-\(\)\.]{7,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,63}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
  GITHUB: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
  GPA: /^[0-4]\.\d{1,2}$|^[0-4]$/,
  QUANTIFIED_ACHIEVEMENT: /\d+[%$]?|\$[\d,]+|\d+\+|[+-]?\d+%/,
  FIRST_PERSON: /\b(I|me|my|myself)\b/i,
} as const;

// Industry-specific data with proper typing
const ATS_KEYWORDS: Record<Industry, readonly string[]> = {
  'Software Engineer': [
    'developed', 'built', 'implemented', 'designed', 'created', 'optimized', 'automated',
    'collaborated', 'led', 'improved', 'delivered', 'maintained', 'integrated', 'debugged'
  ],
  'Electrician': [
    'installed', 'maintained', 'repaired', 'troubleshot', 'wired', 'tested', 'inspected',
    'complied', 'followed', 'ensured', 'performed', 'completed', 'executed', 'operated'
  ],
  'Marketing Manager': [
    'managed', 'developed', 'launched', 'increased', 'generated', 'optimized', 'analyzed',
    'created', 'implemented', 'coordinated', 'executed', 'drove', 'achieved', 'exceeded'
  ],
  'Nurse': [
    'administered', 'provided', 'monitored', 'assessed', 'documented', 'collaborated', 'educated',
    'maintained', 'ensured', 'implemented', 'coordinated', 'supported', 'delivered', 'managed'
  ],
  'Project Manager': [
    'managed', 'led', 'coordinated', 'delivered', 'implemented', 'planned', 'executed',
    'facilitated', 'monitored', 'controlled', 'optimized', 'streamlined', 'improved', 'achieved'
  ],
  'Sales Representative': [
    'achieved', 'exceeded', 'generated', 'closed', 'managed', 'developed', 'built',
    'maintained', 'prospected', 'negotiated', 'presented', 'cultivated', 'drove', 'increased'
  ]
} as const;

const INDUSTRY_SKILLS: Record<Industry, readonly string[]> = {
  'Software Engineer': ['programming', 'development', 'coding', 'software', 'technical'],
  'Electrician': ['electrical', 'installation', 'maintenance', 'safety', 'troubleshooting'],
  'Marketing Manager': ['marketing', 'digital', 'campaigns', 'analytics', 'strategy'],
  'Nurse': ['patient care', 'clinical', 'healthcare', 'medical', 'nursing'],
  'Project Manager': ['project management', 'planning', 'coordination', 'leadership', 'delivery'],
  'Sales Representative': ['sales', 'revenue', 'client', 'relationship', 'negotiation']
} as const;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  suggestions: Record<string, string>;
  score: number;
}

export interface SectionValidation {
  section: string;
  isComplete: boolean;
  completionScore: number;
  atsScore: number;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  suggestions: Record<string, string>;
}

export interface FieldValidation {
  isValid: boolean;
  error?: string;
  warning?: string;
  suggestion?: string;
}

export interface KeywordAnalysis {
  score: number;
  foundKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  hasQuantifiedMetrics: boolean;
  hasActionVerbs: boolean;
}

export interface ResumeRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  action: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

class ValidationUtils {
  static isValidDate(dateString: string): boolean {
    if (!dateString?.trim()) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  static normalizeText(text: string): string {
    return text.toLowerCase().trim();
  }

  static getIndustryFromJobTitle(jobTitle: string): Industry {
    const title = this.normalizeText(jobTitle);
    
    if (title.includes('software') || title.includes('developer') || title.includes('engineer') || title.includes('programmer')) {
      return 'Software Engineer';
    }
    if (title.includes('electrician') || title.includes('electrical')) {
      return 'Electrician';
    }
    if (title.includes('marketing') || title.includes('brand') || title.includes('digital')) {
      return 'Marketing Manager';
    }
    if (title.includes('nurse') || title.includes('nursing') || title.includes('rn')) {
      return 'Nurse';
    }
    if (title.includes('project') && title.includes('manager')) {
      return 'Project Manager';
    }
    if (title.includes('sales') || title.includes('account') || title.includes('business development')) {
      return 'Sales Representative';
    }
    
    return 'Software Engineer'; // Default fallback
  }

  static safePercentage(numerator: number, denominator: number): number {
    return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

// ============================================================================
// FIELD VALIDATORS
// ============================================================================

class FieldValidator {
  static validateEmail(email: string): FieldValidation {
    if (!email?.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Check for unprofessional email providers
    if (email.includes('yahoo.com') || email.includes('hotmail.com')) {
      return { 
        isValid: true, 
        warning: 'Consider using a more professional email provider (Gmail, your domain)' 
      };
    }

    return { isValid: true };
  }

  static validatePhone(phone: string): FieldValidation {
    if (!phone?.trim()) {
      return { isValid: false, error: 'Phone number is required' };
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < VALIDATION_THRESHOLDS.PHONE_MIN_DIGITS) {
      return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }

    if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
      return { isValid: false, error: 'Please enter a valid phone number format' };
    }

    return { isValid: true };
  }

  static validateURL(url: string, urlType: 'website' | 'linkedin' | 'github' = 'website'): FieldValidation {
    if (!url?.trim()) {
      return { isValid: true }; // Optional field
    }

    const patterns = {
      website: VALIDATION_PATTERNS.URL,
      linkedin: VALIDATION_PATTERNS.LINKEDIN,
      github: VALIDATION_PATTERNS.GITHUB,
    };

    if (!patterns[urlType].test(url)) {
      return { isValid: false, error: `Please enter a valid ${urlType} URL` };
    }

    return { isValid: true };
  }

  static validateGPA(gpa: string): FieldValidation {
    if (!gpa?.trim()) {
      return { isValid: true }; // Optional field
    }

    if (!VALIDATION_PATTERNS.GPA.test(gpa)) {
      return { isValid: false, error: 'GPA must be between 0.0 and 4.0' };
    }

    const gpaNum = parseFloat(gpa);
    if (gpaNum < VALIDATION_THRESHOLDS.GPA_MIN || gpaNum > VALIDATION_THRESHOLDS.GPA_MAX) {
      return { isValid: false, error: 'GPA must be between 0.0 and 4.0' };
    }

    if (gpaNum < 3.5) {
      return { isValid: true, suggestion: 'Consider omitting GPA if below 3.5' };
    }

    return { isValid: true };
  }

  static validateDate(dateString: string, fieldName: string, required: boolean = false): FieldValidation {
    if (!dateString?.trim()) {
      return required 
        ? { isValid: false, error: `${fieldName} is required` }
        : { isValid: true };
    }

    if (!ValidationUtils.isValidDate(dateString)) {
      return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
    }

    return { isValid: true };
  }

  static validateContent(content: string, minLength: number, fieldName: string): FieldValidation {
    if (!content?.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (content.length < minLength) {
      return { 
        isValid: true, 
        warning: `${fieldName} should be at least ${minLength} characters for better impact` 
      };
    }

    if (VALIDATION_PATTERNS.FIRST_PERSON.test(content)) {
      return { 
        isValid: true, 
        suggestion: `Consider writing ${fieldName.toLowerCase()} in third person for a more professional tone` 
      };
    }

    return { isValid: true };
  }
}

// ============================================================================
// KEYWORD ANALYZER
// ============================================================================

class KeywordAnalyzer {
  private static normalizedKeywords = new Map<Industry, Set<string>>();

  static {
    // Pre-normalize keywords for performance
    Object.entries(ATS_KEYWORDS).forEach(([industry, keywords]) => {
      this.normalizedKeywords.set(
        industry as Industry, 
        new Set(keywords.map(k => k.toLowerCase()))
      );
    });
  }

  static analyzeContent(content: string, jobTitle?: string): KeywordAnalysis {
    const industry = jobTitle ? ValidationUtils.getIndustryFromJobTitle(jobTitle) : 'Software Engineer';
    const keywords = this.normalizedKeywords.get(industry) || new Set();
    const normalizedContent = ValidationUtils.normalizeText(content);

    const foundKeywords = Array.from(keywords).filter(keyword => 
      normalizedContent.includes(keyword)
    );

    const missingKeywords = Array.from(keywords).filter(keyword => 
      !normalizedContent.includes(keyword)
    );

    const hasQuantifiedMetrics = VALIDATION_PATTERNS.QUANTIFIED_ACHIEVEMENT.test(content);
    const hasActionVerbs = foundKeywords.length > 0;

    const score = ValidationUtils.safePercentage(foundKeywords.length, keywords.size);

    const suggestions: string[] = [];
    if (foundKeywords.length === 0) {
      suggestions.push(`Add action verbs like: ${Array.from(keywords).slice(0, 3).join(', ')}`);
    }
    if (!hasQuantifiedMetrics) {
      suggestions.push('Include quantified achievements with numbers or percentages');
    }
    if (content.length < VALIDATION_THRESHOLDS.DESCRIPTION_MIN_LENGTH) {
      suggestions.push(`Expand content to at least ${VALIDATION_THRESHOLDS.DESCRIPTION_MIN_LENGTH} characters for better ATS scoring`);
    }
    if (missingKeywords.length > 0) {
      suggestions.push(`Consider adding: ${missingKeywords.slice(0, 3).join(', ')}`);
    }

    return {
      score,
      foundKeywords,
      missingKeywords: missingKeywords.slice(0, 5),
      suggestions,
      hasQuantifiedMetrics,
      hasActionVerbs
    };
  }
}

// ============================================================================
// SECTION VALIDATORS
// ============================================================================

class PersonalInfoValidator {
  static validate(personalInfo: PersonalInfo): SectionValidation {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    const suggestions: Record<string, string> = {};

    // Required field validation
    if (!personalInfo.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!personalInfo.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }

    const emailValidation = FieldValidator.validateEmail(personalInfo.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    } else if (emailValidation.warning) {
      warnings.email = emailValidation.warning;
    }

    const phoneValidation = FieldValidator.validatePhone(personalInfo.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }

    // Optional but recommended fields
    if (!personalInfo.location?.trim()) {
      warnings.location = 'Adding your location helps with local job searches';
    }

    if (!personalInfo.linkedin?.trim()) {
      suggestions.linkedin = 'Adding a LinkedIn profile increases your credibility';
    } else {
      const linkedinValidation = FieldValidator.validateURL(personalInfo.linkedin, 'linkedin');
      if (!linkedinValidation.isValid) {
        errors.linkedin = linkedinValidation.error!;
      }
    }

    if (personalInfo.website) {
      const websiteValidation = FieldValidator.validateURL(personalInfo.website, 'website');
      if (!websiteValidation.isValid) {
        errors.website = websiteValidation.error!;
      }
    }

    // Professional Summary validation
    const summaryValidation = FieldValidator.validateContent(
      personalInfo.summary, 
      VALIDATION_THRESHOLDS.SUMMARY_MIN_LENGTH, 
      'Professional summary'
    );
    
    if (!summaryValidation.isValid) {
      errors.summary = summaryValidation.error!;
    } else if (summaryValidation.warning) {
      warnings.summary = summaryValidation.warning;
    } else if (summaryValidation.suggestion) {
      suggestions.summary = summaryValidation.suggestion;
    }

    if (personalInfo.summary && personalInfo.summary.length > VALIDATION_THRESHOLDS.SUMMARY_MAX_LENGTH) {
      warnings.summary = 'Summary should be under 400 characters to maintain reader attention';
    }

    // Job title validation
    if (!personalInfo.jobTitle?.trim()) {
      warnings.jobTitle = 'Adding a professional title helps ATS systems categorize your resume';
    }

    const completionScore = this.calculateCompletion(personalInfo);
    const atsScore = this.calculateATS(personalInfo);

    return {
      section: 'personalInfo',
      isComplete: Object.keys(errors).length === 0 && completionScore >= VALIDATION_THRESHOLDS.SECTION_COMPLETE_THRESHOLD,
      completionScore,
      atsScore,
      errors,
      warnings,
      suggestions
    };
  }

  private static calculateCompletion(personalInfo: PersonalInfo): number {
    let score = 0;
    const checks = [
      { field: personalInfo.firstName?.trim(), points: 15 },
      { field: personalInfo.lastName?.trim(), points: 15 },
      { field: personalInfo.email?.trim() && VALIDATION_PATTERNS.EMAIL.test(personalInfo.email), points: 15 },
      { field: personalInfo.phone?.trim(), points: 15 },
      { field: personalInfo.summary?.trim() && personalInfo.summary.length >= VALIDATION_THRESHOLDS.SUMMARY_MIN_LENGTH, points: 25 },
      { field: personalInfo.jobTitle?.trim(), points: 10 },
      { field: personalInfo.location?.trim(), points: 5 }
    ];

    checks.forEach(check => {
      if (check.field) score += check.points;
    });

    return ValidationUtils.clamp(score, 0, 100);
  }

  private static calculateATS(personalInfo: PersonalInfo): number {
    let score = 0;

    // Contact information completeness (40 points)
    if (personalInfo.firstName?.trim() && personalInfo.lastName?.trim()) score += 15;
    if (personalInfo.email?.trim() && VALIDATION_PATTERNS.EMAIL.test(personalInfo.email)) score += 15;
    if (personalInfo.phone?.trim()) score += 10;

    // Professional summary quality (40 points)
    if (personalInfo.summary?.trim()) {
      const summary = personalInfo.summary;
      score += 20; // Base score for having summary
      
      // Length bonus
      if (summary.length >= VALIDATION_THRESHOLDS.SUMMARY_MIN_LENGTH && 
          summary.length <= VALIDATION_THRESHOLDS.SUMMARY_MAX_LENGTH) {
        score += 10;
      }
      
      // Keyword analysis
      const keywordAnalysis = KeywordAnalyzer.analyzeContent(summary, personalInfo.jobTitle);
      score += Math.min(keywordAnalysis.score * 0.1, 10);
    }

    // Professional title (20 points)
    if (personalInfo.jobTitle?.trim()) score += 20;

    return ValidationUtils.clamp(score, 0, 100);
  }
}

class ExperienceValidator {
  static validate(experience: Experience[]): SectionValidation {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    const suggestions: Record<string, string> = {};

    if (!experience || experience.length === 0) {
      errors.general = 'At least one work experience entry is required';
      return {
        section: 'experience',
        isComplete: false,
        completionScore: 0,
        atsScore: 0,
        errors,
        warnings,
        suggestions
      };
    }

    experience.forEach((exp, index) => {
      const prefix = `experience_${index}`;

      // Required fields
      if (!exp.title?.trim()) {
        errors[`${prefix}_title`] = `Job title is required for position ${index + 1}`;
      }

      if (!exp.company?.trim()) {
        errors[`${prefix}_company`] = `Company name is required for position ${index + 1}`;
      }

      // Date validation
      const startDateValidation = FieldValidator.validateDate(exp.startDate, 'Start date', true);
      if (!startDateValidation.isValid) {
        errors[`${prefix}_startDate`] = startDateValidation.error!;
      }

      if (!exp.current) {
        const endDateValidation = FieldValidator.validateDate(exp.endDate, 'End date', true);
        if (!endDateValidation.isValid) {
          errors[`${prefix}_endDate`] = endDateValidation.error!;
        }
      }

      // Description validation
      const descValidation = FieldValidator.validateContent(
        exp.description, 
        VALIDATION_THRESHOLDS.DESCRIPTION_MIN_LENGTH, 
        'Job description'
      );
      
      if (!descValidation.isValid) {
        errors[`${prefix}_description`] = descValidation.error!;
      } else if (descValidation.warning) {
        warnings[`${prefix}_description_length`] = descValidation.warning;
      }

      if (exp.description?.trim()) {
        const keywordAnalysis = KeywordAnalyzer.analyzeContent(exp.description, exp.title);
        
        if (!keywordAnalysis.hasQuantifiedMetrics) {
          suggestions[`${prefix}_metrics`] = `Add quantified achievements to position ${index + 1} (e.g., "increased sales by 25%")`;
        }

        if (!keywordAnalysis.hasActionVerbs) {
          suggestions[`${prefix}_action_verbs`] = `Use strong action verbs in position ${index + 1} description`;
        }

        if (exp.description.toLowerCase().includes('responsible for')) {
          suggestions[`${prefix}_responsible_for`] = `Replace "responsible for" with action verbs in position ${index + 1}`;
        }
      }

      // Location validation
      if (!exp.location?.trim()) {
        warnings[`${prefix}_location`] = `Adding location for position ${index + 1} helps with geographic targeting`;
      }
    });

    const completionScore = this.calculateCompletion(experience);
    const atsScore = this.calculateATS(experience);

    return {
      section: 'experience',
      isComplete: Object.keys(errors).length === 0 && completionScore >= VALIDATION_THRESHOLDS.EXPERIENCE_COMPLETE_THRESHOLD,
      completionScore,
      atsScore,
      errors,
      warnings,
      suggestions
    };
  }

  private static calculateCompletion(experience: Experience[]): number {
    if (experience.length === 0) return 0;

    let totalScore = 0;
    const maxScorePerEntry = 100;

    experience.forEach(exp => {
      let entryScore = 0;
      if (exp.title?.trim()) entryScore += 20;
      if (exp.company?.trim()) entryScore += 20;
      if (ValidationUtils.isValidDate(exp.startDate)) entryScore += 15;
      if (exp.current || ValidationUtils.isValidDate(exp.endDate)) entryScore += 15;
      if (exp.description?.trim() && exp.description.length >= VALIDATION_THRESHOLDS.DESCRIPTION_MIN_LENGTH) entryScore += 30;

      totalScore += entryScore;
    });

    return ValidationUtils.safePercentage(totalScore, experience.length * maxScorePerEntry);
  }

  private static calculateATS(experience: Experience[]): number {
    if (experience.length === 0) return 0;

    let totalScore = 0;

    experience.forEach(exp => {
      let entryScore = 0;

      // Basic information (30 points)
      if (exp.title?.trim()) entryScore += 10;
      if (exp.company?.trim()) entryScore += 10;
      if (ValidationUtils.isValidDate(exp.startDate)) entryScore += 5;
      if (exp.current || ValidationUtils.isValidDate(exp.endDate)) entryScore += 5;

      // Description quality (70 points)
      if (exp.description?.trim()) {
        // Length bonus (20 points)
        if (exp.description.length >= VALIDATION_THRESHOLDS.DESCRIPTION_MIN_LENGTH) entryScore += 20;
        
        const keywordAnalysis = KeywordAnalyzer.analyzeContent(exp.description, exp.title);
        
        // Action verbs (25 points)
        entryScore += Math.min(keywordAnalysis.foundKeywords.length * 5, 25);
        
        // Quantified achievements (25 points)
        if (keywordAnalysis.hasQuantifiedMetrics) entryScore += 25;
      }

      totalScore += entryScore;
    });

    return ValidationUtils.safePercentage(totalScore, experience.length * 100);
  }
}

class SkillsValidator {
  static validate(skills: Skill[], jobTitle?: string): SectionValidation {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    const suggestions: Record<string, string> = {};

    if (!skills || skills.length === 0) {
      errors.general = `At least ${VALIDATION_THRESHOLDS.MINIMUM_SKILLS} skills are required for a competitive resume`;
      return {
        section: 'skills',
        isComplete: false,
        completionScore: 0,
        atsScore: 0,
        errors,
        warnings,
        suggestions
      };
    }

    if (skills.length < VALIDATION_THRESHOLDS.MINIMUM_SKILLS) {
      warnings.count = `Add at least ${VALIDATION_THRESHOLDS.MINIMUM_SKILLS} skills for better ATS matching`;
    } else if (skills.length > 20) {
      warnings.count = 'Consider limiting skills to 15-20 most relevant ones';
    }

    skills.forEach((skill, index) => {
      const prefix = `skill_${index}`;

      if (!skill.name?.trim()) {
        errors[`${prefix}_name`] = `Skill name is required for skill ${index + 1}`;
      }

      if (!skill.category) {
        warnings[`${prefix}_category`] = `Categorizing skill ${index + 1} helps with organization`;
      }

      if (!skill.level) {
        suggestions[`${prefix}_level`] = `Adding proficiency level for skill ${index + 1} shows expertise`;
      }
    });

    // Industry-specific skill validation
    if (jobTitle) {
      const industry = ValidationUtils.getIndustryFromJobTitle(jobTitle);
      const requiredSkillKeywords = INDUSTRY_SKILLS[industry] || [];
      
      const userSkills = skills.map(s => ValidationUtils.normalizeText(s.name || '')).join(' ');
      const missingKeywords = requiredSkillKeywords.filter(keyword => 
        !userSkills.includes(keyword.toLowerCase())
      );

      if (missingKeywords.length > 0) {
        suggestions.industry_skills = `Consider adding ${industry.toLowerCase()} skills: ${missingKeywords.slice(0, 3).join(', ')}`;
      }
    }

    // Check for generic skills
    const genericSkills = ['Microsoft Office', 'Communication', 'Team Player'];
    const hasGenericSkills = skills.some(skill => 
      genericSkills.some(generic => 
        ValidationUtils.normalizeText(skill.name || '').includes(generic.toLowerCase())
      )
    );

    if (hasGenericSkills) {
      suggestions.generic = 'Replace generic skills like "Microsoft Office" with more specific technical skills';
    }

    // Skills balance
    const technicalSkills = skills.filter(s => s.category === 'technical').length;
    const softSkills = skills.filter(s => s.category === 'soft').length;

    if (technicalSkills === 0) {
      warnings.technical = 'Add some technical skills relevant to your field';
    }

    if (softSkills === 0) {
      warnings.soft = 'Add soft skills to show well-rounded capabilities';
    }

    if (softSkills > technicalSkills) {
      warnings.balance = 'Balance soft skills with more technical/job-specific skills';
    }

    const completionScore = this.calculateCompletion(skills);
    const atsScore = this.calculateATS(skills, jobTitle);

    return {
      section: 'skills',
      isComplete: Object.keys(errors).length === 0 && skills.length >= VALIDATION_THRESHOLDS.MINIMUM_SKILLS,
      completionScore,
      atsScore,
      errors,
      warnings,
      suggestions
    };
  }

  private static calculateCompletion(skills: Skill[]): number {
    if (skills.length === 0) return 0;

    let score = 0;
    const idealSkillCount = 10;
    
    // Base score for having skills
    score += Math.min(skills.length / idealSkillCount, 1) * 60;

    // Bonus for categorization
    const categorizedSkills = skills.filter(s => s.category).length;
    if (skills.length > 0) {
      score += ValidationUtils.safePercentage(categorizedSkills, skills.length) * 0.2;
    }

    // Bonus for skill levels
    const skilledSkills = skills.filter(s => s.level).length;
    if (skills.length > 0) {
      score += ValidationUtils.safePercentage(skilledSkills, skills.length) * 0.2;
    }

    return ValidationUtils.clamp(score, 0, 100);
  }

  private static calculateATS(skills: Skill[], jobTitle?: string): number {
    if (skills.length === 0) return 0;

    let score = 0;

    // Skill count (30 points)
    if (skills.length >= 5) score += 15;
    if (skills.length >= 8) score += 10;
    if (skills.length >= 12) score += 5;

    // Industry relevance (40 points)
    if (jobTitle) {
      const industry = ValidationUtils.getIndustryFromJobTitle(jobTitle);
      const industrySkills = INDUSTRY_SKILLS[industry] || [];
      const userSkills = skills.map(s => ValidationUtils.normalizeText(s.name || '')).join(' ');
      
      const relevantSkills = industrySkills.filter(skill => 
        userSkills.includes(skill.toLowerCase())
      ).length;
      
      score += Math.min(relevantSkills * 8, 40);
    } else {
      score += 20; // Partial credit when no job title
    }

    // Organization (30 points)
    if (skills.length > 0) {
      const categorizedSkills = skills.filter(s => s.category).length;
      score += ValidationUtils.safePercentage(categorizedSkills, skills.length) * 0.3;
    }

    return ValidationUtils.clamp(score, 0, 100);
  }
}

// ============================================================================
// MAIN VALIDATION ENGINE
// ============================================================================

export class ValidationEngine {
  // Validate entire resume
  validateResume(resumeData: ResumeData): ValidationResult {
    const personalInfoValidation = PersonalInfoValidator.validate(resumeData.personalInfo);
    const experienceValidation = ExperienceValidator.validate(resumeData.experience || []);
    const skillsValidation = SkillsValidator.validate(resumeData.skills || [], resumeData.personalInfo?.jobTitle);

    const allErrors = {
      ...personalInfoValidation.errors,
      ...experienceValidation.errors,
      ...skillsValidation.errors
    };

    const allWarnings = {
      ...personalInfoValidation.warnings,
      ...experienceValidation.warnings,
      ...skillsValidation.warnings
    };

    const allSuggestions = {
      ...personalInfoValidation.suggestions,
      ...experienceValidation.suggestions,
      ...skillsValidation.suggestions
    };

    // Calculate weighted overall score
    const overallScore = Math.round(
      personalInfoValidation.atsScore * VALIDATION_THRESHOLDS.PERSONAL_INFO_WEIGHT +
      experienceValidation.atsScore * VALIDATION_THRESHOLDS.EXPERIENCE_WEIGHT +
      skillsValidation.atsScore * VALIDATION_THRESHOLDS.SKILLS_WEIGHT
    );

    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: allSuggestions,
      score: ValidationUtils.clamp(overallScore, 0, 100)
    };
  }

  // Individual field validation
  validateField(fieldName: string, value: any, context?: any): FieldValidation {
    switch (fieldName) {
      case 'email':
        return FieldValidator.validateEmail(value);
      case 'phone':
        return FieldValidator.validatePhone(value);
      case 'linkedin':
        return FieldValidator.validateURL(value, 'linkedin');
      case 'website':
        return FieldValidator.validateURL(value, 'website');
      case 'github':
        return FieldValidator.validateURL(value, 'github');
      case 'gpa':
        return FieldValidator.validateGPA(value);
      case 'summary':
        return FieldValidator.validateContent(value, VALIDATION_THRESHOLDS.SUMMARY_MIN_LENGTH, 'Professional summary');
      case 'startDate':
      case 'endDate':
      case 'graduationDate':
        return FieldValidator.validateDate(value, fieldName, context?.required || false);
      default:
        return { isValid: true };
    }
  }

  // Keyword analysis
  analyzeKeywords(content: string, jobTitle?: string): KeywordAnalysis {
    return KeywordAnalyzer.analyzeContent(content, jobTitle);
  }

  // Generate recommendations
  generateRecommendations(resumeData: ResumeData): ResumeRecommendation[] {
    const recommendations: ResumeRecommendation[] = [];
    const personalInfo = resumeData.personalInfo;
    const experience = resumeData.experience || [];
    const skills = resumeData.skills || [];

    // High priority recommendations
    if (!personalInfo?.summary || personalInfo.summary.length < VALIDATION_THRESHOLDS.SUMMARY_MIN_LENGTH) {
      recommendations.push({
        priority: 'high',
        category: 'Content',
        title: 'Add Professional Summary',
        description: 'A compelling summary significantly improves your resume\'s impact',
        action: 'Write a 2-3 sentence summary highlighting your experience and value'
      });
    }

    if (experience.length === 0) {
      recommendations.push({
        priority: 'high',
        category: 'Experience',
        title: 'Add Work Experience',
        description: 'Work experience is essential for most job applications',
        action: 'Add at least one relevant work experience entry'
      });
    }

    if (skills.length < VALIDATION_THRESHOLDS.MINIMUM_SKILLS) {
      recommendations.push({
        priority: 'high',
        category: 'Skills',
        title: 'Add More Skills',
        description: 'More skills improve ATS matching and demonstrate competency',
        action: `Add at least ${VALIDATION_THRESHOLDS.MINIMUM_SKILLS} relevant skills for your target role`
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Create singleton instance
const validationEngine = new ValidationEngine();

// Export validation functions
export const validatePersonalInfo = (personalInfo: PersonalInfo) => PersonalInfoValidator.validate(personalInfo);
export const validateExperience = (experience: Experience[]) => ExperienceValidator.validate(experience);
export const validateSkills = (skills: Skill[], jobTitle?: string) => SkillsValidator.validate(skills, jobTitle);
export const validateResume = (resumeData: ResumeData) => validationEngine.validateResume(resumeData);
export const validateField = (fieldName: string, value: any, context?: any) => validationEngine.validateField(fieldName, value, context);
export const analyzeKeywords = (content: string, jobTitle?: string) => validationEngine.analyzeKeywords(content, jobTitle);
export const generateRecommendations = (resumeData: ResumeData) => validationEngine.generateRecommendations(resumeData);

// Export constants for external use
export { VALIDATION_THRESHOLDS, VALIDATION_PATTERNS, ATS_KEYWORDS, INDUSTRY_SKILLS };

export default validationEngine;