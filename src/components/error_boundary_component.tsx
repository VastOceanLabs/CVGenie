import React, { Component, ErrorInfo, ReactNode, useCallback, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  FileText, 
  Bug, 
  Wifi, 
  HelpCircle,
  ArrowLeft,
  Download,
  Shield
} from 'lucide-react';

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const DEFAULT_BACKUP_KEY = 'resumeData';
const SUPPORT_EMAIL = 'support@freeresume-builder.com';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  level?: 'page' | 'section' | 'component';
  maxRetries?: number;
  backupKey?: string;
  navigate?: (path: string) => void; // For React Router integration
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  isRetrying: boolean;
  retryCount: number;
}

// Error types for better UX
enum ErrorType {
  CHUNK_LOAD_ERROR = 'ChunkLoadError',
  NETWORK_ERROR = 'NetworkError',
  VALIDATION_ERROR = 'ValidationError',
  PERMISSION_ERROR = 'PermissionError',
  TIMEOUT_ERROR = 'TimeoutError',
  UNKNOWN_ERROR = 'UnknownError'
}

// Typed suggestion object
type ErrorSuggestion = {
  title: string;
  message: string;
  icon: React.ElementType;
  action: string;
};

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private errorCardRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      isRetrying: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error for debugging
    if (this.isDevEnvironment()) {
      console.group('🚨 ErrorBoundary caught an error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to analytics or error tracking service
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Focus management when error boundary renders
    if (!prevState.hasError && this.state.hasError && this.errorCardRef.current) {
      // Move focus to the error card for accessibility
      const firstButton = this.errorCardRef.current.querySelector('button');
      if (firstButton) {
        firstButton.focus();
      } else {
        this.errorCardRef.current.focus();
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private isDevEnvironment = (): boolean => {
    return typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
  };

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Here you would integrate with your error tracking service
    // e.g., Sentry, LogRocket, Bugsnag, etc.
    
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      errorType: this.getErrorType(error),
      level: this.props.level || 'component'
    };

    // Send to analytics (with safety check)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: false,
          custom_map: { error_id: this.state.errorId }
        });
      } catch (analyticsError) {
        console.warn('Failed to report to analytics:', analyticsError);
      }
    }

    // Development logging
    if (this.isDevEnvironment()) {
      console.group('🐛 Error Report');
      console.log('Error ID:', errorReport.errorId);
      console.log('Type:', errorReport.errorType);
      console.log('Message:', errorReport.message);
      console.log('Component Stack:', errorReport.componentStack);
      console.groupEnd();
    }

    // TODO: Replace with your error tracking service
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorReport });
    // }
  };

  private getErrorType = (error: Error): ErrorType => {
    const message = error.message.toLowerCase();
    
    if (message.includes('loading chunk')) {
      return ErrorType.CHUNK_LOAD_ERROR;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK_ERROR;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION_ERROR;
    }
    if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorType.PERMISSION_ERROR;
    }
    if (message.includes('timeout')) {
      return ErrorType.TIMEOUT_ERROR;
    }
    
    return ErrorType.UNKNOWN_ERROR;
  };

  private getErrorSuggestion = (errorType: ErrorType): ErrorSuggestion => {
    switch (errorType) {
      case ErrorType.CHUNK_LOAD_ERROR:
        return {
          title: 'App Update Available',
          message: 'A new version is available. Please refresh the page to get the latest features.',
          icon: RefreshCw,
          action: 'Refresh Page'
        };
      case ErrorType.NETWORK_ERROR:
        return {
          title: 'Connection Issue',
          message: 'Please check your internet connection and try again.',
          icon: Wifi,
          action: 'Retry'
        };
      case ErrorType.VALIDATION_ERROR:
        return {
          title: 'Input Validation Error',
          message: 'Please check your form inputs and try again.',
          icon: AlertTriangle,
          action: 'Go Back'
        };
      case ErrorType.PERMISSION_ERROR:
        return {
          title: 'Permission Denied',
          message: 'You may need to refresh the page or check your browser settings.',
          icon: Shield,
          action: 'Refresh'
        };
      case ErrorType.TIMEOUT_ERROR:
        return {
          title: 'Request Timeout',
          message: 'The operation took too long. Please try again.',
          icon: RefreshCw,
          action: 'Retry'
        };
      default:
        return {
          title: 'Something Went Wrong',
          message: 'An unexpected error occurred. Please try refreshing the page.',
          icon: Bug,
          action: 'Refresh'
        };
    }
  };

  private handleRetry = () => {
    const maxRetries = this.props.maxRetries ?? MAX_RETRIES;
    
    if (this.state.retryCount >= maxRetries) {
      // Max retries reached, suggest page refresh
      window.location.reload();
      return;
    }

    this.setState({ isRetrying: true });

    // Clear error state after a short delay using functional setState
    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        isRetrying: false,
        retryCount: prevState.retryCount + 1
      }));
    }, RETRY_DELAY);
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    // Use React Router navigate if provided, otherwise fallback to location change
    if (this.props.navigate) {
      this.props.navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  };

  private handleDownloadData = () => {
    // Try to save user's data before error
    const backupKey = this.props.backupKey || DEFAULT_BACKUP_KEY;
    
    try {
      const userData = localStorage.getItem(backupKey);
      if (userData) {
        const dataBlob = new Blob([userData], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${backupKey}-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Failed to download backup data:', e);
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorType = this.getErrorType(this.state.error);
      const suggestion = this.getErrorSuggestion(errorType);
      const IconComponent = suggestion.icon;
      const isPageLevel = this.props.level === 'page';
      const maxRetries = this.props.maxRetries ?? MAX_RETRIES;

      // Support email with proper encoding
      const supportMailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Error Report')}&body=${encodeURIComponent(`Error ID: ${this.state.errorId || 'Unknown'}`)}`;

      return (
        <div className={`flex items-center justify-center p-6 ${isPageLevel ? 'min-h-screen bg-gray-50' : 'min-h-[400px]'}`}>
          <div className="max-w-md w-full">
            {/* Error Card */}
            <div 
              ref={this.errorCardRef}
              role="alertdialog"
              aria-labelledby="error-title"
              aria-describedby="error-description"
              tabIndex={-1}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <IconComponent className="w-8 h-8 text-red-600" aria-hidden="true" />
              </div>

              {/* Error Title */}
              <h2 id="error-title" className="text-xl font-semibold text-gray-900 mb-2">
                {suggestion.title}
              </h2>

              {/* Error Message */}
              <p id="error-description" className="text-gray-600 mb-6">
                {suggestion.message}
              </p>

              {/* Error ID for support */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
                <p className="text-xs text-gray-500 mb-1">Error ID for support:</p>
                <code className="text-xs font-mono text-gray-700 bg-white px-2 py-1 rounded border">
                  {this.state.errorId}
                </code>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Primary Action */}
                <button
                  onClick={errorType === ErrorType.CHUNK_LOAD_ERROR ? this.handleRefresh : this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {this.state.isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Retrying...</span>
                    </>
                  ) : (
                    <>
                      <IconComponent className="w-4 h-4" aria-hidden="true" />
                      <span>{suggestion.action}</span>
                    </>
                  )}
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={this.handleGoBack}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Go Back</span>
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>Home</span>
                  </button>
                </div>

                {/* Data Backup Option (for resume builder errors) */}
                {isPageLevel && (
                  <button
                    onClick={this.handleDownloadData}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors border border-green-200"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download Backup Data</span>
                  </button>
                )}
              </div>

              {/* Retry Counter */}
              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-500 mt-4">
                  Retry attempt: {this.state.retryCount}/{maxRetries}
                </p>
              )}

              {/* Help Link */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <a
                  href={supportMailto}
                  className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  <HelpCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>

            {/* Development Error Details */}
            {this.isDevEnvironment() && this.props.showErrorDetails && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">Development Error Details</h3>
                <div className="text-sm text-red-700 space-y-2">
                  <div>
                    <strong>Message:</strong>
                    <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for manual error reporting from functional components
export const useErrorHandler = () => {
  const reportError = useCallback((error: Error, context?: string) => {
    console.error('Manual error report:', error);
    
    // Report to your error tracking service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      try {
        (window as any).gtag('event', 'exception', {
          description: `${context ? `${context}: ` : ''}${error.message}`,
          fatal: false
        });
      } catch (analyticsError) {
        console.warn('Failed to report manual error to analytics:', analyticsError);
      }
    }
  }, []);

  return { reportError };
};

// Functional wrapper for modern React Router integration
export const ErrorBoundaryWithRouter: React.FC<Omit<Props, 'navigate'> & { 
  navigate?: (path: string) => void 
}> = ({ navigate, ...props }) => {
  return <ErrorBoundary {...props} navigate={navigate} />;
};

export default ErrorBoundary;