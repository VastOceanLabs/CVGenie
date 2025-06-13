import React from 'react';
import { 
  FileText, 
  Heart, 
  Shield, 
  Users, 
  Star, 
  Download,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Award,
  Zap,
  Target,
  BookOpen,
  HelpCircle,
  Globe,
  Smartphone,
  Monitor,
  Coffee,
  TrendingUp,
  Search
} from 'lucide-react';

// Define types for better TypeScript support
interface FooterLink {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string;
}

interface FooterSection {
  [key: string]: FooterLink[];
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks: FooterSection = {
    product: [
      { name: 'Resume Builder', href: '/builder', icon: FileText },
      { name: 'Resume Templates', href: '/templates', icon: Award },
      { name: 'Resume Examples', href: '/resume-examples', icon: BookOpen },
      { name: 'ATS Checker', href: '/ats-checker', icon: Target },
      { name: 'Cover Letter Builder', href: '/cover-letter', icon: Mail, badge: 'Soon' }
    ],
    resources: [
      { name: 'Resume Tips', href: '/blog/resume-tips', icon: Zap },
      { name: 'Career Advice', href: '/blog/career-advice', icon: Users },
      { name: 'Interview Tips', href: '/blog/interview-tips', icon: HelpCircle },
      { name: 'Salary Guide', href: '/blog/salary-guide', icon: TrendingUp, badge: 'New' },
      { name: 'Job Search Tips', href: '/blog/job-search', icon: Search }
    ],
    templates: [
      { name: 'Professional Templates', href: '/templates/professional' },
      { name: 'Creative Templates', href: '/templates/creative' },
      { name: 'ATS-Friendly Templates', href: '/templates/ats-friendly' },
      { name: 'Executive Templates', href: '/templates/executive' },
      { name: 'Entry-Level Templates', href: '/templates/entry-level' }
    ],
    industries: [
      { name: 'Software Engineer', href: '/examples/software-engineer' },
      { name: 'Healthcare/Nursing', href: '/examples/nursing' },
      { name: 'Sales & Marketing', href: '/examples/sales' },
      { name: 'Skilled Trades', href: '/examples/trades' },
      { name: 'Project Management', href: '/examples/project-manager' }
    ],
    company: [
      { name: 'About Us', href: '/about', icon: Users },
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
      { name: 'Terms of Service', href: '/terms', icon: FileText },
      { name: 'Contact Us', href: '/contact', icon: Mail },
      { name: 'FAQ', href: '/faq', icon: HelpCircle }
    ],
    support: [
      { name: 'Help Center', href: '/help', icon: HelpCircle },
      { name: 'Video Tutorials', href: '/tutorials', icon: BookOpen, badge: 'Popular' },
      { name: 'Resume Checklist', href: '/checklist', icon: Target },
      { name: 'Format Guide', href: '/format-guide', icon: FileText },
      { name: 'Common Mistakes', href: '/common-mistakes', icon: Shield }
    ]
  };

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com/company/freeresume', icon: Linkedin, color: 'hover:text-blue-600' },
    { name: 'Twitter', href: 'https://twitter.com/freeresume', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'GitHub', href: 'https://github.com/freeresume', icon: Github, color: 'hover:text-gray-700' }
  ];

  const trustSignals = [
    { icon: Users, text: '500K+ Users', subtext: 'Trusted worldwide' },
    { icon: Download, text: '1M+ Downloads', subtext: 'Resumes created' },
    { icon: Star, text: '4.8/5 Rating', subtext: 'User satisfaction' },
    { icon: Shield, text: '100% Private', subtext: 'Your data is safe' }
  ];

  const features = [
    'Always 100% Free',
    'No Hidden Fees',
    'No Credit Card Required',
    'ATS-Optimized Templates',
    'Instant PDF Download',
    'Mobile Friendly'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Signals Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-white">
                <signal.icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-bold text-sm">{signal.text}</div>
                  <div className="text-xs opacity-90">{signal.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">FreeResume</h3>
                <p className="text-sm text-gray-400">Builder</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Build professional, ATS-optimized resumes for free. No hidden costs, 
              no credit card required. Trusted by job seekers worldwide to land their dream jobs.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" aria-hidden="true"></div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-gray-800 rounded-lg transition-colors ${social.color}`}
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    {link.icon && <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />}
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Templates */}
          <div>
            <h4 className="font-semibold text-white mb-4">Templates</h4>
            <ul className="space-y-3">
              {footerLinks.templates.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white hover:underline transition-all duration-200 focus:outline-none focus:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    {link.icon && <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />}
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="flex items-center space-x-2 text-gray-400 hover:text-white hover:underline transition-all duration-200 focus:outline-none focus:underline group"
                  >
                    {link.icon && <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />}
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <h5 className="font-medium text-white mb-3">Company</h5>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    {link.icon && <link.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />}
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Stay Updated with Career Tips
                </h3>
                <p className="text-blue-100">
                  Get free resume tips, job search advice, and career insights delivered to your inbox.
                </p>
              </div>
              <div className="flex space-x-3">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Handle newsletter signup
                    console.log('Newsletter signup submitted');
                  }}
                  className="flex space-x-3 flex-1"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} FreeResume Builder. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Made with love for job seekers</span>
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>Available worldwide</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="flex space-x-1">
                  <Smartphone className="w-4 h-4" />
                  <Monitor className="w-4 h-4" />
                </div>
                <span>Mobile & Desktop</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Coffee className="w-4 h-4" />
                <span>Built with care</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO-friendly structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FreeResume Builder",
            "url": "https://freeresume-builder.pages.dev",
            "logo": "https://freeresume-builder.pages.dev/logo.png",
            "description": "Free online resume builder with professional templates",
            "sameAs": [
              "https://linkedin.com/company/freeresume",
              "https://twitter.com/freeresume",
              "https://github.com/freeresume"
            ],
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://freeresume-builder.pages.dev/contact"
              }
            ]
          })
        }}
      />
    </footer>
  );
};

export default Footer;