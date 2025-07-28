/**
 * Core Resume Type Definitions
 * 
 * This file contains all TypeScript interfaces for the resume builder application.
 * These types ensure type safety across all components and services.
 */

import type { LucideIcon } from 'lucide-react';

// ============================================================================
// STRING LITERAL UNIONS (Reusable Types)
// ============================================================================

export type SkillCategory = 'technical' | 'soft' | 'tools' | 'certifications';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type EducationType = 'degree' | 'certificate' | 'bootcamp' | 'online' | 'other';
export type CertificationStatus = 'valid' | 'expired' | 'in-progress' | 'pending';
export type ProjectStatus = 'completed' | 'in-progress' | 'on-hold' | 'concept';
export type ProjectType = 'personal' | 'professional' | 'academic' | 'freelance';
export type LanguageProficiency = 'native' | 'fluent' | 'conversational' | 'basic';
export type ReferenceRelationship = 'manager' | 'colleague' | 'client' | 'professor' | 'other';
export type TemplateCategory = 'professional' | 'modern' | 'creative' | 'simple' | 'executive';
export type TemplateLayout = 'single-column' | 'two-column' | 'creative' | 'minimal';
export type ValidationErrorType = 'required' | 'format' | 'length' | 'custom';
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

// ============================================================================
// DATE TYPES (Strongly Typed)
// ============================================================================

/** ISO 8601 date string (YYYY-MM-DD) */
export type ISODateString = string & { __brand: 'ISODate' };

/** Helper to create a branded ISO date string */
export const createISODate = (dateString: string): ISODateString => {
  // Validate ISO format (basic check)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error(`Invalid ISO date format: ${dateString}. Expected YYYY-MM-DD`);
  }
  return dateString as ISODateString;
};

/** Helper to get current date as ISO string */
export const getCurrentISODate = (): ISODateString => {
  return createISODate(new Date().toISOString().split('T')[0]);
};

// ============================================================================
// METRICS TYPES (Consistent Shape)
// ============================================================================

/** Standardized metrics object for quantifiable achievements */
export interface Metrics {
  revenue?: number;
  percentage?: number;
  count?: number;
  duration?: number; // in months
  teamSize?: number;
  budget?: number;
  growth?: number;
  efficiency?: number;
  satisfaction?: number; // rating or percentage
  [key: string]: number | undefined;
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

// Personal Information Interface
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
  jobTitle?: string;
  yearsExperience?: number; // Changed from string to number
}

// Work Experience Interface
export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  startDate: ISODateString; // Strongly typed date
  endDate: ISODateString; // Strongly typed date
  current: boolean;
  description: string;
  achievements?: string[];
  responsibilities?: string[];
  skills?: string[];
  metrics?: Metrics; // Consistent metrics shape
}

// Education Interface
export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: ISODateString; // Strongly typed date
  gpa?: string;
  coursework?: string;
  honors?: string;
  location?: string;
  current: boolean;
  type: EducationType; // Using string literal union
}

// Skills Interface
export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory; // Using string literal union
  level: SkillLevel; // Using string literal union
  years?: number; // Changed from string to number
  featured: boolean;
}

// Certifications Interface
export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  dateObtained: ISODateString; // Strongly typed date
  expirationDate?: ISODateString; // Strongly typed date
  credentialId?: string;
  verificationUrl?: string;
  status: CertificationStatus; // Using string literal union
  description?: string;
}

// Projects Interface (for portfolios)
export interface Project {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  startDate: ISODateString; // Strongly typed date
  endDate: ISODateString; // Strongly typed date
  status: ProjectStatus; // Using string literal union
  githubUrl?: string;
  liveUrl?: string;
  metrics?: Metrics; // Consistent metrics shape
  type: ProjectType; // Using string literal union
  teamSize?: number; // Changed from string to number
}

// Languages Interface
export interface Language {
  id?: string;
  name: string;
  proficiency: LanguageProficiency; // Using string literal union
  certification?: string;
}

// References Interface
export interface Reference {
  id?: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: ReferenceRelationship; // Using string literal union
}

// Main Resume Data Interface
export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects?: Project[];
  languages?: Language[];
  references?: Reference[];
}

// Template Interface
export interface Template {
  id: string;
  name: string;
  category: TemplateCategory; // Using string literal union
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: TemplateLayout; // Using string literal union
  description: string;
  atsScore: number;
  preview?: string;
  targetIndustries?: string[];
  features?: string[];
}

// Validation Error Interface
export interface ValidationError {
  field: string;
  message: string;
  type: ValidationErrorType; // Using string literal union
}

// Section Validation Interface
export interface SectionValidation {
  [sectionName: string]: {
    [fieldName: string]: ValidationError[];
  };
}

// ATS Analysis Interface
export interface ATSAnalysis {
  overallScore: number;
  sectionScores: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
    certifications: number;
  };
  recommendations: string[];
  strengths: string[];
  warnings: string[];
  criticalIssues: string[];
  keywordAnalysis: {
    required: string[];
    preferred: string[];
    requiredFound: number;
    preferredFound: number;
  };
  salaryImpact?: number;
  competitiveRanking?: string;
}

// Job Match Analysis Interface (for Job Description Matcher)
export interface JobMatchAnalysis {
  overallScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  industryMatch: number;
  skillsMatch: number;
  experienceMatch: number;
}

// Auto-save State Interface
export interface AutoSaveState {
  status: AutoSaveStatus; // Using string literal union
  lastSaved?: Date;
  saveCount?: number;
  hasUnsavedChanges: boolean;
  isOnline: boolean;
  errorMessage?: string;
}

// Form Step Interface
export interface FormStep {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon; // Properly typed Lucide icon
  required: boolean;
  estimatedTimeMinutes: number;
  component: React.ComponentType<any>;
}

// Export utility types
export type ResumeSection = keyof Omit<ResumeData, 'personalInfo'>;
export type ArraySection = 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'languages' | 'references';

// Default values (using undefined for optional fields to keep intent clearer)
export const defaultPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: undefined,
  website: undefined,
  summary: '',
  jobTitle: undefined,
  yearsExperience: undefined
};

export const defaultResumeData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  references: []
};

// ============================================================================
// TYPE GUARDS (Improved with unknown and stronger checks)
// ============================================================================

/**
 * Type guard to check if an object is a valid PersonalInfo
 * @param obj - Object to check
 * @returns True if object matches PersonalInfo interface
 */
export const isPersonalInfo = (obj: unknown): obj is PersonalInfo => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    typeof (obj as PersonalInfo).firstName === 'string' &&
    typeof (obj as PersonalInfo).lastName === 'string' &&
    typeof (obj as PersonalInfo).email === 'string' &&
    typeof (obj as PersonalInfo).phone === 'string' &&
    typeof (obj as PersonalInfo).summary === 'string'
  );
};

/**
 * Type guard to check if an object is a valid Experience
 * @param obj - Object to check
 * @returns True if object matches Experience interface
 */
export const isExperience = (obj: unknown): obj is Experience => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    typeof (obj as Experience).title === 'string' &&
    typeof (obj as Experience).company === 'string' &&
    typeof (obj as Experience).description === 'string' &&
    typeof (obj as Experience).current === 'boolean'
  );
};

/**
 * Type guard to check if an object is a valid Education
 * @param obj - Object to check
 * @returns True if object matches Education interface
 */
export const isEducation = (obj: unknown): obj is Education => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    typeof (obj as Education).institution === 'string' &&
    typeof (obj as Education).degree === 'string' &&
    typeof (obj as Education).field === 'string' &&
    typeof (obj as Education).current === 'boolean'
  );
};

/**
 * Type guard to check if an object is a valid Skill
 * @param obj - Object to check
 * @returns True if object matches Skill interface
 */
export const isSkill = (obj: unknown): obj is Skill => {
  const validCategories: SkillCategory[] = ['technical', 'soft', 'tools', 'certifications'];
  const validLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  return (
    !!obj &&
    typeof obj === 'object' &&
    typeof (obj as Skill).name === 'string' &&
    validCategories.includes((obj as Skill).category) &&
    validLevels.includes((obj as Skill).level) &&
    typeof (obj as Skill).featured === 'boolean'
  );
};

/**
 * Type guard to check if an object is a valid Certification
 * @param obj - Object to check
 * @returns True if object matches Certification interface
 */
export const isCertification = (obj: unknown): obj is Certification => {
  const validStatuses: CertificationStatus[] = ['valid', 'expired', 'in-progress', 'pending'];
  
  return (
    !!obj &&
    typeof obj === 'object' &&
    typeof (obj as Certification).name === 'string' &&
    typeof (obj as Certification).issuer === 'string' &&
    validStatuses.includes((obj as Certification).status)
  );
};

// ============================================================================
// UTILITY FUNCTIONS (Type-safe object creation with JSDoc)
// ============================================================================

/**
 * Creates a new Experience object with type-safe defaults
 * @param partial - Partial Experience data to merge with defaults
 * @returns Complete Experience object
 */
export const createExperience = (partial: Partial<Experience> = {}): Experience => ({
  title: '',
  company: '',
  location: '',
  startDate: getCurrentISODate(),
  endDate: getCurrentISODate(),
  current: false,
  description: '',
  ...partial
});

/**
 * Creates a new Education object with type-safe defaults
 * @param partial - Partial Education data to merge with defaults
 * @returns Complete Education object
 */
export const createEducation = (partial: Partial<Education> = {}): Education => ({
  institution: '',
  degree: '',
  field: '',
  graduationDate: getCurrentISODate(),
  current: false,
  type: 'degree',
  ...partial
});

/**
 * Creates a new Skill object with type-safe defaults
 * @param partial - Partial Skill data to merge with defaults
 * @returns Complete Skill object
 */
export const createSkill = (partial: Partial<Skill> = {}): Skill => ({
  name: '',
  category: 'technical',
  level: 'intermediate',
  featured: false,
  ...partial
});

/**
 * Creates a new Certification object with type-safe defaults
 * @param partial - Partial Certification data to merge with defaults
 * @returns Complete Certification object
 */
export const createCertification = (partial: Partial<Certification> = {}): Certification => ({
  name: '',
  issuer: '',
  dateObtained: getCurrentISODate(),
  status: 'valid',
  ...partial
});

/**
 * Creates a new Project object with type-safe defaults
 * @param partial - Partial Project data to merge with defaults
 * @returns Complete Project object
 */
export const createProject = (partial: Partial<Project> = {}): Project => ({
  title: '',
  description: '',
  technologies: [],
  role: '',
  startDate: getCurrentISODate(),
  endDate: getCurrentISODate(),
  status: 'completed',
  type: 'personal',
  ...partial
});

/**
 * Creates a new Metrics object with type-safe defaults
 * @param partial - Partial Metrics data to merge with defaults
 * @returns Complete Metrics object
 */
export const createMetrics = (partial: Partial<Metrics> = {}): Metrics => ({
  ...partial
});

// ============================================================================
// DATE UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates and converts a string to an ISO date
 * @param dateString - Date string to validate
 * @returns Validated ISO date string
 * @throws Error if date format is invalid
 */
export const validateISODate = (dateString: string): ISODateString => {
  return createISODate(dateString);
};

/**
 * Formats an ISO date string for display
 * @param isoDate - ISO date string
 * @returns Formatted date string
 */
export const formatDisplayDate = (isoDate: ISODateString): string => {
  return new Date(isoDate).toLocaleDateString();
};

/**
 * Checks if an ISO date string represents a future date
 * @param isoDate - ISO date string to check
 * @returns True if date is in the future
 */
export const isFutureDate = (isoDate: ISODateString): boolean => {
  return new Date(isoDate) > new Date();
};
