import React, { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from '../components/error_boundary_component';
import LoadingStates from '../components/loading_states';
import Navigation from '../components/navigation_component';
import Footer from '../components/footer_component';

// Import critical components immediately (above-the-fold)
import Builder from '../components/Builder';

// Lazy load non-critical components for performance
const LandingPage = lazy(() => import('../pages/landing_page'));
const TemplatesGallery = lazy(() => import('../pages/templates-overview-page'));
const ResumeExamples = lazy(() => import('../pages/resume-examples-page'));
const BlogPage = lazy(() => import('../pages/blog-page'));
const AboutPage = lazy(() => import('../pages/about-page'));
const PrivacyPage = lazy(() => import('../pages/privacy-page'));
const FAQPage = lazy(() => import('../pages/faq-page'));
const NotFoundPage = lazy(() => import('../pages/404-page-component'));

// Group template imports for better bundle splitting
const Templates = lazy(() => import('../templates'));

// Group industry examples for better bundle splitting  
const IndustryExamples = lazy(() => import('../pages/examples'));

// Group blog posts for better bundle splitting
const BlogPosts = lazy(() => import('../pages/blog'));

// Group comparison pages for better bundle splitting
const ComparisonPages = lazy(() => import('../pages/comparisons'));

// Fixed types for lazy components
type AnyComponent = React.ComponentType<any>;
type LazyComponent = React.LazyExoticComponent<AnyComponent>;
type ComponentType = AnyComponent | LazyComponent;

// Layout component with navigation and footer
function RootLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<LoadingStates.PageSkeleton />}>
            {children || <Outlet />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

// Template preview layout (no nav/footer for clean preview)
function TemplateLayout() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingStates.TemplateSkeleton />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

// Builder layout (minimal chrome for focus)
function BuilderLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Suspense fallback={<LoadingStates.BuilderSkeleton />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Safe SEO metadata update utility
function updatePageMetadata(title: string, description: string, keywords?: string) {
  // Update page title
  document.title = title;
  
  // Helper to safely update or create meta tags
  const updateOrCreateMeta = (selector: string, property: string, content: string) => {
    let tag = document.querySelector(selector) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      if (property.startsWith('property=')) {
        tag.setAttribute('property', property.replace('property=', ''));
      } else {
        tag.setAttribute('name', property.replace('name=', ''));
      }
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Update meta description
  updateOrCreateMeta('meta[name="description"]', 'name=description', description);
  
  // Update meta keywords if provided
  if (keywords) {
    updateOrCreateMeta('meta[name="keywords"]', 'name=keywords', keywords);
  }
  
  // Update Open Graph tags
  updateOrCreateMeta('meta[property="og:title"]', 'property=og:title', title);
  updateOrCreateMeta('meta[property="og:description"]', 'property=og:description', description);
  
  // Update Twitter Card tags
  updateOrCreateMeta('meta[name="twitter:title"]', 'name=twitter:title', title);
  updateOrCreateMeta('meta[name="twitter:description"]', 'name=twitter:description', description);
  
  // Return cleanup function
  return () => {
    // Reset to default values when component unmounts
    document.title = 'FreeResume Builder | Create Professional Resumes Online - No Credit Card';
  };
}

// Template route component with SEO metadata and cleanup
function TemplateRoute({ templateName, templateId }: { templateName: string; templateId: string }) {
  useEffect(() => {
    const cleanup = updatePageMetadata(
      `${templateName} Resume Template - Free Download | FreeResume Builder`,
      `Download our ${templateName.toLowerCase()} resume template for free. ATS-friendly design perfect for professional jobs. Instant customization and PDF download.`,
      `${templateName.toLowerCase()} resume template, free resume template, ATS resume, professional resume`
    );
    
    return cleanup;
  }, [templateName]);

  return (
    <Suspense fallback={<LoadingStates.TemplateSkeleton />}>
      <Templates templateId={templateId} />
    </Suspense>
  );
}

// Industry example route with SEO metadata and cleanup
function IndustryExampleRoute({ industry, industryId }: { industry: string; industryId: string }) {
  useEffect(() => {
    const cleanup = updatePageMetadata(
      `${industry} Resume Examples & Templates - Free | FreeResume`,
      `Free ${industry.toLowerCase()} resume examples and templates. ATS-optimized, industry-specific designs. Download instantly and customize online.`,
      `${industry.toLowerCase()} resume examples, ${industry.toLowerCase()} resume template, free resume examples`
    );
    
    return cleanup;
  }, [industry]);

  return (
    <Suspense fallback={<LoadingStates.PageSkeleton />}>
      <IndustryExamples industryId={industryId} />
    </Suspense>
  );
}

// Blog post route with SEO metadata and cleanup
function BlogPostRoute({ title, postId }: { title: string; postId: string }) {
  useEffect(() => {
    const cleanup = updatePageMetadata(
      `${title} | FreeResume Builder`,
      `Expert career advice and resume tips. ${title.toLowerCase()} - Learn from industry professionals and land your dream job.`,
      'resume tips, career advice, job search, professional development'
    );
    
    return cleanup;
  }, [title]);

  return (
    <Suspense fallback={<LoadingStates.PageSkeleton />}>
      <BlogPosts postId={postId} />
    </Suspense>
  );
}

// Comparison page route
function ComparisonRoute({ comparisonId }: { comparisonId: string }) {
  return (
    <Suspense fallback={<LoadingStates.PageSkeleton />}>
      <ComparisonPages comparisonId={comparisonId} />
    </Suspense>
  );
}

// Template preview route with 404 handling
function TemplatePreviewRoute() {
  const { templateId } = useParams<{ templateId: string }>();
  const validTemplates = ['professional', 'modern', 'creative', 'minimal', 'ats', 'executive', 'entry-level', 'two-column'];
  
  if (!templateId || !validTemplates.includes(templateId)) {
    return <NotFoundPage message="Template not found" />;
  }

  return (
    <Suspense fallback={<LoadingStates.TemplateSkeleton />}>
      <Templates templateId={templateId} preview={true} />
    </Suspense>
  );
}

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />, // Fixed: simplified error element
    children: [
      // Landing page
      {
        index: true,
        element: <LandingPage />,
      },
      
      // Core pages
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },

      // Templates gallery and individual templates
      {
        path: 'templates',
        element: <TemplatesGallery />,
      },
      {
        path: 'templates/professional-resume-template',
        element: <TemplateRoute templateName="Professional" templateId="professional" />,
      },
      {
        path: 'templates/modern-resume-template',
        element: <TemplateRoute templateName="Modern" templateId="modern" />,
      },
      {
        path: 'templates/creative-resume-template',
        element: <TemplateRoute templateName="Creative" templateId="creative" />,
      },
      {
        path: 'templates/simple-resume-template',
        element: <TemplateRoute templateName="Simple" templateId="minimal" />,
      },
      {
        path: 'templates/ats-friendly-resume-template',
        element: <TemplateRoute templateName="ATS-Friendly" templateId="ats" />,
      },
      {
        path: 'templates/executive-resume-template',
        element: <TemplateRoute templateName="Executive" templateId="executive" />,
      },
      {
        path: 'templates/entry-level-resume-template',
        element: <TemplateRoute templateName="Entry Level" templateId="entry-level" />,
      },
      {
        path: 'templates/two-column-resume-template',
        element: <TemplateRoute templateName="Two Column" templateId="two-column" />,
      },

      // Resume examples hub and industry-specific examples
      {
        path: 'resume-examples',
        element: <ResumeExamples />,
      },
      {
        path: 'resume-examples/software-engineer',
        element: <IndustryExampleRoute industry="Software Engineer" industryId="software-engineer" />,
      },
      {
        path: 'resume-examples/registered-nurse',
        element: <IndustryExampleRoute industry="Registered Nurse" industryId="registered-nurse" />,
      },
      {
        path: 'resume-examples/electrician',
        element: <IndustryExampleRoute industry="Electrician" industryId="electrician" />,
      },
      {
        path: 'resume-examples/marketing-manager',
        element: <IndustryExampleRoute industry="Marketing Manager" industryId="marketing-manager" />,
      },
      {
        path: 'resume-examples/project-manager',
        element: <IndustryExampleRoute industry="Project Manager" industryId="project-manager" />,
      },
      {
        path: 'resume-examples/sales-representative',
        element: <IndustryExampleRoute industry="Sales Representative" industryId="sales-representative" />,
      },

      // Blog/content hub
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'blog/how-to-write-a-resume',
        element: <BlogPostRoute title="How to Write a Resume That Gets You Hired" postId="how-to-write-a-resume" />,
      },
      {
        path: 'blog/ats-resume-tips',
        element: <BlogPostRoute title="ATS Resume Tips: Beat Applicant Tracking Systems" postId="ats-resume-tips" />,
      },
      {
        path: 'blog/resume-format-guide',
        element: <BlogPostRoute title="Resume Format Guide 2024: Choose the Right Layout" postId="resume-format-guide" />,
      },
      {
        path: 'blog/cover-letter-tips',
        element: <BlogPostRoute title="Cover Letter Tips That Get You Noticed" postId="cover-letter-tips" />,
      },
      {
        path: 'blog/job-interview-tips',
        element: <BlogPostRoute title="Job Interview Tips: How to Ace Your Next Interview" postId="job-interview-tips" />,
      },

      // Competitive comparison pages
      {
        path: 'vs/zety-alternative',
        element: <ComparisonRoute comparisonId="zety-alternative" />,
      },
      {
        path: 'vs/resume-genius-free',
        element: <ComparisonRoute comparisonId="resume-genius-free" />,
      },
      {
        path: 'vs/canva-resume-builder',
        element: <ComparisonRoute comparisonId="canva-resume-builder" />,
      },

      // FAQ specific pages for long-tail SEO
      {
        path: 'faq/is-this-really-free',
        element: <FAQPage section="pricing" />,
      },
      {
        path: 'faq/ats-optimization',
        element: <FAQPage section="ats" />,
      },
      {
        path: 'faq/resume-length',
        element: <FAQPage section="format" />,
      },
      {
        path: 'faq/file-formats',
        element: <FAQPage section="download" />,
      },

      // Future expansion routes (comment out until pages are built)
      /*
      {
        path: 'cover-letter-builder',
        element: <CoverLetterBuilder />,
      },
      {
        path: 'ats-resume-checker',
        element: <ATSChecker />,
      },
      */
    ],
  },

  // Builder app (separate layout for focus)
  {
    path: '/builder',
    element: <BuilderLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Builder />,
      },
    ],
  },

  // Resume builder alternative paths (SEO redirects with canonical handling)
  {
    path: '/resume-builder',
    element: <Navigate to="/builder" replace />,
  },
  {
    path: '/free-resume-builder',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/resume-maker',
    element: <Navigate to="/" replace />,
  },

  // Template preview routes (clean layout, no nav/footer)
  {
    path: '/preview',
    element: <TemplateLayout />,
    errorElement: <NotFoundPage message="Template preview not found" />,
    children: [
      {
        path: ':templateId',
        element: <TemplatePreviewRoute />,
      },
      // Catch-all for invalid template previews
      {
        path: '*',
        element: <NotFoundPage message="Template not found" />,
      },
    ],
  },

  // International expansion routes (future)
  /*
  {
    path: '/ca', // Canada
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage region="canada" />,
      },
      // ... Canadian-specific routes
    ],
  },
  {
    path: '/uk', // United Kingdom
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage region="uk" />,
      },
      // ... UK-specific routes
    ],
  },
  */

  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
], {
  // Add basename for Cloudflare Pages subfolder deployments if needed
  // basename: process.env.NODE_ENV === 'production' ? '/your-subfolder' : '',
});

// Router provider component
export default function AppRouter() {
  return <RouterProvider router={router} />;
}

// Export individual route configs for testing
export { router };

// Route utilities for navigation
export const routes = {
  home: '/',
  builder: '/builder',
  templates: '/templates',
  examples: '/resume-examples',
  blog: '/blog',
  about: '/about',
  privacy: '/privacy',
  faq: '/faq',
  
  // Template routes
  template: (templateName: string) => `/templates/${templateName}-resume-template`,
  
  // Example routes  
  example: (industry: string) => `/resume-examples/${industry.toLowerCase().replace(/\s+/g, '-')}`,
  
  // Blog routes
  blogPost: (slug: string) => `/blog/${slug}`,
  
  // Preview routes
  preview: (templateName: string) => `/preview/${templateName}`,
} as const;

// Fixed navigation helper hooks using react-router
export function useRouteNavigation() {
  const navigate = useNavigate();

  return {
    goToBuilder: () => navigate(routes.builder),
    goToTemplates: () => navigate(routes.templates),
    goToExamples: () => navigate(routes.examples),
    goToBlog: () => navigate(routes.blog),
    goToHome: () => navigate(routes.home),
    goToRoute: (path: string) => navigate(path),
  };
}

// Enhanced SEO helper with cleanup
export { updatePageMetadata };