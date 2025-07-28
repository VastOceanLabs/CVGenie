/**
 * Performance Monitoring Utility for FreeResume Builder
 * 
 * Tracks Core Web Vitals, user interactions, and application performance
 * Optimized for Cloudflare Pages deployment with minimal performance impact
 */

import React from 'react';

// Global type extensions
declare global {
  interface Window {
    gc?: () => void;
  }
}

// Performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  isLowEndDevice?: boolean;
}

// Helper functions for performance analysis
function calculateOverallScore(coreWebVitals: CoreWebVitals): number {
  const weights = { lcp: 0.25, fid: 0.25, cls: 0.25, fcp: 0.15, ttfb: 0.1 };
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(coreWebVitals).forEach(([metric, value]) => {
    if (value !== undefined) {
      const threshold = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
        const score = value <= threshold.good ? 100 : 
                     value <= threshold.poor ? 75 : 50;
        const weight = weights[metric as keyof typeof weights] || 0.1;
        totalScore += score * weight;
        totalWeight += weight;
      }
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

function getSlowestOperations(metrics: PerformanceMetric[]): Array<{
  name: string;
  value: number;
  unit: string;
  count: number;
}> {
  const operationMap = new Map<string, { total: number; count: number; unit: string }>();

  metrics.forEach(metric => {
    const existing = operationMap.get(metric.name);
    if (existing) {
      existing.total += metric.value;
      existing.count += 1;
    } else {
      operationMap.set(metric.name, {
        total: metric.value,
        count: 1,
        unit: metric.unit
      });
    }
  });

  return Array.from(operationMap.entries())
    .map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count),
      unit: data.unit,
      count: data.count
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

function generateRecommendations(coreWebVitals: CoreWebVitals): string[] {
  const recommendations: string[] = [];

  if (coreWebVitals.lcp && coreWebVitals.lcp > PERFORMANCE_THRESHOLDS.lcp.poor) {
    recommendations.push('Optimize Largest Contentful Paint: Compress images, eliminate render-blocking resources, improve server response time');
  }

  if (coreWebVitals.fid && coreWebVitals.fid > PERFORMANCE_THRESHOLDS.fid.poor) {
    recommendations.push('Reduce First Input Delay: Minimize JavaScript execution time, split long tasks, use web workers');
  }

  if (coreWebVitals.cls && coreWebVitals.cls > PERFORMANCE_THRESHOLDS.cls.poor) {
    recommendations.push('Fix Cumulative Layout Shift: Set size attributes on media, avoid inserting content above existing content');
  }

  if (coreWebVitals.fcp && coreWebVitals.fcp > PERFORMANCE_THRESHOLDS.fcp.poor) {
    recommendations.push('Improve First Contentful Paint: Eliminate render-blocking resources, minify CSS, optimize fonts');
  }

  if (coreWebVitals.ttfb && coreWebVitals.ttfb > PERFORMANCE_THRESHOLDS.ttfb.poor) {
    recommendations.push('Optimize Time to First Byte: Improve server response time, use CDN, optimize database queries');
  }

  return recommendations;
}

function calculateTrends(metrics: PerformanceMetric[]): Record<string, 'improving' | 'stable' | 'degrading'> {
  const trends: Record<string, 'improving' | 'stable' | 'degrading'> = {};
  const metricGroups = new Map<string, number[]>();

  // Group metrics by name and collect values in chronological order
  metrics
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(metric => {
      if (!metricGroups.has(metric.name)) {
        metricGroups.set(metric.name, []);
      }
      metricGroups.get(metric.name)!.push(metric.value);
    });

  // Calculate trend for each metric
  metricGroups.forEach((values, metricName) => {
    if (values.length < 3) {
      trends[metricName] = 'stable';
      return;
    }

    const recentValues = values.slice(-5); // Look at last 5 values
    const firstHalf = recentValues.slice(0, Math.floor(recentValues.length / 2));
    const secondHalf = recentValues.slice(Math.floor(recentValues.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (changePercent < -5) {
      trends[metricName] = 'improving';
    } else if (changePercent > 5) {
      trends[metricName] = 'degrading';
    } else {
      trends[metricName] = 'stable';
    }
  });

  return trends;
}

function convertMetricsToCSV(metrics: PerformanceMetric[]): string {
  if (metrics.length === 0) return '';

  const headers = ['timestamp', 'name', 'value', 'unit', 'url', 'userAgent', 'connectionType', 'deviceMemory', 'isLowEndDevice'];
  const csvRows = [headers.join(',')];

  metrics.forEach(metric => {
    const row = [
      new Date(metric.timestamp).toISOString(),
      `"${metric.name}"`,
      metric.value,
      `"${metric.unit}"`,
      `"${metric.url}"`,
      `"${metric.userAgent}"`,
      `"${metric.connectionType || ''}"`,
      metric.deviceMemory || '',
      metric.isLowEndDevice || ''
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

export interface CoreWebVitals {
  lcp?: number;  // Largest Contentful Paint
  fid?: number;  // First Input Delay
  cls?: number;  // Cumulative Layout Shift
  fcp?: number;  // First Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number;  // Interaction to Next Paint
}

export interface CustomMetrics {
  resumeBuilderLoadTime?: number;
  templateRenderTime?: number;
  pdfGenerationTime?: number;
  autoSaveLatency?: number;
  sectionSwitchTime?: number;
  formValidationTime?: number;
}

export interface PerformanceConfig {
  enableCoreWebVitals: boolean;
  enableCustomMetrics: boolean;
  enableResourceTiming: boolean;
  enableUserTiming: boolean;
  enableNetworkInfo: boolean;
  enableDeviceInfo: boolean;
  enableRealTimeAlerts: boolean;
  sampleRate: number; // 0-1, percentage of sessions to monitor
  bufferSize: number;
  flushInterval: number; // ms
  apiEndpoint?: string;
  debugMode: boolean;
}

// Default configuration
const DEFAULT_CONFIG: PerformanceConfig = {
  enableCoreWebVitals: true,
  enableCustomMetrics: true,
  enableResourceTiming: true,
  enableUserTiming: true,
  enableNetworkInfo: true,
  enableDeviceInfo: true,
  enableRealTimeAlerts: true,
  sampleRate: 1.0, // Monitor 100% in development, reduce in production
  bufferSize: 50,
  flushInterval: 10000, // 10 seconds
  debugMode: process.env.NODE_ENV === 'development'
};

// Performance thresholds based on requirements
export const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },      // < 2.5s good, > 4s poor
  fid: { good: 100, poor: 300 },        // < 100ms good, > 300ms poor
  cls: { good: 0.1, poor: 0.25 },       // < 0.1 good, > 0.25 poor
  fcp: { good: 1800, poor: 3000 },      // < 1.8s good, > 3s poor
  ttfb: { good: 800, poor: 1800 },      // < 800ms good, > 1.8s poor
  
  // Custom thresholds for resume builder
  resumeBuilderLoad: { good: 3000, poor: 5000 },
  templateRender: { good: 500, poor: 1000 },
  pdfGeneration: { good: 3000, poor: 8000 },
  autoSave: { good: 1000, poor: 3000 },
  sectionSwitch: { good: 200, poor: 500 }
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetric[] = [];
  private coreWebVitals: CoreWebVitals = {};
  private customMetrics: CustomMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isSupported: boolean;
  private sessionId: string;
  private pageLoadTime: number;
  private flushTimer?: number;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isSupported = this.checkBrowserSupport();
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = performance.now();

    if (this.isSupported && this.shouldMonitor()) {
      this.init();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private init(): void {
    try {
      if (this.config.enableCoreWebVitals) {
        this.initCoreWebVitals();
      }

      if (this.config.enableResourceTiming) {
        this.initResourceTiming();
      }

      if (this.config.enableUserTiming) {
        this.initUserTiming();
      }

      // Start periodic flushing
      this.startPeriodicFlush();

      // Monitor page visibility changes
      this.initVisibilityTracking();

      // Monitor navigation timing
      this.initNavigationTiming();

      if (this.config.debugMode) {
        console.log('🚀 Performance monitoring initialized', {
          sessionId: this.sessionId,
          config: this.config
        });
      }
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Check if browser supports required APIs
   */
  private checkBrowserSupport(): boolean {
    return !!(
      typeof window !== 'undefined' &&
      window.performance &&
      window.performance.now &&
      window.performance.getEntriesByType
    );
  }

  /**
   * Determine if this session should be monitored based on sample rate
   */
  private shouldMonitor(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize Core Web Vitals monitoring using web-vitals library fallback
   */
  private initCoreWebVitals(): void {
    // Fallback implementation if web-vitals library not available
    this.initLCP();
    this.initFID();
    this.initCLS();
    this.initFCP();
    this.initTTFB();
  }

  /**
   * Monitor Largest Contentful Paint (LCP)
   */
  private initLCP(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry) {
          this.coreWebVitals.lcp = lastEntry.startTime;
          this.recordMetric({
            name: 'lcp',
            value: lastEntry.startTime,
            unit: 'ms',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
          });

          this.checkThreshold('lcp', lastEntry.startTime);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('LCP monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor First Input Delay (FID)
   */
  private initFID(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.coreWebVitals.fid = fid;
            this.recordMetric({
              name: 'fid',
              value: fid,
              unit: 'ms',
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent
            });

            this.checkThreshold('fid', fid);
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('FID monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor Cumulative Layout Shift (CLS)
   */
  private initCLS(): void {
    try {
      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries: any[] = [];

      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        for (const entry of entries as any[]) {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (sessionValue &&
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              this.coreWebVitals.cls = clsValue;
              this.recordMetric({
                name: 'cls',
                value: clsValue,
                unit: 'score',
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
              });

              this.checkThreshold('cls', clsValue);
            }
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('CLS monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor First Contentful Paint (FCP)
   */
  private initFCP(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.coreWebVitals.fcp = entry.startTime;
            this.recordMetric({
              name: 'fcp',
              value: entry.startTime,
              unit: 'ms',
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent
            });

            this.checkThreshold('fcp', entry.startTime);
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('FCP monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor Time to First Byte (TTFB)
   */
  private initTTFB(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.responseStart && entry.requestStart) {
            const ttfb = entry.responseStart - entry.requestStart;
            this.coreWebVitals.ttfb = ttfb;
            this.recordMetric({
              name: 'ttfb',
              value: ttfb,
              unit: 'ms',
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent
            });

            this.checkThreshold('ttfb', ttfb);
          }
        });
      });

      observer.observe({ type: 'navigation', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('TTFB monitoring not supported:', error);
      }
    }
  }

  /**
   * Monitor resource loading performance
   */
  private initResourceTiming(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          // Track slow resources
          const loadTime = entry.responseEnd - entry.startTime;
          if (loadTime > 1000) { // Resources taking > 1s
            this.recordMetric({
              name: 'slow_resource',
              value: loadTime,
              unit: 'ms',
              timestamp: Date.now(),
              url: entry.name,
              userAgent: navigator.userAgent
            });

            if (this.config.debugMode) {
              console.warn(`Slow resource detected: ${entry.name} (${loadTime}ms)`);
            }
          }
        });
      });

      observer.observe({ type: 'resource', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('Resource timing not supported:', error);
      }
    }
  }

  /**
   * Monitor custom user timing marks and measures
   */
  private initUserTiming(): void {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'measure') {
            this.recordMetric({
              name: `user_timing_${entry.name}`,
              value: entry.duration,
              unit: 'ms',
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent
            });
          }
        });
      });

      observer.observe({ type: 'measure', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('User timing not supported:', error);
      }
    }
  }

  /**
   * Monitor navigation timing
   */
  private initNavigationTiming(): void {
    try {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.getEntriesByType('navigation')[0] as any;
          if (timing) {
            const metrics = {
              domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
              domComplete: timing.domComplete - timing.navigationStart,
              loadComplete: timing.loadEventEnd - timing.navigationStart,
              firstByte: timing.responseStart - timing.requestStart,
              domInteractive: timing.domInteractive - timing.navigationStart
            };

            Object.entries(metrics).forEach(([name, value]) => {
              this.recordMetric({
                name: `navigation_${name}`,
                value: value as number,
                unit: 'ms',
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
              });
            });
          }
        }, 0);
      });
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('Navigation timing not supported:', error);
      }
    }
  }

  /**
   * Monitor page visibility changes
   */
  private initVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page became hidden - flush metrics
        this.flush();
      } else {
        // Page became visible - record timing
        this.recordMetric({
          name: 'page_visible',
          value: performance.now(),
          unit: 'ms',
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      }
    });

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  /**
   * Start periodic metric flushing
   */
  private startPeriodicFlush(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Record a performance metric
   */
  private recordMetric(metric: PerformanceMetric): void {
    // Add device and network info if enabled
    if (this.config.enableDeviceInfo) {
      metric.deviceMemory = (navigator as any).deviceMemory;
      metric.isLowEndDevice = this.isLowEndDevice();
    }

    if (this.config.enableNetworkInfo) {
      const connection = (navigator as any).connection;
      if (connection) {
        metric.connectionType = connection.effectiveType;
      }
    }

    this.metrics.push(metric);

    // Auto-flush if buffer is full
    if (this.metrics.length >= this.config.bufferSize) {
      this.flush();
    }

    if (this.config.debugMode) {
      console.log('📊 Performance metric recorded:', metric);
    }
  }

  /**
   * Check if device is considered low-end
   */
  private isLowEndDevice(): boolean {
    const memory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    
    return (memory && memory < 4) || (hardwareConcurrency && hardwareConcurrency < 4);
  }

  /**
   * Check performance thresholds and alert if poor
   */
  private checkThreshold(metric: keyof typeof PERFORMANCE_THRESHOLDS, value: number): void {
    const threshold = PERFORMANCE_THRESHOLDS[metric];
    if (!threshold) return;

    const status = value <= threshold.good ? 'good' : 
                   value <= threshold.poor ? 'needs-improvement' : 'poor';

    if (status === 'poor' && this.config.enableRealTimeAlerts) {
      this.alertPoorPerformance(metric, value, threshold);
    }

    if (this.config.debugMode) {
      const emoji = status === 'good' ? '✅' : status === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${metric.toUpperCase()}: ${value}${metric === 'cls' ? '' : 'ms'} (${status})`);
    }
  }

  /**
   * Alert about poor performance
   */
  private alertPoorPerformance(metric: string, value: number, threshold: any): void {
    if (this.config.debugMode) {
      console.warn(`🚨 Poor ${metric.toUpperCase()} performance detected:`, {
        value,
        threshold: threshold.poor,
        recommendation: this.getPerformanceRecommendation(metric)
      });
    }

    // In production, you might want to send this to an error tracking service
    // like Sentry, LogRocket, or custom analytics
  }

  /**
   * Get performance improvement recommendation
   */
  private getPerformanceRecommendation(metric: string): string {
    const recommendations = {
      lcp: 'Optimize images, remove render-blocking resources, improve server response time',
      fid: 'Minimize JavaScript execution, split long tasks, use web workers',
      cls: 'Set size attributes on images/videos, avoid inserting content above existing content',
      fcp: 'Eliminate render-blocking resources, minify CSS, optimize fonts',
      ttfb: 'Improve server response time, use CDN, optimize database queries'
    };

    return recommendations[metric as keyof typeof recommendations] || 'Review performance best practices';
  }

  /**
   * Public API: Mark the start of a custom timing measurement
   */
  public markStart(name: string): void {
    if (!this.isSupported) return;
    
    try {
      performance.mark(`${name}_start`);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn(`Failed to mark start for ${name}:`, error);
      }
    }
  }

  /**
   * Public API: Mark the end of a custom timing measurement
   */
  public markEnd(name: string): void {
    if (!this.isSupported) return;

    try {
      const startMark = `${name}_start`;
      const endMark = `${name}_end`;
      
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);

      // Get the measurement
      const measures = performance.getEntriesByName(name, 'measure');
      if (measures.length > 0) {
        const measure = measures[measures.length - 1];
        
        // Store in custom metrics if it's a known metric
        if (name.includes('resume')) {
          (this.customMetrics as any)[name] = measure.duration;
        }

        this.recordMetric({
          name: `custom_${name}`,
          value: measure.duration,
          unit: 'ms',
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });

        // Check custom thresholds
        if (name.includes('resume') || name.includes('template') || name.includes('pdf')) {
          const thresholdKey = name.replace(/[^a-zA-Z]/g, '') as keyof typeof PERFORMANCE_THRESHOLDS;
          if (PERFORMANCE_THRESHOLDS[thresholdKey]) {
            this.checkThreshold(thresholdKey, measure.duration);
          }
        }
      }

      // Clean up marks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(name);
    } catch (error) {
      if (this.config.debugMode) {
        console.warn(`Failed to mark end for ${name}:`, error);
      }
    }
  }

  /**
   * Public API: Record a custom metric value
   */
  public recordCustomMetric(name: string, value: number, unit: string = 'ms'): void {
    this.recordMetric({
      name: `custom_${name}`,
      value,
      unit,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  /**
   * Public API: Get current Core Web Vitals
   */
  public getCoreWebVitals(): CoreWebVitals {
    return { ...this.coreWebVitals };
  }

  /**
   * Public API: Get custom metrics
   */
  public getCustomMetrics(): CustomMetrics {
    return { ...this.customMetrics };
  }

  /**
   * Public API: Get all recorded metrics
   */
  public getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Public API: Get performance summary
   */
  public getPerformanceSummary(): {
    coreWebVitals: CoreWebVitals;
    customMetrics: CustomMetrics;
    sessionInfo: {
      sessionId: string;
      pageLoadTime: number;
      totalMetrics: number;
      isLowEndDevice: boolean;
    };
  } {
    return {
      coreWebVitals: this.getCoreWebVitals(),
      customMetrics: this.getCustomMetrics(),
      sessionInfo: {
        sessionId: this.sessionId,
        pageLoadTime: this.pageLoadTime,
        totalMetrics: this.metrics.length,
        isLowEndDevice: this.isLowEndDevice()
      }
    };
  }

  /**
   * Flush metrics to analytics endpoint
   */
  public flush(): void {
    if (this.metrics.length === 0) return;

    const metricsToFlush = [...this.metrics];
    this.metrics = []; // Clear buffer

    if (this.config.apiEndpoint) {
      this.sendToAnalytics(metricsToFlush);
    }

    if (this.config.debugMode) {
      console.log('📤 Flushed performance metrics:', {
        count: metricsToFlush.length,
        metrics: metricsToFlush
      });
    }
  }

  /**
   * Send metrics to analytics endpoint
   */
  private async sendToAnalytics(metrics: PerformanceMetric[]): Promise<void> {
    try {
      const payload = {
        sessionId: this.sessionId,
        timestamp: Date.now(),
        metrics,
        coreWebVitals: this.coreWebVitals,
        customMetrics: this.customMetrics,
        deviceInfo: {
          userAgent: navigator.userAgent,
          deviceMemory: (navigator as any).deviceMemory,
          hardwareConcurrency: navigator.hardwareConcurrency,
          connectionType: (navigator as any).connection?.effectiveType,
          isLowEndDevice: this.isLowEndDevice()
        }
      };

      // Use sendBeacon for reliability, fallback to fetch
      if (navigator.sendBeacon && this.config.apiEndpoint) {
        const success = navigator.sendBeacon(
          this.config.apiEndpoint,
          JSON.stringify(payload)
        );
        
        if (!success) {
          throw new Error('sendBeacon failed');
        }
      } else if (this.config.apiEndpoint) {
        await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          keepalive: true
        });
      }
    } catch (error) {
      if (this.config.debugMode) {
        console.error('Failed to send metrics to analytics:', error);
      }
    }
  }

  /**
   * Cleanup and stop monitoring
   */
  public destroy(): void {
    // Clear observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        // Ignore errors during cleanup
      }
    });
    this.observers = [];

    // Clear timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Final flush
    this.flush();

    if (this.config.debugMode) {
      console.log('🔄 Performance monitoring destroyed');
    }
  }
}

// Create singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

/**
 * Initialize performance monitoring with configuration
 */
export function initPerformanceMonitoring(config: Partial<PerformanceConfig> = {}): PerformanceMonitor {
  if (performanceMonitor) {
    performanceMonitor.destroy();
  }

  performanceMonitor = new PerformanceMonitor(config);
  return performanceMonitor;
}

/**
 * Get the current performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}

/**
 * Utility function to measure React component render time
 */
export function measureComponentRender<T extends object>(
  Component: React.ComponentType<T>,
  displayName?: string
): React.ComponentType<T> {
  const ComponentWithMeasure = React.forwardRef<any, T>((props, ref) => {
    const componentName = displayName || Component.displayName || Component.name || 'Component';
    const monitor = getPerformanceMonitor();

    React.useEffect(() => {
      monitor?.markStart(`${componentName}_render`);
      return () => {
        monitor?.markEnd(`${componentName}_render`);
      };
    });

    return React.createElement(Component, { ...props, ref });
  });

  ComponentWithMeasure.displayName = `withPerformanceMeasure(${displayName || Component.displayName || Component.name})`;
  
  return ComponentWithMeasure;
}

/**
 * React hook for measuring operation performance
 */
export function usePerformanceMeasure(operationName: string) {
  const monitor = getPerformanceMonitor();

  const startMeasure = React.useCallback(() => {
    monitor?.markStart(operationName);
  }, [monitor, operationName]);

  const endMeasure = React.useCallback(() => {
    monitor?.markEnd(operationName);
  }, [monitor, operationName]);

  const recordMetric = React.useCallback((value: number, unit: string = 'ms') => {
    monitor?.recordCustomMetric(operationName, value, unit);
  }, [monitor, operationName]);

  return { startMeasure, endMeasure, recordMetric };
}

/**
 * React hook for generating performance reports
 */
export function usePerformanceReport() {
  const [report, setReport] = React.useState<any>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const monitor = getPerformanceMonitor();

  const generateReport = React.useCallback(async () => {
    if (!monitor) return null;

    setIsGenerating(true);
    
    try {
      const summary = monitor.getPerformanceSummary();
      const metrics = monitor.getAllMetrics();
      
      // Generate detailed report
      const detailedReport = {
        summary,
        metrics,
        analysis: {
          overallScore: calculateOverallScore(summary.coreWebVitals),
          slowestOperations: getSlowestOperations(metrics),
          recommendations: generateRecommendations(summary.coreWebVitals),
          trends: calculateTrends(metrics)
        },
        generatedAt: new Date().toISOString(),
        reportId: `report_${Date.now()}`
      };

      setReport(detailedReport);
      return detailedReport;
    } catch (error) {
      console.error('Failed to generate performance report:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [monitor]);

  const exportReport = React.useCallback((format: 'json' | 'csv' = 'json') => {
    if (!report) return null;

    if (format === 'json') {
      const dataStr = JSON.stringify(report, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `performance-report-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return dataUri;
    } else if (format === 'csv') {
      const csvContent = convertMetricsToCSV(report.metrics);
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const exportFileDefaultName = `performance-metrics-${Date.now()}.csv`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return dataUri;
    }
  }, [report]);

  return {
    report,
    isGenerating,
    generateReport,
    exportReport,
    hasData: !!monitor?.getAllMetrics().length
  };
}

/**
 * React hook for monitoring memory usage
 */
export function useMemoryMonitor(options: {
  interval?: number;
  enableAlerts?: boolean;
  memoryThreshold?: number;
} = {}) {
  const {
    interval = 5000, // 5 seconds
    enableAlerts = true,
    memoryThreshold = 50 * 1024 * 1024 // 50MB
  } = options;

  const [memoryInfo, setMemoryInfo] = React.useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    usagePercentage: number;
    trend: 'stable' | 'increasing' | 'decreasing';
    isSupported: boolean;
  } | null>(null);

  const [alerts, setAlerts] = React.useState<Array<{
    id: string;
    type: 'warning' | 'critical';
    message: string;
    timestamp: number;
  }>>([]);

  const previousUsage = React.useRef<number[]>([]);
  const monitor = getPerformanceMonitor();

  const getMemoryInfo = React.useCallback(() => {
    // Check if Performance API and memory are supported
    const performance = window.performance as any;
    if (!performance || !performance.memory) {
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        usagePercentage: 0,
        trend: 'stable' as const,
        isSupported: false
      };
    }

    const memory = performance.memory;
    const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    
    // Calculate trend
    previousUsage.current.push(memory.usedJSHeapSize);
    if (previousUsage.current.length > 10) {
      previousUsage.current.shift(); // Keep only last 10 measurements
    }

    let trend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    if (previousUsage.current.length >= 3) {
      const recent = previousUsage.current.slice(-3);
      const isIncreasing = recent[2] > recent[1] && recent[1] > recent[0];
      const isDecreasing = recent[2] < recent[1] && recent[1] < recent[0];
      
      if (isIncreasing) trend = 'increasing';
      else if (isDecreasing) trend = 'decreasing';
    }

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage,
      trend,
      isSupported: true
    };
  }, []);

  const checkMemoryAlerts = React.useCallback((info: any) => {
    if (!enableAlerts || !info.isSupported) return;

    const newAlerts: any[] = [];

    // High memory usage alert
    if (info.usagePercentage > 80) {
      newAlerts.push({
        id: `memory_critical_${Date.now()}`,
        type: 'critical',
        message: `Critical memory usage: ${info.usagePercentage.toFixed(1)}%`,
        timestamp: Date.now()
      });
    } else if (info.usagePercentage > 60) {
      newAlerts.push({
        id: `memory_warning_${Date.now()}`,
        type: 'warning',
        message: `High memory usage: ${info.usagePercentage.toFixed(1)}%`,
        timestamp: Date.now()
      });
    }

    // Memory leak detection (consistently increasing trend)
    if (info.trend === 'increasing' && previousUsage.current.length >= 5) {
      const allIncreasing = previousUsage.current.every((usage, index) => 
        index === 0 || usage > previousUsage.current[index - 1]
      );
      
      if (allIncreasing) {
        newAlerts.push({
          id: `memory_leak_${Date.now()}`,
          type: 'warning',
          message: 'Potential memory leak detected: consistent memory increase',
          timestamp: Date.now()
        });
      }
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts].slice(-10)); // Keep only last 10 alerts
      
      // Record memory alerts as performance metrics
      newAlerts.forEach(alert => {
        monitor?.recordCustomMetric('memory_alert', 1, 'count');
      });
    }
  }, [enableAlerts, monitor]);

  React.useEffect(() => {
    const updateMemoryInfo = () => {
      const info = getMemoryInfo();
      setMemoryInfo(info);
      checkMemoryAlerts(info);
      
      // Record memory metrics
      if (info.isSupported && monitor) {
        monitor.recordCustomMetric('memory_usage_percentage', info.usagePercentage, '%');
        monitor.recordCustomMetric('memory_used_heap_size', info.usedJSHeapSize, 'bytes');
      }
    };

    // Initial measurement
    updateMemoryInfo();

    // Set up interval
    const intervalId = setInterval(updateMemoryInfo, interval);

    return () => clearInterval(intervalId);
  }, [interval, getMemoryInfo, checkMemoryAlerts, monitor]);

  const clearAlerts = React.useCallback(() => {
    setAlerts([]);
  }, []);

  const forceGarbageCollection = React.useCallback(() => {
    // Force garbage collection if available (Chrome DevTools)
    if (window.gc) {
      window.gc();
      monitor?.recordCustomMetric('manual_gc_triggered', 1, 'count');
    } else {
      console.warn('Garbage collection not available. Enable in Chrome DevTools or use --js-flags="--expose-gc"');
    }
  }, [monitor]);

  return {
    memoryInfo,
    alerts,
    clearAlerts,
    forceGarbageCollection,
    isSupported: memoryInfo?.isSupported ?? false
  };
}

/**
 * Utility for measuring async operations
 */
export async function measureAsync<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const monitor = getPerformanceMonitor();
  
  monitor?.markStart(operationName);
  
  try {
    const result = await operation();
    monitor?.markEnd(operationName);
    return result;
  } catch (error) {
    monitor?.markEnd(operationName);
    monitor?.recordCustomMetric(`${operationName}_error`, 1, 'count');
    throw error;
  }
}

/**
 * Default export for easy usage
 */
export default {
  init: initPerformanceMonitoring,
  get: getPerformanceMonitor,
  measureComponent: measureComponentRender,
  measureAsync,
  THRESHOLDS: PERFORMANCE_THRESHOLDS
};