import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, ReactNode } from 'react';

// ==========================================
// CONSTANTS & ENUMS
// ==========================================

const AUTO_SAVE_DEBOUNCE_MS = 1000;

export enum AutoSaveStatus {
  SAVED = 'saved',
  SAVING = 'saving',
  ERROR = 'error'
}

export enum PreviewMode {
  DESKTOP = 'desktop',
  MOBILE = 'mobile'
}

// ==========================================
// TYPE DEFINITIONS
// ==========================================

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

export interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
  certification?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects?: Project[];
  languages?: Language[];
}

// Type for array sections only (fixes issue 1.3)
export type ArraySections = 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'languages';

export interface Template {
  id: string;
  name: string;
  category: string;
  colors: { primary: string; secondary: string; accent: string };
  layout: 'single-column' | 'two-column' | 'creative' | 'minimal';
  description: string;
  atsScore: number;
}

export interface ValidationErrors {
  [key: string]: { [field: string]: string };
}

export interface ATSAnalysis {
  score: number;
  keywords: string[];
  missing: string[];
  suggestions: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface ResumeState {
  // Core data
  resumeData: ResumeData;
  currentTemplate: string;
  
  // UI state
  activeSection: string;
  currentStep: number;
  showPreview: boolean;
  previewMode: PreviewMode;
  
  // Validation & Analysis
  validationErrors: ValidationErrors;
  atsAnalysis: ATSAnalysis;
  completedSections: Set<string>;
  
  // App state
  autoSaveStatus: AutoSaveStatus;
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

// ==========================================
// ACTION TYPES
// ==========================================

export type ResumeAction =
  | { type: 'UPDATE_SECTION'; payload: { section: keyof ResumeData; data: any } }
  | { type: 'ADD_ARRAY_ITEM'; payload: { section: ArraySections; item: any } }
  | { type: 'REMOVE_ARRAY_ITEM'; payload: { section: ArraySections; index: number } }
  | { type: 'UPDATE_ARRAY_ITEM'; payload: { section: ArraySections; index: number; data: any } }
  | { type: 'REORDER_ARRAY_ITEMS'; payload: { section: ArraySections; fromIndex: number; toIndex: number } }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_PREVIEW_MODE'; payload: PreviewMode }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationErrors }
  | { type: 'SET_ATS_ANALYSIS'; payload: ATSAnalysis }
  | { type: 'UPDATE_COMPLETED_SECTIONS'; payload: Set<string> }
  | { type: 'SET_AUTO_SAVE_STATUS'; payload: AutoSaveStatus }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'RESET_RESUME' }
  | { type: 'LOAD_RESUME'; payload: ResumeData };

// ==========================================
// SCHEMA VALIDATION (fixes issue 1.5)
// ==========================================

function isValidResumeData(data: any): data is ResumeData {
  if (!data || typeof data !== 'object') return false;
  
  // Check personalInfo
  const personalInfo = data.personalInfo;
  if (!personalInfo || typeof personalInfo !== 'object') return false;
  if (typeof personalInfo.firstName !== 'string') return false;
  if (typeof personalInfo.lastName !== 'string') return false;
  if (typeof personalInfo.email !== 'string') return false;
  if (typeof personalInfo.phone !== 'string') return false;
  if (typeof personalInfo.summary !== 'string') return false;
  
  // Check arrays exist and are arrays
  if (!Array.isArray(data.experience)) return false;
  if (!Array.isArray(data.education)) return false;
  if (!Array.isArray(data.skills)) return false;
  if (!Array.isArray(data.certifications)) return false;
  
  // Optional arrays
  if (data.projects && !Array.isArray(data.projects)) return false;
  if (data.languages && !Array.isArray(data.languages)) return false;
  
  return true;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Fix issue 1.2 - Set comparison
function areSetsEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
}

// ==========================================
// INITIAL STATE (fixes issue 1.1)
// ==========================================

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

// Factory function to create fresh initial state (fixes issue 1.1)
const createInitialState = (): ResumeState => ({
  resumeData: { ...defaultResumeData },
  currentTemplate: 'professional',
  activeSection: 'personalInfo',
  currentStep: 0,
  showPreview: true,
  previewMode: PreviewMode.DESKTOP,
  validationErrors: {},
  atsAnalysis: {
    score: 0,
    keywords: [],
    missing: [],
    suggestions: []
  },
  completedSections: new Set<string>(), // Fresh Set instance
  autoSaveStatus: AutoSaveStatus.SAVED,
  isLoading: false,
  lastSaved: null,
  hasUnsavedChanges: false
});

const initialState = createInitialState();

// ==========================================
// REDUCER (fixes issue 1.1 for exhaustiveness)
// ==========================================

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'UPDATE_SECTION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: action.payload.data
        },
        hasUnsavedChanges: true,
        autoSaveStatus: AutoSaveStatus.SAVING
      };

    case 'ADD_ARRAY_ITEM':
      const currentArray = state.resumeData[action.payload.section] as any[];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: [...(currentArray || []), action.payload.item]
        },
        hasUnsavedChanges: true,
        autoSaveStatus: AutoSaveStatus.SAVING
      };

    case 'REMOVE_ARRAY_ITEM':
      const arrayToFilter = state.resumeData[action.payload.section] as any[];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: arrayToFilter.filter((_, index) => index !== action.payload.index)
        },
        hasUnsavedChanges: true,
        autoSaveStatus: AutoSaveStatus.SAVING
      };

    case 'UPDATE_ARRAY_ITEM':
      const arrayToUpdate = state.resumeData[action.payload.section] as any[];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: arrayToUpdate.map((item, index) => 
            index === action.payload.index ? { ...item, ...action.payload.data } : item
          )
        },
        hasUnsavedChanges: true,
        autoSaveStatus: AutoSaveStatus.SAVING
      };

    case 'REORDER_ARRAY_ITEMS':
      const arrayToReorder = [...(state.resumeData[action.payload.section] as any[])];
      const [movedItem] = arrayToReorder.splice(action.payload.fromIndex, 1);
      arrayToReorder.splice(action.payload.toIndex, 0, movedItem);
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: arrayToReorder
        },
        hasUnsavedChanges: true,
        autoSaveStatus: AutoSaveStatus.SAVING
      };

    case 'SET_TEMPLATE':
      return {
        ...state,
        currentTemplate: action.payload,
        hasUnsavedChanges: true
      };

    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSection: action.payload
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload
      };

    case 'TOGGLE_PREVIEW':
      return {
        ...state,
        showPreview: !state.showPreview
      };

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.payload
      };

    case 'SET_ATS_ANALYSIS':
      return {
        ...state,
        atsAnalysis: action.payload
      };

    case 'UPDATE_COMPLETED_SECTIONS':
      return {
        ...state,
        completedSections: action.payload
      };

    case 'SET_AUTO_SAVE_STATUS':
      return {
        ...state,
        autoSaveStatus: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'MARK_SAVED':
      return {
        ...state,
        hasUnsavedChanges: false,
        autoSaveStatus: AutoSaveStatus.SAVED,
        lastSaved: new Date()
      };

    case 'RESET_RESUME':
      return {
        ...createInitialState(), // Fresh state with new Set instance (fixes issue 1.1)
        lastSaved: new Date()
      };

    case 'LOAD_RESUME':
      return {
        ...state,
        resumeData: action.payload,
        hasUnsavedChanges: false,
        autoSaveStatus: AutoSaveStatus.SAVED,
        lastSaved: new Date()
      };

    default:
      // Exhaustiveness check (style improvement)
      const _exhaustiveCheck: never = action;
      return state;
  }
}

// ==========================================
// CONTEXT DEFINITION
// ==========================================

interface ResumeContextType extends ResumeState {
  // Core data actions
  updateResumeData: (section: keyof ResumeData, data: any) => void;
  addArrayItem: (section: ArraySections, item: any) => void;
  removeArrayItem: (section: ArraySections, index: number) => void;
  updateArrayItem: (section: ArraySections, index: number, data: any) => void;
  reorderArrayItems: (section: ArraySections, fromIndex: number, toIndex: number) => void;
  
  // Template actions
  setTemplate: (templateId: string) => void;
  
  // Navigation actions
  setActiveSection: (section: string) => void;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToSection: (sectionKey: string) => void;
  
  // UI actions
  setPreviewMode: (mode: PreviewMode) => void;
  togglePreview: () => void;
  
  // Validation actions
  setValidationErrors: (errors: ValidationErrors) => void;
  validateSection: (section: string) => boolean;
  
  // ATS actions
  setATSAnalysis: (analysis: ATSAnalysis) => void;
  calculateATSScore: () => void;
  
  // Save/Load actions
  saveResume: () => void;
  loadResume: (data: ResumeData) => void;
  resetResume: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  
  // Utility functions
  getCompletionPercentage: () => number;
  isRequiredSectionComplete: (section: string) => boolean;
  canProceedToNext: () => boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// ==========================================
// PROVIDER COMPONENT (fixes performance issues 1.6, 1.7, 1.8)
// ==========================================

interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Section configuration for navigation and validation
  const sectionSteps = useMemo(() => [
    { key: 'personalInfo', label: 'Personal Info', required: true },
    { key: 'experience', label: 'Experience', required: true },
    { key: 'education', label: 'Education', required: false },
    { key: 'skills', label: 'Skills', required: true },
    { key: 'certifications', label: 'Certifications', required: false },
    { key: 'projects', label: 'Projects', required: false },
    { key: 'languages', label: 'Languages', required: false }
  ], []);

  // Auto-save effect with proper debouncing (fixes issue 1.8)
  useEffect(() => {
    if (state.hasUnsavedChanges) {
      const timer = setTimeout(() => {
        dispatch({ type: 'MARK_SAVED' });
      }, AUTO_SAVE_DEBOUNCE_MS);
      
      // Cleanup previous timer to implement debouncing
      return () => clearTimeout(timer);
    }
  }, [state.hasUnsavedChanges]);

  // Completion tracking effect with Set comparison (fixes issue 1.2)
  useEffect(() => {
    const completed = new Set<string>();
    const { resumeData } = state;

    // Personal Info completion check
    const personalInfo = resumeData.personalInfo;
    if (personalInfo.firstName && personalInfo.lastName && 
        personalInfo.email && personalInfo.summary && personalInfo.summary.length > 50) {
      completed.add('personalInfo');
    }
    
    // Experience completion check
    if (resumeData.experience.length > 0 && 
        resumeData.experience.some((exp) => exp.title && exp.company && exp.description)) {
      completed.add('experience');
    }
    
    // Education completion check
    if (resumeData.education.length > 0) {
      completed.add('education');
    }
    
    // Skills completion check
    if (resumeData.skills.length >= 3) {
      completed.add('skills');
    }
    
    // Certifications completion check
    if (resumeData.certifications.length > 0) {
      completed.add('certifications');
    }

    // Projects completion check
    if (resumeData.projects && resumeData.projects.length > 0) {
      completed.add('projects');
    }

    // Languages completion check
    if (resumeData.languages && resumeData.languages.length > 0) {
      completed.add('languages');
    }
    
    // Only dispatch if the Set actually changed (fixes issue 1.2)
    if (!areSetsEqual(completed, state.completedSections)) {
      dispatch({ type: 'UPDATE_COMPLETED_SECTIONS', payload: completed });
    }
  }, [state.resumeData, state.completedSections]);

  // Core data actions with useCallback (fixes issue 1.7)
  const updateResumeData = useCallback((section: keyof ResumeData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { section, data } });
  }, []);

  const addArrayItem = useCallback((section: ArraySections, item: any) => {
    dispatch({ type: 'ADD_ARRAY_ITEM', payload: { section, item } });
  }, []);

  const removeArrayItem = useCallback((section: ArraySections, index: number) => {
    dispatch({ type: 'REMOVE_ARRAY_ITEM', payload: { section, index } });
  }, []);

  const updateArrayItem = useCallback((section: ArraySections, index: number, data: any) => {
    dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section, index, data } });
  }, []);

  const reorderArrayItems = useCallback((section: ArraySections, fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_ARRAY_ITEMS', payload: { section, fromIndex, toIndex } });
  }, []);

  // Template actions
  const setTemplate = useCallback((templateId: string) => {
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
  }, []);

  // Navigation actions
  const setActiveSection = useCallback((section: string) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, []);

  const goToNextStep = useCallback(() => {
    if (state.currentStep < sectionSteps.length - 1) {
      const nextStep = state.currentStep + 1;
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionSteps[nextStep].key });
    }
  }, [state.currentStep, sectionSteps]);

  const goToPrevStep = useCallback(() => {
    if (state.currentStep > 0) {
      const prevStep = state.currentStep - 1;
      dispatch({ type: 'SET_CURRENT_STEP', payload: prevStep });
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionSteps[prevStep].key });
    }
  }, [state.currentStep, sectionSteps]);

  const goToSection = useCallback((sectionKey: string) => {
    const stepIndex = sectionSteps.findIndex(step => step.key === sectionKey);
    if (stepIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepIndex });
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionKey });
    }
  }, [sectionSteps]);

  // UI actions
  const setPreviewMode = useCallback((mode: PreviewMode) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: mode });
  }, []);

  const togglePreview = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  }, []);

  // Validation actions
  const setValidationErrors = useCallback((errors: ValidationErrors) => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
  }, []);

  const validateSection = useCallback((section: string): boolean => {
    const errors = state.validationErrors[section];
    const sectionConfig = sectionSteps.find(step => step.key === section);
    
    // Fix issue 1.4: Default to false for required sections that haven't been validated
    if (sectionConfig?.required && !errors) {
      return false;
    }
    
    return !errors || Object.keys(errors).length === 0;
  }, [state.validationErrors, sectionSteps]);

  // ATS actions
  const setATSAnalysis = useCallback((analysis: ATSAnalysis) => {
    dispatch({ type: 'SET_ATS_ANALYSIS', payload: analysis });
  }, []);

  const calculateATSScore = useCallback(() => {
    // This would be implemented with proper ATS analysis logic
    const mockAnalysis: ATSAnalysis = {
      score: 85,
      keywords: ['experienced', 'professional', 'skilled'],
      missing: ['leadership', 'project management'],
      suggestions: [
        {
          category: 'Keywords',
          title: 'Add industry keywords',
          description: 'Include more relevant keywords for your industry',
          priority: 'high'
        }
      ]
    };
    dispatch({ type: 'SET_ATS_ANALYSIS', payload: mockAnalysis });
  }, []);

  // Save/Load actions
  const saveResume = useCallback(() => {
    // In a real app, this would save to a backend or local storage
    dispatch({ type: 'MARK_SAVED' });
  }, []);

  const loadResume = useCallback((data: ResumeData) => {
    dispatch({ type: 'LOAD_RESUME', payload: data });
  }, []);

  const resetResume = useCallback(() => {
    dispatch({ type: 'RESET_RESUME' });
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(state.resumeData, null, 2);
  }, [state.resumeData]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Fix issue 1.5: Validate schema before dispatching
      if (!isValidResumeData(data)) {
        console.error('Invalid resume data format');
        return false;
      }
      
      dispatch({ type: 'LOAD_RESUME', payload: data });
      return true;
    } catch (error) {
      console.error('Failed to import resume data:', error);
      return false;
    }
  }, []);

  // Utility functions
  const getCompletionPercentage = useCallback((): number => {
    const totalSections = sectionSteps.length;
    const completedCount = state.completedSections.size;
    return Math.round((completedCount / totalSections) * 100);
  }, [state.completedSections, sectionSteps]);

  const isRequiredSectionComplete = useCallback((section: string): boolean => {
    const sectionConfig = sectionSteps.find(step => step.key === section);
    if (!sectionConfig?.required) return true;
    return state.completedSections.has(section);
  }, [state.completedSections, sectionSteps]);

  const canProceedToNext = useCallback((): boolean => {
    const currentSection = sectionSteps[state.currentStep];
    if (!currentSection?.required) return true;
    return state.completedSections.has(currentSection.key);
  }, [state.currentStep, state.completedSections, sectionSteps]);

  // Context value with useMemo to prevent unnecessary re-renders (fixes issue 1.6)
  const contextValue: ResumeContextType = useMemo(() => ({
    // State
    ...state,
    
    // Actions
    updateResumeData,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    reorderArrayItems,
    setTemplate,
    setActiveSection,
    setCurrentStep,
    goToNextStep,
    goToPrevStep,
    goToSection,
    setPreviewMode,
    togglePreview,
    setValidationErrors,
    validateSection,
    setATSAnalysis,
    calculateATSScore,
    saveResume,
    loadResume,
    resetResume,
    exportData,
    importData,
    getCompletionPercentage,
    isRequiredSectionComplete,
    canProceedToNext
  }), [
    state,
    updateResumeData,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    reorderArrayItems,
    setTemplate,
    setActiveSection,
    setCurrentStep,
    goToNextStep,
    goToPrevStep,
    goToSection,
    setPreviewMode,
    togglePreview,
    setValidationErrors,
    validateSection,
    setATSAnalysis,
    calculateATSScore,
    saveResume,
    loadResume,
    resetResume,
    exportData,
    importData,
    getCompletionPercentage,
    isRequiredSectionComplete,
    canProceedToNext
  ]);

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

// ==========================================
// TYPED SELECTORS FOR PERFORMANCE
// ==========================================

export function useResumeData() {
  const { resumeData } = useResume();
  return resumeData;
}

export function usePersonalInfo() {
  const { resumeData } = useResume();
  return resumeData.personalInfo;
}

export function useExperience() {
  const { resumeData } = useResume();
  return resumeData.experience;
}

export function useEducation() {
  const { resumeData } = useResume();
  return resumeData.education;
}

export function useSkills() {
  const { resumeData } = useResume();
  return resumeData.skills;
}

export function useCertifications() {
  const { resumeData } = useResume();
  return resumeData.certifications;
}

export function useTemplateState() {
  const { currentTemplate, setTemplate } = useResume();
  return { currentTemplate, setTemplate };
}

export function useNavigationState() {
  const { 
    activeSection, 
    currentStep, 
    setActiveSection, 
    setCurrentStep, 
    goToNextStep, 
    goToPrevStep, 
    goToSection,
    canProceedToNext
  } = useResume();
  
  return {
    activeSection,
    currentStep,
    setActiveSection,
    setCurrentStep,
    goToNextStep,
    goToPrevStep,
    goToSection,
    canProceedToNext
  };
}

export function useValidationState() {
  const { validationErrors, setValidationErrors, validateSection } = useResume();
  return { validationErrors, setValidationErrors, validateSection };
}

export function useATSState() {
  const { atsAnalysis, setATSAnalysis, calculateATSScore } = useResume();
  return { atsAnalysis, setATSAnalysis, calculateATSScore };
}

export function useProgressState() {
  const { completedSections, getCompletionPercentage, isRequiredSectionComplete } = useResume();
  return { completedSections, getCompletionPercentage, isRequiredSectionComplete };
}

export default ResumeContext;