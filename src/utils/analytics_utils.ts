/**
 * Google Analytics 4 (GA4) Integration for FreeResume Builder
 * 
 * Features:
 * - GDPR compliant tracking with consent management
 * - Resume builder specific event tracking
 * - Performance monitoring with proper CWV tracking
 * - Conversion tracking
 * - A/B testing support
 * - Error tracking
 * - User journey analytics
 * 
 * Fixed Issues:
 * - Deprecated substr() replaced with slice()
 * - Proper GA4 custom_map handling
 * - Fixed PerformanceObserver memory leaks
 * - Capped event queue growth
 * - Proper subdomain cookie clearing
 * - Type-safe event tracking
 */

import { useEffect } from 'react';

// Types for better TypeScript support
interface AnalyticsConfig {
  measurementId: string;
  debug?: boolean;
  anonymizeIp?: boolean;
  respectDnt?: boolean;
  customDimensions?: Record<string, string>;
}

// Type-safe event actions to prevent typos
type ResumeEventAction = 
  | 'builder_session_start'
  | 'builder_session_end'
  | 'section_completed'
  | 'template_selected'
  | 'resume_downloaded'
  | 'ats_score_updated'
  | 'auto_save'
  | 'error_occurred'
  | 'engagement_action'
  | 'experiment_impression'
  | 'timing_complete'
  | 'web_vital';

type EventCategory = 
  | 'resume_builder'
  | 'performance' 
  | 'engagement'
  | 'experiments'
  | 'error'
  | 'timing';

interface ResumeAnalyticsEvent {
  action: ResumeEventAction;
  category: EventCategory;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface UserProperties {
  user_type?: 'new' | 'returning';
  device_category?: 'mobile' | 'tablet' | 'desktop';
  traffic_source?: string;
  resume_builder_version?: string;
  preferred_template?: string;
  industry?: string;
  experience_level?: string;
}

interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity?: number;
    price?: number;
  }>;
}

// Global analytics interface
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    ga_debug?: boolean;
    resumeAnalytics?: ResumeAnalytics;
  }
}

// Module-level variables to prevent GC issues
let fidObserver: PerformanceObserver | null = null;
let clsObserver: PerformanceObserver | null = null;
let lcpObserver: PerformanceObserver | null = null;
let clsValue = 0; // Hoisted outside callback for proper CLS calculation

class ResumeAnalytics {
  private static instance: ResumeAnalytics | null = null;
  private config: AnalyticsConfig;
  private consentGiven: boolean = false;
  private debug: boolean = false;
  private isInitialized: boolean = false;
  private eventQueue: ResumeAnalyticsEvent[] = [];
  private readonly maxQueueSize = 100; // Cap queue growth
  private sessionId: string;
  private userId?: string;

  constructor(config: AnalyticsConfig) {
    // Singleton pattern to prevent double instantiation
    if (ResumeAnalytics.instance) {
      return ResumeAnalytics.instance;
    }

    this.config = {
      anonymizeIp: true,
      respectDnt: true,
      ...config
    };
    
    this.debug = config.debug || process.env.NODE_ENV === 'development';
    this.sessionId = this.generateSessionId();
    
    // Set singleton instance
    ResumeAnalytics.instance = this;
    
    // Initialize if not in development or if debug is explicitly enabled
    if (process.env.NODE_ENV === 'production' || this.debug) {
      this.init();
    }
  }

  /**
   * Debug logger with grouped output
   */
  private log = (...msg: any[]) => {
    if (this.debug) {
      console.log('[Analytics]', ...msg);
    }
  };

  /**
   * Initialize Google Analytics
   */
  private async init(): Promise<void> {
    try {
      // Check for Do Not Track
      if (this.config.respectDnt && this.isDntEnabled()) {
        this.log('DNT enabled, skipping initialization');
        return;
      }

      // Load GA4 script with recommended async snippet
      await this.loadGoogleAnalyticsAsync();
      
      // Initialize gtag
      this.initializeGtag();
      
      // Set up custom dimension mapping (separate from config)
      this.setupCustomDimensions();
      
      // Set up error tracking
      this.setupErrorTracking();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      this.isInitialized = true;
      this.log('Analytics initialized successfully');

      if (this.debug) {
        window.ga_debug = true;
      }

      // Process queued events
      this.processEventQueue();
      
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Load Google Analytics with recommended async snippet
   */
  private loadGoogleAnalyticsAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src*="googletagmanager.com"]`)) {
        resolve();
        return;
      }

      // Recommended GA4 async loading pattern
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      
      script.onload = () => {
        // Initialize dataLayer if not exists
        window.dataLayer = window.dataLayer || [];
        resolve();
      };
      
      script.onerror = () => reject(new Error('Failed to load Google Analytics'));
      
      // Insert script
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    });
  }

  /**
   * Initialize gtag function
   */
  private initializeGtag(): void {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Configure GA4 without custom_map (doesn't work in config)
    window.gtag('js', new Date());
    window.gtag('config', this.config.measurementId, {
      anonymize_ip: this.config.anonymizeIp,
      respect_dnt: this.config.respectDnt,
      cookie_flags: this.getCookieFlags(),
      send_page_view: false, // Handle page views manually
      debug_mode: this.debug
    });
  }

  /**
   * Setup custom dimensions mapping (separate from config)
   */
  private setupCustomDimensions(): void {
    // GA4 requires custom_map to be set separately, not in config
    window.gtag('set', 'custom_map', {
      custom_dimension_1: 'template_used',
      custom_dimension_2: 'industry',
      custom_dimension_3: 'experience_level',
      custom_dimension_4: 'completion_percentage'
    });
  }

  /**
   * Get cookie flags with proper Secure handling
   */
  private getCookieFlags(): string {
    const isHttps = window.location.protocol === 'https:';
    const secureFlag = isHttps ? ';Secure' : '';
    return `SameSite=Strict${secureFlag}`;
  }

  /**
   * Set up error tracking
   */
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: 'Unhandled Promise Rejection',
        reason: event.reason?.toString()
      });
    });
  }

  /**
   * Set up performance monitoring with proper observer management
   */
  private setupPerformanceMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Largest Contentful Paint
      lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent({
            action: 'web_vital',
            category: 'performance',
            label: 'LCP',
            value: Math.round(entry.startTime),
            custom_parameters: {
              metric_value: entry.startTime,
              metric_id: 'LCP'
            }
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay - keep module reference to prevent GC
      fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackEvent({
            action: 'web_vital',
            category: 'performance',
            label: 'FID',
            value: Math.round(entry.processingStart - entry.startTime),
            custom_parameters: {
              metric_value: entry.processingStart - entry.startTime,
              metric_id: 'FID'
            }
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift - fixed calculation
      clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        // Send final CLS score
        this.trackEvent({
          action: 'web_vital',
          category: 'performance',
          label: 'CLS',
          value: Math.round(clsValue * 1000),
          custom_parameters: {
            metric_value: clsValue,
            metric_id: 'CLS'
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }
  }

  /**
   * Check if Do Not Track is enabled (removed legacy "yes" check)
   */
  private isDntEnabled(): boolean {
    return navigator.doNotTrack === '1' || (window as any).doNotTrack === '1';
  }

  /**
   * Generate session ID (fixed deprecated substr)
   */
  private generateSessionId(): string {
    // Use crypto.randomUUID() if available for true uniqueness
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback with slice instead of deprecated substr
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Set user consent for tracking
   */
  public setConsent(consent: boolean): void {
    this.consentGiven = consent;
    
    if (this.isInitialized) {
      window.gtag('consent', 'update', {
        analytics_storage: consent ? 'granted' : 'denied',
        ad_storage: 'denied' // We don't use ads
      });
    }

    if (consent && this.eventQueue.length > 0) {
      this.processEventQueue();
    }

    this.log(`Consent ${consent ? 'granted' : 'denied'}`);
  }

  /**
   * Set user properties
   */
  public setUserProperties(properties: UserProperties): void {
    if (!this.canTrack()) return;

    window.gtag('set', 'user_properties', {
      ...properties,
      session_id: this.sessionId
    });

    this.log('User properties set:', properties);
  }

  /**
   * Set user ID for cross-device tracking
   */
  public setUserId(userId: string): void {
    if (!this.canTrack()) return;

    this.userId = userId;
    window.gtag('config', this.config.measurementId, {
      user_id: userId
    });
  }

  /**
   * Track page views
   */
  public trackPageView(path?: string, title?: string): void {
    if (!this.canTrack()) return;

    const pageLocation = path || window.location.pathname + window.location.search;
    const pageTitle = title || document.title;

    window.gtag('event', 'page_view', {
      page_location: pageLocation,
      page_title: pageTitle,
      session_id: this.sessionId
    });

    this.log('Page view tracked:', { pageLocation, pageTitle });
  }

  /**
   * Track generic events with type safety
   */
  public trackEvent(event: ResumeAnalyticsEvent): void {
    if (!this.canTrack()) {
      this.addToQueue(event);
      return;
    }

    const eventData = {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      session_id: this.sessionId,
      ...event.custom_parameters
    };

    window.gtag('event', event.action, eventData);
    this.log('Event tracked:', event.action, eventData);
  }

  /**
   * Add event to queue with size limit
   */
  private addToQueue(event: ResumeAnalyticsEvent): void {
    if (this.eventQueue.length >= this.maxQueueSize) {
      // Remove oldest event to prevent unlimited growth
      this.eventQueue.shift();
    }
    this.eventQueue.push(event);
  }

  /**
   * Track resume builder specific events
   */
  public trackResumeEvent(action: ResumeEventAction, data: Record<string, any> = {}): void {
    this.trackEvent({
      action,
      category: 'resume_builder',
      custom_parameters: {
        timestamp: Date.now(),
        ...data
      }
    });
  }

  /**
   * Track section completion
   */
  public trackSectionCompletion(section: string, completionPercentage: number): void {
    this.trackResumeEvent('section_completed', {
      section_name: section,
      completion_percentage: completionPercentage,
      time_spent: Date.now()
    });
  }

  /**
   * Track template usage
   */
  public trackTemplateUsage(templateId: string, templateName: string): void {
    this.trackResumeEvent('template_selected', {
      template_id: templateId,
      template_name: templateName
    });

    // Set as user property for segmentation
    this.setUserProperties({
      preferred_template: templateId
    });
  }

  /**
   * Track resume download/export
   */
  public trackResumeDownload(format: 'pdf' | 'docx' | 'txt', templateId: string): void {
    this.trackResumeEvent('resume_downloaded', {
      download_format: format,
      template_used: templateId,
      file_name: `resume_${Date.now()}.${format}`
    });

    // Track as conversion
    this.trackConversion({
      event_name: 'resume_download',
      value: 1,
      items: [{
        item_id: templateId,
        item_name: `Resume Template - ${templateId}`,
        category: 'template',
        quantity: 1,
        price: 0
      }]
    });
  }

  /**
   * Track ATS score improvements
   */
  public trackATSScore(score: number, previousScore?: number): void {
    this.trackResumeEvent('ats_score_updated', {
      current_score: score,
      previous_score: previousScore,
      score_improvement: previousScore ? score - previousScore : 0
    });
  }

  /**
   * Track auto-save events
   */
  public trackAutoSave(saveCount: number, dataSize: number): void {
    this.trackResumeEvent('auto_save', {
      save_count: saveCount,
      data_size_kb: Math.round(dataSize / 1024),
      save_trigger: 'automatic'
    });
  }

  /**
   * Track errors
   */
  public trackError(error: Record<string, any>): void {
    this.trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: error.message || 'Unknown error',
      custom_parameters: {
        error_details: JSON.stringify(error),
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Track conversions
   */
  public trackConversion(conversion: ConversionEvent): void {
    if (!this.canTrack()) return;

    window.gtag('event', conversion.event_name, {
      currency: conversion.currency || 'USD',
      value: conversion.value || 0,
      transaction_id: conversion.transaction_id,
      items: conversion.items || []
    });

    this.log('Conversion tracked:', conversion);
  }

  /**
   * Track timing - GA4 compatible custom events
   */
  public trackTiming(category: string, variable: string, value: number, label?: string): void {
    // GA4 doesn't support UA timing - use custom events instead
    this.trackEvent({
      action: 'timing_complete',
      category: 'timing',
      label: label || variable,
      value: Math.round(value),
      custom_parameters: {
        timing_category: category,
        timing_variable: variable,
        timing_value: value,
        metric_type: 'custom_timing'
      }
    });
  }

  /**
   * Track user engagement
   */
  public trackEngagement(action: string, details: Record<string, any> = {}): void {
    this.trackEvent({
      action: 'engagement_action',
      category: 'engagement',
      custom_parameters: {
        engagement_action: action,
        engagement_time: Date.now(),
        session_id: this.sessionId,
        ...details
      }
    });
  }

  /**
   * Track A/B test variants (fixed - use events instead of config)
   */
  public trackExperiment(experimentId: string, variantId: string): void {
    // Use event instead of overwriting config
    this.trackEvent({
      action: 'experiment_impression',
      category: 'experiments',
      label: `${experimentId}_${variantId}`,
      custom_parameters: {
        experiment_id: experimentId,
        variant_id: variantId
      }
    });
  }

  /**
   * Check if tracking is allowed
   */
  private canTrack(): boolean {
    return this.isInitialized && this.consentGiven && !this.isDntEnabled();
  }

  /**
   * Process queued events
   */
  private processEventQueue(): void {
    if (!this.canTrack()) return;

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.trackEvent(event);
      }
    }
  }

  /**
   * Get session information
   */
  public getSessionInfo(): { sessionId: string; userId?: string } {
    return {
      sessionId: this.sessionId,
      userId: this.userId
    };
  }

  /**
   * Enable/disable debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debug = enabled;
    window.ga_debug = enabled;
    
    if (this.isInitialized) {
      window.gtag('config', this.config.measurementId, {
        debug_mode: enabled
      });
    }
  }

  /**
   * Clear all tracking data (for privacy compliance)
   */
  public clearTrackingData(): void {
    this.consentGiven = false;
    this.eventQueue = [];
    this.userId = undefined;
    
    if (this.isInitialized) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }

    // Clear analytics cookies
    this.clearAnalyticsCookies();
  }

  /**
   * Clear analytics cookies (fixed subdomain handling)
   */
  private clearAnalyticsCookies(): void {
    const cookies = document.cookie.split(';');
    const domain = this.getRootDomain();
    
    cookies.forEach(cookie => {
      const [name] = cookie.split('=');
      const cookieName = name.trim();
      
      // Use regex to catch all GA prefixed cookies including _ga_
      if (/^_ga/.test(cookieName)) {
        // Clear for current domain
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        
        // Clear for root domain if different
        if (domain) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
        }
      }
    });
  }

  /**
   * Get root domain for cookie clearing
   */
  private getRootDomain(): string | null {
    const parts = window.location.hostname.split('.');
    if (parts.length > 2) {
      return `.${parts.slice(-2).join('.')}`;
    }
    return null;
  }

  /**
   * Cleanup observers on destroy
   */
  public destroy(): void {
    if (fidObserver) {
      fidObserver.disconnect();
      fidObserver = null;
    }
    if (clsObserver) {
      clsObserver.disconnect(); 
      clsObserver = null;
    }
    if (lcpObserver) {
      lcpObserver.disconnect();
      lcpObserver = null;
    }
    
    ResumeAnalytics.instance = null;
  }
}

// Singleton instance
let analyticsInstance: ResumeAnalytics | null = null;

/**
 * Initialize analytics with configuration
 */
export function initializeAnalytics(config: AnalyticsConfig): ResumeAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new ResumeAnalytics(config);
    
    // Make available globally for debugging
    if (config.debug || process.env.NODE_ENV === 'development') {
      window.resumeAnalytics = analyticsInstance;
    }
  }
  
  return analyticsInstance;
}

/**
 * Get analytics instance
 */
export function getAnalytics(): ResumeAnalytics | null {
  return analyticsInstance;
}

/**
 * React hook for analytics with auto page-view tracking
 */
export function useAnalytics() {
  const analytics = getAnalytics();
  
  return {
    analytics,
    trackEvent: (event: ResumeAnalyticsEvent) => analytics?.trackEvent(event),
    trackPageView: (path?: string, title?: string) => analytics?.trackPageView(path, title),
    trackResumeEvent: (action: ResumeEventAction, data?: Record<string, any>) => analytics?.trackResumeEvent(action, data),
    trackSectionCompletion: (section: string, percentage: number) => analytics?.trackSectionCompletion(section, percentage),
    trackTemplateUsage: (templateId: string, templateName: string) => analytics?.trackTemplateUsage(templateId, templateName),
    trackResumeDownload: (format: 'pdf' | 'docx' | 'txt', templateId: string) => analytics?.trackResumeDownload(format, templateId),
    trackATSScore: (score: number, previousScore?: number) => analytics?.trackATSScore(score, previousScore),
    trackError: (error: Record<string, any>) => analytics?.trackError(error),
    setConsent: (consent: boolean) => analytics?.setConsent(consent),
    setUserProperties: (properties: UserProperties) => analytics?.setUserProperties(properties)
  };
}

/**
 * React hook for automatic page view tracking on route changes
 */
export function usePageViewTracking(location: { pathname: string; search: string }) {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search, trackPageView]);
}

// Export types for external usage
export type {
  AnalyticsConfig,
  ResumeAnalyticsEvent,
  ResumeEventAction,
  EventCategory,
  UserProperties,
  ConversionEvent
};

export { ResumeAnalytics };

// Default export
export default ResumeAnalytics;