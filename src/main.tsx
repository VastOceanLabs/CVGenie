import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Performance monitoring
import { initializePerformanceMonitoring } from './utils/performance';

// Error tracking
import { initializeErrorTracking } from './utils/analytics';

// Initialize monitoring in production
if (import.meta.env.PROD) {
  initializePerformanceMonitoring();
  initializeErrorTracking();
}

// Development warnings and debugging
if (import.meta.env.DEV) {
  console.log('🚀 FreeResume Builder - Development Mode');
  console.log('📊 Bundle analysis available at: npm run build && npm run preview');
  
  // Add development helpers
  window.__RESUME_BUILDER_DEBUG__ = {
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
      console.log('✅ Storage cleared');
    },
    logState: () => {
      console.log('📱 Current localStorage:', Object.fromEntries(Object.entries(localStorage)));
    }
  };
}

// Create root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure your index.html has a <div id="root"></div>'
  );
}

// Enable React 18 Concurrent Features
const root = ReactDOM.createRoot(rootElement);

// Render app with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot Module Replacement (HMR) for development
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    console.log('🔄 Hot reloading App component...');
  });
}

// Service Worker registration for PWA features
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('❌ SW registration failed: ', registrationError);
      });
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('💥 Global error:', event.error);
  
  // Track critical errors in production
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', 'exception', {
      description: event.error?.message || 'Unknown error',
      fatal: true
    });
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled promise rejection:', event.reason);
  
  // Track promise rejections in production
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', 'exception', {
      description: event.reason?.message || 'Unhandled promise rejection',
      fatal: false
    });
  }
});

// Performance measurement
if (import.meta.env.PROD) {
  // Measure and report Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Accessibility reminder in development
if (import.meta.env.DEV) {
  console.log('♿ Remember to test accessibility with screen readers');
  console.log('🎯 Use axe-core browser extension for accessibility auditing');
}