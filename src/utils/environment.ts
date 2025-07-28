// ✅ CORRECT - Clean environment detection without duplicate declarations

// Don't redeclare global types here - they're already in src/types/global.d.ts

// Type-safe environment variable access
type ViteEnvKey = keyof ImportMetaEnv;

export const getEnvironmentVariable = (key: ViteEnvKey, defaultValue: string = ''): string => {
  // Check if we're in a Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as any)[key] || defaultValue;
  }
  
  // Fallback for other environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key as string] || defaultValue;
  }
  
  return defaultValue;
};

export const isProduction = (): boolean => {
  // Check Vite environment first (most reliable)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.PROD === true;
  }
  
  // Fallback to process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production';
  }
  
  return false;
};

export const isDevelopment = (): boolean => {
  // Check Vite environment first (most reliable)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV === true;
  }
  
  // Fallback to process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  
  return true; // Default to development for safety
};

export const getMode = (): string => {
  // Check Vite environment first
  if (typeof import.meta !== 'undefined' && import.meta.env?.MODE) {
    return import.meta.env.MODE;
  }
  
  // Fallback to process.env
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  
  return 'development'; // Default to development for safety
};

// Safe console logging for production
export const safeConsole = {
  log: (...args: any[]) => {
    if (isDevelopment()) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment()) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args); // Always log errors
  },
  debug: (...args: any[]) => {
    if (isDevelopment()) {
      console.debug(...args);
    }
  }
};

// Environment-specific configurations
export const config = {
  // Environment state
  isProduction: isProduction(),
  isDevelopment: isDevelopment(),
  mode: getMode(),
  
  // Feature flags
  enableAnalytics: isProduction(),
  enableErrorTracking: isProduction(),
  enableDebugLogging: isDevelopment(),
  enablePWA: isProduction(),
  enableServiceWorker: isProduction(),
  
  // API configuration
  apiUrl: getEnvironmentVariable('VITE_API_URL', ''),
  analyticsId: getEnvironmentVariable('VITE_GA_ID', ''),
  
  // App metadata
  appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0',
  buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
} as const;

// Helper for conditional execution
export const ifDevelopment = (fn: () => void): void => {
  if (isDevelopment()) {
    fn();
  }
};

export const ifProduction = (fn: () => void): void => {
  if (isProduction()) {
    fn();
  }
};

export default config;