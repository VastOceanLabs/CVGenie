import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Toast types and interfaces
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

interface ToastConfig {
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  titleColor: string;
  messageColor: string;
  barColor: string;
  defaultDuration: number;
}

// Toast context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast configuration with proper typing
const TOAST_CONFIGS: Record<ToastType, ToastConfig> = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-800',
    barColor: 'bg-green-600',
    defaultDuration: 5000,
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    messageColor: 'text-red-800',
    barColor: 'bg-red-600',
    defaultDuration: 7000,
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-800',
    barColor: 'bg-yellow-600',
    defaultDuration: 6000,
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-800',
    barColor: 'bg-blue-600',
    defaultDuration: 5000,
  },
};

// Generate unique IDs safely
function generateToastId(): string {
  // Use crypto.randomUUID if available, fallback to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `toast-${crypto.randomUUID()}`;
  }
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Individual Toast Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const config = TOAST_CONFIGS[toast.type];
  const IconComponent = config.icon;
  const duration = toast.duration ?? config.defaultDuration;
  const isDismissible = toast.dismissible !== false;

  // Stable dismiss handler
  const handleDismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match the transition duration
  }, [toast.id, onRemove]);

  // Auto-dismiss timer with proper cleanup
  useEffect(() => {
    if (duration > 0) {
      timerRef.current = window.setTimeout(() => {
        handleDismiss();
      }, duration);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [duration, handleDismiss]);

  // Entry animation
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleActionClick = () => {
    if (toast.action) {
      toast.action.onClick();
    }
    handleDismiss();
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
      role="alert"
      aria-atomic="true"
    >
      <div className={`
        ${config.bgColor} ${config.borderColor}
        border rounded-lg shadow-lg p-4 mb-3 max-w-sm w-full
        backdrop-blur-sm
      `}>
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
              {toast.title}
            </h4>
            {toast.message && (
              <p className={`text-sm ${config.messageColor} break-words`}>
                {toast.message}
              </p>
            )}
            
            {/* Action Button */}
            {toast.action && (
              <button
                onClick={handleActionClick}
                className={`
                  mt-2 text-sm font-medium underline hover:no-underline
                  ${config.titleColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Dismiss Button */}
          {isDismissible && (
            <button
              onClick={handleDismiss}
              className={`
                flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-colors duration-200
              `}
              aria-label="Dismiss notification"
            >
              <X className={`w-4 h-4 ${config.iconColor}`} />
            </button>
          )}
        </div>

        {/* Progress Bar (for auto-dismiss) */}
        {duration > 0 && (
          <div className="mt-3 w-full bg-black bg-opacity-10 rounded-full h-1">
            <div 
              ref={progressRef}
              className={`h-1 rounded-full ${config.barColor} toast-progress`}
              style={{
                animationDuration: `${duration}ms`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Toast Container Component
function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  if (toasts.length === 0) return null;

  return (
    <>
      {/* Progress bar animation styles */}
      <style>
        {`
          .toast-progress {
            width: 100%;
            animation: toast-progress-shrink linear forwards;
          }
          
          @keyframes toast-progress-shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
      
      {/* Toast container */}
      <div 
        className="fixed top-4 right-4 z-50 space-y-2"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </>
  );
}

// Toast Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const cleanupTimerRef = useRef<number | null>(null);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = generateToastId();
    const newToast: Toast = {
      id,
      dismissible: true,
      ...toastData,
    };

    setToasts(prev => [...prev, newToast]);
    
    // Clear existing cleanup timer
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
    }
    
    // Limit maximum number of toasts with proper cleanup
    cleanupTimerRef.current = window.setTimeout(() => {
      setToasts(prev => {
        if (prev.length > 5) {
          return prev.slice(-5);
        }
        return prev;
      });
      cleanupTimerRef.current = null;
    }, 100);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Custom hook for using toasts
export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearAllToasts } = context;

  // Convenience methods for different toast types
  const toast = {
    success: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'success',
        title,
        message,
        ...options,
      });
    },
    
    error: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'error',
        title,
        message,
        duration: 8000, // Longer duration for errors
        ...options,
      });
    },
    
    warning: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'warning',
        title,
        message,
        ...options,
      });
    },
    
    info: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'info',
        title,
        message,
        ...options,
      });
    },

    // Custom toast with full control
    custom: (toastData: Omit<Toast, 'id'>) => {
      return addToast(toastData);
    },

    // Promise-based toasts for async operations
    promise: async <T,>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: any) => string);
      }
    ): Promise<T> => {
      const loadingToastId = addToast({
        type: 'info',
        title: loading,
        duration: 0,
        dismissible: false,
      });

      try {
        const result = await promise;
        removeToast(loadingToastId);
        
        const successMessage = typeof success === 'function' ? success(result) : success;
        addToast({
          type: 'success',
          title: successMessage,
        });
        
        return result;
      } catch (err) {
        removeToast(loadingToastId);
        
        const errorMessage = typeof error === 'function' ? error(err) : error;
        addToast({
          type: 'error',
          title: errorMessage,
          duration: 8000,
        });
        
        throw err;
      }
    },

    dismiss: removeToast,
    dismissAll: clearAllToasts,
  };

  return toast;
}

// Factory function for resume-specific toasts (fixes hook rule violation)
export const createResumeToasts = (toast: ReturnType<typeof useToast>) => ({
  // Data operations
  autoSaved: () => toast.success('Auto-saved', 'Your resume has been saved automatically'),
  
  dataSaved: () => toast.success('Saved', 'Your changes have been saved'),
  
  dataRestored: () => toast.success('Data Restored', 'Your resume data has been recovered'),
  
  // PDF operations
  pdfGenerated: () => toast.success('PDF Ready', 'Your resume has been generated successfully'),
  
  pdfFailed: () => toast.error('PDF Generation Failed', 'Unable to generate PDF. Please try again.'),
  
  // Template operations
  templateChanged: (templateName: string) => 
    toast.success('Template Changed', `Switched to ${templateName} template`),
  
  // Validation
  formIncomplete: () => toast.warning('Form Incomplete', 'Please fill in all required fields'),
  
  // ATS optimization
  atsImproved: (score: number) => 
    toast.success('ATS Score Improved', `Your ATS compatibility is now ${score}%`),
  
  // Import/Export
  dataImported: () => toast.success('Data Imported', 'Resume data imported successfully'),
  
  dataExported: () => toast.success('Data Exported', 'Resume data exported to clipboard'),
  
  // Errors
  loadingError: () => toast.error('Loading Error', 'Failed to load resume data'),
  
  networkError: () => toast.error('Network Error', 'Please check your internet connection'),
  
  validationError: (field: string) => 
    toast.error('Validation Error', `Please check the ${field} field`),
});

// Hook for resume-specific toasts
export function useResumeToasts() {
  const toast = useToast();
  
  return useMemo(() => createResumeToasts(toast), [toast]);
}

export default ToastProvider;