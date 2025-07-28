/**
 * Production-Ready Resume Builder Component
 * Clean architecture with TypeScript interfaces, using only existing files
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Download, Target, Clock, Eye, EyeOff, 
  Paintbrush2 as Palette, Smartphone, Monitor, Save, Wifi, WifiOff, 
  RotateCcw, CheckCircle, AlertCircle, User, Briefcase, 
  GraduationCap, Brain, Award, X
} from 'lucide-react';

// Import components and services - Using only existing files
import { 
  AutoSaveProvider, 
  useResumeAutoSave, 
  useAutoSave 
} from '../services/autosave-service';
import { useAnalytics } from '../utils/analytics_utils';

// TypeScript Interfaces - Clean, no PropTypes
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  jobTitle: string;
  yearsExperience: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  location?: string;
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
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  languages: string[];
}

interface Template {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  atsScore: number;
}

interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
}

interface AutoSaveState {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSaved: Date | null;
  isOnline: boolean;
  hasUnsavedChanges: boolean;
  saveCount: number;
  errorMessage?: string;
}

// Props interfaces for components
interface AutoSaveWidgetProps {
  autoSaveState: AutoSaveState;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  compact?: boolean;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: Template;
}

interface PersonalInfoFormProps {
  resumeData: ResumeData;
  updateResumeData: (section: keyof ResumeData, data: any) => void;
}

interface ComingSoonSectionProps {
  section: Section;
}

// Default resume data
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
  languages: []
};

// Section configuration
const sections: Section[] = [
  { id: 'personal', label: 'Personal Info', icon: User, required: true },
  { id: 'experience', label: 'Experience', icon: Briefcase, required: true },
  { id: 'education', label: 'Education', icon: GraduationCap, required: false },
  { id: 'skills', label: 'Skills', icon: Brain, required: true },
  { id: 'certifications', label: 'Certifications', icon: Award, required: false }
];

// Template configuration
const templates: Record<string, Template> = {
  professional: {
    id: 'professional',
    name: 'Professional',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    atsScore: 95
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    atsScore: 88
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
    atsScore: 75
  }
};

// Enhanced AutoSave Status Widget - Clean implementation
const AutoSaveWidget: React.FC<AutoSaveWidgetProps> = ({ 
  autoSaveState, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  compact = false 
}) => {
  const formatTime = useCallback((date: Date | null): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  if (compact) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          autoSaveState.status === 'saved' ? 'bg-green-500' :
          autoSaveState.status === 'saving' ? 'bg-yellow-500 animate-pulse' :
          autoSaveState.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
        }`} />
        <span className="text-gray-600">
          {autoSaveState.status === 'saved' && autoSaveState.lastSaved 
            ? `Saved ${formatTime(autoSaveState.lastSaved)}`
            : autoSaveState.status === 'saving' ? 'Saving...'
            : autoSaveState.status === 'error' ? 'Save failed'
            : 'Ready'
          }
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${
            autoSaveState.status === 'saving' ? 'text-yellow-500' :
            autoSaveState.status === 'saved' ? 'text-green-500' :
            autoSaveState.status === 'error' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {autoSaveState.status === 'saving' && <Clock className="w-4 h-4 animate-spin" />}
            {autoSaveState.status === 'saved' && <CheckCircle className="w-4 h-4" />}
            {autoSaveState.status === 'error' && <AlertCircle className="w-4 h-4" />}
            {autoSaveState.status === 'idle' && <Save className="w-4 h-4" />}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {autoSaveState.status === 'saved' && autoSaveState.lastSaved 
              ? `Saved ${formatTime(autoSaveState.lastSaved)}`
              : autoSaveState.status === 'saving' ? 'Saving...'
              : autoSaveState.status === 'error' ? 'Save failed'
              : 'Auto-save ready'
            }
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
            title="Undo (Ctrl+Z)"
            aria-label="Undo last action"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
            title="Redo (Ctrl+Y)"
            aria-label="Redo last undone action"
          >
            <RotateCcw className="w-4 h-4 rotate-180" />
          </button>
          <div className="w-3 h-3 ml-2">
            {autoSaveState.isOnline ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Resume Preview Component - Optimized with proper memoization
const ResumePreview = React.memo<ResumePreviewProps>(function ResumePreview({ resumeData, template }) {
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-full" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header */}
        <div 
          className="px-8 py-6 text-center"
          style={{ background: `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.secondary}08)` }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {personalInfo.firstName || 'Your Name'} {personalInfo.lastName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-lg text-gray-600 mb-2">{personalInfo.jobTitle}</p>
          )}
          <div className="text-gray-600 space-y-1">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            <div className="flex justify-center space-x-4 text-sm">
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
            {(personalInfo.linkedin || personalInfo.website) && (
              <div className="flex justify-center space-x-4 text-sm">
                {personalInfo.linkedin && <span className="text-blue-600">{personalInfo.linkedin}</span>}
                {personalInfo.website && <span className="text-blue-600">{personalInfo.website}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b-2" 
                  style={{ borderColor: template.colors.primary }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2" 
                  style={{ borderColor: template.colors.primary }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={`exp-${index}-${exp.title}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.title || 'Job Title'}</h3>
                        <div className="text-gray-700">{exp.company}</div>
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                        {exp.location && <div>{exp.location}</div>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 mt-2 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2" 
                  style={{ borderColor: template.colors.primary }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={`skill-${index}-${skill.name}`} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!personalInfo.summary && experience.length === 0 && skills.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Continue filling out sections to see your resume preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Personal Info Form Component - Clean implementation with proper typing
const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ resumeData, updateResumeData }) => {
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    updateResumeData('personalInfo', {
      ...resumeData.personalInfo,
      [field]: value
    });
  }, [resumeData.personalInfo, updateResumeData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.firstName}
              onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.lastName}
              onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Smith"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john.smith@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(555) 123-4567"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={resumeData.personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            value={resumeData.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a compelling 2-3 sentence summary of your professional background and key strengths..."
            required
          />
          <div className="mt-1 text-xs text-gray-500">
            {resumeData.personalInfo.summary.length} characters (aim for 100-200)
          </div>
        </div>
      </div>
    </div>
  );
};

// Coming Soon Component - Clean implementation
const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ section }) => {
  const IconComponent = section.icon;
  return (
    <div className="text-center py-12">
      <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{section.label} Section</h3>
      <p className="text-gray-600">Coming soon! This section is under development.</p>
    </div>
  );
};

// Main Builder Core Component - Clean, optimized implementation
function BuilderCore() {
  // State management - clean and typed
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [currentTemplate, setCurrentTemplate] = useState<string>('professional');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);

  // Job matching - removed until JobDescriptionMatcher is built
  const [showJobMatcher, setShowJobMatcher] = useState<boolean>(false);
  const [jobMatchData, setJobMatchData] = useState<any>(null);

  // Hooks - using only existing services
  const { trackResumeEvent, trackError } = useAnalytics();
  const { hasUnsavedChanges } = useResumeAutoSave(resumeData);
  const { performUndo, performRedo, canUndo, canRedo, autoSaveState } = useAutoSave();

  // Performance measurement - removed until performance.ts is built
  useEffect(() => {
    console.log('🚀 Resume Builder loaded');
  }, []);

  // Keyboard shortcuts - clean implementation with proper cleanup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      
      if ((event.ctrlKey || event.metaKey)) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          handleUndo();
        } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // No dependencies needed - handlers are stable

  // Data management - clean and typed
  const updateResumeData = useCallback(<K extends keyof ResumeData>(section: K, data: ResumeData[K]) => {
    setResumeData(prev => ({ ...prev, [section]: data }));
  }, []);

  // Undo/Redo handlers - clean implementation
  const handleUndo = useCallback(() => {
    const undoData = performUndo();
    if (undoData) setResumeData(undoData);
  }, [performUndo]);

  const handleRedo = useCallback(() => {
    const redoData = performRedo();
    if (redoData) setResumeData(redoData);
  }, [performRedo]);

  // Download handler - clean implementation
  const handleDownload = useCallback(() => {
    trackResumeEvent('resume_download', {
      template_used: currentTemplate,
      has_job_match: !!jobMatchData
    });
    alert('PDF download functionality coming soon!');
  }, [currentTemplate, jobMatchData, trackResumeEvent]);

  // Current template object
  const currentTemplateObj = templates[currentTemplate];

  // Render current section - clean implementation
  const renderSection = useCallback(() => {
    const section = sections.find(s => s.id === activeSection);
    
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm resumeData={resumeData} updateResumeData={updateResumeData} />;
      default:
        return section ? <ComingSoonSection section={section} /> : null;
    }
  }, [activeSection, resumeData, updateResumeData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FreeResume Builder</h1>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">100% FREE</span>
              </div>
              
              {/* Auto-save status - compact for header */}
              <div className="hidden sm:block">
                <AutoSaveWidget 
                  autoSaveState={autoSaveState}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  compact={true}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Job Matcher Button - disabled until component is built */}
              <button
                onClick={() => alert('Job Matcher feature coming soon!')}
                disabled={true}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Job Matcher (Coming Soon)</span>
              </button>

              {/* Preview toggle for mobile */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>

              {/* Template selector */}
              <button
                onClick={() => setCurrentTemplate(currentTemplate === 'professional' ? 'modern' : 'professional')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Template</span>
              </button>

              {/* Download button */}
              <button 
                onClick={handleDownload}
                disabled={hasUnsavedChanges}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Job Matcher Modal - removed until component is built */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : ''}`}>
            {/* Auto-save status - full for desktop */}
            <div className="hidden sm:block">
              <AutoSaveWidget 
                autoSaveState={autoSaveState}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>

            {/* Job Match Score Widget - removed until job matcher is built */}

            {/* Section Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900 mb-4">Resume Sections</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mb-1" />
                      <span className="text-xs">{section.label}</span>
                      {section.required && <span className="text-red-500 text-xs">*</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Section Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderSection()}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`space-y-6 ${!showPreview ? 'hidden lg:block' : ''}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className={`transform origin-top transition-transform ${
                  previewMode === 'mobile' ? 'scale-75' : 'scale-90'
                }`} style={{ 
                  width: previewMode === 'mobile' ? '133%' : '111%', 
                  marginBottom: previewMode === 'mobile' ? '-25%' : '-10%'
                }}>
                  <ResumePreview 
                    resumeData={resumeData}
                    template={currentTemplateObj}
                  />
                </div>
              </div>
            </div>

            {/* Mobile auto-save status */}
            <div className="sm:hidden">
              <AutoSaveWidget 
                autoSaveState={autoSaveState}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                compact={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Builder Component with Providers
export default function Builder() {
  return (
    <AutoSaveProvider 
      initialConfig={{
        debounceMs: 2000,
        maxHistoryEntries: 25,
        autoSaveEnabled: true,
        showVisualFeedback: true,
        onlineCheckInterval: 10000
      }}
    >
      <BuilderCore />
    </AutoSaveProvider>
  );
}