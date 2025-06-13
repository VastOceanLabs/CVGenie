import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Core components (eager loaded)
import Builder from './components/Builder';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingStates';

// Lazy loaded components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const TemplatesGallery = lazy(() => import('./pages/TemplatesGallery'));
const ResumeExamples = lazy(() => import('./pages/ResumeExamples'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const NotFoundPage = lazy(() => import('./pages/404Page'));

// Template detail pages
const ProfessionalTemplate = lazy(() => import('./templates/ProfessionalTemplate'));
const ModernTemplate = lazy(() => import('./templates/ModernTemplate'));
const CreativeTemplate = lazy(() => import('./templates/CreativeTemplate'));
const ATSTemplate = lazy(() => import('./templates/ATSTemplate'));
const ExecutiveTemplate = lazy(() => import('./templates/ExecutiveTemplate'));

// Industry example pages
const SoftwareEngineerExample = lazy(() => import('./examples/SoftwareEngineerExample'));
const NurseExample = lazy(() => import('./examples/NurseExample'));
const ElectricianExample = lazy(() => import('./examples/ElectricianExample'));
const MarketingExample = lazy(() => import('./examples/MarketingExample'));
const ProjectManagerExample = lazy(() => import('./examples/ProjectManagerExample'));

// Analytics and performance monitoring
import { initAnalytics, trackPageView } from './utils/analytics';
import { measurePerformance } from './utils/performance';

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner text="Loading..." />
  </div>
);

// Enhanced Error Boundary for route-level errors
const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We're sorry, but there was an error loading this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    }
  >
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
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Free Resume Builder | Create Professional Resumes Online - No Credit Card",
  description = "Build professional resumes for free. ATS-optimized templates, no hidden fees, instant PDF download. Trusted by 100,000+ job seekers worldwide.",
  keywords = "free resume builder, resume maker, CV builder, ATS resume, professional resume templates",
  ogImage = "/og-image.jpg",
  canonicalUrl,
  structuredData
}) => {
  const currentUrl = canonicalUrl || window.location.href;
  
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
      <meta property="og:image" content={`${window.location.origin}${ogImage}`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="FreeResume Builder" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${window.location.origin}${ogImage}`} />
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
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "FreeResume Builder",
          "description": "Free online resume builder with professional templates",
          "url": "https://freeresume-builder.pages.dev",
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
            "url": "https://freeresume-builder.pages.dev"
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
        })}
      </script>
    </Helmet>
  );
};

// Layout components for different page types
const StandardLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const BuilderLayout: React.FC = () => {
  return (
    <main className="flex-1">
      <Outlet />
    </main>
  );
};

// Analytics tracking hook
const usePageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);
};

// Analytics wrapper component
const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};

// Main App component
function App() {
  useEffect(() => {
    // Initialize analytics using Vite env flags
    if (import.meta.env.PROD) {
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
                    <Route path="resume-tips" element={<Navigate to="/blog/resume-tips" replace />} />
                    <Route path="ats-resume-checker" element={<Navigate to="/blog/ats-resume-tips" replace />} />
                    
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
              </Suspense>
            </AnalyticsProvider>
          </RouteErrorBoundary>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;