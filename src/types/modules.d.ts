// Minimal TypeScript type definitions for modules without built-in types
// Only declare modules that truly don't ship with TypeScript support

// Most packages (jspdf, html2canvas, date-fns, lucide-react, react-hook-form, clsx, web-vitals)
// already ship with official TypeScript definitions - rely on those instead of redeclaring

// Global type augmentations only
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __RESUME_BUILDER_DEBUG__?: {
      clearStorage: () => void;
      logState: () => void;
    };
  }

  // Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE?: string;
    readonly VITE_API_URL?: string;
    readonly VITE_ANALYTICS_ID?: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly MODE: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly hot?: {
      accept: (modules?: string | string[], callback?: () => void) => void;
      dispose: (callback: () => void) => void;
    };
  }
}

// React CSSProperties augmentation for Tailwind custom properties
import 'react';

declare module 'react' {
  interface CSSProperties {
    '--tw-bg-opacity'?: string;
    '--tw-text-opacity'?: string;
    '--tw-border-opacity'?: string;
    '--tw-ring-opacity'?: string;
    '--tw-shadow-color'?: string;
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-via'?: string;
  }
}

// Only declare modules that genuinely lack TypeScript support
// (Currently none needed - all major packages have official types)

export {};