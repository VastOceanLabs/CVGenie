import React from 'react';

// Simple 404 Page Component
export function NotFoundPage() {
  // Mock Link component for demo (replace with actual react-router-dom Link in real app)
  const Link = ({ to, className, children }: { to: string; className: string; children: React.ReactNode }) => (
    <button 
      onClick={() => {
        console.log(`Would navigate to: ${to}`);
        // In real app: navigate(to) or use react-router-dom Link
        alert(`Would navigate to: ${to}`);
      }}
      className={className}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link to="/" className="btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;