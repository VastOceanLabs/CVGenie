// Module type declarations for packages without built-in TypeScript support
// This file declares types for external modules that don't ship with TypeScript definitions

// Note: Most modern packages (jspdf, html2canvas, react-hook-form, lucide-react, etc.)
// now ship with official TypeScript definitions, so we only declare truly necessary ones

// File type declarations for imports
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.avif' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

// Font file declarations
declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.eot' {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.otf' {
  const content: string;
  export default content;
}

// Stylesheet declarations
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.less' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.sass' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.less' {
  const classes: Record<string, string>;
  export default classes;
}

// JSON file declarations
declare module '*.json' {
  const content: Record<string, any>;
  export default content;
}

// Text file declarations
declare module '*.txt' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.csv' {
  const content: string;
  export default content;
}

// Video file declarations
declare module '*.mp4' {
  const content: string;
  export default content;
}

declare module '*.webm' {
  const content: string;
  export default content;
}

declare module '*.ogg' {
  const content: string;
  export default content;
}

declare module '*.avi' {
  const content: string;
  export default content;
}

declare module '*.mov' {
  const content: string;
  export default content;
}

declare module '*.wmv' {
  const content: string;
  export default content;
}

// Audio file declarations
declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.wav' {
  const content: string;
  export default content;
}

declare module '*.flac' {
  const content: string;
  export default content;
}

declare module '*.aac' {
  const content: string;
  export default content;
}

// Document file declarations
declare module '*.pdf' {
  const content: string;
  export default content;
}

declare module '*.doc' {
  const content: string;
  export default content;
}

declare module '*.docx' {
  const content: string;
  export default content;
}

declare module '*.xls' {
  const content: string;
  export default content;
}

declare module '*.xlsx' {
  const content: string;
  export default content;
}

declare module '*.ppt' {
  const content: string;
  export default content;
}

declare module '*.pptx' {
  const content: string;
  export default content;
}

// Specialized file formats
declare module '*.wasm' {
  const content: string;
  export default content;
}

declare module '*.xml' {
  const content: string;
  export default content;
}

declare module '*.yaml' {
  const content: string;
  export default content;
}

declare module '*.yml' {
  const content: string;
  export default content;
}

declare module '*.toml' {
  const content: string;
  export default content;
}

// Vite-specific declarations for dynamic imports
declare module 'virtual:*' {
  const content: any;
  export default content;
}

// Environment-specific modules
declare module '*.env' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.env.local' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.env.development' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.env.production' {
  const content: Record<string, string>;
  export default content;
}

// Web Worker declarations
declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}

declare module '*?sharedworker' {
  const sharedWorkerConstructor: {
    new (): SharedWorker;
  };
  export default sharedWorkerConstructor;
}

// URL imports
declare module '*?url' {
  const url: string;
  export default url;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '*?inline' {
  const content: string;
  export default content;
}

// Resume builder specific module declarations
declare module '@/data/*' {
  const content: any;
  export default content;
}

declare module '@/templates/*' {
  const content: any;
  export default content;
}

declare module '@/utils/*' {
  const content: any;
  export default content;
}

declare module '@/services/*' {
  const content: any;
  export default content;
}

declare module '@/components/*' {
  const content: any;
  export default content;
}

declare module '@/hooks/*' {
  const content: any;
  export default content;
}

declare module '@/types/*' {
  const content: any;
  export default content;
}

// Path mapping for Vite aliases
declare module '@/*' {
  const content: any;
  export default content;
}

// Conditional module declarations for packages that might not have types
// Only declare if the package doesn't already provide TypeScript definitions

// Most packages now have built-in types, but if needed, uncomment and customize:

// declare module 'some-package-without-types' {
//   export interface SomeInterface {
//     prop: string;
//   }
//   
//   export function someFunction(): void;
//   
//   const defaultExport: {
//     method: () => string;
//   };
//   export default defaultExport;
// }

// Module augmentation for existing packages (if needed)
// Example: Extending a package's types

// declare module 'existing-package' {
//   export interface ExistingInterface {
//     newProperty?: string;
//   }
// }

// Export empty object to ensure this file is treated as a module
export {};