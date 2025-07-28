import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, Clock, ChevronRight } from 'lucide-react';

// ✅ PROGRESS INDICATOR HOOK FOR AUTOMATIC COMPLETION TRACKING
export function useProgressIndicator(sectionSteps: any[], resumeData: any) {
  return useMemo(() => {
    const completed = new Set<string>();
    
    // Personal Info completion logic
    const personalInfo = resumeData?.personalInfo || {};
    if (personalInfo.firstName && personalInfo.lastName && 
        personalInfo.email && personalInfo.phone && 
        personalInfo.summary && personalInfo.summary.length > 50) {
      completed.add('personalInfo');
    }
    
    // Experience completion logic
    const experience = resumeData?.experience || [];
    if (experience.length > 0 && 
        experience.some((exp: any) => 
          exp.title && exp.company && exp.description && exp.description.length > 100
        )) {
      completed.add('experience');
    }
    
    // Education completion logic (optional but recommended)
    const education = resumeData?.education || [];
    if (education.length > 0 && 
        education.some((edu: any) => edu.institution && edu.degree)) {
      completed.add('education');
    }
    
    // Skills completion logic
    const skills = resumeData?.skills || [];
    if (skills.length >= 3 && 
        skills.every((skill: any) => skill.name && skill.name.trim())) {
      completed.add('skills');
    }
    
    // Certifications completion logic (optional)
    const certifications = resumeData?.certifications || [];
    if (certifications.length > 0 && 
        certifications.some((cert: any) => cert.name && cert.issuer)) {
      completed.add('certifications');
    }
    
    return completed;
  }, [resumeData, sectionSteps]);
}

interface ProgressIndicatorProps {
  sectionSteps: Array<{
    key: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<any>;
    required?: boolean;
    estimatedTimeMinutes?: number;
  }>;
  completedSections: Set<string>;
  activeSection: string;
  onSectionClick: (sectionKey: string) => void;
  validationErrors?: any;
  showProgress?: boolean;
  showTimeEstimates?: boolean;
  showDescriptions?: boolean;
  compact?: boolean;
}

export default function ProgressIndicator({ 
  sectionSteps, 
  completedSections, 
  activeSection, 
  onSectionClick,
  validationErrors = {},
  showProgress = true,
  showTimeEstimates = false,
  showDescriptions = false,
  compact = false
}: ProgressIndicatorProps) {
  
  // Calculate overall completion percentage
  const completionPercentage = Math.round((completedSections.size / sectionSteps.length) * 100);
  
  // Calculate total estimated time
  const totalEstimatedTime = sectionSteps.reduce((total, step) => 
    total + (step.estimatedTimeMinutes || 0), 0
  );
  
  // Calculate completed time
  const completedTime = sectionSteps
    .filter(step => completedSections.has(step.key))
    .reduce((total, step) => total + (step.estimatedTimeMinutes || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Resume Progress</h4>
        {showProgress && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{completionPercentage}% Complete</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Time Estimate */}
      {showTimeEstimates && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-blue-700">
              <Clock className="w-4 h-4 mr-1" />
              <span>Time Estimate: {totalEstimatedTime} minutes</span>
            </div>
            <span className="text-blue-600">
              {completedTime}/{totalEstimatedTime} min completed
            </span>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
            <div 
              className="h-1 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedTime / totalEstimatedTime) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Section Steps */}
      <div className="space-y-2">
        {sectionSteps.map((step, index) => {
          const isCompleted = completedSections.has(step.key);
          const isActive = activeSection === step.key;
          const hasErrors = validationErrors[step.key] && 
                           Object.keys(validationErrors[step.key]).length > 0;
          const Icon = step.icon;

          return (
            <button
              key={step.key}
              onClick={() => onSectionClick(step.key)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? 'bg-blue-50 border border-blue-200 shadow-sm'
                  : isCompleted
                  ? 'bg-green-50 hover:bg-green-100 border border-green-200'
                  : hasErrors
                  ? 'bg-red-50 hover:bg-red-100 border border-red-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Status Icon */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
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

                {/* Section Icon (if provided) */}
                {Icon && !compact && (
                  <div className={`w-5 h-5 ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 
                    hasErrors ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}

                {/* Section Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      isActive ? 'text-blue-900' : 
                      isCompleted ? 'text-green-900' : 
                      hasErrors ? 'text-red-900' : 'text-gray-700'
                    }`}>
                      {step.label}
                    </span>
                    
                    {/* Required Badge */}
                    {step.required && !isCompleted && (
                      <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                        Required
                      </span>
                    )}
                    
                    {/* Time Estimate */}
                    {showTimeEstimates && step.estimatedTimeMinutes && !compact && (
                      <span className="text-xs text-gray-500">
                        ~{step.estimatedTimeMinutes} min
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  {showDescriptions && step.description && !compact && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {step.description}
                    </p>
                  )}
                  
                  {/* Error Message */}
                  {hasErrors && (
                    <p className="text-xs text-red-600 mt-0.5">
                      {Object.values(validationErrors[step.key])[0] as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Arrow Indicator */}
              <ChevronRight className={`w-4 h-4 transition-transform ${
                isActive ? 'rotate-90 text-blue-600' : 'text-gray-400'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Summary Stats */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {completedSections.size}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {sectionSteps.filter(s => s.required).length - 
                 Array.from(completedSections).filter(key => 
                   sectionSteps.find(s => s.key === key)?.required
                 ).length}
              </div>
              <div className="text-xs text-gray-600">Required Left</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">
                {sectionSteps.length - completedSections.size}
              </div>
              <div className="text-xs text-gray-600">Remaining</div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {completionPercentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              🎉 Resume Complete! Ready to download your professional resume.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}