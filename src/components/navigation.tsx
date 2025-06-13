import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Menu, 
  X, 
  Palette, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Download,
  Sparkles,
  Target,
  Zap,
  type LucideIcon
} from 'lucide-react';

// Brand constant
const BRAND = 'FreeResume';

// Type-safe navigation item interface
interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Memoized active path checker with precise matching
  const isActivePath = useCallback((path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }, [location.pathname]);

  // Type-safe navigation items
  const navItems: NavItem[] = [
    {
      name: 'Templates',
      href: '/templates',
      icon: Palette,
      description: 'Professional resume templates'
    },
    {
      name: 'Examples',
      href: '/resume-examples',
      icon: BookOpen,
      description: 'Resume examples by industry'
    },
    {
      name: 'Resume Tips',
      href: '/blog',
      icon: Target,
      description: 'Career advice and tips'
    },
    {
      name: 'About',
      href: '/about',
      icon: Users,
      description: 'Learn about our mission'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{BRAND}</h1>
                <div className="text-xs text-green-600 font-semibold -mt-1">100% FREE</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Key Features - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 rounded">
                <Sparkles className="w-3 h-3" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-50 text-purple-700 rounded">
                <Zap className="w-3 h-3" />
                <span>AI Powered</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/builder"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Build Resume</span>
              <span className="sm:hidden">Build</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg" role="menu">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActivePath(item.href)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}

            {/* Mobile Features */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">Why Choose FreeResume:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">ATS Optimized</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">AI Powered</span>
                </div>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="pt-3">
              <Link
                to="/builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                <span>Start Building Resume</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar for Builder Page - removed until progress logic is implemented */}
      {/* Future: Add progress bar when builder state management is ready */}
    </nav>
  );
}