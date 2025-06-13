import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import core components directly (not lazy loaded for critical path)
import Navigation from './components/Navigation'; // Now using proper Navigation component
import Footer from './components/footer_component';
import ErrorBoundary from './components/error_boundary_component';

// Create a PageLoader component instead of importing LoadingStates object
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for better performance - matching your actual file names
const LandingPage = lazy(() => import('./pages/landing_page'));
const Builder = lazy(() => import('./components/Builder')); // Ensure Builder is default export
const TemplatesGallery = lazy(() => import('./pages/templates_gallery'));
const TemplateDetail = lazy(() => import('./pages/template-categories-page')); // Using your template categories page
const ResumeExamples = lazy(() => import('./pages/resume-examples-page'));
const ResumeExampleDetail = lazy(() => import('./pages/resume-examples-page')); // Reusing for now
const BlogPage = lazy(() => import('./pages/blog-page'));
const BlogPost = lazy(() => import('./pages/blog-page')); // Reusing for now
const AboutPage = lazy(() => import('./pages/about-page'));
const PrivacyPage = lazy(() => import('./pages/privacy-page'));
const FAQPage = lazy(() => import('./pages/faq-page'));
const NotFoundPage = lazy(() => import('./pages/404-page-component'));

// Context providers - using your actual file names
import { ResumeProvider } from './utils/resume-context';
import { AnalyticsProvider } from './utils/analytics_utils';

// Scroll to top on route change component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Toast Notifications Portal Component - using your actual file name
const ToastNotifications = lazy(() => import('./components/toast_notifications'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* Context providers inside Router to access routing context */}
        <AnalyticsProvider>
          <ResumeProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              {/* Scroll restoration */}
              <ScrollToTop />
              
              {/* Navigation - now using proper Navigation component */}
              <Navigation />
              
              {/* Main Content */}
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Homepage */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Resume Builder App */}
                    <Route path="/builder" element={<Builder />} />
                    <Route path="/resume-builder" element={<Navigate to="/builder" replace />} />
                    
                    {/* Templates - using your actual components */}
                    <Route path="/templates" element={<TemplatesGallery />} />
                    <Route path="/templates/:templateId" element={<TemplateDetail />} />
                    
                    {/* Resume Examples - using your actual components */}
                    <Route path="/resume-examples" element={<ResumeExamples />} />
                    <Route path="/resume-examples/:industry" element={<ResumeExampleDetail />} />
                    <Route path="/examples" element={<Navigate to="/resume-examples" replace />} />
                    
                    {/* Content Pages - using your actual components */}
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/resume-tips" element={<Navigate to="/blog" replace />} />
                    
                    {/* Company Pages - using your actual file names */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    
                    {/* SEO Redirects */}
                    <Route path="/free-resume-builder" element={<Navigate to="/" replace />} />
                    <Route path="/online-resume-maker" element={<Navigate to="/" replace />} />
                    <Route path="/ats-resume-builder" element={<Navigate to="/builder" replace />} />
                    
                    {/* 404 Page - using your actual file name */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              
              {/* Footer - using your actual component */}
              <Footer />
              
              {/* Toast Notifications in Portal - using your actual file name */}
              <Suspense fallback={null}>
                <ToastNotifications />
              </Suspense>
            </div>
          </ResumeProvider>
        </AnalyticsProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
