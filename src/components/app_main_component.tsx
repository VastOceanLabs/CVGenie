import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Core components (eager loaded) - FIXED: Correct import path
import Builder from './Builder';

// Stub components - replace these imports as you create the actual files
const Navigation = () => {
  const location = useLocation();
  return (
    <nav className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">FreeResume Builder</div>
        <a 
          href="/builder" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          rel="noopener"
        >
          Create Resume
        </a>
      </div>
    </nav>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {currentYear} FreeResume Builder. All rights reserved.</p>
      </div>
    </footer>
  );
};

const ErrorBoundary = class extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // In production, you might want to log to an error reporting service
    if (import.meta.env.PROD && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry, but there was an error loading this page.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                // Use navigate instead of window.location.reload for better UX
                if (typeof window !== 'undefined') {
                  window.history.pushState(null, '', '/');
                  window.location.href = '/';
                }
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
};

const LoadingSpinner = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2">{text}</span>
  </div>
);

// FIXED: Helper for lazy loading stubs - proper Promise typing
const createStubComponent = (name: string) => {
  const StubComponent = () => (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
      <p className="text-gray-600 mt-2">Coming soon...</p>
    </div>
  );
  
  return lazy(() => {
    const moduleExport = { default: StubComponent };
    
    // Add artificial delay in development to avoid hydration warnings
    if (import.meta.env.DEV) {
      return new Promise<{ default: React.ComponentType<any> }>((resolve) => 
        setTimeout(() => resolve(moduleExport), 10)
      );
    }
    return Promise.resolve(moduleExport);
  });
};

// Stub page components - replace these as you create actual pages
const LandingPage = createStubComponent('Landing Page');
const TemplatesGallery = createStubComponent('Templates Gallery');
const ResumeExamples = createStubComponent('Resume Examples');
const BlogPage = createStubComponent('Blog');
const AboutPage = createStubComponent('About Page');
const PrivacyPage = createStubComponent('Privacy Policy');
const FAQPage = createStubComponent('FAQ');
const NotFoundPage = createStubComponent('404 - Page Not Found');

// Template stub components
const ProfessionalTemplate = createStubComponent('Professional Template');
const ModernTemplate = createStubComponent('Modern Template');
const CreativeTemplate = createStubComponent('Creative Template');
const ATSTemplate = createStubComponent('ATS Template');
const ExecutiveTemplate = createStubComponent('Executive Template');

// Example stub components
const SoftwareEngineerExample = createStubComponent('Software Engineer Example');
const NurseExample = createStubComponent('Nurse Example');
const ElectricianExample = createStubComponent('Electrician Example');
const MarketingExample = createStubComponent('Marketing Example');
const ProjectManagerExample = createStubComponent('Project Manager Example');

// Stub utility functions - replace these as you create actual utilities
const initAnalytics = () => {
  console.log('Analytics initialized (stub)');
};

const trackPageView = () => {
  console.log('Page view tracked (stub)', window.location.pathname + window.location.search + window.location.hash);
};

const measurePerformance = () => {
  console.log('Performance measurement started (stub)');
};

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner text="Loading..." />
  </div>
);

// Enhanced Error Boundary for route-level errors (now using class component)
const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

// SEO component for dynamic meta tags
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({
  title = "Free Resume Builder | Create Professional Resumes Online - No Credit Card",
  description = "Build professional resumes for free. ATS-optimized templates, no hidden fees, instant PDF download. Trusted by 100,000+ job seekers worldwide.",
  keywords = "free resume builder, resume maker, CV builder, ATS resume, professional resume templates",
  ogImage = "/og-image.jpg",
  canonicalUrl,
  structuredData
}) => {
  // Safe window access for URL - fallback for SSR
  const baseUrl = 'https://freeresume-builder.pages.dev';
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  
  // Fix image URL construction to avoid double slashes
  const imageUrl = typeof window !== 'undefined' 
    ? new URL(ogImage, window.location.origin).toString()
    : new URL(ogImage, baseUrl).toString();
  
  // Memoize structured data to avoid recreating on every render
  const defaultStructuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FreeResume Builder",
    "description": "Free online resume builder with professional templates",
    "url": baseUrl,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "FreeResume",
      "url": baseUrl
    },
    "creator": {
      "@type": "Organization",
      "name": "FreeResume"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true
  }), [baseUrl]);
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="FreeResume Team" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FreeResume Builder" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@FreeResume" />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="application-name" content="FreeResume Builder" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Structured Data for Web Application */}
      <script type="application/ld+json">
        {JSON.stringify(defaultStructuredData)}
      </script>
    </Helmet>
  );
};

// Layout components for different page types
const StandardLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="flex-1" role="main" aria-label="Main content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const BuilderLayout: React.FC = () => {
  return (
    <main className="flex-1" role="main" aria-label="Resume builder">
      <Outlet />
    </main>
  );
};

// Analytics tracking hook
const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView();
  }, [location.pathname, location.search, location.hash]); // Track full URL changes
};

// Analytics wrapper component with location tracking
const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};

// Route wrapper that provides location context for redirects
const RouteWrapper: React.FC = () => {
  const location = useLocation();
  
  return (
    <Routes>
      {/* Builder Layout - No nav/footer for focused experience */}
      <Route path="/builder" element={<BuilderLayout />}>
        <Route index element={
          <RouteErrorBoundary>
            <Builder />
          </RouteErrorBoundary>
        } />
      </Route>
      
      {/* Standard Layout - With nav/footer */}
      <Route path="/" element={<StandardLayout />}>
        {/* Core Routes */}
        <Route index element={
          <RouteErrorBoundary>
            <LandingPage />
          </RouteErrorBoundary>
        } />
        <Route path="resume-builder" element={<Navigate to="/builder" replace />} />
        
        {/* Template Routes */}
        <Route path="templates" element={
          <RouteErrorBoundary>
            <TemplatesGallery />
          </RouteErrorBoundary>
        } />
        <Route path="templates/professional-resume-template" element={
          <RouteErrorBoundary>
            <ProfessionalTemplate />
          </RouteErrorBoundary>
        } />
        <Route path="templates/modern-resume-template" element={
          <RouteErrorBoundary>
            <ModernTemplate />
          </RouteErrorBoundary>
        } />
        <Route path="templates/creative-resume-template" element={
          <RouteErrorBoundary>
            <CreativeTemplate />
          </RouteErrorBoundary>
        } />
        <Route path="templates/ats-friendly-resume-template" element={
          <RouteErrorBoundary>
            <ATSTemplate />
          </RouteErrorBoundary>
        } />
        <Route path="templates/executive-resume-template" element={
          <RouteErrorBoundary>
            <ExecutiveTemplate />
          </RouteErrorBoundary>
        } />
        
        {/* Resume Examples Routes */}
        <Route path="resume-examples" element={
          <RouteErrorBoundary>
            <ResumeExamples />
          </RouteErrorBoundary>
        } />
        <Route path="resume-examples/software-engineer" element={
          <RouteErrorBoundary>
            <SoftwareEngineerExample />
          </RouteErrorBoundary>
        } />
        <Route path="resume-examples/registered-nurse" element={
          <RouteErrorBoundary>
            <NurseExample />
          </RouteErrorBoundary>
        } />
        <Route path="resume-examples/electrician" element={
          <RouteErrorBoundary>
            <ElectricianExample />
          </RouteErrorBoundary>
        } />
        <Route path="resume-examples/marketing-manager" element={
          <RouteErrorBoundary>
            <MarketingExample />
          </RouteErrorBoundary>
        } />
        <Route path="resume-examples/project-manager" element={
          <RouteErrorBoundary>
            <ProjectManagerExample />
          </RouteErrorBoundary>
        } />
        
        {/* Content Routes */}
        <Route path="blog/*" element={
          <RouteErrorBoundary>
            <BlogPage />
          </RouteErrorBoundary>
        } />
        <Route path="resume-tips" element={
          <Navigate to="/blog/resume-tips" replace state={{ from: location }} />
        } />
        <Route path="ats-resume-checker" element={
          <Navigate to="/blog/ats-resume-tips" replace state={{ from: location }} />
        } />
        
        {/* Information Routes */}
        <Route path="about" element={
          <RouteErrorBoundary>
            <AboutPage />
          </RouteErrorBoundary>
        } />
        <Route path="privacy" element={
          <RouteErrorBoundary>
            <PrivacyPage />
          </RouteErrorBoundary>
        } />
        <Route path="faq" element={
          <RouteErrorBoundary>
            <FAQPage />
          </RouteErrorBoundary>
        } />
        
        {/* Legacy/Redirect Routes */}
        <Route path="create" element={<Navigate to="/builder" replace />} />
        <Route path="build" element={<Navigate to="/builder" replace />} />
        <Route path="free-resume-builder" element={<Navigate to="/" replace />} />
        <Route path="cv-builder" element={<Navigate to="/" replace />} />
        
        {/* 404 Route - Must be last */}
        <Route path="*" element={
          <RouteErrorBoundary>
            <NotFoundPage />
          </RouteErrorBoundary>
        } />
      </Route>
    </Routes>
  );
};

// Main App component
function App() {
  useEffect(() => {
    // Initialize analytics using more portable env check
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD) {
      initAnalytics();
    }
    
    // Start performance monitoring
    measurePerformance();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 flex flex-col">
          <RouteErrorBoundary>
            <AnalyticsProvider>
              {/* Global SEO - will be overridden by page-specific SEO */}
              <SEO />
              
              {/* Main Content Area */}
              <Suspense fallback={<PageLoader />}>
                <RouteWrapper />
              </Suspense>
            </AnalyticsProvider>
          </RouteErrorBoundary>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;