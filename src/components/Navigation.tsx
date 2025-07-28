import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  FileText, 
  Home, 
  LayoutTemplate, 
  BookOpen, 
  HelpCircle, 
  Download,
  Palette,
  Briefcase,
  ChevronDown
} from 'lucide-react';

// Define proper interface for navigation items
interface NavigationItem {
  label: string;
  href?: string;
  action?: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  hasDropdown?: boolean;
  dropdownItems?: Array<{
    label: string;
    href: string;
    description: string;
  }>;
}

interface NavigationProps {
  currentPage?: 'landing' | 'builder' | 'templates' | 'examples' | 'blog' | 'about';
  isInBuilder?: boolean;
  onNavigate?: (page: string) => void;
  builderProgress?: {
    currentStep: number;
    totalSteps: number;
    completedSections: string[];
  };
}

export default function Navigation({ 
  currentPage = 'landing', 
  isInBuilder = false,
  onNavigate = () => {},
  builderProgress
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [showExamplesDropdown, setShowExamplesDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Refs for click-outside detection
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const templatesDropdownRef = useRef<HTMLDivElement>(null);
  const examplesDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Close mobile menu if clicking outside
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      
      // Close dropdowns if clicking outside
      if (showTemplatesDropdown && templatesDropdownRef.current && !templatesDropdownRef.current.contains(target)) {
        setShowTemplatesDropdown(false);
      }
      
      if (showExamplesDropdown && examplesDropdownRef.current && !examplesDropdownRef.current.contains(target)) {
        setShowExamplesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, showTemplatesDropdown, showExamplesDropdown]);

  // Main navigation items for marketing site
  const mainNavItems: NavigationItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      active: currentPage === 'landing'
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: LayoutTemplate,
      active: currentPage === 'templates',
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Templates', href: '/templates', description: 'Browse all resume templates' },
        { label: 'ATS-Friendly', href: '/templates/ats-friendly', description: 'Beat applicant tracking systems' },
        { label: 'Professional', href: '/templates/professional', description: 'Classic corporate design' },
        { label: 'Modern', href: '/templates/modern', description: 'Contemporary layouts' },
        { label: 'Creative', href: '/templates/creative', description: 'Stand out designs' },
        { label: 'Executive', href: '/templates/executive', description: 'Senior-level positions' },
        { label: 'Entry-Level', href: '/templates/entry-level', description: 'Perfect for new graduates' },
        { label: 'Tech/Software', href: '/templates/software-engineer', description: 'Developer-focused templates' }
      ]
    },
    {
      label: 'Examples',
      href: '/resume-examples',
      icon: Briefcase,
      active: currentPage === 'examples',
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Examples', href: '/resume-examples', description: 'Resume examples by industry' },
        { label: 'Software Engineer', href: '/resume-examples/software-engineer', description: 'Tech professional examples' },
        { label: 'Registered Nurse', href: '/resume-examples/registered-nurse', description: 'Healthcare examples' },
        { label: 'Electrician', href: '/resume-examples/electrician', description: 'Skilled trades examples' },
        { label: 'Marketing Manager', href: '/resume-examples/marketing-manager', description: 'Marketing professional examples' },
        { label: 'Project Manager', href: '/resume-examples/project-manager', description: 'PM role examples' },
        { label: 'Sales Representative', href: '/resume-examples/sales-representative', description: 'Sales role examples' }
      ]
    },
    {
      label: 'Resume Tips',
      href: '/blog',
      icon: BookOpen,
      active: currentPage === 'blog'
    },
    {
      label: 'About',
      href: '/about',
      icon: HelpCircle,
      active: currentPage === 'about'
    }
  ];

  // Builder-specific navigation
  const builderNavItems: NavigationItem[] = [
    { label: 'Templates', action: 'showTemplates', icon: Palette },
    { label: 'Download', action: 'download', icon: Download },
    { label: 'Examples', href: '/resume-examples', icon: Briefcase },
    { label: 'Help', href: '/blog/resume-tips', icon: HelpCircle }
  ];

  const handleNavClick = (href: string) => {
    if (!href) return;
    // Handle navigation - in a real app this would use React Router
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  const handleNavAction = (item: NavigationItem) => {
    if (item.action) {
      onNavigate(item.action);
    } else if (item.href) {
      handleNavClick(item.href);
    }
    setIsMobileMenuOpen(false);
  };

  const renderDropdown = (items: Array<{ label: string; href: string; description: string }>, isVisible: boolean) => {
    if (!isVisible) return null;

    return (
      <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
        <div className="grid grid-cols-1 gap-1">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
            >
              <div className="font-medium text-gray-900">{item.label}</div>
              {item.description && (
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen 
        ? 'bg-white shadow-lg border-b border-gray-200' 
        : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a
              href="/"
              className="flex items-center space-x-3"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('/');
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">FreeResume</span>
                <span className="text-xs text-green-600 font-semibold -mt-1">100% FREE</span>
              </div>
            </a>

            {/* Builder Progress Indicator */}
            {isInBuilder && builderProgress && (
              <div className="hidden md:flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Step {builderProgress.currentStep + 1} of {builderProgress.totalSteps}
                  </span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((builderProgress.currentStep + 1) / builderProgress.totalSteps) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isInBuilder ? (
              // Builder-specific navigation
              <>
                {builderNavItems.map((item) => (
                  <button
                    key={item.action || item.href || item.label}
                    onClick={() => handleNavAction(item)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label={item.label}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </>
            ) : (
              // Main site navigation
              <>
                {mainNavItems.map((item) => (
                  <div key={item.href || item.label} className="relative">
                    <button
                      onClick={() => {
                        if (item.hasDropdown) {
                          if (item.label === 'Templates') {
                            setShowTemplatesDropdown(!showTemplatesDropdown);
                            setShowExamplesDropdown(false);
                          } else if (item.label === 'Examples') {
                            setShowExamplesDropdown(!showExamplesDropdown);
                            setShowTemplatesDropdown(false);
                          }
                        } else {
                          handleNavAction(item);
                        }
                      }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        item.active 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      aria-label={item.label}
                      aria-expanded={item.hasDropdown ? (item.label === 'Templates' ? showTemplatesDropdown : showExamplesDropdown) : undefined}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Dropdowns */}
                    {item.label === 'Templates' && (
                      <div ref={templatesDropdownRef}>
                        {renderDropdown(item.dropdownItems || [], showTemplatesDropdown)}
                      </div>
                    )}
                    {item.label === 'Examples' && (
                      <div ref={examplesDropdownRef}>
                        {renderDropdown(item.dropdownItems || [], showExamplesDropdown)}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!isInBuilder && (
              <button
                onClick={() => handleNavClick('/builder')}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Build Resume</span>
              </button>
            )}
            
            {isInBuilder && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-saving...</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 space-y-2">
              {/* Builder Progress on Mobile */}
              {isInBuilder && builderProgress && (
                <div className="px-4 py-3 bg-gray-50 rounded-lg mx-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Step {builderProgress.currentStep + 1} of {builderProgress.totalSteps}
                    </span>
                    <span className="text-xs text-gray-600">
                      {builderProgress.completedSections.length} sections completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((builderProgress.currentStep + 1) / builderProgress.totalSteps) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Items */}
              {(isInBuilder ? builderNavItems : mainNavItems).map((item) => (
                <div key={item.action || item.href || item.label}>
                  <button
                    onClick={() => handleNavAction(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      item.active 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label={item.label}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Mobile Dropdown Items */}
                  {item.dropdownItems && (
                    <div className="bg-gray-50 px-4">
                      {item.dropdownItems.map((dropdownItem) => (
                        <button
                          key={dropdownItem.href}
                          onClick={() => handleNavClick(dropdownItem.href)}
                          className="w-full text-left py-2 pl-8 text-sm text-gray-600 hover:text-gray-900"
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              {!isInBuilder && (
                <div className="px-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleNavClick('/builder')}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Build Resume</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SEO-friendly structured data */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            "name": "Site Navigation",
            "url": typeof window !== 'undefined' ? window.location.origin : "https://freeresume-builder.pages.dev"
          })
        }}
      />
    </nav>
  );
}