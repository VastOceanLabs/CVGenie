import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, ReactNode } from 'react';

// Type definitions
interface PersonalInfo {
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

interface Experience {
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

interface Education {
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

interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'certifications';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: string;
  featured: boolean;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  status: 'valid' | 'expired' | 'in-progress' | 'pending';
  description?: string;
}

interface Project {
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

interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
  certification?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects?: Project[];
  languages?: Language[];
}

interface ValidationErrors {
  [key: string]: { [field: string]: string };
}

interface ATSAnalysis {
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

interface ResumeState {
  resumeData: ResumeData;
  currentTemplate: string;
  activeSection: string;
  currentStep: number;
  showPreview: boolean;
  previewMode: 'desktop' | 'mobile';
  validationErrors: ValidationErrors;
  atsAnalysis: ATSAnalysis;
  completedSections: Set<string>;
  autoSaveStatus: 'saved' | 'saving' | 'error';
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

// Action types - Fixed: Replace any with proper types
type ResumeAction =
  | { type: 'UPDATE_SECTION'; payload: { section: keyof ResumeData; data: PersonalInfo | Experience[] | Education[] | Skill[] | Certification[] | Project[] | Language[] } }
  | { type: 'ADD_ARRAY_ITEM'; payload: { section: keyof ResumeData; item: Experience | Education | Skill | Certification | Project | Language } }
  | { type: 'REMOVE_ARRAY_ITEM'; payload: { section: keyof ResumeData; index: number } }
  | { type: 'UPDATE_ARRAY_ITEM'; payload: { section: keyof ResumeData; index: number; data: Partial<Experience | Education | Skill | Certification | Project | Language> } }
  | { type: 'REORDER_ARRAY_ITEMS'; payload: { section: keyof ResumeData; fromIndex: number; toIndex: number } }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_PREVIEW_MODE'; payload: 'desktop' | 'mobile' }
  | { type: 'TOGGLE_PREVIEW' }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationErrors }
  | { type: 'SET_ATS_ANALYSIS'; payload: ATSAnalysis }
  | { type: 'UPDATE_COMPLETED_SECTIONS'; payload: Set<string> }
  | { type: 'SET_AUTO_SAVE_STATUS'; payload: 'saved' | 'saving' | 'error' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'RESET_RESUME' }
  | { type: 'LOAD_RESUME'; payload: ResumeData };

// Initial state
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

const initialState: ResumeState = {
  resumeData: defaultResumeData,
  currentTemplate: 'professional',
  activeSection: 'personalInfo',
  currentStep: 0,
  showPreview: true,
  previewMode: 'desktop',
  validationErrors: {},
  atsAnalysis: {
    score: 0,
    keywords: [],
    missing: [],
    suggestions: []
  },
  completedSections: new Set(),
  autoSaveStatus: 'saved',
  isLoading: false,
  lastSaved: null,
  hasUnsavedChanges: false
};

// Reducer function
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
        autoSaveStatus: 'saving'
      };

    case 'ADD_ARRAY_ITEM': {
      // Fixed: Wrap lexical declarations in case blocks with curly braces
      const currentArray = state.resumeData[action.payload.section] as (Experience | Education | Skill | Certification | Project | Language)[];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: [...(currentArray || []), action.payload.item]
        },
        hasUnsavedChanges: true,
        autoSaveStatus: 'saving'
      };
    }

    case 'REMOVE_ARRAY_ITEM': {
      // Fixed: Wrap lexical declarations in case blocks with curly braces
      const arrayToFilter = state.resumeData[action.payload.section] as (Experience | Education | Skill | Certification | Project | Language)[];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: arrayToFilter.filter((_, index) => index !== action.payload.index)
        },
        hasUnsavedChanges: true,
        autoSaveStatus: 'saving'
      };
    }

    case 'UPDATE_ARRAY_ITEM': {
      // Fixed: Wrap lexical declarations in case blocks with curly braces
      const arrayToUpdate = state.resumeData[action.payload.section] as (Experience | Education | Skill | Certification | Project | Language)[];
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: arrayToUpdate.map((item, index) => 
            index === action.payload.index ? { ...item, ...action.payload.data } : item
          )
        },
        hasUnsavedChanges: true,
        autoSaveStatus: 'saving'
      };
    }

    case 'REORDER_ARRAY_ITEMS': {
      // Fixed: Wrap lexical declarations in case blocks with curly braces
      const arrayToReorder = [...(state.resumeData[action.payload.section] as (Experience | Education | Skill | Certification | Project | Language)[])];
      const [movedItem] = arrayToReorder.splice(action.payload.fromIndex, 1);
      arrayToReorder.splice(action.payload.toIndex, 0, movedItem);
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.payload.section]: arrayToReorder
        },
        hasUnsavedChanges: true,
        autoSaveStatus: 'saving'
      };
    }

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
        autoSaveStatus: 'saved',
        lastSaved: new Date()
      };

    case 'RESET_RESUME':
      return {
        ...initialState,
        lastSaved: new Date()
      };

    case 'LOAD_RESUME':
      return {
        ...state,
        resumeData: action.payload,
        hasUnsavedChanges: false,
        autoSaveStatus: 'saved',
        lastSaved: new Date()
      };

    default: {
      // Fixed: Wrap lexical declarations in case blocks with curly braces
      const hasMatch = Object.keys(action).length > 0;
      if (hasMatch) {
        return state;
      }
      return state;
    }
  }
}

// Context interface - Fixed: Replace any with proper types
interface ResumeContextType extends ResumeState {
  updateResumeData: (section: keyof ResumeData, data: PersonalInfo | Experience[] | Education[] | Skill[] | Certification[] | Project[] | Language[]) => void;
  addArrayItem: (section: keyof ResumeData, item: Experience | Education | Skill | Certification | Project | Language) => void;
  removeArrayItem: (section: keyof ResumeData, index: number) => void;
  updateArrayItem: (section: keyof ResumeData, index: number, data: Partial<Experience | Education | Skill | Certification | Project | Language>) => void;
  reorderArrayItems: (section: keyof ResumeData, fromIndex: number, toIndex: number) => void;
  setTemplate: (templateId: string) => void;
  setActiveSection: (section: string) => void;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToSection: (sectionKey: string) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  togglePreview: () => void;
  setValidationErrors: (errors: ValidationErrors) => void;
  validateSection: (section: string) => boolean;
  setATSAnalysis: (analysis: ATSAnalysis) => void;
  calculateATSScore: () => void;
  saveResume: () => void;
  loadResume: (data: ResumeData) => void;
  resetResume: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  getCompletionPercentage: () => number;
  isRequiredSectionComplete: (section: string) => boolean;
  canProceedToNext: () => boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Provider component
interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  const sectionSteps = useMemo(() => [
    { key: 'personalInfo', label: 'Personal Info', required: true },
    { key: 'experience', label: 'Experience', required: true },
    { key: 'education', label: 'Education', required: false },
    { key: 'skills', label: 'Skills', required: true },
    { key: 'certifications', label: 'Certifications', required: false },
    { key: 'projects', label: 'Projects', required: false },
    { key: 'languages', label: 'Languages', required: false }
  ], []);

  useEffect(() => {
    if (state.hasUnsavedChanges) {
      const timer = setTimeout(() => {
        dispatch({ type: 'MARK_SAVED' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.hasUnsavedChanges]);

  // Fixed: Added missing React Hook dependency (sectionSteps)
  useEffect(() => {
    const completed = new Set<string>();
    const { resumeData } = state;

    const personalInfo = resumeData.personalInfo;
    if (personalInfo.firstName && personalInfo.lastName && 
        personalInfo.email && personalInfo.summary && personalInfo.summary.length > 50) {
      completed.add('personalInfo');
    }
    
    if (resumeData.experience.length > 0 && 
        resumeData.experience.some((exp) => exp.title && exp.company && exp.description)) {
      completed.add('experience');
    }
    
    if (resumeData.education.length > 0) {
      completed.add('education');
    }
    
    if (resumeData.skills.length >= 3) {
      completed.add('skills');
    }
    
    if (resumeData.certifications.length > 0) {
      completed.add('certifications');
    }

    if (resumeData.projects && resumeData.projects.length > 0) {
      completed.add('projects');
    }

    if (resumeData.languages && resumeData.languages.length > 0) {
      completed.add('languages');
    }
    
    dispatch({ type: 'UPDATE_COMPLETED_SECTIONS', payload: completed });
  }, [state.resumeData, sectionSteps]); // Fixed: Added missing dependency

  // Action functions - Fixed: Replace any with proper types
  const updateResumeData = (section: keyof ResumeData, data: PersonalInfo | Experience[] | Education[] | Skill[] | Certification[] | Project[] | Language[]) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { section, data } });
  };

  const addArrayItem = (section: keyof ResumeData, item: Experience | Education | Skill | Certification | Project | Language) => {
    dispatch({ type: 'ADD_ARRAY_ITEM', payload: { section, item } });
  };

  const removeArrayItem = (section: keyof ResumeData, index: number) => {
    dispatch({ type: 'REMOVE_ARRAY_ITEM', payload: { section, index } });
  };

  const updateArrayItem = (section: keyof ResumeData, index: number, data: Partial<Experience | Education | Skill | Certification | Project | Language>) => {
    dispatch({ type: 'UPDATE_ARRAY_ITEM', payload: { section, index, data } });
  };

  const reorderArrayItems = (section: keyof ResumeData, fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_ARRAY_ITEMS', payload: { section, fromIndex, toIndex } });
  };

  const setTemplate = (templateId: string) => {
    dispatch({ type: 'SET_TEMPLATE', payload: templateId });
  };

  const setActiveSection = (section: string) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const goToNextStep = () => {
    if (state.currentStep < sectionSteps.length - 1) {
      const nextStep = state.currentStep + 1;
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionSteps[nextStep].key });
    }
  };

  const goToPrevStep = () => {
    if (state.currentStep > 0) {
      const prevStep = state.currentStep - 1;
      dispatch({ type: 'SET_CURRENT_STEP', payload: prevStep });
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionSteps[prevStep].key });
    }
  };

  const goToSection = (sectionKey: string) => {
    const stepIndex = sectionSteps.findIndex(step => step.key === sectionKey);
    if (stepIndex !== -1) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: stepIndex });
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionKey });
    }
  };

  const setPreviewMode = (mode: 'desktop' | 'mobile') => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: mode });
  };

  const togglePreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW' });
  };

  const setValidationErrors = (errors: ValidationErrors) => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
  };

  const validateSection = (section: string): boolean => {
    const errors = state.validationErrors[section];
    return !errors || Object.keys(errors).length === 0;
  };

  const setATSAnalysis = (analysis: ATSAnalysis) => {
    dispatch({ type: 'SET_ATS_ANALYSIS', payload: analysis });
  };

  const calculateATSScore = () => {
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
  };

  const saveResume = () => {
    dispatch({ type: 'MARK_SAVED' });
  };

  const loadResume = (data: ResumeData) => {
    dispatch({ type: 'LOAD_RESUME', payload: data });
  };

  const resetResume = () => {
    dispatch({ type: 'RESET_RESUME' });
  };

  const exportData = (): string => {
    return JSON.stringify(state.resumeData, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      dispatch({ type: 'LOAD_RESUME', payload: data });
      return true;
    } catch (error) {
      console.error('Failed to import resume data:', error);
      return false;
    }
  };

  const getCompletionPercentage = (): number => {
    const totalSections = sectionSteps.length;
    const completedCount = state.completedSections.size;
    return Math.round((completedCount / totalSections) * 100);
  };

  const isRequiredSectionComplete = (section: string): boolean => {
    const sectionConfig = sectionSteps.find(step => step.key === section);
    if (!sectionConfig?.required) return true;
    return state.completedSections.has(section);
  };

  const canProceedToNext = (): boolean => {
    const currentSection = sectionSteps[state.currentStep];
    if (!currentSection?.required) return true;
    return state.completedSections.has(currentSection.key);
  };

  const contextValue: ResumeContextType = {
    ...state,
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
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

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

export default ResumeContext;