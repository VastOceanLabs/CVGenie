import React, { createContext, useContext, ReactNode } from 'react';

// Global analytics interface
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'exception',
      targetId: string,
      config?: any
    ) => void;
  }
}

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: any) => void;
  trackPageView: (page: string) => void;
  setUserProperties: (properties: any) => void;
  trackResumeEvent: (event: string, properties?: any) => void;
  trackError: (error: { message: string; stack?: string; context?: string }) => void;
  trackSectionCompletion: (section: string, timeSpent: number) => void;
  trackTemplateUsage: (templateId: string, templateName: string) => void;
  trackATSScore: (score: number, improvements: string[]) => void;
  trackAutoSave: (success: boolean, errorMessage?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default class AnalyticsProvider extends React.Component<AnalyticsProviderProps> {
  analytics: AnalyticsContextType;

  constructor(props: AnalyticsProviderProps) {
    super(props);
    this.analytics = {
      trackEvent: this.trackEvent.bind(this),
      trackPageView: this.trackPageView.bind(this),
      setUserProperties: this.setUserProperties.bind(this),
      trackResumeEvent: this.trackResumeEvent.bind(this),
      trackError: this.trackError.bind(this),
      trackSectionCompletion: this.trackSectionCompletion.bind(this),
      trackTemplateUsage: this.trackTemplateUsage.bind(this),
      trackATSScore: this.trackATSScore.bind(this),
      trackAutoSave: this.trackAutoSave.bind(this)
    };
  }

  trackEvent(event: string, properties?: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
    console.log('Analytics Event:', event, properties);
  }

  trackPageView(page: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: page
      });
    }
    console.log('Page View:', page);
  }

  setUserProperties(properties: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_properties: properties
      });
    }
    console.log('User Properties:', properties);
  }

  trackResumeEvent(event: string, properties?: any) {
    this.trackEvent(event, {
      event_category: 'resume_builder',
      ...properties
    });
  }

  trackError(error: { message: string; stack?: string; context?: string }) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        context: error.context
      });
    }
    console.error('Analytics Error:', error);
  }

  trackSectionCompletion(section: string, timeSpent: number) {
    this.trackResumeEvent('section_completed', {
      section_name: section,
      time_spent: timeSpent
    });
  }

  trackTemplateUsage(templateId: string, templateName: string) {
    this.trackResumeEvent('template_selected', {
      template_id: templateId,
      template_name: templateName
    });
  }

  trackATSScore(score: number, improvements: string[]) {
    this.trackResumeEvent('ats_score_calculated', {
      score,
      improvements_count: improvements.length
    });
  }

  trackAutoSave(success: boolean, errorMessage?: string) {
    this.trackResumeEvent('auto_save', {
      success,
      error_message: errorMessage
    });
  }

  render() {
    return (
      <AnalyticsContext.Provider value={this.analytics}>
        {this.props.children}
      </AnalyticsContext.Provider>
    );
  }
}

// Hook for using analytics
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Standalone utility functions
export const trackResumeEvent = (event: string, properties?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'resume_builder',
      ...properties
    });
  }
};

export const trackError = (error: { message: string; stack?: string; context?: string }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      context: error.context
    });
  }
};

export const initializeErrorTracking = () => {
  console.log('Error tracking initialized');
};

export const initializePerformanceMonitoring = () => {
  console.log('Performance monitoring initialized');
};