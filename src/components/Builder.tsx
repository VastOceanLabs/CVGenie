/**
 * Enhanced Builder.tsx with Job Description Matcher Integration
 * 
 * FIXES APPLIED:
 * ✅ Fixed Palette icon import (using Paintbrush2 as Palette)
 * ✅ Removed duplicate transform class in redo button
 * ✅ Removed unused jobDescriptionParser import
 * ✅ Fixed prop forwarding in stub components
 * ✅ Added defensive coding with optional chaining
 * ✅ Added saveCount undefined guard
 * ✅ Improved React keys with unique generation
 * ✅ Enhanced accessibility with aria-live and screen reader support
 * ✅ Added React.memo for ResumePreview performance
 * ✅ Improved time formatting with screen reader alternatives
 * ✅ Added color-blind friendly indicators and text alternatives
 * ✅ Enhanced error boundaries and validation
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Fixed: Single import line for better maintainability and faster bundling
import { 
  Download, Eye, EyeOff, Paintbrush2 as Palette, FileText, Target, Smartphone, Monitor, 
  User, Briefcase, GraduationCap, Brain, Award, CheckCircle, Clock, 
  AlertCircle, Save, Wifi, WifiOff, RotateCcw, Zap, TrendingUp
} from 'lucide-react';

// Import AutoSave components
import { 
  AutoSaveProvider, 
  useResumeAutoSave, 
  AutoSaveStatusWidget, 
  AutoSaveHistory,
  useAutoSave 
} from '../services/AutoSave';

// Import Analytics and Performance
import { useAnalytics } from '../utils/analytics';
import { usePerformanceMeasure } from '../utils/performance';

// Import Job Description Matcher components
import JobDescriptionMatcher from '../components/JobDescriptionMatcher';
import { matchResumeToJob } from '../utils/jobDescriptionParser';

// Import section components
import PersonalInfoSection from './PersonalInfoSection';
import CertificationsSection from './CertificationsSection';
import ATSScoreWidget from './ATSScoreWidget';

// Fixed: Stub components to prevent crashes until real components are built
// Fixed: Only pass required props to PersonalInfoSection to avoid prop shape conflicts
function ExperienceSection({ 
  resumeData, 
  updateResumeData, 
  addArrayItem, 
  removeArrayItem, 
  updateArrayItem,
  goToNextStep,
  goToPrevStep,
  currentStep,
  totalSteps,
  validationErrors,
  setValidationErrors
}) {
  const personalInfoProps = {
    resumeData,
    updateResumeData,
    goToNextStep,
    goToPrevStep,
    currentStep,
    totalSteps
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
      <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p>Experience Section Coming Soon</p>
      <p className="text-xs mt-1">Using PersonalInfoSection as placeholder</p>
      <div className="mt-4">
        <PersonalInfoSection {...personalInfoProps} />
      </div>
    </div>
  );
}

function EducationSection({ 
  resumeData, 
  updateResumeData, 
  addArrayItem, 
  removeArrayItem, 
  updateArrayItem,
  goToNextStep,
  goToPrevStep,
  currentStep,
  totalSteps,
  validationErrors,
  setValidationErrors
}) {
  const personalInfoProps = {
    resumeData,
    updateResumeData,
    goToNextStep,
    goToPrevStep,
    currentStep,
    totalSteps
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
      <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p>Education Section Coming Soon</p>
      <p className="text-xs mt-1">Using PersonalInfoSection as placeholder</p>
      <div className="mt-4">
        <PersonalInfoSection {...personalInfoProps} />
      </div>
    </div>
  );
}

function SkillsSection({ 
  resumeData, 
  updateResumeData, 
  addArrayItem, 
  removeArrayItem, 
  updateArrayItem,
  goToNextStep,
  goToPrevStep,
  currentStep,
  totalSteps,
  validationErrors,
  setValidationErrors
}) {
  const personalInfoProps = {
    resumeData,
    updateResumeData,
    goToNextStep,
    goToPrevStep,
    currentStep,
    totalSteps
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p>Skills Section Coming Soon</p>
      <p className="text-xs mt-1">Using PersonalInfoSection as placeholder</p>
      <div className="mt-4">
        <PersonalInfoSection {...personalInfoProps} />
      </div>
    </div>
  );
}

// Analytics Helper Functions
const calculateCompletedSections = (resumeData) => {
  let completed = 0;
  
  // Personal Info
  const personalInfo = resumeData.personalInfo || {};
  if (personalInfo.firstName && personalInfo.lastName && personalInfo.email && personalInfo.summary) {
    completed++;
  }
  
  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    completed++;
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    completed++;
  }
  
  // Skills
  if (resumeData.skills && resumeData.skills.length >= 3) {
    completed++;
  }
  
  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    completed++;
  }
  
  return completed;
};

const calculateCompletionPercentage = (section, data) => {
  switch (section) {
    case 'personalInfo':
      const fields = ['firstName', 'lastName', 'email', 'phone', 'summary'];
      const completed = fields.filter(field => data[field] && data[field].trim()).length;
      return Math.round((completed / fields.length) * 100);
    
    case 'experience':
      if (!data || data.length === 0) return 0;
      const expComplete = data.filter(exp => exp.title && exp.company && exp.description).length;
      return Math.min(100, Math.round((expComplete / Math.max(data.length, 1)) * 100));
    
    case 'skills':
      // Fixed: Clamp to 100% when skills exceed target of 5
      return Math.min(100, Math.round((data.length / 5) * 100));
    
    case 'education':
      if (!data || data.length === 0) return 0;
      const eduComplete = data.filter(edu => edu.degree && edu.institution).length;
      return Math.min(100, Math.round((eduComplete / Math.max(data.length, 1)) * 100));
    
    case 'certifications':
      if (!data || data.length === 0) return 0;
      const certComplete = data.filter(cert => cert.name && cert.issuer).length;
      return Math.min(100, Math.round((certComplete / Math.max(data.length, 1)) * 100));
    
    default:
      return 0;
  }
};

const calculateATSScore = (resumeData) => {
  // Simple ATS score calculation - you can make this more sophisticated
  let score = 0;
  
  // Personal info completeness (30 points)
  const personalInfo = resumeData.personalInfo || {};
  if (personalInfo.firstName && personalInfo.lastName) score += 5;
  if (personalInfo.email) score += 5;
  if (personalInfo.phone) score += 5;
  if (personalInfo.summary && personalInfo.summary.length > 100) score += 15;
  
  // Experience (40 points)
  const experience = resumeData.experience || [];
  if (experience.length > 0) score += 10;
  if (experience.some(exp => exp.description && exp.description.length > 150)) score += 15;
  if (experience.some(exp => /\d+%|\$\d+|\d+\+/.test(exp.description || ''))) score += 15; // Has metrics
  
  // Skills (20 points)
  const skills = resumeData.skills || [];
  if (skills.length >= 5) score += 10;
  if (skills.length >= 10) score += 10;
  
  // Education (10 points)
  if (resumeData.education && resumeData.education.length > 0) score += 10;
  
  return Math.min(100, score);
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We're sorry, but there was an error loading the resume builder.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default resume data
const defaultResumeData = {
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

// Custom hook for progress tracking
function useProgressIndicator(sectionSteps, resumeData) {
  const [completedSections, setCompletedSections] = useState(new Set());

  useEffect(() => {
    const completed = new Set();
    
    // Personal Info completion check - Fixed: Safe property access
    const personalInfo = resumeData.personalInfo || {};
    const summary = personalInfo.summary ?? "";
    if (personalInfo.firstName && personalInfo.lastName && 
        personalInfo.email && summary && summary.length > 50) {
      completed.add('personalInfo');
    }
    
    // Experience completion check - Fixed: Safe array access
    const experience = resumeData.experience || [];
    if (experience.length > 0 && 
        experience.some((exp) => exp.title && exp.company && exp.description)) {
      completed.add('experience');
    }
    
    // Education completion check - Fixed: Safe array access
    const education = resumeData.education || [];
    if (education.length > 0) {
      completed.add('education');
    }
    
    // Skills completion check - Fixed: Safe array access
    const skills = resumeData.skills || [];
    if (skills.length >= 3) {
      completed.add('skills');
    }
    
    // Certifications completion check - Fixed: Safe array access
    const certifications = resumeData.certifications || [];
    if (certifications.length > 0) {
      completed.add('certifications');
    }
    
    setCompletedSections(completed);
  }, [resumeData, sectionSteps]);

  return completedSections;
}

// Progress Indicator Component
function ProgressIndicator({ 
  sectionSteps, 
  completedSections, 
  activeSection, 
  onSectionClick, 
  validationErrors = {},
  showProgress = true,
  showTimeEstimates = true,
  showDescriptions = true,
  compact = false 
}) {
  const totalSections = sectionSteps.length;
  const completedCount = completedSections.size;
  const progressPercentage = (completedCount / totalSections) * 100;
  
  const totalEstimatedTime = sectionSteps.reduce((total, step) => total + (step.estimatedTimeMinutes || 0), 0);
  const completedTime = sectionSteps
    .filter(step => completedSections.has(step.key))
    .reduce((total, step) => total + (step.estimatedTimeMinutes || 0), 0);
  
  // Fixed: Prevent negative remaining time
  const remainingTime = Math.max(0, totalEstimatedTime - completedTime);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Progress</h4>
        {showProgress && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{completedCount} of {totalSections} sections</span>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              progressPercentage === 100 ? 'bg-green-100 text-green-700' :
              progressPercentage >= 60 ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {Math.round(progressPercentage)}%
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}

      {/* Time Estimate */}
      {showTimeEstimates && (
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Completed: {completedTime} min</span>
          </div>
          <div>
            <span>Remaining: {remainingTime} min</span>
          </div>
        </div>
      )}

      {/* Section List */}
      <div className={`space-y-2 ${compact ? 'space-y-1' : ''}`}>
        {sectionSteps.map((step, index) => {
          const isCompleted = completedSections.has(step.key);
          const isActive = activeSection === step.key;
          const hasErrors = validationErrors[step.key] && Object.keys(validationErrors[step.key]).length > 0;
          const IconComponent = step.icon;

          return (
            <button
              key={`${step.key}-${index}`}
              onClick={() => onSectionClick(step.key)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              } ${compact ? 'p-2' : ''}`}
            >
              <div className="flex items-center space-x-3">
                {/* Status Icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 text-white'
                    : hasErrors
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : hasErrors ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Section Info */}
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <div className={`font-medium ${
                      isActive ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {step.label}
                      {step.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    {showDescriptions && !compact && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Estimate & Status */}
              <div className="flex items-center space-x-2">
                {showTimeEstimates && step.estimatedTimeMinutes && (
                  <span className="text-xs text-gray-500">
                    {step.estimatedTimeMinutes} min
                  </span>
                )}
                {hasErrors && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {isCompleted && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          {progressPercentage === 100 ? (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Resume completed! Ready to download.</span>
            </div>
          ) : (
            <span>
              Complete {sectionSteps.filter(s => s.required).length - 
                sectionSteps.filter(s => s.required && completedSections.has(s.key)).length} more required sections
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced AutoSave Status Widget that handles undo/redo
function EnhancedAutoSaveWidget({ 
  autoSaveState,
  resumeData, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  className = "",
  compact = false 
}) {
  const { forceSave } = useAutoSave();

  // Fixed: Better date formatting with proper fallbacks and accessibility
  const formatLastSaved = useCallback((date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Return object with display text and screen reader text
    if (diffMins < 1) return { display: 'just now', screenReader: 'saved just now' };
    if (diffMins < 60) return { 
      display: `${diffMins}m ago`, 
      screenReader: `saved ${diffMins} minute${diffMins !== 1 ? 's' : ''} ago` 
    };
    if (diffHours < 24) return { 
      display: `${diffHours}h ago`, 
      screenReader: `saved ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago` 
    };
    if (diffDays < 7) return { 
      display: `${diffDays}d ago`, 
      screenReader: `saved ${diffDays} day${diffDays !== 1 ? 's' : ''} ago` 
    };
    
    const displayTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return { 
      display: displayTime, 
      screenReader: `saved on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}` 
    };
  }, []);

  const handleManualSave = useCallback(async () => {
    try {
      await forceSave(resumeData, 'Manual save triggered');
    } catch (error) {
      console.error('Manual save failed:', error);
    }
  }, [forceSave, resumeData]);

  if (compact) {
    const timeInfo = autoSaveState.status === 'saved' && autoSaveState.lastSaved 
      ? formatLastSaved(autoSaveState.lastSaved)
      : null;

    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Status Icon */}
        <div className={`flex items-center space-x-1 ${
          autoSaveState.status === 'saving' ? 'text-yellow-500' :
          autoSaveState.status === 'saved' ? 'text-green-500' :
          autoSaveState.status === 'error' ? 'text-red-500' :
          autoSaveState.status === 'offline' ? 'text-gray-400' :
          'text-gray-400'
        }`}>
          {autoSaveState.status === 'saving' && <Clock className="w-4 h-4 animate-spin" />}
          {autoSaveState.status === 'saved' && <CheckCircle className="w-4 h-4" />}
          {autoSaveState.status === 'error' && <AlertCircle className="w-4 h-4" />}
          {autoSaveState.status === 'offline' && <WifiOff className="w-4 h-4" />}
          {autoSaveState.status === 'idle' && <Save className="w-4 h-4" />}
        </div>
        <span 
          className="text-sm text-gray-600"
          aria-live="polite"
          aria-label={timeInfo ? timeInfo.screenReader : autoSaveState.status}
        >
          {timeInfo 
            ? `Saved ${timeInfo.display}`
            : autoSaveState.status === 'saving' ? 'Saving...'
            : autoSaveState.status === 'error' ? 'Save failed'
            : autoSaveState.status === 'offline' ? 'Offline'
            : 'Ready to save'
          }
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Status Icon */}
          <div className={`flex items-center space-x-1 ${
            autoSaveState.status === 'saving' ? 'text-yellow-500' :
            autoSaveState.status === 'saved' ? 'text-green-500' :
            autoSaveState.status === 'error' ? 'text-red-500' :
            autoSaveState.status === 'offline' ? 'text-gray-400' :
            'text-gray-400'
          }`}>
            {autoSaveState.status === 'saving' && <Clock className="w-4 h-4 animate-spin" />}
            {autoSaveState.status === 'saved' && <CheckCircle className="w-4 h-4" />}
            {autoSaveState.status === 'error' && <AlertCircle className="w-4 h-4" />}
            {autoSaveState.status === 'offline' && <WifiOff className="w-4 h-4" />}
            {autoSaveState.status === 'idle' && <Save className="w-4 h-4" />}
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-900" aria-live="polite">
              {autoSaveState.status === 'saved' && autoSaveState.lastSaved 
                ? `Saved ${formatLastSaved(autoSaveState.lastSaved)}`
                : autoSaveState.status === 'saving' ? 'Saving...'
                : autoSaveState.status === 'error' ? 'Save failed'
                : autoSaveState.status === 'offline' ? 'Offline'
                : 'Ready to save'
              }
            </div>
            {autoSaveState.lastSaved && (
              <div className="text-xs text-gray-500">
                Save #{autoSaveState.saveCount ?? 0} • {autoSaveState.lastSaved.toLocaleTimeString()}
              </div>
            )}
            {autoSaveState.errorMessage && (
              <div className="text-xs text-red-600 mt-1">
                {autoSaveState.errorMessage}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Undo button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo (Ctrl+Z)"
            aria-label="Undo last action"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Redo button */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo (Ctrl+Y)"
            aria-label="Redo last undone action"
          >
            <RotateCcw className="w-4 h-4 transform rotate-180" />
          </button>

          {/* Manual save button */}
          <button
            onClick={handleManualSave}
            disabled={autoSaveState.status === 'saving' || autoSaveState.status === 'offline'}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Save manually"
          >
            Save Now
          </button>

          {/* Online status */}
          <div className="flex items-center space-x-1" title={autoSaveState.isOnline ? 'Online' : 'Offline'}>
            {autoSaveState.isOnline ? (
              <Wifi className="w-3 h-3 text-green-500" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Unsaved changes indicator */}
      {autoSaveState.hasUnsavedChanges && (
        <div className="mt-2 flex items-center space-x-1 text-xs text-yellow-600" aria-live="polite">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>You have unsaved changes</span>
        </div>
      )}
    </div>
  );
}

// Resume Preview Component - Fixed: Added defensive coding, better keys, and memoization for performance
const ResumePreview = React.memo(function ResumePreview({ resumeData, template }) {
  // Fixed: Safe array access and object guards
  const personalInfo = resumeData?.personalInfo || {};
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const skills = resumeData?.skills || [];
  const certifications = resumeData?.certifications || [];

  // Helper function to generate unique keys - memoized for performance
  const generateKey = React.useCallback((item, index, prefix) => {
    return item?.id || `${prefix}-${index}-${Date.now()}`;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-full" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {/* Header - Fixed: Added optional chaining */}
        <div 
          className="px-8 py-6"
          style={{ background: `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.secondary}08)` }}
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {personalInfo?.firstName || 'Your Name'} {personalInfo?.lastName || ''}
            </h1>
            {personalInfo?.jobTitle && (
              <p className="text-lg text-gray-600 mb-2">{personalInfo.jobTitle}</p>
            )}
            <div className="text-gray-600 space-y-1">
              {personalInfo?.email && (
                <div>{personalInfo.email}</div>
              )}
              <div className="flex justify-center space-x-4 text-sm">
                {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                {personalInfo?.location && <span>{personalInfo.location}</span>}
              </div>
              {(personalInfo?.linkedin || personalInfo?.website) && (
                <div className="flex justify-center space-x-4 text-sm">
                  {personalInfo?.linkedin && <span className="text-blue-600">{personalInfo.linkedin}</span>}
                  {personalInfo?.website && <span className="text-blue-600">{personalInfo.website}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Summary */}
          {personalInfo?.summary && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={generateKey(exp, index, 'exp')}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp?.title || 'Job Title'}</h3>
                        <div className="text-gray-700">{exp?.company || ''}</div>
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        <div>{exp?.startDate || ''} {exp?.endDate && `- ${exp.endDate}`} {exp?.current && '- Present'}</div>
                        {exp?.location && <div>{exp.location}</div>}
                      </div>
                    </div>
                    {exp?.description && (
                      <div className="text-gray-700 mt-2 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, index) => (
                  <div key={generateKey(edu, index, 'edu')}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu?.degree || ''} {edu?.field && `in ${edu.field}`}
                        </h3>
                        <div className="text-gray-700">{edu?.institution || ''}</div>
                      </div>
                      <span className="text-sm text-gray-600">{edu?.graduationDate || ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={generateKey(skill, index, 'skill')} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {skill?.name || skill || ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={generateKey(cert, index, 'cert')}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert?.name || 'Certification'}</h3>
                        <div className="text-gray-700">{cert?.issuer || ''}</div>
                      </div>
                      <span className="text-sm text-gray-600">{cert?.dateObtained || ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Custom hook for builder state with Job Matcher integration
function useBuilderStore() {
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [currentTemplate, setCurrentTemplate] = useState('professional');
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [startTime] = useState(Date.now());
  const [sectionStartTime, setSectionStartTime] = useState(Date.now());
  const [previousATSScore, setPreviousATSScore] = useState(0);

  // NEW: Job Matcher State
  const [showJobMatcher, setShowJobMatcher] = useState(false);
  const [jobMatchData, setJobMatchData] = useState(null);
  const [lastJobDescription, setLastJobDescription] = useState('');

  // Analytics integration
  const { 
    trackResumeEvent, 
    trackSectionCompletion, 
    trackTemplateUsage,
    trackATSScore,
    trackAutoSave,
    trackError,
    setUserProperties 
  } = useAnalytics();

  // Use the AutoSave hook
  const { autoSaveStatus, lastSaved, hasUnsavedChanges, isOnline } = useResumeAutoSave(resumeData);
  const { performUndo, performRedo, canUndo, canRedo, autoSaveState } = useAutoSave();

  // Fixed: Memoized constants to prevent recreation
  const templates = useMemo(() => ({
    professional: {
      id: 'professional',
      name: 'Professional',
      category: 'Corporate',
      colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
      layout: 'single-column',
      description: 'Clean, traditional design perfect for corporate roles',
      atsScore: 95
    },
    modern: {
      id: 'modern',
      name: 'Modern',
      category: 'Creative',
      colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
      layout: 'two-column',
      description: 'Contemporary design with striking color accents',
      atsScore: 88
    },
    creative: {
      id: 'creative',
      name: 'Creative',
      category: 'Design',
      colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' },
      layout: 'creative',
      description: 'Artistic design perfect for creative industries',
      atsScore: 75
    },
    minimal: {
      id: 'minimal',
      name: 'Minimal',
      category: 'Classic',
      colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#9ca3af' },
      layout: 'minimal',
      description: 'Clean and simple for timeless appeal',
      atsScore: 92
    }
  }), []);

  const sectionSteps = useMemo(() => [
    { 
      key: 'personalInfo', 
      label: 'Personal Info', 
      description: 'Basic contact information and professional summary',
      icon: User,
      required: true,
      estimatedTimeMinutes: 3,
      component: PersonalInfoSection 
    },
    { 
      key: 'experience', 
      label: 'Experience', 
      description: 'Work history and achievements',
      icon: Briefcase,
      required: true,
      estimatedTimeMinutes: 8,
      component: ExperienceSection
    },
    { 
      key: 'education', 
      label: 'Education', 
      description: 'Academic background and qualifications',
      icon: GraduationCap,
      required: false,
      estimatedTimeMinutes: 4,
      component: EducationSection
    },
    { 
      key: 'skills', 
      label: 'Skills', 
      description: 'Technical and soft skills',
      icon: Brain,
      required: true,
      estimatedTimeMinutes: 5,
      component: SkillsSection
    },
    { 
      key: 'certifications', 
      label: 'Certifications', 
      description: 'Professional certifications and licenses',
      icon: Award,
      required: false,
      estimatedTimeMinutes: 3,
      component: CertificationsSection 
    }
  ], []);

  // Use the progress indicator hook
  const completedSections = useProgressIndicator(sectionSteps, resumeData);

  // Data management functions
  const updateResumeData = useCallback((section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  const safeAddArrayItem = useCallback((section, newItem) => {
    const currentData = resumeData[section];
    if (!Array.isArray(currentData)) {
      console.warn(`Cannot add array item: ${section} is not an array`);
      return;
    }
    setResumeData(prev => ({
      ...prev,
      [section]: [...currentData, newItem]
    }));
  }, [resumeData]);

  const safeRemoveArrayItem = useCallback((section, index) => {
    const currentData = resumeData[section];
    if (!Array.isArray(currentData)) {
      console.warn(`Cannot remove array item: ${section} is not an array`);
      return;
    }
    setResumeData(prev => ({
      ...prev,
      [section]: currentData.filter((_, i) => i !== index)
    }));
  }, [resumeData]);

  const safeUpdateArrayItem = useCallback((section, index, data) => {
    const currentData = resumeData[section];
    if (!Array.isArray(currentData)) {
      console.warn(`Cannot update array item: ${section} is not an array`);
      return;
    }
    setResumeData(prev => ({
      ...prev,
      [section]: currentData.map((item, i) => i === index ? { ...item, ...data } : item)
    }));
  }, [resumeData]);

  // NEW: Job Matcher Functions
  const handleJobMatch = useCallback(async (jobDescriptionText) => {
    try {
      setLastJobDescription(jobDescriptionText);
      const analysis = matchResumeToJob(resumeData, jobDescriptionText);
      setJobMatchData(analysis);
      
      // Track job matching usage
      trackResumeEvent('job_match_analyzed', {
        match_score: analysis.overallScore,
        missing_keywords_count: analysis.missingKeywords.length,
        matched_keywords_count: analysis.matchedKeywords.length
      });
      
      return analysis;
    } catch (error) {
      trackError({
        message: 'Job matching failed',
        error: error.message,
        context: 'job_matcher'
      });
      throw error;
    }
  }, [resumeData, trackResumeEvent, trackError]);

  const handleKeywordSuggestion = useCallback((keyword, category) => {
    // Add suggested keyword to skills
    const newSkill = {
      name: keyword,
      category: category || 'technical',
      level: 'intermediate',
      years: '',
      featured: false
    };
    
    safeAddArrayItem('skills', newSkill);
    
    // Track keyword addition
    trackResumeEvent('keyword_added_from_job_match', {
      keyword,
      category,
      source: 'job_matcher'
    });
  }, [safeAddArrayItem, trackResumeEvent]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const undoData = performUndo();
    if (undoData) {
      setResumeData(undoData);
      return true;
    }
    return false;
  }, [performUndo]);

  const handleRedo = useCallback(() => {
    const redoData = performRedo();
    if (redoData) {
      setResumeData(redoData);
      return true;
    }
    return false;
  }, [performRedo]);

  // Template change with analytics
  const handleTemplateChange = useCallback((templateId) => {
    const oldTemplate = currentTemplate;
    setCurrentTemplate(templateId);
    
    const templateName = templates[templateId]?.name || templateId;
    trackTemplateUsage(templateId, templateName);
    
    setUserProperties({
      preferred_template: templateId
    });
    
    trackResumeEvent('template_changed', {
      from_template: oldTemplate,
      to_template: templateId,
      template_name: templateName
    });
  }, [currentTemplate, templates, trackTemplateUsage, setUserProperties, trackResumeEvent]);

  // Download tracking
  const handleDownload = useCallback((format = 'pdf') => {
    trackResumeEvent('resume_download', {
      format,
      template_used: currentTemplate,
      sections_completed: calculateCompletedSections(resumeData),
      total_sections: 5,
      ats_score: calculateATSScore(resumeData),
      has_job_match: !!jobMatchData
    });
    
    alert('PDF download functionality coming soon!');
  }, [trackResumeEvent, currentTemplate, resumeData, jobMatchData]);

  // Error tracking
  const handleError = useCallback((error, errorInfo) => {
    trackError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      context: 'react_error_boundary'
    });
  }, [trackError]);

  return {
    resumeData,
    currentTemplate,
    setCurrentTemplate: handleTemplateChange,
    activeSection,
    setActiveSection,
    currentStep,
    setCurrentStep,
    autoSaveStatus,
    lastSaved,
    hasUnsavedChanges,
    isOnline,
    autoSaveState,
    completedSections,
    validationErrors,
    setValidationErrors,
    updateResumeData,
    addArrayItem: safeAddArrayItem,
    removeArrayItem: safeRemoveArrayItem,
    updateArrayItem: safeUpdateArrayItem,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    templates,
    sectionSteps,
    handleDownload,
    handleError,
    // NEW: Job Matcher methods
    showJobMatcher,
    setShowJobMatcher,
    jobMatchData,
    lastJobDescription,
    handleJobMatch,
    handleKeywordSuggestion
  };
}

// Main Builder Component
function BuilderCore() {
  const { startMeasure, endMeasure } = usePerformanceMeasure('resume_builder_load');

  const {
    resumeData,
    currentTemplate,
    setCurrentTemplate,
    activeSection,
    setActiveSection,
    currentStep,
    setCurrentStep,
    autoSaveStatus,
    lastSaved,
    hasUnsavedChanges,
    isOnline,
    autoSaveState,
    completedSections,
    validationErrors,
    setValidationErrors,
    updateResumeData,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    templates,
    sectionSteps,
    handleDownload,
    handleError,
    // NEW: Job Matcher state and methods
    showJobMatcher,
    setShowJobMatcher,
    jobMatchData,
    lastJobDescription,
    handleJobMatch,
    handleKeywordSuggestion
  } = useBuilderStore();

  const [previewMode, setPreviewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showPhraseLibrary, setShowPhraseLibrary] = useState(false);
  const [showAutoSaveHistory, setShowAutoSaveHistory] = useState(false);

  // Performance measurement
  useEffect(() => {
    startMeasure();
    const timer = setTimeout(() => {
      endMeasure();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [startMeasure, endMeasure]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
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
  }, [handleUndo, handleRedo]);

  // Get current template object
  const currentTemplateObj = templates[currentTemplate];

  // Navigation helpers
  const goToNextStep = useCallback(() => {
    if (currentStep < sectionSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setActiveSection(sectionSteps[nextStep].key);
    }
  }, [currentStep, sectionSteps, setCurrentStep, setActiveSection]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setActiveSection(sectionSteps[prevStep].key);
    }
  }, [currentStep, sectionSteps, setCurrentStep, setActiveSection]);

  const goToSection = useCallback((sectionKey) => {
    const stepIndex = sectionSteps.findIndex(step => step.key === sectionKey);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setActiveSection(sectionKey);
    }
  }, [sectionSteps, setCurrentStep, setActiveSection]);

  // Handle ATS suggestion clicks
  const handleAtsSuggestionClick = useCallback((suggestion) => {
    const categoryToSection = {
      'Contact Info': 'personalInfo',
      'Professional Summary': 'personalInfo',
      'Work Experience': 'experience',
      'Skills': 'skills',
      'Keywords': activeSection,
      'Template': 'template'
    };

    const targetSection = categoryToSection[suggestion.category];
    if (targetSection && targetSection !== 'template') {
      goToSection(targetSection);
    } else if (targetSection === 'template') {
      setShowTemplateSelector(true);
    }
  }, [activeSection, goToSection]);

  // Render current section
  const renderCurrentSection = useCallback(() => {
    const currentSectionConfig = sectionSteps.find(step => step.key === activeSection);
    if (!currentSectionConfig) return null;

    const SectionComponent = currentSectionConfig.component;
    const sharedProps = {
      resumeData,
      updateResumeData,
      addArrayItem,
      removeArrayItem,
      updateArrayItem,
      setShowPhraseLibrary,
      goToNextStep,
      goToPrevStep,
      currentStep,
      totalSteps: sectionSteps.length,
      validationErrors,
      setValidationErrors
    };

    return <SectionComponent {...sharedProps} />;
  }, [activeSection, sectionSteps, resumeData, updateResumeData, addArrayItem, removeArrayItem, updateArrayItem, goToNextStep, goToPrevStep, currentStep, validationErrors, setValidationErrors]);

  return (
    <ErrorBoundary onError={handleError}>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header with Job Matcher */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">FreeResume Builder</h1>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">100% FREE</span>
                </div>
                
                {/* AutoSave Status Widget - Compact for header */}
                <div className="hidden sm:block">
                  <EnhancedAutoSaveWidget 
                    autoSaveState={autoSaveState}
                    resumeData={resumeData}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    compact={true}
                  />
                </div>

                {/* Offline indicator for mobile */}
                {!isOnline && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs">
                    <WifiOff className="w-3 h-3" />
                    <span className="hidden sm:inline">Offline</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* NEW: Job Matcher Button */}
                <button
                  onClick={() => setShowJobMatcher(!showJobMatcher)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                    showJobMatcher 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Job Matcher</span>
                  {jobMatchData && (
                    <div className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                      jobMatchData.overallScore >= 80 ? 'bg-green-500 text-white' :
                      jobMatchData.overallScore >= 60 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {jobMatchData.overallScore}%
                    </div>
                  )}
                </button>

                {/* AutoSave History Button */}
                <button
                  onClick={() => setShowAutoSaveHistory(!showAutoSaveHistory)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="View save history"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden md:inline">History</span>
                </button>

                {/* Preview toggle */}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>

                {/* Template selector */}
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Template</span>
                </button>

                {/* Download button */}
                <button 
                  onClick={() => handleDownload('pdf')}
                  disabled={autoSaveState.status === 'saving' || hasUnsavedChanges}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium relative"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                  {hasUnsavedChanges && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* NEW: Job Matcher Modal/Panel */}
        {showJobMatcher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <JobDescriptionMatcher 
                resumeData={resumeData}
                onKeywordSuggestion={handleKeywordSuggestion}
                onClose={() => setShowJobMatcher(false)}
                className="flex-1 overflow-hidden"
              />
            </div>
          </div>
        )}

        {/* AutoSave History Overlay */}
        {showAutoSaveHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-hidden">
              <AutoSaveHistory 
                onRestore={(data) => {
                  updateResumeData('personalInfo', data.personalInfo || {});
                  updateResumeData('experience', data.experience || []);
                  updateResumeData('education', data.education || []);
                  updateResumeData('skills', data.skills || []);
                  updateResumeData('certifications', data.certifications || []);
                  setShowAutoSaveHistory(false);
                }}
              />
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAutoSaveHistory(false)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : ''}`}>
              {/* Progress Indicator */}
              <div className="space-y-4">
                <ProgressIndicator 
                  sectionSteps={sectionSteps}
                  completedSections={completedSections}
                  activeSection={activeSection}
                  onSectionClick={goToSection}
                  validationErrors={validationErrors}
                  showProgress={true}
                  showTimeEstimates={true}
                  showDescriptions={true}
                  compact={false}
                />

                {/* Full AutoSave Status Widget for desktop */}
                <div className="hidden sm:block">
                  <EnhancedAutoSaveWidget 
                    autoSaveState={autoSaveState}
                    resumeData={resumeData}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                  />
                </div>
              </div>

              {/* NEW: Job Match Score Widget */}
              {jobMatchData && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-purple-900 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Job Match Score
                    </h3>
                    <div className={`text-2xl font-bold ${
                      jobMatchData.overallScore >= 80 ? 'text-green-600' :
                      jobMatchData.overallScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {jobMatchData.overallScore}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-green-700 font-medium">✓ Matched Keywords:</p>
                      <p className="text-green-600">{jobMatchData.matchedKeywords.length}</p>
                    </div>
                    <div>
                      <p className="text-red-700 font-medium">⚠ Missing Keywords:</p>
                      <p className="text-red-600">{jobMatchData.missingKeywords.length}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowJobMatcher(true)}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View Detailed Analysis →
                  </button>
                </div>
              )}

              {/* ATS Score Widget */}
              <ATSScoreWidget 
                resumeData={resumeData}
                template={currentTemplateObj}
                showDetailedAnalysis={true}
                onSuggestionClick={handleAtsSuggestionClick}
                className=""
              />

              {/* Current Section Content */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {renderCurrentSection()}
              </div>
            </div>

            {/* Preview Panel */}
            <div className={`space-y-4 ${!showPreview ? 'hidden lg:block' : ''}`}>
              {/* Preview Controls */}
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

              {/* Preview Container */}
              <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className={`transform origin-top transition-transform ${
                    previewMode === 'mobile' ? 'scale-75 md:scale-50' : 'scale-90 md:scale-75'
                  }`} style={{ 
                    width: previewMode === 'mobile' ? '133.33%' : '125%', 
                    marginBottom: previewMode === 'mobile' ? '-25%' : '-20%' 
                  }}>
                    <ResumePreview 
                      resumeData={resumeData}
                      template={currentTemplateObj}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile AutoSave Status */}
              <div className="sm:hidden">
                <EnhancedAutoSaveWidget 
                  autoSaveState={autoSaveState}
                  resumeData={resumeData}
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
    </ErrorBoundary>
  );
}

// Main Builder Component with AutoSave Provider
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