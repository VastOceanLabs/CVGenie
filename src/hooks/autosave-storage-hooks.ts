// Extended AutoSave hooks for different storage scenarios
import { useEffect, useCallback, useState } from 'react';
import { useAutoSave } from './AutoSave';

// ============================================================================
// BROWSER STORAGE EXTENSION (for environments where it's available)
// ============================================================================

/**
 * Extended AutoSave that includes browser storage when available
 * Note: Only use this outside of Claude.ai artifacts
 */
export function useAutoSaveWithBrowserStorage(resumeData: any, storageKey = 'freeresume-data') {
  const { saveData, autoSaveState, forceSave } = useAutoSave();
  const [storageAvailable, setStorageAvailable] = useState(false);

  // Check if localStorage is available
  useEffect(() => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
      console.log('localStorage not available - using memory only');
    }
  }, []);

  // Enhanced save function that includes localStorage
  const saveWithStorage = useCallback(async (data: any, description?: string) => {
    // Always save to memory first
    const memorySuccess = await saveData(data, description);
    
    // Also save to localStorage if available
    if (storageAvailable) {
      try {
        const storageData = {
          resumeData: data,
          timestamp: new Date().toISOString(),
          version: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(storageData));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
    
    return memorySuccess;
  }, [saveData, storageAvailable, storageKey]);

  // Load from localStorage on mount
  useEffect(() => {
    if (storageAvailable) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const { resumeData: savedData, timestamp } = JSON.parse(saved);
          // Only load if we don't already have data and saved data is recent (< 7 days)
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          if (new Date(timestamp).getTime() > sevenDaysAgo) {
            console.log('Loaded resume data from localStorage');
            return savedData;
          }
        }
      } catch (error) {
        console.warn('Failed to load from localStorage:', error);
      }
    }
    return null;
  }, [storageAvailable, storageKey]);

  // Auto-save when resume data changes
  useEffect(() => {
    if (resumeData) {
      saveWithStorage(resumeData);
    }
  }, [resumeData, saveWithStorage]);

  return {
    ...autoSaveState,
    saveWithStorage,
    storageAvailable,
    forceSave: (data: any, description?: string) => forceSave(data, description)
  };
}

// ============================================================================
// CLOUD STORAGE SIMULATION
// ============================================================================

/**
 * AutoSave with simulated cloud storage
 * Replace the simulation with real API calls to your backend
 */
export function useAutoSaveWithCloudStorage(
  resumeData: any, 
  userId?: string,
  apiEndpoint = '/api/resume'
) {
  const { saveData, autoSaveState } = useAutoSave();
  const [cloudSync, setCloudSync] = useState({
    lastSynced: null as Date | null,
    syncStatus: 'idle' as 'idle' | 'syncing' | 'synced' | 'error',
    syncError: null as string | null
  });

  // Simulated cloud save function
  const saveToCloud = useCallback(async (data: any) => {
    if (!userId) return false;

    setCloudSync(prev => ({ ...prev, syncStatus: 'syncing', syncError: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // In a real app, replace this with your actual API call:
      // const response = await fetch(`${apiEndpoint}/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // 
      // if (!response.ok) throw new Error('Cloud save failed');

      setCloudSync({
        lastSynced: new Date(),
        syncStatus: 'synced',
        syncError: null
      });

      console.log('Resume saved to cloud successfully');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Cloud sync failed';
      setCloudSync(prev => ({
        ...prev,
        syncStatus: 'error',
        syncError: errorMessage
      }));
      console.error('Cloud save error:', error);
      return false;
    }
  }, [userId, apiEndpoint]);

  // Enhanced save that includes cloud sync
  const saveWithCloud = useCallback(async (data: any, description?: string) => {
    // Save locally first
    const localSuccess = await saveData(data, description);
    
    // Then sync to cloud
    if (localSuccess && userId) {
      await saveToCloud(data);
    }
    
    return localSuccess;
  }, [saveData, saveToCloud, userId]);

  // Auto-save when resume data changes
  useEffect(() => {
    if (resumeData && userId) {
      saveWithCloud(resumeData);
    }
  }, [resumeData, saveWithCloud, userId]);

  return {
    ...autoSaveState,
    cloudSync,
    saveWithCloud,
    manualCloudSync: () => saveToCloud(resumeData)
  };
}

// ============================================================================
// EXPORT/IMPORT FUNCTIONALITY
// ============================================================================

/**
 * AutoSave with export/import capabilities
 */
export function useAutoSaveWithExport(resumeData: any) {
  const { saveData, getHistory, autoSaveState } = useAutoSave();

  // Export resume data as JSON
  const exportResumeData = useCallback(() => {
    const exportData = {
      resumeData,
      exportDate: new Date().toISOString(),
      version: '1.0',
      source: 'FreeResume Builder'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [resumeData]);

  // Import resume data from JSON file
  const importResumeData = useCallback((file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const importedData = JSON.parse(result);
          
          // Validate imported data structure
          if (importedData.resumeData && typeof importedData.resumeData === 'object') {
            resolve(importedData.resumeData);
          } else {
            reject(new Error('Invalid resume data format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse resume data file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  // Export history
  const exportHistory = useCallback(() => {
    const history = getHistory();
    const exportData = {
      history,
      exportDate: new Date().toISOString(),
      totalVersions: history.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [getHistory]);

  return {
    ...autoSaveState,
    exportResumeData,
    importResumeData,
    exportHistory
  };
}

// ============================================================================
// COLLABORATIVE EDITING SIMULATION
// ============================================================================

/**
 * AutoSave with collaborative editing simulation
 * This would integrate with WebSockets in a real app
 */
export function useAutoSaveWithCollaboration(
  resumeData: any,
  sessionId: string,
  collaborators: string[] = []
) {
  const { saveData, autoSaveState } = useAutoSave();
  const [collaboration, setCollaboration] = useState({
    activeCollaborators: collaborators,
    conflictDetected: false,
    lastRemoteUpdate: null as Date | null,
    remoteChanges: [] as Array<{ user: string; timestamp: Date; changes: any }>
  });

  // Simulate receiving remote changes
  useEffect(() => {
    if (collaborators.length === 0) return;

    const interval = setInterval(() => {
      // Simulate random remote changes
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const mockChange = {
          user: collaborators[Math.floor(Math.random() * collaborators.length)],
          timestamp: new Date(),
          changes: { section: 'personalInfo', field: 'summary', value: 'Updated by collaborator' }
        };

        setCollaboration(prev => ({
          ...prev,
          remoteChanges: [mockChange, ...prev.remoteChanges.slice(0, 9)],
          lastRemoteUpdate: mockChange.timestamp
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [collaborators]);

  // Enhanced save with conflict detection
  const saveWithCollaboration = useCallback(async (data: any, description?: string) => {
    // Check for conflicts (simplified)
    const hasConflict = collaboration.lastRemoteUpdate && 
                       collaboration.lastRemoteUpdate > (autoSaveState.lastSaved || new Date(0));

    if (hasConflict) {
      setCollaboration(prev => ({ ...prev, conflictDetected: true }));
      console.warn('Potential conflict detected with remote changes');
    }

    // Save locally
    const success = await saveData(data, description);

    // In a real app, you would:
    // - Send changes to WebSocket server
    // - Handle conflict resolution
    // - Broadcast changes to other collaborators

    return success;
  }, [saveData, collaboration.lastRemoteUpdate, autoSaveState.lastSaved]);

  return {
    ...autoSaveState,
    collaboration,
    saveWithCollaboration,
    resolveConflict: () => setCollaboration(prev => ({ ...prev, conflictDetected: false }))
  };
}

// ============================================================================
// COMPONENT FOR TESTING DIFFERENT STORAGE OPTIONS
// ============================================================================

export function AutoSaveStorageDemo({ resumeData }: { resumeData: any }) {
  const [storageType, setStorageType] = useState<'memory' | 'browser' | 'cloud' | 'export'>('memory');
  const [userId] = useState('demo-user-123');

  // Different storage hooks
  const memoryAutoSave = useAutoSave();
  const browserAutoSave = useAutoSaveWithBrowserStorage(resumeData);
  const cloudAutoSave = useAutoSaveWithCloudStorage(resumeData, userId);
  const exportAutoSave = useAutoSaveWithExport(resumeData);

  const getCurrentAutoSave = () => {
    switch (storageType) {
      case 'browser': return browserAutoSave;
      case 'cloud': return cloudAutoSave;
      case 'export': return exportAutoSave;
      default: return memoryAutoSave;
    }
  };

  const currentAutoSave = getCurrentAutoSave();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-medium text-gray-900 mb-4">AutoSave Storage Options</h3>
      
      {/* Storage Type Selector */}
      <div className="flex space-x-2 mb-4">
        {['memory', 'browser', 'cloud', 'export'].map(type => (
          <button
            key={type}
            onClick={() => setStorageType(type as any)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              storageType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Current Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${
            currentAutoSave.autoSaveState?.status === 'saved' ? 'text-green-600' :
            currentAutoSave.autoSaveState?.status === 'saving' ? 'text-yellow-600' :
            currentAutoSave.autoSaveState?.status === 'error' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {currentAutoSave.autoSaveState?.status || 'Ready'}
          </span>
        </div>

        {storageType === 'browser' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Browser Storage:</span>
            <span className={`text-sm ${browserAutoSave.storageAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {browserAutoSave.storageAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
        )}

        {storageType === 'cloud' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cloud Sync:</span>
            <span className={`text-sm ${
              cloudAutoSave.cloudSync?.syncStatus === 'synced' ? 'text-green-600' :
              cloudAutoSave.cloudSync?.syncStatus === 'syncing' ? 'text-yellow-600' :
              cloudAutoSave.cloudSync?.syncStatus === 'error' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {cloudAutoSave.cloudSync?.syncStatus || 'Idle'}
            </span>
          </div>
        )}

        {storageType === 'export' && (
          <div className="flex space-x-2">
            <button
              onClick={exportAutoSave.exportResumeData}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              Export Resume
            </button>
            <button
              onClick={exportAutoSave.exportHistory}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            >
              Export History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  useAutoSaveWithBrowserStorage,
  useAutoSaveWithCloudStorage,
  useAutoSaveWithExport,
  useAutoSaveWithCollaboration,
  AutoSaveStorageDemo
};