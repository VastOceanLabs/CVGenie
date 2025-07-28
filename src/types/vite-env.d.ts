/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Basic Vite environment variables
  readonly VITE_APP_TITLE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR: boolean;
  
  // Custom app environment variables
  readonly VITE_API_URL: string;           // API endpoint (if you add backend later)
  readonly VITE_GA_ID: string;             // Google Analytics ID
  readonly VITE_APP_VERSION: string;       // App version
  readonly VITE_APP_NAME: string;          // App name for branding
  
  // Feature flags
  readonly VITE_ENABLE_ANALYTICS: string;  // Enable/disable analytics
  readonly VITE_ENABLE_PWA: string;        // Enable/disable PWA features
  readonly VITE_ENABLE_DEBUG: string;      // Enable debug mode
  
  // Third-party service keys (if needed)
  readonly VITE_SENTRY_DSN: string;        // Error tracking
  readonly VITE_HOTJAR_ID: string;         // User behavior analytics
  
  // Resume builder specific
  readonly VITE_MAX_RESUME_SIZE: string;   // File size limits
  readonly VITE_SUPPORTED_FORMATS: string; // Export formats
  readonly VITE_DEFAULT_TEMPLATE: string;  // Default template ID
  
  // Optional: Environment-specific URLs
  readonly VITE_CDN_URL: string;           // CDN for assets
  readonly VITE_FEEDBACK_URL: string;      // User feedback endpoint
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    accept(cb?: () => void): void;
    accept(dep: string, cb: () => void): void;
    accept(deps: readonly string[], cb: () => void): void;
    accept(deps: string, cb: (modules: any) => void): void;
    dispose(cb: () => void): void;
    invalidate(): void;
    on(event: string, cb: (...args: any[]) => void): void;
    data: any;
  };
}

// Extend global Window interface for additional browser APIs
declare global {
  interface Window {
    // Google Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    
    // Development debugging
    __RESUME_BUILDER_DEBUG__?: {
      clearStorage: () => void;
      logState: () => void;
      exportData: () => void;
      importData: (data: any) => void;
    };
    
    // Performance monitoring
    webkitRequestFileSystem?: any;
    mozRequestFileSystem?: any;
  }
}