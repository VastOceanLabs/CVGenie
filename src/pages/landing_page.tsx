import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Zap, 
  Shield, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Target,
  Clock,
  Smartphone,
  Briefcase,
  GraduationCap,
  Wrench,
  TrendingUp,
  Heart,
  Code,
  ChevronDown,
  ChevronUp,
  Eye,
  Palette,
  ThumbsUp
} from 'lucide-react';

// SEO Head component
const SEOHead = () => {
  useEffect(() => {
    // Set document title
    document.title = "Free Resume Builder | Create Professional Resumes Online - No Credit Card Required";
    
    // Helper function to create or update meta tag
    const setMetaTag = (selector: string, content: string, attribute = 'content') => {
      let metaTag = document.querySelector(selector);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) metaTag.setAttribute('name', name);
        }
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) metaTag.setAttribute('property', property);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute(attribute, content);
    };

    // Meta description
    setMetaTag(
      'meta[name="description"]',
      'Build professional resumes for free. ATS-optimized templates, no hidden fees, instant PDF download. Trusted by 100,000+ job seekers worldwide.'
    );

    // Open Graph tags
    setMetaTag(
      'meta[property="og:title"]',
      'Free Resume Builder | Create Professional Resumes Online'
    );

    setMetaTag(
      'meta[property="og:description"]',
      'Build professional resumes for free. ATS-optimized templates, no hidden fees, instant PDF download.'
    );

    setMetaTag('meta[property="og:type"]', 'website');
    setMetaTag('meta[property="og:site_name"]', 'FreeResume Builder');
    
    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'Free Resume Builder | Create Professional Resumes Online');
    setMetaTag('meta[name="twitter:description"]', 'Build professional resumes for free. ATS-optimized templates, no hidden fees, instant PDF download.');
  }, []);

  return null;
};

// Hero Section Component
const HeroSection = () => {
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 overflow-hidden">
      <SEOHead />
      
      {/* Background Pattern - using simple geometric pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              100% Free Forever • No Credit Card Required
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Professional Resume</span>
              <br />in Minutes
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Create ATS-optimized resumes with our free builder. Choose from professional templates, get hired faster.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Zap className="w-4 h-4 mr-1" />
                ATS-Optimized
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                <Download className="w-4 h-4 mr-1" />
                Instant PDF
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <Users className="w-4 h-4 mr-1" />
                No Sign-up Required
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/builder"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/templates"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Templates
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className={`text-2xl font-bold text-gray-900 transition-all duration-1000 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  100,000+
                </div>
                <div className="text-sm text-gray-600">Resumes Created</div>
              </div>
              <div>
                <div className={`text-2xl font-bold text-gray-900 transition-all duration-1000 delay-200 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  95%
                </div>
                <div className="text-sm text-gray-600">ATS Pass Rate</div>
              </div>
              <div>
                <div className={`text-2xl font-bold text-gray-900 transition-all duration-1000 delay-400 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  4.9★
                </div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview/Demo */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 rounded w-full"></div>
                    <div className="h-2 bg-blue-200 rounded w-5/6"></div>
                    <div className="h-2 bg-blue-200 rounded w-4/5"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-purple-100 rounded"></div>
                    <div className="h-16 bg-green-100 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Live Preview
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-blue-500 text-white p-3 rounded-xl shadow-lg animate-bounce">
              <FileText className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-purple-500 text-white p-3 rounded-xl shadow-lg animate-pulse">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  // Pre-defined color mappings for Tailwind JIT compilation
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    red: 'bg-red-100 text-red-600'
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "ATS-Optimized Templates",
      description: "Beat Applicant Tracking Systems with our professionally designed, ATS-friendly templates that get you noticed.",
      color: "blue" as keyof typeof colorMap
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Instant PDF Download",
      description: "Download your professional resume as a high-quality PDF instantly. No waiting, no email required.",
      color: "green" as keyof typeof colorMap
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-Friendly Builder",
      description: "Create and edit your resume on any device. Our mobile-optimized builder works perfectly on phones and tablets.",
      color: "purple" as keyof typeof colorMap
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Industry-Specific Guidance",
      description: "Get tailored suggestions for your industry, from tech to healthcare to trades. We know what recruiters want.",
      color: "orange" as keyof typeof colorMap
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Build in Under 10 Minutes",
      description: "Our intuitive interface and smart suggestions help you create a professional resume in just minutes.",
      color: "teal" as keyof typeof colorMap
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Your Privacy Protected",
      description: "We don&apos;t store your data. Everything happens in your browser. Your information stays 100% private.",
      color: "red" as keyof typeof colorMap
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Choose Our Free Resume Builder?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;ve built the most comprehensive free resume builder that actually delivers results. No hidden fees, no limitations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${colorMap[feature.color]} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Industry Section
const IndustrySection = () => {
  // Pre-defined color mappings for Tailwind JIT compilation
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    teal: 'bg-teal-100 text-teal-600'
  };

  const industries = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Technology",
      description: "Software engineers, developers, data scientists",
      templates: "5 specialized templates",
      color: "blue" as keyof typeof colorMap
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Healthcare",
      description: "Nurses, doctors, medical professionals",
      templates: "4 healthcare templates",
      color: "red" as keyof typeof colorMap
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Skilled Trades",
      description: "Electricians, plumbers, mechanics, contractors",
      templates: "3 trade-focused templates",
      color: "orange" as keyof typeof colorMap
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Business & Sales",
      description: "Managers, sales reps, consultants",
      templates: "6 business templates",
      color: "green" as keyof typeof colorMap
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Education",
      description: "Teachers, professors, administrators",
      templates: "3 education templates",
      color: "purple" as keyof typeof colorMap
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Entry Level",
      description: "Recent graduates, career changers",
      templates: "4 entry-level templates",
      color: "teal" as keyof typeof colorMap
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Templates for Every Industry
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From tech to trades, healthcare to hospitality - we have industry-specific templates that speak your language.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <Link
              key={index}
              to="/templates"
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${colorMap[industry.color]} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {industry.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {industry.title}
              </h3>
              <p className="text-gray-600 mb-3">
                {industry.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">
                  {industry.templates}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/templates"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            View All Templates
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Social Proof Section
const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      avatar: "SJ",
      text: "Got my dream job at Google! The ATS optimization really works. Best free resume builder I&apos;ve used.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Electrician",
      company: "Union Local 101",
      avatar: "MR",
      text: "Finally found a resume builder that understands trades. The electrician template was perfect for my union application.",
      rating: 5
    },
    {
      name: "Dr. Emily Chen",
      role: "Registered Nurse",
      company: "Johns Hopkins",
      avatar: "EC",
      text: "Clean, professional templates that highlight healthcare experience. Landed interviews at top hospitals.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Project Manager",
      company: "Microsoft",
      avatar: "DT",
      text: "The industry-specific suggestions were spot-on. Built my resume in 8 minutes and got callbacks within days.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join 100,000+ Job Seekers Who Got Hired
          </h2>
          <p className="text-xl text-gray-600">
            Real people, real results. See what our users are saying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.company}</div>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-4 h-4 text-yellow-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    role="img"
                    aria-label="Star rating"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 text-sm italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 bg-green-50 px-8 py-4 rounded-xl">
            <div className="flex items-center">
              <ThumbsUp className="w-6 h-6 text-green-600 mr-2" role="img" aria-label="Success rate indicator" />
              <span className="text-green-800 font-semibold">98% Success Rate</span>
            </div>
            <div className="flex items-center">
              <Users className="w-6 h-6 text-green-600 mr-2" role="img" aria-label="User count indicator" />
              <span className="text-green-800 font-semibold">100,000+ Users</span>
            </div>
            <div className="flex items-center">
              <Star className="w-6 h-6 text-green-600 mr-2" role="img" aria-label="Rating indicator" />
              <span className="text-green-800 font-semibold">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this resume builder really free?",
      answer: "Yes! Our resume builder is 100% free forever. No hidden fees, no credit card required, no premium upsells. You can create unlimited resumes and download them as PDFs completely free."
    },
    {
      question: "Are the templates ATS-friendly?",
      answer: "Absolutely! All our templates are designed to pass Applicant Tracking Systems (ATS). We use clean, simple formatting with standard fonts and proper heading hierarchy to ensure your resume gets past automated screening."
    },
    {
      question: "Do I need to sign up or create an account?",
      answer: "No signup required! You can start building your resume immediately. Your data is saved in your browser locally - we don't store any of your personal information on our servers."
    },
    {
      question: "Can I edit my resume after downloading?",
      answer: "Yes! Your resume data is saved locally in your browser. Return to our builder anytime to make changes and download an updated version. You can also export to Word format for external editing."
    },
    {
      question: "How do you make money if it's free?",
      answer: "We keep it simple - this is a free service with no catches. We may eventually offer premium add-ons like cover letter templates, but the core resume builder will always be free."
    },
    {
      question: "Is my personal information secure?",
      answer: "Very secure! Your data never leaves your device. Everything is processed locally in your browser. We don't collect, store, or sell your personal information. You maintain complete privacy and control."
    },
    {
      question: "Can I use this on my phone?",
      answer: "Yes! Our resume builder is fully mobile-optimized. You can create and edit resumes on your phone, tablet, or computer. The experience is seamless across all devices."
    },
    {
      question: "What file formats can I download?",
      answer: "You can download your resume as a high-quality PDF, which is the standard format recruiters expect. We're also working on Word document export for additional flexibility."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our free resume builder.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                aria-expanded={openFAQ === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" aria-label="Collapse answer" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" aria-label="Expand answer" />
                )}
              </button>
              
              {openFAQ === index && (
                <div 
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4"
                  aria-hidden={openFAQ !== index}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            to="/faq"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View Full FAQ
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Build Your Professional Resume?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who&apos;ve landed their dream jobs with our free resume builder. Start creating your professional resume in minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/builder"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Building Now - It&apos;s Free!
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          
          <Link
            to="/templates"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
          >
            <Palette className="w-5 h-5 mr-2" />
            Browse Templates
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>100% Free Forever</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>No Sign-up Required</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>ATS-Optimized</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <IndustrySection />
      <SocialProofSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}