import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Custom hook for managing localStorage with React state synchronization
 * Provides type-safe localStorage operations with error handling and SSR compatibility
 */

// Serializer interface with proper typing
interface Serializer<T> {
  parse: (value: string) => T;
  stringify: (value: T) => string;
}

// Types for the hook
interface UseLocalStorageOptions<T> {
  serializer?: Serializer<T>;
  syncAcrossTabs?: boolean;
  onError?: (error: Error) => void;
}

interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prevValue: T) => T)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  quotaInfo: {
    used: number;
    available: number;
    percentage: number;
  };
}

// Typed setter for better DX
type Setter<T> = (value: T | ((prevValue: T) => T)) => void;

// Default serializer for JSON operations
const defaultSerializer: Serializer<any> = {
  parse: JSON.parse,
  stringify: JSON.stringify,
};

// Check if localStorage is available (SSR-safe)
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Check localStorage quota with accurate byte calculation
const checkStorageQuota = (): { used: number; available: number; percentage: number } => {
  try {
    if (!isLocalStorageAvailable()) {
      return { used: 0, available: 0, percentage: 0 };
    }
    
    let totalBytes = 0;
    
    // Use proper localStorage API instead of for...in
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        // Use Blob for accurate byte calculation
        totalBytes += new Blob([key]).size + new Blob([value]).size;
      }
    }
    
    const available = 5 * 1024 * 1024; // 5MB typical limit
    const percentage = Math.round((totalBytes / available) * 100);
    
    return {
      used: totalBytes,
      available,
      percentage,
    };
  } catch {
    return { used: 0, available: 5 * 1024 * 1024, percentage: 0 };
  }
};

/**
 * Enhanced localStorage hook with comprehensive error handling and features
 * 
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Configuration options
 * @returns Object with value, setter, and utility functions
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = defaultSerializer as Serializer<T>,
    syncAcrossTabs = false,
    onError = () => {},
  } = options;

  // Memoize serializer to prevent effect re-runs
  const stableSerializer = useMemo(() => serializer, [serializer]);

  // State for the stored value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotaInfo, setQuotaInfo] = useState(() => checkStorageQuota());
  
  const isSupported = isLocalStorageAvailable();

  // Ref to track if component is mounted (prevents state updates after unmount)
  const isMountedRef = useRef(true);

  // Update quota info
  const updateQuotaInfo = useCallback(() => {
    const info = checkStorageQuota();
    if (isMountedRef.current) {
      setQuotaInfo(info);
    }
  }, []);

  // Read value from localStorage on mount
  useEffect(() => {
    const readFromStorage = () => {
      try {
        setError(null);
        
        if (!isSupported) {
          setIsLoading(false);
          return;
        }

        const item = window.localStorage.getItem(key);
        
        if (item !== null) {
          const parsedValue = stableSerializer.parse(item);
          if (isMountedRef.current) {
            setStoredValue(parsedValue);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to read from localStorage';
        setError(errorMessage);
        onError(new Error(errorMessage));
        console.warn(`useLocalStorage: Error reading key "${key}":`, err);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          updateQuotaInfo();
        }
      }
    };

    readFromStorage();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [key, isSupported, stableSerializer, onError, updateQuotaInfo]);

  // Listen for storage changes across tabs - fixed dependency issue
  useEffect(() => {
    if (!isSupported) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (!syncAcrossTabs) return; // Early return if disabled
      
      if (e.key === key && e.newValue !== null && isMountedRef.current) {
        try {
          const newValue = stableSerializer.parse(e.newValue);
          setStoredValue(newValue);
          setError(null);
          updateQuotaInfo();
        } catch (err) {
          const errorMessage = 'Failed to sync storage change across tabs';
          setError(errorMessage);
          onError(new Error(errorMessage));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, syncAcrossTabs, isSupported, stableSerializer, onError, updateQuotaInfo]);

  // Set value in localStorage and state
  const setValue = useCallback<Setter<T>>((value) => {
    try {
      setError(null);
      
      if (!isSupported) {
        // SSR-safe: log instead of throwing
        console.warn('localStorage is not supported in this environment');
        return;
      }

      // Allow value to be a function for updates based on previous value
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Check storage quota before writing
      const serializedValue = stableSerializer.stringify(valueToStore);
      const newValueSize = new Blob([key]).size + new Blob([serializedValue]).size;
      const currentQuota = checkStorageQuota();
      const estimatedTotalSize = currentQuota.used + newValueSize;
      
      // Warn if approaching 5MB limit
      if (estimatedTotalSize > 4.5 * 1024 * 1024) {
        console.warn('useLocalStorage: Approaching localStorage quota limit');
      }

      // Save to localStorage
      window.localStorage.setItem(key, serializedValue);
      
      // Update state and quota
      if (isMountedRef.current) {
        setStoredValue(valueToStore);
        updateQuotaInfo();
      }
    } catch (err) {
      let errorMessage = 'Failed to save to localStorage';
      
      if (err instanceof Error) {
        // Fixed: Cast to DOMException for proper type checking
        if ((err as DOMException).name === 'QuotaExceededError') {
          errorMessage = 'localStorage quota exceeded';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      onError(new Error(errorMessage));
      console.error(`useLocalStorage: Error setting key "${key}":`, err);
    }
  }, [key, storedValue, isSupported, stableSerializer, onError, updateQuotaInfo]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setError(null);
      
      if (!isSupported) {
        // SSR-safe: log instead of throwing
        console.warn('localStorage is not supported in this environment');
        return;
      }

      window.localStorage.removeItem(key);
      
      if (isMountedRef.current) {
        setStoredValue(initialValue);
        updateQuotaInfo();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from localStorage';
      setError(errorMessage);
      onError(new Error(errorMessage));
      console.error(`useLocalStorage: Error removing key "${key}":`, err);
    }
  }, [key, initialValue, isSupported, onError, updateQuotaInfo]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
    error,
    isSupported,
    quotaInfo,
  };
}

// Add display name for React DevTools
useLocalStorage.displayName = 'useLocalStorage';

/**
 * Simplified localStorage hook for string values - Fixed return type
 */
export function useLocalStorageString(
  key: string,
  initialValue: string = ''
): [string, Setter<string>, () => void] {
  const { value, setValue, removeValue } = useLocalStorage(key, initialValue);
  return [value, setValue, removeValue];
}

/**
 * localStorage hook for boolean values - Fixed return type
 */
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
): [boolean, Setter<boolean>, () => void] {
  const { value, setValue, removeValue } = useLocalStorage(key, initialValue);
  return [value, setValue, removeValue];
}

/**
 * localStorage hook for number values - Fixed return type
 */
export function useLocalStorageNumber(
  key: string,
  initialValue: number = 0
): [number, Setter<number>, () => void] {
  const { value, setValue, removeValue } = useLocalStorage(key, initialValue);
  return [value, setValue, removeValue];
}

/**
 * Hook for managing arrays in localStorage with utility methods
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
) {
  const { value, setValue, removeValue, isLoading, error, quotaInfo } = useLocalStorage<T[]>(key, initialValue);

  const addItem = useCallback((item: T) => {
    setValue(prev => [...prev, item]);
  }, [setValue]);

  const removeItem = useCallback((index: number) => {
    setValue(prev => prev.filter((_, i) => i !== index));
  }, [setValue]);

  const updateItem = useCallback((index: number, newItem: T) => {
    setValue(prev => prev.map((item, i) => i === index ? newItem : item));
  }, [setValue]);

  const clearArray = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return {
    items: value,
    setItems: setValue,
    addItem,
    removeItem,
    updateItem,
    clearArray,
    removeAll: removeValue,
    isLoading,
    error,
    quotaInfo,
  };
}

/**
 * Hook for managing key-value maps in localStorage
 */
export function useLocalStorageMap<T>(
  key: string,
  initialValue: Record<string, T> = {}
) {
  const { value, setValue, removeValue, isLoading, error, quotaInfo } = useLocalStorage<Record<string, T>>(key, initialValue);

  const setItem = useCallback((itemKey: string, item: T) => {
    setValue(prev => ({ ...prev, [itemKey]: item }));
  }, [setValue]);

  const removeItem = useCallback((itemKey: string) => {
    setValue(prev => {
      const newMap = { ...prev };
      delete newMap[itemKey];
      return newMap;
    });
  }, [setValue]);

  const hasItem = useCallback((itemKey: string) => {
    return itemKey in value;
  }, [value]);

  const getItem = useCallback((itemKey: string) => {
    return value[itemKey];
  }, [value]);

  const clearMap = useCallback(() => {
    setValue({});
  }, [setValue]);

  return {
    map: value,
    setMap: setValue,
    setItem,
    removeItem,
    hasItem,
    getItem,
    clearMap,
    removeAll: removeValue,
    keys: Object.keys(value),
    values: Object.values(value),
    entries: Object.entries(value),
    size: Object.keys(value).length,
    isLoading,
    error,
    quotaInfo,
  };
}

/**
 * Hook for managing user preferences with localStorage
 * Specifically designed for FreeResume Builder settings
 */
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  previewMode: 'desktop' | 'mobile';
  autoSave: boolean;
  showTips: boolean;
  completedTutorial: boolean;
  preferredTemplate: string;
  lastUsedSections: string[];
  atsWarningsEnabled: boolean;
  compactMode: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  previewMode: 'desktop',
  autoSave: true,
  showTips: true,
  completedTutorial: false,
  preferredTemplate: 'professional',
  lastUsedSections: [],
  atsWarningsEnabled: true,
  compactMode: false,
};

export function useUserPreferences() {
  const { value: preferences, setValue: setPreferences, quotaInfo } = useLocalStorage<UserPreferences>(
    'freeresume_user_preferences',
    defaultPreferences,
    {
      syncAcrossTabs: true,
      onError: (error) => {
        console.warn('Failed to save user preferences:', error);
      },
    }
  );

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
    setPreferences,
    quotaInfo,
  };
}

/**
 * Hook for managing recent resume drafts
 */
interface ResumeSnapshot {
  id: string;
  name: string;
  lastModified: number;
  data: any; // Resume data
  template: string;
  completionPercentage: number;
}

export function useRecentResumes() {
  const { items: resumes, addItem, removeItem, updateItem, clearArray, quotaInfo } = useLocalStorageArray<ResumeSnapshot>(
    'freeresume_recent_drafts'
  );

  const saveResume = useCallback((resumeData: any, template: string, name?: string) => {
    const snapshot: ResumeSnapshot = {
      id: Date.now().toString(),
      name: name || `Resume Draft ${new Date().toLocaleDateString()}`,
      lastModified: Date.now(),
      data: resumeData,
      template,
      completionPercentage: calculateCompletionPercentage(resumeData),
    };

    // Keep only the most recent 5 drafts
    if (resumes.length >= 5) {
      const oldestIndex = resumes.reduce((oldest, resume, index) => 
        resume.lastModified < resumes[oldest].lastModified ? index : oldest, 0
      );
      removeItem(oldestIndex);
    }

    addItem(snapshot);
  }, [resumes, addItem, removeItem]);

  return {
    resumes,
    saveResume,
    removeResume: removeItem,
    updateResume: updateItem,
    clearResumes: clearArray,
    quotaInfo,
  };
}

/**
 * Utility function to calculate resume completion percentage
 */
function calculateCompletionPercentage(resumeData: any): number {
  let completedSections = 0;
  const totalSections = 5; // personalInfo, experience, education, skills, certifications

  if (resumeData?.personalInfo?.firstName && resumeData?.personalInfo?.email) {
    completedSections++;
  }
  if (resumeData?.experience?.length > 0) {
    completedSections++;
  }
  if (resumeData?.education?.length > 0) {
    completedSections++;
  }
  if (resumeData?.skills?.length > 0) {
    completedSections++;
  }
  if (resumeData?.certifications?.length > 0) {
    completedSections++;
  }

  return Math.round((completedSections / totalSections) * 100);
}

/**
 * Hook for localStorage cleanup and management
 */
export function useLocalStorageCleanup() {
  const clearAppData = useCallback(() => {
    if (!isLocalStorageAvailable()) return;

    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('freeresume_')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }, []);

  const getStorageInfo = useCallback(() => {
    if (!isLocalStorageAvailable()) {
      return { supported: false, used: 0, available: 0, percentage: 0 };
    }

    return {
      supported: true,
      ...checkStorageQuota(),
    };
  }, []);

  return {
    clearAppData,
    getStorageInfo,
    isSupported: isLocalStorageAvailable(),
  };
}

// Export utilities
export { isLocalStorageAvailable, checkStorageQuota };

// Default export
export default useLocalStorage;