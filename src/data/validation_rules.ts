// Form validation schemas and rules for resume builder

// Section names enum to prevent typos
export const SECTION_NAMES = {
  PERSONAL_INFO: 'personalInfo',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  CERTIFICATIONS: 'certifications'
} as const;

export type SectionName = typeof SECTION_NAMES[keyof typeof SECTION_NAMES];

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string | number | boolean) => boolean;
  atsOptimized?: boolean;
  atsWeight?: number; // 1-10, how important for ATS scoring
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  atsScore: number; // 0-100
  suggestions: ATSSuggestion[];
}

export interface ATSSuggestion {
  type: 'keyword' | 'format' | 'content' | 'structure' | 'metrics';
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface FieldValidationRule {
  rule: ValidationRule;
  errorMessage: string;
  warningMessage?: string;
  atsMessage?: string;
  suggestion?: string;
}

// Proper typing for industry rules
export interface IndustryRules {
  requiredSkills: string[];
  recommendedSections: SectionName[];
  atsKeywords: string[];
  specialRequirements: {
    portfolio?: boolean;
    certifications?: boolean;
    metrics?: boolean;
    licenses?: boolean;
  };
}

// ATS scoring constants - centralized for easy tuning
export const ATS_SCORE_DEDUCTIONS = {
  MISSING_REQUIRED: 100,
  INVALID_FORMAT: 30,
  MISSING_METRICS: 15,
  MISSING_ACTION_VERBS: 15,
  LENGTH_WARNING: 10,
  LENGTH_ERROR: 20,
  PATTERN_MISMATCH: 25,
  CUSTOM_RULE_FAIL: 20
} as const;

// Section importance weights for overall ATS scoring
export const SECTION_WEIGHTS = {
  [SECTION_NAMES.PERSONAL_INFO]: 25,
  [SECTION_NAMES.EXPERIENCE]: 35,
  [SECTION_NAMES.SKILLS]: 20,
  [SECTION_NAMES.EDUCATION]: 10,
  [SECTION_NAMES.CERTIFICATIONS]: 10
} as const;

// Common validation patterns (non-global to avoid lastIndex issues)
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Enhanced phone pattern for international support (still has limitations - documented)
  phoneUS: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  phoneInternational: /^\+[1-9]\d{1,14}$/, // Basic E.164 format
  // More secure URL pattern requiring HTTPS
  url: /^https:\/\/.+\..+$/,
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
  github: /^https:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
  // ATS-friendly text (includes accented characters and common punctuation)
  atsText: /^[a-zA-Z0-9\u00C0-\u017F\s.,;:()&/-]+$/,
  // Enhanced metrics detection with proper grouping
  containsMetrics: /(\d+[%$]?|\$[\d,]+[kKmMbB]?|\d+[+]?[kKmMbB]?|\d+[-]?\d*\s*(percent|times|fold|increase|decrease))/i,
  // Enhanced action verbs
  containsActionVerbs: /(achieved|accomplished|built|created|developed|designed|established|generated|implemented|improved|increased|led|managed|optimized|reduced|streamlined|supervised|delivered|executed|launched|spearheaded)/i,
  // Enhanced bullet point detection (includes numbered lists and indented bullets)
  bulletPoints: /^[\s\t]*(\d+\.|[-*•‐–])\s+/,
  // Fixed GPA pattern (allows 4.0, 4.00, but not 4.99, and includes plain "4")
  gpa: /^(4(\.0{1,2})?|[0-3](\.\d{1,2})?)$/
};

// ATS-friendly requirements
export const ATS_REQUIREMENTS = {
  minSummaryLength: 100,
  maxSummaryLength: 300,
  minExperienceDescription: 150,
  maxExperienceDescription: 600,
  recommendedSkillCount: 8,
  maxSkillCount: 20,
  requiredSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.SKILLS] as SectionName[],
  optimalSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.EDUCATION, SECTION_NAMES.SKILLS, SECTION_NAMES.CERTIFICATIONS] as SectionName[],
  minBulletPoints: 2,
  maxBulletPoints: 6
} as const;

// Helper functions for common validations
export const ValidationHelpers = {
  isValidEmail: (value: string): boolean => 
    typeof value === 'string' && VALIDATION_PATTERNS.email.test(value),
  
  isValidPhone: (value: string): boolean => 
    typeof value === 'string' && (
      VALIDATION_PATTERNS.phoneUS.test(value) || 
      VALIDATION_PATTERNS.phoneInternational.test(value)
    ),
  
  isValidUrl: (value: string): boolean => 
    typeof value === 'string' && VALIDATION_PATTERNS.url.test(value),
  
  hasStringLength: (value: unknown): value is string => 
    typeof value === 'string',
  
  hasArrayLength: (value: unknown): value is unknown[] => 
    Array.isArray(value),
  
  hasLength: (value: unknown): boolean => 
    ValidationHelpers.hasStringLength(value) || ValidationHelpers.hasArrayLength(value),
  
  getLength: (value: unknown): number => {
    if (ValidationHelpers.hasStringLength(value)) return value.length;
    if (ValidationHelpers.hasArrayLength(value)) return value.length;
    return 0;
  },
  
  safePatternTest: (pattern: RegExp, value: unknown): boolean => 
    typeof value === 'string' && pattern.test(value),
  
  countBulletPoints: (text: string): number => {
    const matches = text.match(VALIDATION_PATTERNS.bulletPoints);
    return matches ? matches.length : 0;
  },
  
  hasMetrics: (text: string): boolean => 
    VALIDATION_PATTERNS.containsMetrics.test(text),
  
  hasActionVerbs: (text: string): boolean => 
    VALIDATION_PATTERNS.containsActionVerbs.test(text),

  isEmpty: (value: unknown): boolean => 
    value === null || 
    value === undefined || 
    (typeof value === 'string' && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0)
};

// Personal Information Validation Rules
export const personalInfoValidation: Record<string, FieldValidationRule> = {
  firstName: {
    rule: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z\u00C0-\u017F\s\-']+$/,
      atsOptimized: true,
      atsWeight: 10
    },
    errorMessage: 'First name is required and must contain only letters',
    atsMessage: 'Use your legal first name for ATS compatibility'
  },
  
  lastName: {
    rule: {
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z\u00C0-\u017F\s\-']+$/,
      atsOptimized: true,
      atsWeight: 10
    },
    errorMessage: 'Last name is required and must contain only letters',
    atsMessage: 'Use your legal last name for ATS compatibility'
  },
  
  email: {
    rule: {
      required: true,
      custom: ValidationHelpers.isValidEmail,
      atsOptimized: true,
      atsWeight: 9
    },
    errorMessage: 'Please enter a valid email address',
    warningMessage: 'Consider using a professional email address',
    atsMessage: 'Professional email addresses score higher with ATS systems'
  },
  
  phone: {
    rule: {
      required: true,
      custom: ValidationHelpers.isValidPhone,
      atsOptimized: true,
      atsWeight: 8
    },
    errorMessage: 'Please enter a valid phone number (US format or international +country code)',
    atsMessage: 'Use standard phone format: (555) 123-4567 or international format'
  },
  
  location: {
    rule: {
      required: false,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 6
    },
    errorMessage: 'Location should be at least 2 characters',
    warningMessage: 'City, State format is recommended for privacy',
    suggestion: 'Example: San Francisco, CA'
  },
  
  linkedin: {
    rule: {
      required: false,
      custom: (value: string) => ValidationHelpers.isEmpty(value) || ValidationHelpers.safePatternTest(VALIDATION_PATTERNS.linkedin, value),
      atsOptimized: true,
      atsWeight: 7
    },
    errorMessage: 'Please enter a valid LinkedIn URL',
    suggestion: 'Format: https://linkedin.com/in/yourprofile'
  },
  
  website: {
    rule: {
      required: false,
      custom: (value: string) => ValidationHelpers.isEmpty(value) || ValidationHelpers.isValidUrl(value),
      atsOptimized: true,
      atsWeight: 5
    },
    errorMessage: 'Please enter a valid website URL (HTTPS required)',
    suggestion: 'Include your portfolio or professional website'
  },
  
  jobTitle: {
    rule: {
      required: false,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 9
    },
    errorMessage: 'Job title should be at least 2 characters',
    atsMessage: 'Use standard job titles that match industry keywords',
    suggestion: 'Use the exact title from job postings you\'re targeting'
  },
  
  summary: {
    rule: {
      required: true,
      minLength: ATS_REQUIREMENTS.minSummaryLength,
      maxLength: ATS_REQUIREMENTS.maxSummaryLength,
      atsOptimized: true,
      atsWeight: 10,
      custom: (value: string) => {
        if (!ValidationHelpers.hasStringLength(value)) return false;
        const hasMetrics = ValidationHelpers.hasMetrics(value);
        const hasActionVerbs = ValidationHelpers.hasActionVerbs(value);
        return hasMetrics && hasActionVerbs;
      }
    },
    errorMessage: `Professional summary must be ${ATS_REQUIREMENTS.minSummaryLength}-${ATS_REQUIREMENTS.maxSummaryLength} characters`,
    warningMessage: 'Include quantified achievements and strong action verbs for better ATS scoring',
    atsMessage: 'Include industry keywords and measurable results for better ATS scoring',
    suggestion: 'Start with your years of experience, include 2-3 key achievements with numbers'
  }
};

// Experience Validation Rules
export const experienceValidation: Record<string, FieldValidationRule> = {
  title: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 9
    },
    errorMessage: 'Job title is required',
    atsMessage: 'Use standard industry job titles for better ATS matching',
    suggestion: 'Match the exact title from the job posting when possible'
  },
  
  company: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 8
    },
    errorMessage: 'Company name is required',
    atsMessage: 'Use the official company name for verification purposes'
  },
  
  location: {
    rule: {
      required: false,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 5
    },
    errorMessage: 'Location should be at least 2 characters',
    suggestion: 'City, State or Remote'
  },
  
  startDate: {
    rule: {
      required: true,
      atsOptimized: true,
      atsWeight: 6
    },
    errorMessage: 'Start date is required',
    suggestion: 'Format: Month Year (e.g., January 2020)'
  },
  
  endDate: {
    rule: {
      required: false,
      atsOptimized: true,
      atsWeight: 6
    },
    errorMessage: 'End date is required if not current position',
    suggestion: 'Use "Present" for current positions'
  },
  
  description: {
    rule: {
      required: true,
      minLength: ATS_REQUIREMENTS.minExperienceDescription,
      maxLength: ATS_REQUIREMENTS.maxExperienceDescription,
      atsOptimized: true,
      atsWeight: 10,
      custom: (value: string) => {
        if (!ValidationHelpers.hasStringLength(value)) return false;
        const hasMetrics = ValidationHelpers.hasMetrics(value);
        const hasActionVerbs = ValidationHelpers.hasActionVerbs(value);
        const bulletCount = ValidationHelpers.countBulletPoints(value);
        return hasMetrics && hasActionVerbs && bulletCount >= ATS_REQUIREMENTS.minBulletPoints;
      }
    },
    errorMessage: `Job description must be ${ATS_REQUIREMENTS.minExperienceDescription}-${ATS_REQUIREMENTS.maxExperienceDescription} characters`,
    warningMessage: 'Include specific achievements with metrics and use bullet points for better ATS scoring',
    atsMessage: 'Lead with achievements, include numbers, use action verbs',
    suggestion: 'Start each bullet with an action verb, include specific metrics and results'
  }
};

// Education Validation Rules
export const educationValidation: Record<string, FieldValidationRule> = {
  institution: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 200,
      atsOptimized: true,
      atsWeight: 7
    },
    errorMessage: 'Institution name is required',
    atsMessage: 'Use the official institution name'
  },
  
  degree: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 8
    },
    errorMessage: 'Degree is required',
    suggestion: 'Examples: Bachelor of Science, Master of Arts, High School Diploma'
  },
  
  field: {
    rule: {
      required: false,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 7
    },
    errorMessage: 'Field of study should be at least 2 characters',
    suggestion: 'Include your major or area of concentration'
  },
  
  graduationDate: {
    rule: {
      required: true,
      atsOptimized: true,
      atsWeight: 6
    },
    errorMessage: 'Graduation date is required',
    suggestion: 'Format: Month Year or just Year'
  },
  
  gpa: {
    rule: {
      required: false,
      custom: (value: string) => ValidationHelpers.isEmpty(value) || ValidationHelpers.safePatternTest(VALIDATION_PATTERNS.gpa, value),
      atsOptimized: true,
      atsWeight: 4
    },
    errorMessage: 'GPA should be between 0.00 and 4.00 (e.g., 3.75, 4.0, or just 4)',
    warningMessage: 'Only include GPA if 3.5 or higher',
    suggestion: 'Include GPA only if it strengthens your application'
  }
};

// Skills Validation Rules
export const skillsValidation: Record<string, FieldValidationRule> = {
  name: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 50,
      atsOptimized: true,
      atsWeight: 9
    },
    errorMessage: 'Skill name is required',
    atsMessage: 'Use exact keywords from job descriptions',
    suggestion: 'Match skills to target job requirements'
  },
  
  category: {
    rule: {
      required: true,
      atsOptimized: true,
      atsWeight: 7
    },
    errorMessage: 'Skill category is required',
    suggestion: 'Categorize for better organization and ATS parsing'
  },
  
  level: {
    rule: {
      required: true,
      atsOptimized: true,
      atsWeight: 6
    },
    errorMessage: 'Skill level is required',
    suggestion: 'Be honest about your proficiency level'
  },
  
  years: {
    rule: {
      required: false,
      pattern: /^\d+(\+|\s?(years?|yrs?))?$/i,
      atsOptimized: true,
      atsWeight: 5
    },
    errorMessage: 'Years should be in format "3" or "3 years"',
    suggestion: 'Include years of experience for technical skills'
  }
};

// Certifications Validation Rules
export const certificationsValidation: Record<string, FieldValidationRule> = {
  name: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 200,
      atsOptimized: true,
      atsWeight: 8
    },
    errorMessage: 'Certification name is required',
    atsMessage: 'Use the official certification name',
    suggestion: 'Include full certification title and any acronyms'
  },
  
  issuer: {
    rule: {
      required: true,
      minLength: 2,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 7
    },
    errorMessage: 'Issuing organization is required',
    atsMessage: 'Use the official organization name'
  },
  
  dateObtained: {
    rule: {
      required: true,
      atsOptimized: true,
      atsWeight: 6
    },
    errorMessage: 'Date obtained is required',
    suggestion: 'Format: Month Year'
  },
  
  expirationDate: {
    rule: {
      required: false,
      atsOptimized: true,
      atsWeight: 5
    },
    errorMessage: 'Expiration date format is invalid',
    warningMessage: 'Include expiration date if certification expires',
    suggestion: 'Helps employers verify currency of certification'
  },
  
  credentialId: {
    rule: {
      required: false,
      minLength: 3,
      maxLength: 100,
      atsOptimized: true,
      atsWeight: 4
    },
    errorMessage: 'Credential ID should be at least 3 characters',
    suggestion: 'Include for easy verification by employers'
  }
};

// Industry-specific validation rules with proper typing
export const industryValidationRules: Record<string, IndustryRules> = {
  'Software Engineer': {
    requiredSkills: ['Programming Languages', 'Version Control', 'Problem Solving'],
    recommendedSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.SKILLS, SECTION_NAMES.EDUCATION],
    atsKeywords: ['software', 'development', 'programming', 'coding', 'technical'],
    specialRequirements: {
      portfolio: true
    }
  },
  
  'Electrician': {
    requiredSkills: ['Electrical Installation', 'Safety Compliance', 'Blueprint Reading'],
    recommendedSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.SKILLS, SECTION_NAMES.CERTIFICATIONS],
    atsKeywords: ['electrical', 'installation', 'wiring', 'safety', 'licensed'],
    specialRequirements: {
      certifications: true,
      licenses: true
    }
  },
  
  'Marketing Manager': {
    requiredSkills: ['Digital Marketing', 'Analytics', 'Campaign Management'],
    recommendedSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.SKILLS, SECTION_NAMES.EDUCATION],
    atsKeywords: ['marketing', 'digital', 'campaigns', 'analytics', 'growth'],
    specialRequirements: {
      metrics: true
    }
  },
  
  'Nurse': {
    requiredSkills: ['Patient Care', 'Clinical Skills', 'Medical Knowledge'],
    recommendedSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.EDUCATION, SECTION_NAMES.SKILLS, SECTION_NAMES.CERTIFICATIONS],
    atsKeywords: ['nursing', 'patient', 'clinical', 'healthcare', 'medical'],
    specialRequirements: {
      licenses: true,
      certifications: true
    }
  },
  
  'Project Manager': {
    requiredSkills: ['Project Planning', 'Team Leadership', 'Budget Management'],
    recommendedSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.SKILLS, SECTION_NAMES.EDUCATION, SECTION_NAMES.CERTIFICATIONS],
    atsKeywords: ['project', 'management', 'agile', 'scrum', 'leadership'],
    specialRequirements: {
      certifications: true,
      metrics: true
    }
  },
  
  'Sales Representative': {
    requiredSkills: ['Sales', 'Customer Relations', 'Negotiation'],
    recommendedSections: [SECTION_NAMES.PERSONAL_INFO, SECTION_NAMES.EXPERIENCE, SECTION_NAMES.SKILLS, SECTION_NAMES.EDUCATION],
    atsKeywords: ['sales', 'revenue', 'customers', 'targets', 'relationship'],
    specialRequirements: {
      metrics: true
    }
  }
} as const;

// Enhanced validation engine with proper typing and fixed logic
export class ValidationEngine {
  // Simplified method signature without problematic generics
  static validateField(
    value: unknown, 
    fieldName: string, 
    rules: Record<string, FieldValidationRule>
  ): ValidationResult {
    const rule = rules[fieldName];
    if (!rule) {
      return { 
        isValid: true, 
        errors: [], 
        warnings: [], 
        atsScore: 100, 
        suggestions: [] 
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: ATSSuggestion[] = [];
    let atsScore = 100;

    // Required validation
    if (rule.rule.required && ValidationHelpers.isEmpty(value)) {
      errors.push(rule.errorMessage);
      atsScore = 0;
      
      // Add warning message for required fields too
      if (rule.warningMessage) {
        warnings.push(rule.warningMessage);
      }
      
      return { isValid: false, errors, warnings, atsScore, suggestions };
    }

    // Skip other validations if value is empty and not required
    if (ValidationHelpers.isEmpty(value)) {
      return { isValid: true, errors, warnings, atsScore: 80, suggestions };
    }

    // Ensure we have a string for string validations
    const stringValue = typeof value === 'string' ? value : String(value);

    // Length validations with proper type checking
    if (rule.rule.minLength && ValidationHelpers.hasLength(value)) {
      const length = ValidationHelpers.getLength(value);
      if (length < rule.rule.minLength) {
        errors.push(rule.errorMessage);
        atsScore = Math.max(0, atsScore - ATS_SCORE_DEDUCTIONS.LENGTH_ERROR);
      }
    }

    if (rule.rule.maxLength && ValidationHelpers.hasLength(value)) {
      const length = ValidationHelpers.getLength(value);
      if (length > rule.rule.maxLength) {
        // Max length violations are errors, not just warnings
        errors.push(`Must be no more than ${rule.rule.maxLength} characters`);
        atsScore = Math.max(0, atsScore - ATS_SCORE_DEDUCTIONS.LENGTH_ERROR);
      }
    }

    // Pattern validation with type safety
    if (rule.rule.pattern && !ValidationHelpers.safePatternTest(rule.rule.pattern, value)) {
      errors.push(rule.errorMessage);
      atsScore = Math.max(0, atsScore - ATS_SCORE_DEDUCTIONS.PATTERN_MISMATCH);
    }

    // Custom validation - properly determines validity
    if (rule.rule.custom && !rule.rule.custom(stringValue)) {
      if (rule.warningMessage) {
        warnings.push(rule.warningMessage);
        atsScore = Math.max(0, atsScore - ATS_SCORE_DEDUCTIONS.CUSTOM_RULE_FAIL);
      } else {
        // If no warning message, treat as error (fails validation)
        errors.push(rule.errorMessage);
        atsScore = Math.max(0, atsScore - ATS_SCORE_DEDUCTIONS.CUSTOM_RULE_FAIL);
      }
    }

    // ATS optimizations with weighted scoring
    if (rule.rule.atsOptimized) {
      const weight = rule.rule.atsWeight || 5;
      
      if (rule.atsMessage) {
        suggestions.push({
          type: 'format',
          message: rule.atsMessage,
          priority: weight > 7 ? 'high' : weight > 4 ? 'medium' : 'low',
          category: fieldName
        });
      }
      
      // Additional ATS checks for text fields
      if (typeof value === 'string') {
        if (fieldName === 'summary' || fieldName === 'description') {
          if (!ValidationHelpers.hasMetrics(value)) {
            warnings.push('Consider adding specific metrics and numbers');
            suggestions.push({
              type: 'metrics',
              message: 'Add quantified achievements (percentages, dollar amounts, timeframes)',
              priority: 'high',
              category: fieldName
            });
            atsScore = Math.max(0, atsScore - Math.round(ATS_SCORE_DEDUCTIONS.MISSING_METRICS * (weight / 10)));
          }
          
          if (!ValidationHelpers.hasActionVerbs(value)) {
            warnings.push('Consider using strong action verbs');
            suggestions.push({
              type: 'content',
              message: 'Start sentences with action verbs (achieved, developed, led, etc.)',
              priority: 'medium',
              category: fieldName
            });
            atsScore = Math.max(0, atsScore - Math.round(ATS_SCORE_DEDUCTIONS.MISSING_ACTION_VERBS * (weight / 10)));
          }
        }
      }
    }

    // Add general suggestions
    if (rule.suggestion) {
      suggestions.push({
        type: 'format',
        message: rule.suggestion,
        priority: 'low',
        category: fieldName
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      atsScore: Math.max(0, Math.round(atsScore)),
      suggestions
    };
  }

  // Overloaded methods for better type safety
  static validateObjectSection(sectionData: Record<string, unknown>, sectionName: SectionName): ValidationResult {
    return this.validateSectionInternal(sectionData, sectionName, false);
  }

  static validateArraySection(sectionData: unknown[], sectionName: SectionName): ValidationResult {
    return this.validateSectionInternal(sectionData, sectionName, true);
  }

  static validateSection(sectionData: unknown, sectionName: SectionName): ValidationResult {
    const isArray = Array.isArray(sectionData);
    return this.validateSectionInternal(sectionData, sectionName, isArray);
  }

  private static validateSectionInternal(sectionData: unknown, sectionName: SectionName, isArraySection: boolean): ValidationResult {
    const validationRules = this.getValidationRules(sectionName);
    if (!validationRules) {
      return { isValid: true, errors: [], warnings: [], atsScore: 100, suggestions: [] };
    }

    // Check if section is required but missing
    if (this.isSectionRequired(sectionName) && (
        !sectionData || 
        (isArraySection && Array.isArray(sectionData) && sectionData.length === 0)
      )) {
      return {
        isValid: false,
        errors: [`${sectionName} section is required`],
        warnings: [],
        atsScore: 0,
        suggestions: [{
          type: 'structure',
          message: `Add your ${sectionName} information for better ATS scoring`,
          priority: 'high',
          category: sectionName
        }]
      };
    }

    let isValid = true;
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allSuggestions: ATSSuggestion[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Get field names as array for safe iteration
    const fieldNames = Object.keys(validationRules);

    if (isArraySection && Array.isArray(sectionData)) {
      // Handle array sections (experience, education, skills, certifications)
      sectionData.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          fieldNames.forEach(fieldName => {
            const itemData = item as Record<string, unknown>;
            const result = this.validateField(itemData[fieldName], fieldName, validationRules);
            if (!result.isValid) isValid = false;
            
            allErrors.push(...result.errors.map(error => `${sectionName} ${index + 1}: ${error}`));
            allWarnings.push(...result.warnings.map(warning => `${sectionName} ${index + 1}: ${warning}`));
            allSuggestions.push(...result.suggestions);
            
            // Weighted ATS scoring
            const fieldRule = validationRules[fieldName];
            const weight = fieldRule.rule.atsWeight || 5;
            totalWeightedScore += result.atsScore * weight;
            totalWeight += weight;
          });
        }
      });
    } else if (typeof sectionData === 'object' && sectionData !== null) {
      // Handle object sections (personalInfo)
      const objectData = sectionData as Record<string, unknown>;
      fieldNames.forEach(fieldName => {
        const result = this.validateField(objectData[fieldName], fieldName, validationRules);
        if (!result.isValid) isValid = false;
        
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
        allSuggestions.push(...result.suggestions);
        
        // Weighted ATS scoring
        const fieldRule = validationRules[fieldName];
        const weight = fieldRule.rule.atsWeight || 5;
        totalWeightedScore += result.atsScore * weight;
        totalWeight += weight;
      });
    }

    const avgAtsScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 100;

    return {
      isValid,
      errors: allErrors,
      warnings: allWarnings,
      atsScore: avgAtsScore,
      suggestions: allSuggestions
    };
  }

  static validateFullResume(resumeData: Record<string, unknown>, targetJobTitle?: string): ValidationResult {
    let isValid = true;
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allSuggestions: ATSSuggestion[] = [];
    const sectionScores: Record<string, number> = {};

    // Validate each section
    const sections: SectionName[] = [
      SECTION_NAMES.PERSONAL_INFO, 
      SECTION_NAMES.EXPERIENCE, 
      SECTION_NAMES.EDUCATION, 
      SECTION_NAMES.SKILLS, 
      SECTION_NAMES.CERTIFICATIONS
    ];
    
    sections.forEach(sectionName => {
      if (resumeData[sectionName]) {
        const result = this.validateSection(resumeData[sectionName], sectionName);
        if (!result.isValid) isValid = false;
        
        allErrors.push(...result.errors);
        allWarnings.push(...result.warnings);
        allSuggestions.push(...result.suggestions);
        sectionScores[sectionName] = result.atsScore;
      } else if (this.isSectionRequired(sectionName)) {
        isValid = false;
        allErrors.push(`${sectionName} section is required`);
        sectionScores[sectionName] = 0;
      }
    });

    // Industry-specific validation with proper typing
    if (targetJobTitle && industryValidationRules[targetJobTitle]) {
      const industryRules = industryValidationRules[targetJobTitle];
      
      // Check recommended sections
      industryRules.recommendedSections.forEach(sectionName => {
        if (!resumeData[sectionName] || 
            (Array.isArray(resumeData[sectionName]) && (resumeData[sectionName] as unknown[]).length === 0)) {
          allWarnings.push(`Consider adding ${sectionName} section for ${targetJobTitle} positions`);
          allSuggestions.push({
            type: 'structure',
            message: `${sectionName} section improves applications for ${targetJobTitle} roles`,
            priority: 'medium',
            category: sectionName
          });
        }
      });

      // Check industry keywords in summary (optimized)
      if (resumeData.personalInfo && typeof resumeData.personalInfo === 'object') {
        const personalInfo = resumeData.personalInfo as Record<string, unknown>;
        if (typeof personalInfo.summary === 'string') {
          const lowerSummary = personalInfo.summary.toLowerCase(); // Pre-compute
          const missingKeywords = industryRules.atsKeywords.filter(keyword => 
            !lowerSummary.includes(keyword.toLowerCase())
          );
          
          if (missingKeywords.length > 0) {
            allSuggestions.push({
              type: 'keyword',
              message: `Include these ${targetJobTitle} keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
              priority: 'high',
              category: SECTION_NAMES.PERSONAL_INFO
            });
          }
        }
      }

      // Check special requirements
      const specialReqs = industryRules.specialRequirements;
      if (specialReqs.portfolio && resumeData.personalInfo && typeof resumeData.personalInfo === 'object') {
        const personalInfo = resumeData.personalInfo as Record<string, unknown>;
        if (!personalInfo.website) {
          allSuggestions.push({
            type: 'content',
            message: 'Consider adding a portfolio website for software engineering roles',
            priority: 'medium',
            category: SECTION_NAMES.PERSONAL_INFO
          });
        }
      }

      if (specialReqs.certifications && (!resumeData.certifications || 
          (Array.isArray(resumeData.certifications) && resumeData.certifications.length === 0))) {
        allSuggestions.push({
          type: 'structure',
          message: `Certifications are highly valued for ${targetJobTitle} positions`,
          priority: 'high',
          category: SECTION_NAMES.CERTIFICATIONS
        });
      }
    }

    // Calculate overall ATS score with section weighting
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.entries(sectionScores).forEach(([section, score]) => {
      const weight = SECTION_WEIGHTS[section as SectionName] || 10;
      totalWeightedScore += score * weight;
      totalWeight += weight;
    });

    const overallAtsScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

    return {
      isValid,
      errors: allErrors,
      warnings: allWarnings,
      atsScore: overallAtsScore,
      suggestions: allSuggestions
    };
  }

  static getValidationRules(sectionName: SectionName): Record<string, FieldValidationRule> | null {
    switch (sectionName) {
      case SECTION_NAMES.PERSONAL_INFO:
        return personalInfoValidation;
      case SECTION_NAMES.EXPERIENCE:
        return experienceValidation;
      case SECTION_NAMES.EDUCATION:
        return educationValidation;
      case SECTION_NAMES.SKILLS:
        return skillsValidation;
      case SECTION_NAMES.CERTIFICATIONS:
        return certificationsValidation;
      default:
        return null;
    }
  }

  static isSectionRequired(sectionName: SectionName): boolean {
    return ATS_REQUIREMENTS.requiredSections.includes(sectionName);
  }

  static getAtsOptimizationTips(sectionName: SectionName, jobTitle?: string): ATSSuggestion[] {
    const tips: ATSSuggestion[] = [];
    
    switch (sectionName) {
      case SECTION_NAMES.PERSONAL_INFO:
        tips.push(
          {
            type: 'format',
            message: 'Include a professional email address',
            priority: 'high',
            category: SECTION_NAMES.PERSONAL_INFO
          },
          {
            type: 'keyword',
            message: 'Write a compelling summary with industry keywords',
            priority: 'high',
            category: SECTION_NAMES.PERSONAL_INFO
          }
        );
        break;
        
      case SECTION_NAMES.EXPERIENCE:
        tips.push(
          {
            type: 'content',
            message: 'Start bullet points with action verbs',
            priority: 'high',
            category: SECTION_NAMES.EXPERIENCE
          },
          {
            type: 'metrics',
            message: 'Include specific metrics and numbers',
            priority: 'high',
            category: SECTION_NAMES.EXPERIENCE
          }
        );
        break;
        
      case SECTION_NAMES.SKILLS:
        tips.push(
          {
            type: 'keyword',
            message: 'Include exact keywords from job descriptions',
            priority: 'high',
            category: SECTION_NAMES.SKILLS
          }
        );
        break;
    }

    // Add job-specific tips
    if (jobTitle && industryValidationRules[jobTitle]) {
      const industryRules = industryValidationRules[jobTitle];
      tips.push({
        type: 'keyword',
        message: `Include these key ${jobTitle} skills: ${industryRules.requiredSkills.slice(0, 3).join(', ')}`,
        priority: 'medium',
        category: sectionName
      });
    }

    return tips;
  }
}