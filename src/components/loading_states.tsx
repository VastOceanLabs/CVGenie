import React from 'react';
import { Loader, FileText, Download, Save, Sparkles, Target, Brain, Palette, CheckCircle, AlertCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// ===== TYPE DEFINITIONS =====

type LucideIcon = (props: LucideProps) => JSX.Element;

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'white' | 'gray' | 'green' | 'purple' | 'yellow';
  className?: string;
  'aria-label'?: string;
}

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

interface AutoSaveProps {
  status: 'saved' | 'saving' | 'error';
  className?: string;
}

interface PDFLoadingProps {
  progress?: number;
  stage: 'preparing' | 'generating' | 'finalizing' | 'complete';
}

interface SkeletonProps {
  variant?: 'line' | 'block' | 'avatar';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ATSLoadingProps {
  stage: 'analyzing' | 'scoring' | 'suggestions' | 'complete';
}

interface AILoadingProps {
  type: 'summary' | 'experience' | 'skills' | 'suggestions';
  className?: string;
}

interface InlineLoadingProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

interface OverlayLoadingProps {
  isVisible: boolean;
  message: string;
  subMessage?: string;
  progress?: number;
  onCancel?: () => void;
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  label?: string;
}

// ===== CONFIGURATION OBJECTS =====

const STATUS_CONFIG = {
  saved: {
    icon: CheckCircle,
    text: 'All changes saved',
    color: 'text-green-600',
    bgColor: 'bg-green-500'
  },
  saving: {
    icon: Save,
    text: 'Saving...',
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-500'
  },
  error: {
    icon: AlertCircle,
    text: 'Save failed',
    color: 'text-red-600',
    bgColor: 'bg-red-500'
  }
} as const;

const PDF_STAGE_CONFIG = {
  preparing: { text: 'Preparing your resume...', icon: FileText },
  generating: { text: 'Generating PDF...', icon: Download },
  finalizing: { text: 'Finalizing document...', icon: CheckCircle },
  complete: { text: 'PDF ready for download!', icon: CheckCircle }
} as const;

const ATS_STAGE_CONFIG = {
  analyzing: { text: 'Analyzing your resume...', progress: 25 },
  scoring: { text: 'Calculating ATS score...', progress: 60 },
  suggestions: { text: 'Generating suggestions...', progress: 85 },
  complete: { text: 'Analysis complete!', progress: 100 }
} as const;

const AI_TYPE_CONFIG = {
  summary: { text: 'AI is writing your professional summary...', icon: Brain },
  experience: { text: 'Generating experience descriptions...', icon: Sparkles },
  skills: { text: 'Analyzing relevant skills...', icon: Target },
  suggestions: { text: 'Finding the perfect phrases...', icon: Sparkles }
} as const;

// ===== UTILITY COMPONENTS =====

function ProgressBar({ value, max = 100, className = '', label }: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div className={className}>
      <div 
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  );
}

function StatusIcon({ 
  status, 
  isAnimated = false 
}: { 
  status: keyof typeof STATUS_CONFIG; 
  isAnimated?: boolean; 
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  
  return (
    <Icon 
      className={`w-4 h-4 ${isAnimated ? 'animate-pulse' : ''}`}
      aria-hidden="true"
    />
  );
}

// ===== MAIN COMPONENTS =====

export function Spinner({ 
  size = 'md', 
  color = 'blue', 
  className = '',
  'aria-label': ariaLabel
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  } as const;

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600'
  } as const;

  return (
    <span role="status" aria-label={ariaLabel || 'Loading'}>
      <Loader 
        className={`animate-spin duration-1000 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        aria-hidden="true"
      />
      <span className="sr-only">{ariaLabel || 'Loading'}</span>
    </span>
  );
}

export function LoadingButton({ 
  isLoading, 
  loadingText, 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 focus:ring-offset-2',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 focus:ring-offset-2'
  } as const;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  } as const;

  const spinnerColor = variant === 'primary' ? 'white' : 'gray';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Spinner 
            size="sm" 
            color={spinnerColor} 
            className="mr-2" 
            aria-label={loadingText}
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function AutoSaveIndicator({ status, className = '' }: AutoSaveProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <div 
      className={`flex items-center space-x-2 text-sm ${config.color} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div 
        className={`w-2 h-2 rounded-full ${config.bgColor} ${status === 'saving' ? 'animate-pulse duration-1000' : ''}`}
        aria-hidden="true"
      />
      {status === 'saving' ? (
        <Spinner size="sm" color="yellow" aria-label="Saving changes" />
      ) : (
        <StatusIcon status={status} />
      )}
      <span>{config.text}</span>
    </div>
  );
}

export function PDFGenerationLoading({ progress = 0, stage }: PDFLoadingProps) {
  const config = PDF_STAGE_CONFIG[stage];
  const Icon = config.icon;
  const isComplete = stage === 'complete';

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {isComplete ? (
            <Icon className="w-12 h-12 text-green-600" aria-hidden="true" />
          ) : (
            <div className="relative">
              <Icon className="w-12 h-12 text-blue-600" aria-hidden="true" />
              <Spinner 
                size="lg" 
                className="absolute inset-0" 
                aria-label={config.text}
              />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{config.text}</h3>
        
        {!isComplete && (
          <>
            <ProgressBar 
              value={progress} 
              className="mb-3"
              label={`PDF generation progress: ${progress}%`}
            />
            <p className="text-sm text-gray-600">{progress}% complete</p>
          </>
        )}

        {isComplete && (
          <p className="text-sm text-green-600">Your resume is ready!</p>
        )}
      </div>
    </div>
  );
}

export function Skeleton({ variant = 'line', size = 'md', className = '' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    line: 'h-4',
    block: 'rounded-lg',
    avatar: 'rounded-full'
  } as const;

  const sizeClasses = {
    sm: variant === 'avatar' ? 'w-8 h-8' : variant === 'line' ? 'h-3' : 'h-16',
    md: variant === 'avatar' ? 'w-12 h-12' : variant === 'line' ? 'h-4' : 'h-20',
    lg: variant === 'avatar' ? 'w-16 h-16' : variant === 'line' ? 'h-5' : 'h-24'
  } as const;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function TemplateLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-hidden="true">
      <div className="animate-pulse">
        {/* Header */}
        <div className="text-center mb-6">
          <Skeleton variant="line" className="w-48 mx-auto mb-2" />
          <Skeleton variant="line" className="w-32 mx-auto" />
        </div>

        {/* Content blocks */}
        <div className="space-y-4">
          <div>
            <Skeleton variant="line" className="w-24 mb-2" />
            <Skeleton variant="line" className="w-full mb-1" />
            <Skeleton variant="line" className="w-3/4" />
          </div>
          
          <div>
            <Skeleton variant="line" className="w-32 mb-2" />
            <Skeleton variant="line" className="w-full mb-1" />
            <Skeleton variant="line" className="w-5/6 mb-1" />
            <Skeleton variant="line" className="w-4/5" />
          </div>

          <div>
            <Skeleton variant="line" className="w-20 mb-2" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton variant="line" />
              <Skeleton variant="line" />
              <Skeleton variant="line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormSectionLoading() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" aria-hidden="true">
      <div className="animate-pulse space-y-6">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="line" className="w-40 h-6 mb-2" />
            <Skeleton variant="line" className="w-64 h-4" />
          </div>
          <Skeleton variant="block" className="w-24 h-8" />
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton variant="line" className="w-20 h-4 mb-2" />
            <Skeleton variant="block" className="w-full h-10" />
          </div>
          <div>
            <Skeleton variant="line" className="w-24 h-4 mb-2" />
            <Skeleton variant="block" className="w-full h-10" />
          </div>
        </div>

        <div>
          <Skeleton variant="line" className="w-32 h-4 mb-2" />
          <Skeleton variant="block" className="w-full h-24" />
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Skeleton variant="block" className="w-20 h-10" />
          <Skeleton variant="line" className="w-16 h-4" />
          <Skeleton variant="block" className="w-16 h-10" />
        </div>
      </div>
    </div>
  );
}

export function ATSAnalysisLoading({ stage }: ATSLoadingProps) {
  const config = ATS_STAGE_CONFIG[stage];
  const isComplete = stage === 'complete';

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Target className="w-6 h-6 text-blue-600" aria-hidden="true" />
          {!isComplete && (
            <Spinner 
              size="sm" 
              className="absolute -top-1 -right-1" 
              aria-label={config.text}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">{config.text}</span>
            <span className="text-sm text-blue-700">{config.progress}%</span>
          </div>
          <ProgressBar 
            value={config.progress}
            className="w-full bg-blue-200 rounded-full h-2"
            label={`ATS analysis progress: ${config.progress}%`}
          />
        </div>
      </div>
    </div>
  );
}

export function AIGenerationLoading({ type, className = '' }: AILoadingProps) {
  const config = AI_TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Icon className="w-6 h-6 text-purple-600" aria-hidden="true" />
          <div className="absolute inset-0 animate-ping duration-2000">
            <Icon className="w-6 h-6 text-purple-400 opacity-75" aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-purple-900">{config.text}</p>
          <LoadingDots className="mt-2 text-purple-600" />
        </div>
      </div>
    </div>
  );
}

export function TemplateSwitchLoading() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
      <div className="relative inline-block mb-4">
        <Palette className="w-12 h-12 text-blue-600" aria-hidden="true" />
        <Spinner size="lg" className="absolute inset-0" aria-label="Applying template" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Applying Template</h3>
      <p className="text-sm text-gray-600">Updating your resume design...</p>
      
      <LoadingDots className="mt-4 text-blue-600" />
    </div>
  );
}

export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <FileText className="w-16 h-16 text-blue-600" aria-hidden="true" />
          <Spinner size="xl" className="absolute inset-0" aria-label={message} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">FreeResume Builder</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoading({ text, size = 'sm', className = '' }: InlineLoadingProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size={size} aria-label={text} />
      <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} text-gray-600`}>
        {text}
      </span>
    </div>
  );
}

export function OverlayLoading({ 
  isVisible, 
  message, 
  subMessage, 
  progress,
  onCancel 
}: OverlayLoadingProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <Spinner size="xl" className="mx-auto mb-4" aria-label={message} />
          <h3 id="loading-title" className="text-lg font-semibold text-gray-900 mb-2">
            {message}
          </h3>
          
          {subMessage && (
            <p id="loading-description" className="text-sm text-gray-600 mb-4">
              {subMessage}
            </p>
          )}

          {progress !== undefined && (
            <div className="mb-4">
              <ProgressBar 
                value={progress}
                label={`${message} progress: ${progress}%`}
              />
              <p className="text-sm text-gray-600 mt-2">{progress}%</p>
            </div>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// All components are exported individually above for optimal tree-shaking