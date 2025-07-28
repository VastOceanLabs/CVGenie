// Global type augmentations for the Resume Builder application
// This file extends existing global interfaces and types

declare global {
  // Window object extensions for analytics and debugging
  interface Window {
    // Google Analytics gtag function
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
    
    // Google Analytics data layer
    dataLayer?: Array<Record<string, any>>;
    
    // Development debugging utilities (only available in dev mode)
    __RESUME_BUILDER_DEBUG__?: {
      clearStorage: () => void;
      logState: () => void;
      exportData: () => void;
      importData: (data: any) => void;
      logEvents: boolean;
    };

    // Service Worker registration
    workbox?: any;
    
    // PWA install prompt
    beforeInstallPrompt?: any;
    
    // File System Access API (for future file operations)
    showSaveFilePicker?: (options?: any) => Promise<any>;
    showOpenFilePicker?: (options?: any) => Promise<any>;
  }

  // Vite environment variables interface
  interface ImportMetaEnv {
    // Application configuration
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_DESCRIPTION: string;
    
    // API configuration
    readonly VITE_API_URL: string;
    readonly VITE_API_VERSION: string;
    
    // Analytics configuration
    readonly VITE_ANALYTICS_ID: string;
    readonly VITE_GTM_ID: string;
    
    // Feature flags
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_PWA: string;
    readonly VITE_ENABLE_DEBUG: string;
    
    // Environment info
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    
    // Build info
    readonly VITE_BUILD_TIME: string;
    readonly VITE_COMMIT_HASH: string;
  }

  // Vite import meta interface
  interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly hot?: {
      accept(): void;
      accept(cb: (mod: any) => void): void;
      accept(dep: string, cb: (mod: any) => void): void;
      accept(deps: readonly string[], cb: (mods: any[]) => void): void;
      dispose(cb: () => void): void;
      decline(): void;
      invalidate(): void;
      data: any;
    };
    readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
    readonly globEager: (pattern: string) => Record<string, any>;
    readonly url: string;
  }

  // Custom CSS properties for Tailwind and resume styling
  namespace React {
    interface CSSProperties {
      // Tailwind CSS custom properties
      '--tw-bg-opacity'?: string;
      '--tw-text-opacity'?: string;
      '--tw-border-opacity'?: string;
      '--tw-ring-opacity'?: string;
      '--tw-shadow-color'?: string;
      '--tw-shadow-colored'?: string;
      '--tw-backdrop-blur'?: string;
      '--tw-backdrop-brightness'?: string;
      '--tw-backdrop-contrast'?: string;
      '--tw-backdrop-grayscale'?: string;
      '--tw-backdrop-hue-rotate'?: string;
      '--tw-backdrop-invert'?: string;
      '--tw-backdrop-opacity'?: string;
      '--tw-backdrop-saturate'?: string;
      '--tw-backdrop-sepia'?: string;
      
      // Gradient properties
      '--tw-gradient-from'?: string;
      '--tw-gradient-to'?: string;
      '--tw-gradient-via'?: string;
      '--tw-gradient-from-position'?: string;
      '--tw-gradient-via-position'?: string;
      '--tw-gradient-to-position'?: string;
      
      // Transform properties
      '--tw-rotate'?: string;
      '--tw-scale'?: string;
      '--tw-skew'?: string;
      '--tw-translate-x'?: string;
      '--tw-translate-y'?: string;
      '--tw-translate-z'?: string;
      
      // Resume-specific custom properties
      '--resume-primary-color'?: string;
      '--resume-secondary-color'?: string;
      '--resume-accent-color'?: string;
      '--resume-text-color'?: string;
      '--resume-bg-color'?: string;
      '--resume-border-color'?: string;
      
      // Print-specific properties
      '--print-scale'?: string;
      '--print-margin'?: string;
      '--print-page-break'?: string;
      
      // Animation properties
      '--animation-duration'?: string;
      '--animation-delay'?: string;
      '--animation-timing-function'?: string;
    }
  }

  // PDF generation types (for jsPDF integration)
  interface PDFGenerationOptions {
    format: 'a4' | 'letter' | 'legal';
    orientation: 'portrait' | 'landscape';
    unit: 'mm' | 'cm' | 'in' | 'px' | 'pt' | 'pc' | 'em' | 'ex';
    compress: boolean;
    precision: number;
    userUnit: number;
    hotfixes: string[];
    floatPrecision: number;
  }

  // ATS (Applicant Tracking System) analysis types
  interface ATSAnalysisResult {
    score: number;
    keywords: {
      found: string[];
      missing: string[];
      suggested: string[];
    };
    formatting: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    content: {
      sections: Record<string, boolean>;
      wordCount: number;
      readabilityScore: number;
    };
  }

  // Performance monitoring types
  interface PerformanceMetrics {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
    customMetrics: Record<string, number>;
  }

  // Error tracking types
  interface ErrorTrackingEvent {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    error?: Error;
    context?: Record<string, any>;
    timestamp: number;
    userAgent: string;
    url: string;
  }

  // Resume data validation types
  interface ValidationRule {
    field: string;
    required: boolean;
    type: 'string' | 'number' | 'email' | 'url' | 'date' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: any) => boolean | string;
  }

  interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    score: number;
  }

  // Template system types
  interface TemplateMetadata {
    id: string;
    name: string;
    category: string;
    description: string;
    preview: string;
    atsScore: number;
    industry: string[];
    features: string[];
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    layout: 'single-column' | 'two-column' | 'three-column' | 'creative' | 'minimal';
    fonts: {
      heading: string;
      body: string;
      accent?: string;
    };
  }

  // Auto-save system types
  interface AutoSaveState {
    status: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
    isOnline: boolean;
    saveCount: number;
    errorMessage?: string;
  }

  interface AutoSaveConfig {
    debounceMs: number;
    maxHistoryEntries: number;
    autoSaveEnabled: boolean;
    showVisualFeedback: boolean;
    onlineCheckInterval: number;
  }

  // Job description matching types
  interface JobMatchAnalysis {
    overallScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    suggestions: {
      category: string;
      priority: 'high' | 'medium' | 'low';
      action: string;
      keywords: string[];
    }[];
  }
}

// Export empty object to make this a module
export {};