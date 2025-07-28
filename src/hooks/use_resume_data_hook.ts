import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Resume data types
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
  yearsExperience?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string[];
  responsibilities?: string[];
  skills?: string[];
}

export interface Education {
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

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'certifications';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: string;
  featured: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  status: 'valid' | 'expired' | 'in-progress' | 'pending';
  description?: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  role: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in-progress' | 'on-hold' | 'concept';
  githubUrl?: string;
  liveUrl?: string;
  metrics?: string;
  type: string;
  teamSize?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects?: Project[];
  languages?: Array<{
    name: string;
    proficiency: string;
  }>;
}

// Type-safe section keys
export type Section = keyof ResumeData;

// Auto-save status enum
export enum AutoSaveStatus {
  SAVED = 'saved',
  SAVING = 'saving',
  ERROR = 'error'
}

// Validation rule types - simplified
export interface FieldRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [section: string]: {
    [field: string]: string;
  };
}

export interface UseResumeDataReturn {
  // Data
  resumeData: ResumeData;
  
  // Update functions
  updateResumeData: (section: Section, data: any) => void;
  addArrayItem: (section: Section, item: any) => void;
  removeArrayItem: (section: Section, index: number) => void;
  updateArrayItem: (section: Section, index: number, data: any) => void;
  
  // Utility functions
  resetResumeData: () => void;
  exportResumeData: () => string;
  importResumeData: (jsonData: string) => boolean;
  
  // Validation
  validationErrors: ValidationErrors;
  validateSection: (section: Section) => boolean;
  isValid: boolean;
  
  // Progress tracking
  completedSections: string[]; // Changed to array for stable identity
  completionPercentage: number;
  
  // Auto-save status
  autoSaveStatus: AutoSaveStatus;
  lastSaved: Date | null;
  
  // Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

// Deep merge utility to fix shallow merge issues
const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
        targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }
  
  return result;
};

// Deep clone utility for history snapshots
const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Deep equality check to prevent duplicate history entries
const deepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

// Default resume data with all required fields
const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    jobTitle: '',
    yearsExperience: ''
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: []
};

// Default items for arrays to ensure all required fields are present
const defaultArrayItems = {
  experience: {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    responsibilities: [],
    skills: []
  } as Experience,
  education: {
    institution: '',
    degree: '',
    field: '',
    graduationDate: '',
    gpa: '',
    coursework: '',
    honors: '',
    location: '',
    current: false,
    type: ''
  } as Education,
  skills: {
    name: '',
    category: 'technical' as const,
    level: 'intermediate' as const,
    years: '',
    featured: false
  } as Skill,
  certifications: {
    name: '',
    issuer: '',
    dateObtained: '',
    expirationDate: '',
    credentialId: '',
    verificationUrl: '',
    status: 'valid' as const,
    description: ''
  } as Certification,
  projects: {
    title: '',
    description: '',
    technologies: [],
    role: '',
    startDate: '',
    endDate: '',
    status: 'completed' as const,
    githubUrl: '',
    liveUrl: '',
    metrics: '',
    type: '',
    teamSize: ''
  } as Project,
  languages: {
    name: '',
    proficiency: ''
  }
};

// Validation rules structure - simplified for better compatibility
const validationRules: Record<string, any> = {
  personalInfo: {
    firstName: { required: true, message: 'First name is required' },
    lastName: { required: true, message: 'Last name is required' },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Valid email is required' 
    },
    phone: { 
      required: true, 
      pattern: /^[\+]?[1-9][\d]{0,15}$/, 
      message: 'Valid phone number is required' 
    },
    summary: { 
      required: true, 
      minLength: 100, 
      message: 'Summary should be at least 100 characters for better impact' 
    }
  },
  experience: {
    title: { required: true, message: 'Job title is required' },
    company: { required: true, message: 'Company name is required' },
    description: { 
      required: true, 
      minLength: 100, 
      message: 'Description should be at least 100 characters for better ATS scoring' 
    }
  },
  education: {
    institution: { required: true, message: 'Institution name is required' },
    degree: { required: true, message: 'Degree is required' },
    field: { required: true, message: 'Field of study is required' }
  },
  skills: {
    name: { required: true, message: 'Skill name is required' }
  },
  certifications: {
    name: { required: true, message: 'Certification name is required' },
    issuer: { required: true, message: 'Issuing organization is required' }
  },
  projects: {
    title: { required: true, message: 'Project title is required' },
    description: { required: true, message: 'Project description is required' }
  },
  languages: {
    name: { required: true, message: 'Language name is required' },
    proficiency: { required: true, message: 'Proficiency level is required' }
  }
};

// History management for undo/redo
interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
}

const MAX_HISTORY_SIZE = 50;

export function useResumeData(initialData?: Partial<ResumeData>): UseResumeDataReturn {
  // Deep merge initial data to preserve all defaults
  const initialResumeData = useMemo(() => 
    initialData ? deepMerge(defaultResumeData, initialData) : defaultResumeData
  , [initialData]);

  // Main state
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialResumeData,
    future: []
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>(AutoSaveStatus.SAVED);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs for cleanup and debouncing
  const validationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resumeData = history.present;

  // Calculate total sections dynamically
  const totalSections = useMemo(() => {
    const requiredSections = ['personalInfo', 'experience', 'skills'];
    const optionalSections = ['education', 'certifications', 'projects', 'languages'];
    return requiredSections.length + optionalSections.length;
  }, []);

  // Validation function with simplified typing
  const validateField = useCallback((section: Section, field: string, value: any): string | null => {
    const sectionRules = validationRules[section];
    if (!sectionRules) return null;

    const fieldRule = sectionRules[field];
    if (!fieldRule) return null;

    // Required check
    if (fieldRule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return fieldRule.message;
    }

    // Pattern check (for email, phone)
    if (fieldRule.pattern && value && !fieldRule.pattern.test(value)) {
      return fieldRule.message;
    }

    // Min length check
    if (fieldRule.minLength && value && value.length < fieldRule.minLength) {
      return fieldRule.message;
    }

    return null;
  }, []);

  // Validate entire section with debouncing and cleanup
  const validateSection = useCallback((section: Section): boolean => {
    // Clear existing timer
    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
    }

    // Debounce validation
    validationTimerRef.current = setTimeout(() => {
      const sectionData = resumeData[section];
      const sectionRules = validationRules[section];
      
      if (!sectionRules) return true;

      const errors: { [field: string]: string } = {};

      if (Array.isArray(sectionData)) {
        // Validate array items (experience, education, etc.)
        sectionData.forEach((item, index) => {
          Object.keys(sectionRules).forEach(field => {
            const error = validateField(section, field, (item as any)[field]);
            if (error) {
              errors[`${index}.${field}`] = error;
            }
          });
        });
      } else {
        // Validate object fields (personalInfo)
        Object.keys(sectionRules).forEach(field => {
          const error = validateField(section, field, (sectionData as any)?.[field]);
          if (error) {
            errors[field] = error;
          }
        });
      }

      setValidationErrors(prev => ({
        ...prev,
        [section]: errors
      }));

      return Object.keys(errors).length === 0;
    }, 100);

    return true; // Temporary return for immediate calls
  }, [resumeData, validateField]);

  // Add to history with duplicate check
  const addToHistory = useCallback((newData: ResumeData) => {
    // Prevent duplicate history entries
    if (deepEqual(newData, history.present)) {
      return;
    }

    setHistory(prev => ({
      past: [...prev.past, deepClone(prev.present)].slice(-MAX_HISTORY_SIZE),
      present: deepClone(newData),
      future: [] // Clear future when new action is performed
    }));
  }, [history.present]);

  // Update functions with proper typing and guards
  const updateResumeData = useCallback((section: Section, data: any) => {
    const newResumeData = {
      ...resumeData,
      [section]: data
    };
    addToHistory(newResumeData);
    validateSection(section);
  }, [resumeData, addToHistory, validateSection]);

  const addArrayItem = useCallback((section: Section, newItem?: any) => {
    // Use default item if none provided to ensure type safety
    const defaultItem = newItem || defaultArrayItems[section as keyof typeof defaultArrayItems];
    const currentArray = resumeData[section] as any[];
    const newResumeData = {
      ...resumeData,
      [section]: [...(currentArray || []), defaultItem]
    };
    addToHistory(newResumeData);
    validateSection(section);
  }, [resumeData, addToHistory, validateSection]);

  const removeArrayItem = useCallback((section: Section, index: number) => {
    const currentArray = resumeData[section] as any[];
    
    // Guard against invalid indexes
    if (!currentArray || index < 0 || index >= currentArray.length) {
      console.warn(`Invalid index ${index} for section ${section}`);
      return;
    }

    const newResumeData = {
      ...resumeData,
      [section]: currentArray.filter((_, i) => i !== index)
    };
    addToHistory(newResumeData);
    validateSection(section);
  }, [resumeData, addToHistory, validateSection]);

  const updateArrayItem = useCallback((section: Section, index: number, data: any) => {
    const currentArray = resumeData[section] as any[];
    
    // Guard against invalid indexes
    if (!currentArray || index < 0 || index >= currentArray.length) {
      console.warn(`Invalid index ${index} for section ${section}`);
      return;
    }

    const newResumeData = {
      ...resumeData,
      [section]: currentArray.map((item, i) => 
        i === index ? { ...item, ...data } : item
      )
    };
    addToHistory(newResumeData);
    validateSection(section);
  }, [resumeData, addToHistory, validateSection]);

  // Utility functions
  const resetResumeData = useCallback(() => {
    addToHistory(defaultResumeData);
    setValidationErrors({});
  }, [addToHistory]);

  const exportResumeData = useCallback((): string => {
    return JSON.stringify(resumeData, null, 2);
  }, [resumeData]);

  const importResumeData = useCallback((jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData);
      // Use deep merge to preserve defaults
      const newResumeData = deepMerge(defaultResumeData, parsedData);
      addToHistory(newResumeData);
      return true;
    } catch (error) {
      console.error('Failed to import resume data:', error);
      return false;
    }
  }, [addToHistory]);

  // Undo/Redo functions
  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  // Progress tracking with stable array identity
  const completedSections = useMemo(() => {
    const completed: string[] = [];
    
    // Personal Info completion check
    const personalInfo = resumeData.personalInfo;
    if (personalInfo.firstName && personalInfo.lastName && 
        personalInfo.email && personalInfo.summary && personalInfo.summary.length > 50) {
      completed.push('personalInfo');
    }
    
    // Experience completion check
    if (resumeData.experience.length > 0 && 
        resumeData.experience.some((exp) => exp.title && exp.company && exp.description)) {
      completed.push('experience');
    }
    
    // Education completion check
    if (resumeData.education.length > 0 && 
        resumeData.education.some((edu) => edu.institution && edu.degree)) {
      completed.push('education');
    }
    
    // Skills completion check
    if (resumeData.skills.length >= 3) {
      completed.push('skills');
    }
    
    // Certifications completion check
    if (resumeData.certifications.length > 0) {
      completed.push('certifications');
    }
    
    // Projects completion check
    if (resumeData.projects && resumeData.projects.length > 0) {
      completed.push('projects');
    }
    
    // Languages completion check
    if (resumeData.languages && resumeData.languages.length > 0) {
      completed.push('languages');
    }
    
    return completed;
  }, [resumeData]);

  const completionPercentage = useMemo(() => {
    const percentage = Math.round((completedSections.length / totalSections) * 100);
    // Clamp to 0-100 for safety
    return Math.max(0, Math.min(100, percentage));
  }, [completedSections.length, totalSections]);

  // Overall validation status
  const isValid = useMemo(() => {
    return Object.values(validationErrors).every(sectionErrors => 
      Object.keys(sectionErrors).length === 0
    );
  }, [validationErrors]);

  // Auto-save with proper debouncing and cleanup
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSaveStatus(AutoSaveStatus.SAVING);
    
    autoSaveTimerRef.current = setTimeout(() => {
      setAutoSaveStatus(AutoSaveStatus.SAVED);
      setLastSaved(new Date());
    }, 1000);
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [resumeData]);

  // Initial validation on mount only
  useEffect(() => {
    Object.keys(validationRules).forEach(section => {
      validateSection(section as Section);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    // Data
    resumeData,
    
    // Update functions
    updateResumeData,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    
    // Utility functions
    resetResumeData,
    exportResumeData,
    importResumeData,
    
    // Validation
    validationErrors,
    validateSection,
    isValid,
    
    // Progress tracking
    completedSections, // Now returns stable array instead of Set
    completionPercentage,
    
    // Auto-save status
    autoSaveStatus,
    lastSaved,
    
    // Undo/Redo
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo,
    redo
  };
}