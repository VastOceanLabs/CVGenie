// Extended AutoSave hooks for different storage scenarios
import React, { useEffect, useCallback, useState } from 'react';
import { 
  useAutoSave, 
  AutoSaveHistory as AutoSaveEntry, 
  AutoSaveState,
  AutoSaveConfig 
} from '../services/autosave-service';
import { Download, Upload, Cloud, HardDrive, Users, Wifi, WifiOff } from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface CloudSyncState {
  lastSynced: Date | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncError: string | null;
}

interface CollaborationState {
  activeCollaborators: string[];
  conflictDetected: boolean;
  lastRemoteUpdate: Date | null;
  remoteChanges: Array<{
    user: string;
    timestamp: Date;
    changes: any;
  }>;
}

interface StorageCapabilities {
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webSQL: boolean;
}

// ============================================================================
// BROWSER STORAGE EXTENSION (for environments where it's available)
// ============================================================================

/**
 * Extended AutoSave that includes browser storage when available
 * Note: Only use this outside of Claude.ai artifacts
 */
export function useAutoSaveWithBrowserStorage(
  resumeData: any, 
  storageKey = 'freeresume-data'
) {
  const { saveData, autoSaveState, forceSave } = useAutoSave();
  const [storageCapabilities, setStorageCapabilities] = useState<StorageCapabilities>({
    localStorage: false,
    sessionStorage: false,
    indexedDB: false,
    webSQL: false
  });

  // Check storage capabilities on mount
  useEffect(() => {
    const capabilities: StorageCapabilities = {
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
      webSQL: false
    };

    // Test localStorage
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      capabilities.localStorage = true;
    } catch {
      console.log('localStorage not available - using memory only');
    }

    // Test sessionStorage
    try {
      const testKey = '__session_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      capabilities.sessionStorage = true;
    } catch {
      console.log('sessionStorage not available');
    }

    // Test IndexedDB
    try {
      capabilities.indexedDB = 'indexedDB' in window && window.indexedDB !== null;
    } catch {
      console.log('IndexedDB not available');
    }

    // Test WebSQL (deprecated but still check)
    try {
      capabilities.webSQL = 'openDatabase' in window;
    } catch {
      console.log('WebSQL not available');
    }

    setStorageCapabilities(capabilities);
  }, []);

  // Enhanced save function that includes localStorage
  const saveWithStorage = useCallback(async (data: any, description?: string) => {
    // Always save to memory first
    const memorySuccess = await saveData(data, description);
    
    // Also save to localStorage if available
    if (storageCapabilities.localStorage) {
      try {
        const storageData = {
          resumeData: data,
          timestamp: new Date().toISOString(),
          version: Date.now(),
          description
        };
        localStorage.setItem(storageKey, JSON.stringify(storageData));
        console.log('Successfully saved to localStorage');
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
    
    return memorySuccess;
  }, [saveData, storageCapabilities.localStorage, storageKey]);

  // Load from localStorage on mount
  const loadFromStorage = useCallback((): any | null => {
    if (!storageCapabilities.localStorage) return null;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { resumeData: savedData, timestamp } = JSON.parse(saved);
        
        // Only load if saved data is recent (< 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (new Date(timestamp).getTime() > sevenDaysAgo) {
          console.log('Loaded resume data from localStorage');
          return savedData;
        } else {
          console.log('Stored data is too old, ignoring');
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
    return null;
  }, [storageCapabilities.localStorage, storageKey]);

  // Auto-save when resume data changes
  useEffect(() => {
    if (resumeData && Object.keys(resumeData).length > 0) {
      saveWithStorage(resumeData, 'Auto-save to browser storage');
    }
  }, [resumeData, saveWithStorage]);

  return {
    ...autoSaveState,
    saveWithStorage,
    loadFromStorage,
    storageCapabilities,
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
  const [cloudSync, setCloudSync] = useState<CloudSyncState>({
    lastSynced: null,
    syncStatus: 'idle',
    syncError: null
  });

  // Simulated cloud save function
  const saveToCloud = useCallback(async (data: any): Promise<boolean> => {
    if (!userId) {
      console.warn('No user ID provided for cloud save');
      return false;
    }

    setCloudSync(prev => ({ 
      ...prev, 
      syncStatus: 'syncing', 
      syncError: null 
    }));

    try {
      // Simulate network latency
      const delay = 500 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate occasional failures (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error: Connection timeout');
      }

      // In a real app, replace this with your actual API call:
      // const response = await fetch(`${apiEndpoint}/${userId}`, {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify({
      //     resumeData: data,
      //     timestamp: new Date().toISOString(),
      //     checksum: btoa(JSON.stringify(data))
      //   })
      // });
      // 
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Cloud save failed');
      // }

      setCloudSync({
        lastSynced: new Date(),
        syncStatus: 'synced',
        syncError: null
      });

      console.log(`Resume saved to cloud for user ${userId}`);
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
    
    // Then sync to cloud if user is logged in
    if (localSuccess && userId) {
      await saveToCloud(data);
    }
    
    return localSuccess;
  }, [saveData, saveToCloud, userId]);

  // Auto-save when resume data changes
  useEffect(() => {
    if (resumeData && userId && Object.keys(resumeData).length > 0) {
      saveWithCloud(resumeData, 'Auto-save with cloud sync');
    }
  }, [resumeData, saveWithCloud, userId]);

  // Manual cloud sync
  const manualCloudSync = useCallback(() => {
    if (!resumeData || !userId) return Promise.resolve(false);
    return saveToCloud(resumeData);
  }, [resumeData, userId, saveToCloud]);

  return {
    ...autoSaveState,
    cloudSync,
    saveWithCloud,
    manualCloudSync
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
      source: 'FreeResume Builder',
      metadata: {
        totalSections: Object.keys(resumeData).length,
        hasExperience: resumeData.experience?.length > 0,
        hasEducation: resumeData.education?.length > 0,
        hasSkills: resumeData.skills?.length > 0,
        hasCertifications: resumeData.certifications?.length > 0
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const fileName = `resume-${resumeData.personalInfo?.firstName || 'untitled'}-${new Date().toISOString().split('T')[0]}.json`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Resume exported as ${fileName}`);
  }, [resumeData]);

  // Import resume data from JSON file
  const importResumeData = useCallback((file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!file.type.includes('json')) {
        reject(new Error('Please select a valid JSON file'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('File size too large (max 5MB)'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const importedData = JSON.parse(result);
          
          // Validate imported data structure
          if (importedData.resumeData && typeof importedData.resumeData === 'object') {
            // Basic validation of resume structure
            const requiredFields = ['personalInfo'];
            const hasRequiredFields = requiredFields.every(field => 
              field in importedData.resumeData
            );

            if (hasRequiredFields) {
              console.log('Resume data imported successfully');
              resolve(importedData.resumeData);
            } else {
              reject(new Error('Invalid resume data structure - missing required fields'));
            }
          } else {
            reject(new Error('Invalid file format - not a valid resume export'));
          }
        } catch (error) {
          reject(new Error('Failed to parse resume data file - invalid JSON'));
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
      history: history.map(entry => ({
        ...entry,
        timestamp: entry.timestamp.toISOString()
      })),
      exportDate: new Date().toISOString(),
      totalVersions: history.length,
      source: 'FreeResume Builder - AutoSave History'
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

    console.log('AutoSave history exported');
  }, [getHistory]);

  // Import history
  const importHistory = useCallback((file: File): Promise<AutoSaveEntry[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const importedData = JSON.parse(result);
          
          if (importedData.history && Array.isArray(importedData.history)) {
            // Convert timestamp strings back to Date objects
            const processedHistory = importedData.history.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp)
            }));
            resolve(processedHistory);
          } else {
            reject(new Error('Invalid history file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse history file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    ...autoSaveState,
    exportResumeData,
    importResumeData,
    exportHistory,
    importHistory
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
  const [collaboration, setCollaboration] = useState<CollaborationState>({
    activeCollaborators: collaborators,
    conflictDetected: false,
    lastRemoteUpdate: null,
    remoteChanges: []
  });

  // Simulate receiving remote changes
  useEffect(() => {
    if (collaborators.length === 0) return;

    const interval = setInterval(() => {
      // Simulate random remote changes (10% chance every 5 seconds)
      if (Math.random() < 0.1) {
        const randomCollaborator = collaborators[Math.floor(Math.random() * collaborators.length)];
        const mockChanges = [
          { section: 'personalInfo', field: 'summary', value: 'Updated summary by collaborator' },
          { section: 'skills', action: 'add', value: { name: 'New Skill', level: 'intermediate' } },
          { section: 'experience', field: 'description', value: 'Enhanced job description' }
        ];
        
        const randomChange = mockChanges[Math.floor(Math.random() * mockChanges.length)];
        
        const mockChange = {
          user: randomCollaborator,
          timestamp: new Date(),
          changes: randomChange
        };

        setCollaboration(prev => ({
          ...prev,
          remoteChanges: [mockChange, ...prev.remoteChanges.slice(0, 9)],
          lastRemoteUpdate: mockChange.timestamp
        }));

        console.log(`Remote change received from ${randomCollaborator}:`, randomChange);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [collaborators]);

  // Enhanced save with conflict detection
  const saveWithCollaboration = useCallback(async (data: any, description?: string) => {
    // Check for conflicts (simplified conflict detection)
    const hasConflict = collaboration.lastRemoteUpdate && 
                       collaboration.lastRemoteUpdate > (autoSaveState.lastSaved || new Date(0));

    if (hasConflict) {
      setCollaboration(prev => ({ ...prev, conflictDetected: true }));
      console.warn('Potential conflict detected with remote changes');
    }

    // Save locally
    const success = await saveData(data, description);

    // In a real app, you would:
    // - Send changes to WebSocket server with conflict resolution
    // - Handle operational transformation for concurrent edits
    // - Broadcast changes to other collaborators
    // - Implement proper conflict resolution strategies

    if (success) {
      console.log(`Data saved with collaboration awareness for session ${sessionId}`);
    }

    return success;
  }, [saveData, collaboration.lastRemoteUpdate, autoSaveState.lastSaved, sessionId]);

  // Resolve conflict
  const resolveConflict = useCallback((resolution: 'accept_remote' | 'keep_local' | 'manual') => {
    setCollaboration(prev => ({ 
      ...prev, 
      conflictDetected: false 
    }));
    
    console.log(`Conflict resolved with strategy: ${resolution}`);
    
    // In a real app, apply the resolution strategy here
  }, []);

  // Update collaborator list
  const updateCollaborators = useCallback((newCollaborators: string[]) => {
    setCollaboration(prev => ({
      ...prev,
      activeCollaborators: newCollaborators
    }));
  }, []);

  return {
    ...autoSaveState,
    collaboration,
    saveWithCollaboration,
    resolveConflict,
    updateCollaborators
  };
}

// ============================================================================
// COMPREHENSIVE STORAGE MANAGER COMPONENT
// ============================================================================

interface AutoSaveStorageDemoProps {
  resumeData: any;
  onDataChange?: (data: any) => void;
}

export function AutoSaveStorageDemo({ 
  resumeData, 
  onDataChange 
}: AutoSaveStorageDemoProps) {
  const [storageType, setStorageType] = useState<'memory' | 'browser' | 'cloud' | 'export' | 'collaboration'>('memory');
  const [userId] = useState('demo-user-123');
  const [sessionId] = useState('session-' + Math.random().toString(36).substr(2, 9));
  const [collaborators] = useState(['alice@example.com', 'bob@example.com']);

  // Different storage hooks
  const memoryAutoSave = useAutoSave();
  const browserAutoSave = useAutoSaveWithBrowserStorage(resumeData);
  const cloudAutoSave = useAutoSaveWithCloudStorage(resumeData, userId);
  const exportAutoSave = useAutoSaveWithExport(resumeData);
  const collaborationAutoSave = useAutoSaveWithCollaboration(resumeData, sessionId, collaborators);

  const getCurrentAutoSave = () => {
    switch (storageType) {
      case 'browser': return browserAutoSave;
      case 'cloud': return cloudAutoSave;
      case 'export': return exportAutoSave;
      case 'collaboration': return collaborationAutoSave;
      default: return memoryAutoSave;
    }
  };

  const currentAutoSave = getCurrentAutoSave();

  // Handle file import
  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if ('importResumeData' in exportAutoSave) {
      exportAutoSave.importResumeData(file)
        .then(data => {
          if (onDataChange) {
            onDataChange(data);
          }
          console.log('Resume data imported successfully');
        })
        .catch(error => {
          console.error('Import failed:', error);
          alert(`Import failed: ${error.message}`);
        });
    }

    // Reset file input
    event.target.value = '';
  }, [exportAutoSave, onDataChange]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
        <HardDrive className="w-5 h-5 mr-2" />
        AutoSave Storage Options
      </h3>
      
      {/* Storage Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {([
          { id: 'memory', label: 'Memory', icon: '🧠' },
          { id: 'browser', label: 'Browser', icon: '💾' },
          { id: 'cloud', label: 'Cloud', icon: '☁️' },
          { id: 'export', label: 'Export', icon: '📤' },
          { id: 'collaboration', label: 'Collab', icon: '👥' }
        ] as const).map(type => (
          <button
            key={type.id}
            onClick={() => setStorageType(type.id)}
            className={`flex flex-col items-center p-3 rounded-lg text-sm font-medium transition-colors ${
              storageType === type.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg mb-1">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>

      {/* Current Status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium flex items-center space-x-1 ${
            currentAutoSave.status === 'saved' ? 'text-green-600' :
            currentAutoSave.status === 'saving' ? 'text-yellow-600' :
            currentAutoSave.status === 'error' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {currentAutoSave.isOnline === false ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            <span>{currentAutoSave.status || 'Ready'}</span>
          </span>
        </div>

        {/* Storage-specific status */}
        {storageType === 'browser' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">Browser Storage</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">localStorage:</span>
                <span className={`ml-2 ${browserAutoSave.storageCapabilities?.localStorage ? 'text-green-600' : 'text-red-600'}`}>
                  {browserAutoSave.storageCapabilities?.localStorage ? '✓ Available' : '✗ Not Available'}
                </span>
              </div>
              <div>
                <span className="text-blue-700">sessionStorage:</span>
                <span className={`ml-2 ${browserAutoSave.storageCapabilities?.sessionStorage ? 'text-green-600' : 'text-red-600'}`}>
                  {browserAutoSave.storageCapabilities?.sessionStorage ? '✓ Available' : '✗ Not Available'}
                </span>
              </div>
            </div>
          </div>
        )}

        {storageType === 'cloud' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="font-medium text-purple-900 mb-2 flex items-center">
              <Cloud className="w-4 h-4 mr-2" />
              Cloud Sync Status
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-purple-700">Sync Status:</span>
                <span className={`${
                  cloudAutoSave.cloudSync?.syncStatus === 'synced' ? 'text-green-600' :
                  cloudAutoSave.cloudSync?.syncStatus === 'syncing' ? 'text-yellow-600' :
                  cloudAutoSave.cloudSync?.syncStatus === 'error' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {cloudAutoSave.cloudSync?.syncStatus || 'Idle'}
                </span>
              </div>
              {cloudAutoSave.cloudSync?.lastSynced && (
                <div className="flex justify-between">
                  <span className="text-purple-700">Last Synced:</span>
                  <span className="text-purple-600">
                    {cloudAutoSave.cloudSync.lastSynced.toLocaleTimeString()}
                  </span>
                </div>
              )}
              {cloudAutoSave.cloudSync?.syncError && (
                <div className="text-red-600 text-xs mt-2">
                  Error: {cloudAutoSave.cloudSync.syncError}
                </div>
              )}
            </div>
          </div>
        )}

        {storageType === 'export' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-3 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export & Import
            </h4>
            <div className="flex flex-wrap gap-2">
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
              
              <label className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 transition-colors cursor-pointer">
                <Upload className="w-3 h-3 inline mr-1" />
                Import Resume
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {storageType === 'collaboration' && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Collaboration
            </h4>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-indigo-700">Active Collaborators:</span>
                <div className="mt-1 space-x-1">
                  {collaborationAutoSave.collaboration.activeCollaborators.map(user => (
                    <span key={user} className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                      {user.split('@')[0]}
                    </span>
                  ))}
                </div>
              </div>
              
              {collaborationAutoSave.collaboration.conflictDetected && (
                <div className="bg-red-100 border border-red-300 rounded p-2">
                  <span className="text-red-700 text-xs font-medium">
                    ⚠️ Conflict detected with remote changes
                  </span>
                  <button
                    onClick={() => collaborationAutoSave.resolveConflict('keep_local')}
                    className="ml-2 px-2 py-1 bg-red-200 text-red-800 rounded text-xs hover:bg-red-300"
                  >
                    Resolve
                  </button>
                </div>
              )}
              
              {collaborationAutoSave.collaboration.remoteChanges.length > 0 && (
                <div>
                  <span className="text-indigo-700">Recent Changes:</span>
                  <div className="mt-1 max-h-20 overflow-y-auto">
                    {collaborationAutoSave.collaboration.remoteChanges.slice(0, 3).map((change, index) => (
                      <div key={index} className="text-xs text-indigo-600">
                        {change.user.split('@')[0]} modified {change.changes.section}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => currentAutoSave.forceSave?.(resumeData, 'Manual save')}
          disabled={currentAutoSave.status === 'saving'}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Force Save
        </button>
        
        {storageType === 'cloud' && (
          <button
            onClick={() => cloudAutoSave.manualCloudSync?.()}
            disabled={cloudAutoSave.cloudSync?.syncStatus === 'syncing'}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
}

// Export all hooks and components
export default {
  useAutoSaveWithBrowserStorage,
  useAutoSaveWithCloudStorage,
  useAutoSaveWithExport,
  useAutoSaveWithCollaboration,
  AutoSaveStorageDemo
};