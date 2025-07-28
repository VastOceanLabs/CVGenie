import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { Save, AlertCircle, CheckCircle, Clock, RotateCcw, Wifi, WifiOff } from 'lucide-react';

// Types for AutoSave functionality
export interface AutoSaveState {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  errorMessage?: string;
  saveCount: number;
  isOnline: boolean;
}

export interface AutoSaveHistory {
  timestamp: Date;
  data: any;
  version: number;
  changeDescription?: string;
}

export interface AutoSaveConfig {
  debounceMs: number;
  maxHistoryEntries: number;
  autoSaveEnabled: boolean;
  showVisualFeedback: boolean;
  onlineCheckInterval: number;
}

interface AutoSaveContextType {
  autoSaveState: AutoSaveState;
  config: AutoSaveConfig;
  saveData: (data: any, description?: string) => Promise<boolean>;
  forceSave: (data: any, description?: string) => Promise<boolean>;
  getHistory: () => AutoSaveHistory[];
  restoreFromHistory: (version: number) => any | null;
  clearHistory: () => void;
  updateConfig: (newConfig: Partial<AutoSaveConfig>) => void;
  performUndo: () => any | null;
  performRedo: () => any | null;
  canUndo: boolean;
  canRedo: boolean;
}

// Constants for better maintainability
const DEFAULT_UNDO_STACK_SIZE = 50;
const STATUS_ICONS = {
  idle: Save,
  saving: Clock,
  saved: CheckCircle,
  error: AlertCircle,
  offline: WifiOff
} as const;

const STATUS_MESSAGES = {
  idle: 'Ready to save',
  saving: 'Saving...',
  saved: 'All changes saved',
  error: 'Save failed',
  offline: 'Offline'
} as const;

// Helper functions
const safeClone = (data: any): any => {
  try {
    // Use structuredClone for modern browsers, fallback to JSON for compatibility
    return typeof structuredClone !== 'undefined' 
      ? structuredClone(data)
      : JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to clone data, using reference:', error);
    return data;
  }
};

const formatLastSaved = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
};

// Default configuration
const defaultConfig: AutoSaveConfig = {
  debounceMs: 1500,
  maxHistoryEntries: 50,
  autoSaveEnabled: true,
  showVisualFeedback: true,
  onlineCheckInterval: 30000 // Check every 30 seconds
};

// Create AutoSave Context
const AutoSaveContext = createContext<AutoSaveContextType | null>(null);

// AutoSave Provider Component
export function AutoSaveProvider({ 
  children, 
  initialConfig = defaultConfig 
}: { 
  children: React.ReactNode;
  initialConfig?: Partial<AutoSaveConfig>;
}) {
  const [config, setConfig] = useState<AutoSaveConfig>({ ...defaultConfig, ...initialConfig });
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    status: 'idle',
    lastSaved: null,
    hasUnsavedChanges: false,
    saveCount: 0,
    isOnline: navigator.onLine
  });

  const [history, setHistory] = useState<AutoSaveHistory[]>([]);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [undoStack, setUndoStack] = useState<AutoSaveHistory[]>([]);
  const [redoStack, setRedoStack] = useState<AutoSaveHistory[]>([]);

  // Fixed: Use correct timeout type for browser environment
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveDataRef = useRef<string>('');
  const onlineCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fixed: Online/Offline detection without dependency churn
  useEffect(() => {
    // Check initial offline state
    if (!navigator.onLine) {
      setAutoSaveState(prev => ({ 
        ...prev, 
        isOnline: false, 
        status: 'offline',
        errorMessage: 'You are currently offline. Changes will be saved when connection is restored.'
      }));
    }

    const handleOnline = () => {
      setAutoSaveState(prev => ({ ...prev, isOnline: true, status: 'idle', errorMessage: undefined }));
    };

    const handleOffline = () => {
      setAutoSaveState(prev => ({ 
        ...prev, 
        isOnline: false, 
        status: 'offline',
        errorMessage: 'You are currently offline. Changes will be saved when connection is restored.'
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic online check - removed autoSaveState.isOnline from dependencies
    if (config.onlineCheckInterval > 0) {
      onlineCheckRef.current = setInterval(() => {
        const currentOnlineStatus = navigator.onLine;
        setAutoSaveState(prev => {
          if (prev.isOnline !== currentOnlineStatus) {
            return { 
              ...prev, 
              isOnline: currentOnlineStatus,
              status: currentOnlineStatus ? 'idle' : 'offline',
              errorMessage: currentOnlineStatus ? undefined : 'Connection lost'
            };
          }
          return prev;
        });
      }, config.onlineCheckInterval);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (onlineCheckRef.current) {
        clearInterval(onlineCheckRef.current);
      }
    };
  }, [config.onlineCheckInterval]); // Removed autoSaveState.isOnline

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Core save function
  const performSave = useCallback(async (data: any, description?: string): Promise<boolean> => {
    if (!autoSaveState.isOnline) {
      setAutoSaveState(prev => ({
        ...prev,
        status: 'offline',
        errorMessage: 'Cannot save while offline'
      }));
      return false;
    }

    try {
      setAutoSaveState(prev => ({ ...prev, status: 'saving', errorMessage: undefined }));

      // Simulate save operation (replace with actual save logic)
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

      // Simulate occasional failures for testing
      if (Math.random() < 0.05) { // 5% failure rate
        throw new Error('Simulated save failure');
      }

      const now = new Date();
      
      // Fixed: Use functional updater to prevent version drift
      const newVersion = await new Promise<number>((resolve) => {
        setCurrentVersion(v => {
          const nextVersion = v + 1;
          resolve(nextVersion);
          return nextVersion;
        });
      });

      // Add to history with safe cloning
      const historyEntry: AutoSaveHistory = {
        timestamp: now,
        data: safeClone(data),
        version: newVersion,
        changeDescription: description
      };

      setHistory(prev => {
        const newHistory = [historyEntry, ...prev].slice(0, config.maxHistoryEntries);
        return newHistory;
      });

      lastSaveDataRef.current = JSON.stringify(data);

      setAutoSaveState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: now,
        hasUnsavedChanges: false,
        saveCount: prev.saveCount + 1,
        errorMessage: undefined
      }));

      return true;
    } catch (error) {
      console.error('AutoSave error:', error);
      setAutoSaveState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Save failed'
      }));
      return false;
    }
  }, [autoSaveState.isOnline, config.maxHistoryEntries]);

  // Fixed: Debounced save function with proper Promise handling
  const saveData = useCallback(async (data: any, description?: string): Promise<boolean> => {
    if (!config.autoSaveEnabled) return false;

    const dataString = JSON.stringify(data);
    
    // Check if data has actually changed
    if (dataString === lastSaveDataRef.current) {
      return true; // No changes to save
    }

    // Mark as having unsaved changes
    setAutoSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Return a Promise that properly handles success/failure
    return new Promise((resolve, reject) => {
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const success = await performSave(data, description);
          if (success) {
            resolve(true);
          } else {
            reject(new Error('Save operation failed'));
          }
        } catch (error) {
          reject(error);
        }
      }, config.debounceMs);
    });
  }, [config.autoSaveEnabled, config.debounceMs, performSave]);

  // Force immediate save
  const forceSave = useCallback(async (data: any, description?: string): Promise<boolean> => {
    // Clear any pending debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    return await performSave(data, description || 'Manual save');
  }, [performSave]);

  // History management
  const getHistory = useCallback(() => history, [history]);

  const restoreFromHistory = useCallback((version: number): any | null => {
    const historyEntry = history.find(entry => entry.version === version);
    if (historyEntry) {
      // Add current state to undo stack before restoring
      if (history[0]) {
        setUndoStack(prev => [history[0], ...prev.slice(0, DEFAULT_UNDO_STACK_SIZE - 1)]);
      }
      setRedoStack([]); // Clear redo stack
      return safeClone(historyEntry.data);
    }
    return null;
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setUndoStack([]);
    setRedoStack([]);
    setCurrentVersion(0);
  }, []);

  // Fixed: Improved Undo/Redo functionality
  const performUndo = useCallback((): any | null => {
    if (undoStack.length > 0) {
      const undoEntry = undoStack[0];
      
      // Remove from undo stack
      setUndoStack(prev => prev.slice(1));
      
      // Add current state to redo stack
      if (history[0]) {
        setRedoStack(prev => [history[0], ...prev.slice(0, DEFAULT_UNDO_STACK_SIZE - 1)]);
      }
      
      // Update current history to reflect the undo
      setHistory(prev => [undoEntry, ...prev.slice(0, config.maxHistoryEntries - 1)]);
      
      return safeClone(undoEntry.data);
    }
    return null;
  }, [undoStack, history, config.maxHistoryEntries]);

  const performRedo = useCallback((): any | null => {
    if (redoStack.length > 0) {
      const redoEntry = redoStack[0];
      
      // Remove from redo stack
      setRedoStack(prev => prev.slice(1));
      
      // Add current state to undo stack
      if (history[0]) {
        setUndoStack(prev => [history[0], ...prev.slice(0, DEFAULT_UNDO_STACK_SIZE - 1)]);
      }
      
      // Update current history to reflect the redo
      setHistory(prev => [redoEntry, ...prev.slice(0, config.maxHistoryEntries - 1)]);
      
      return safeClone(redoEntry.data);
    }
    return null;
  }, [redoStack, history, config.maxHistoryEntries]);

  // Configuration updates
  const updateConfig = useCallback((newConfig: Partial<AutoSaveConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const contextValue: AutoSaveContextType = {
    autoSaveState,
    config,
    saveData,
    forceSave,
    getHistory,
    restoreFromHistory,
    clearHistory,
    updateConfig,
    performUndo,
    performRedo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0
  };

  return (
    <AutoSaveContext.Provider value={contextValue}>
      {children}
    </AutoSaveContext.Provider>
  );
}

// Hook to use AutoSave
export function useAutoSave() {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error('useAutoSave must be used within an AutoSaveProvider');
  }
  return context;
}

// AutoSave Status Widget Component
export function AutoSaveStatusWidget({ 
  className = "",
  showDetails = true,
  compact = false,
  resumeData = null // Fixed: Accept actual resume data
}: { 
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  resumeData?: any;
}) {
  const { autoSaveState, forceSave, canUndo, canRedo, performUndo, performRedo } = useAutoSave();

  const getStatusIcon = () => {
    const IconComponent = STATUS_ICONS[autoSaveState.status];
    const iconProps = {
      className: `w-4 h-4 ${
        autoSaveState.status === 'saving' ? 'animate-spin text-yellow-500' :
        autoSaveState.status === 'saved' ? 'text-green-500' :
        autoSaveState.status === 'error' ? 'text-red-500' :
        autoSaveState.status === 'offline' ? 'text-gray-400' :
        'text-gray-400'
      }`
    };
    return <IconComponent {...iconProps} />;
  };

  const getStatusText = () => {
    const baseMessage = STATUS_MESSAGES[autoSaveState.status];
    if (autoSaveState.status === 'saved' && autoSaveState.lastSaved) {
      return `Saved ${formatLastSaved(autoSaveState.lastSaved)}`;
    }
    return baseMessage;
  };

  const handleManualSave = async () => {
    // Fixed: Use actual resume data instead of empty object
    if (resumeData) {
      try {
        await forceSave(resumeData, 'Manual save triggered');
      } catch (error) {
        console.error('Manual save failed:', error);
      }
    }
  };

  const handleUndo = () => {
    const undoData = performUndo();
    if (undoData) {
      // Return the data so parent component can handle the state update
      return undoData;
    }
  };

  const handleRedo = () => {
    const redoData = performRedo();
    if (redoData) {
      // Return the data so parent component can handle the state update
      return redoData;
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className="text-sm text-gray-600">{getStatusText()}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {getStatusText()}
            </div>
            {showDetails && autoSaveState.lastSaved && (
              <div className="text-xs text-gray-500">
                Save #{autoSaveState.saveCount} • Last: {autoSaveState.lastSaved.toLocaleTimeString()}
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
          {/* Undo/Redo buttons */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            {/* Fixed: Use proper CSS transform for flip */}
            <RotateCcw className="w-4 h-4 transform -scale-x-100" />
          </button>

          {/* Manual save button */}
          <button
            onClick={handleManualSave}
            disabled={autoSaveState.status === 'saving' || autoSaveState.status === 'offline' || !resumeData}
            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Now
          </button>

          {/* Online status */}
          <div className="flex items-center space-x-1">
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
        <div className="mt-2 flex items-center space-x-1 text-xs text-yellow-600">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>You have unsaved changes</span>
        </div>
      )}
    </div>
  );
}

// Hook for integrating AutoSave with resume data
export function useResumeAutoSave(resumeData: any) {
  const { saveData, autoSaveState } = useAutoSave();

  useEffect(() => {
    if (resumeData) {
      // Handle async save with proper error handling
      saveData(resumeData).catch(error => {
        console.error('Auto-save failed:', error);
      });
    }
  }, [resumeData, saveData]);

  return {
    autoSaveStatus: autoSaveState.status,
    lastSaved: autoSaveState.lastSaved,
    hasUnsavedChanges: autoSaveState.hasUnsavedChanges,
    isOnline: autoSaveState.isOnline
  };
}

// AutoSave History Viewer Component - FIXED: Proper parameter syntax
export function AutoSaveHistory({ 
  className = "",
  onRestore
}: { 
  className?: string;
  onRestore?: (data: any) => void;
}) {
  const { getHistory, restoreFromHistory } = useAutoSave();
  const [showHistory, setShowHistory] = useState(false);
  const history = getHistory();

  const handleRestore = (version: number) => {
    const data = restoreFromHistory(version);
    if (data && onRestore) {
      onRestore(data);
      setShowHistory(false);
    }
  };

  if (!showHistory) {
    return (
      <button
        onClick={() => setShowHistory(true)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      >
        <Clock className="w-4 h-4" />
        <span>View History ({history.length})</span>
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 max-h-80 overflow-y-auto ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Save History</h4>
        <button
          onClick={() => setShowHistory(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {history.map((entry, index) => (
          <div
            key={entry.version}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-gray-100"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Version {entry.version}
                {index === 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    Current
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {entry.timestamp.toLocaleString()}
                {entry.changeDescription && ` • ${entry.changeDescription}`}
              </div>
            </div>
            
            {index > 0 && (
              <button
                onClick={() => handleRestore(entry.version)}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                Restore
              </button>
            )}
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No save history available
          </div>
        )}
      </div>
    </div>
  );
}