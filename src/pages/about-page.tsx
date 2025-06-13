import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, 
  Users, 
  Target, 
  Shield, 
  CheckCircle, 
  Star,
  Award,
  Zap,
  Globe,
  FileText,
  Gift,
  Lightbulb,
  ArrowRight,
  Mail,
  ExternalLink,
  Quote
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// More flexible icon type that works with any SVG icon library
type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image: string;
}

interface Stat {
  number: string;
  label: string;
  description: string;
}

interface Value {
  icon: Icon;
  title: string;
  description: string;
}

interface Feature {
  icon: Icon;
  title: string;
  description: string;
}

// ============================================================================
// REUSABLE CLASS CONSTANTS
// ============================================================================

const BUTTON_CLASSES = {
  primary: 'inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors',
  secondary: 'inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors',
  white: 'inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors',
  outline: 'inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors'
} as const;

const TEXT_CLASSES = {
  heroTitle: 'text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6',
  sectionTitle: 'text-3xl sm:text-4xl font-bold text-gray-900 mb-4',
  sectionSubtitle: 'text-xl text-gray-600 max-w-3xl mx-auto',
  cardTitle: 'text-xl font-semibold text-gray-900 mb-4',
  description: 'text-gray-600 leading-relaxed',
  proseText: 'text-lg text-gray-600 space-y-6' // Replaced prose classes
} as const;

const LAYOUT_CLASSES = {
  section: 'py-20',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  textCenter: 'text-center mb-16',
  card: 'bg-white rounded-xl shadow-md',
  iconWrapper: 'w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6',
  flexStart: 'flex items-start space-x-4',
  gridMd2: 'grid grid-cols-1 md:grid-cols-2 gap-8',
  gridLg3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  rounded: 'rounded-lg p-6'
} as const;

const COMMON_CLASSES = {
  buttonSpacing: 'px-8 py-3',
  cardPadding: 'p-8',
  iconSize: 'w-6 h-6',
  transitionColors: 'transition-colors'
} as const;

// ============================================================================
// MOCK DATA
// ============================================================================

const teamMembers: TeamMember[] = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Former HR director who experienced firsthand how expensive resume services exclude talented candidates. Built FreeResume to level the playing field.",
    image: "/api/placeholder/150/150", // TODO: Replace with actual team photos before production
    linkedin: "https://linkedin.com/in/sarahjohnson"
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    bio: "Full-stack engineer passionate about creating accessible technology. Previously helped 1000+ developers land jobs at top tech companies.",
    image: "/api/placeholder/150/150", // TODO: Replace with actual team photos before production
    linkedin: "https://linkedin.com/in/michaelchen"
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    bio: "Design advocate for underserved communities. Specializes in making complex tools simple and accessible for all skill levels.",
    image: "/api/placeholder/150/150", // TODO: Replace with actual team photos before production
    linkedin: "https://linkedin.com/in/emilyrodriguez"
  },
  {
    name: "David Park",
    role: "Career Advisor",
    bio: "20+ years in recruitment across industries from tech to trades. Helps ensure our templates work in the real world.",
    image: "/api/placeholder/150/150", // TODO: Replace with actual team photos before production
    linkedin: "https://linkedin.com/in/davidpark"
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Marcus Williams",
    role: "Electrician",
    company: "City Electric",
    quote: "Finally found a resume builder that understands trade workers. Got my journeyman resume looking professional in 20 minutes. Landed 3 interviews in the first week!",
    rating: 5,
    image: "/api/placeholder/60/60" // TODO: Replace with actual user photos (with permission) before production
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    company: "Google",
    quote: "Used FreeResume to transition from a startup to FAANG. The ATS optimization really works - my resume passed all the screening systems.",
    rating: 5,
    image: "/api/placeholder/60/60" // TODO: Replace with actual user photos (with permission) before production
  },
  {
    name: "Jennifer Lopez",
    role: "Nursing Student",
    company: "UCLA Medical",
    quote: "As a student, paid resume services were out of my budget. FreeResume helped me create a professional nursing resume that got me into my dream program.",
    rating: 5,
    image: "/api/placeholder/60/60" // TODO: Replace with actual user photos (with permission) before production
  },
  {
    name: "James Mitchell",
    role: "Project Manager",
    company: "Microsoft",
    quote: "Tried 4 other 'free' builders that all wanted my credit card. FreeResume is actually free and better quality than the paid ones I've used.",
    rating: 5,
    image: "/api/placeholder/60/60" // TODO: Replace with actual user photos (with permission) before production
  }
];

const stats: Stat[] = [
  {
    number: "500K+",
    label: "Resumes Created",
    description: "Job seekers have built professional resumes"
  },
  {
    number: "89%",
    label: "Interview Rate",
    description: "Of users report getting more interviews"
  },
  {
    number: "100%",
    label: "Actually Free",
    description: "No hidden fees, no credit card required"
  },
  {
    number: "30+",
    label: "Industries",
    description: "Specialized templates and guidance"
  }
];

const values: Value[] = [
  {
    icon: Gift,
    title: "Truly Free Forever",
    description: "No freemium model, no hidden costs, no credit card tricks. Professional resume building should be accessible to everyone, regardless of financial situation."
  },
  {
    icon: Users,
    title: "Serve Everyone",
    description: "From software engineers to electricians, from nurses to sales reps. Every profession deserves quality career tools, not just white-collar workers."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your resume data never leaves your device. We don't store, sell, or share your personal information. Your career journey is yours alone."
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "Every feature is designed to help you land interviews. ATS optimization, industry-specific guidance, and proven templates that work."
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description: "Constantly improving based on user feedback and industry changes. We adapt so your resume stays competitive in the evolving job market."
  },
  {
    icon: Heart,
    title: "Mission Over Profit",
    description: "Built by job seekers, for job seekers. Our success is measured by your career success, not by subscription revenue."
  }
];

const features: Feature[] = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "12+ ATS-optimized templates designed by career experts for different industries and experience levels."
  },
  {
    icon: Zap,
    title: "Smart Builder",
    description: "Intelligent suggestions for skills, achievements, and industry keywords to make your resume stand out."
  },
  {
    icon: Award,
    title: "ATS Optimization",
    description: "Built-in ATS checker ensures your resume passes automated screening systems used by 95% of companies."
  },
  {
    icon: Globe,
    title: "Industry Expertise",
    description: "Specialized guidance for 30+ industries, from tech and healthcare to trades and creative fields."
  }
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Star Rating Component (fixes the Lucide icon fill issue)
const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    {[...Array(5)].map((_, i) => (
      <span 
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        aria-hidden="true"
      >
        ★
      </span>
    ))}
    <span className="sr-only">{rating} out of 5 stars</span>
  </div>
);

// ============================================================================
// COMPONENT DEFINITIONS
// ============================================================================

const SEOHead: React.FC = () => (
  <Helmet>
    <title>About FreeResume Builder | Our Mission to Make Resume Building Accessible</title>
    <meta name="description" content="Learn about FreeResume Builder's mission to provide truly free, professional resume building tools. Meet our team and discover why we're different from other resume services." />
    <meta name="keywords" content="about free resume builder, mission, team, truly free resume maker, no hidden costs" />
    <meta property="og:title" content="About FreeResume Builder | Our Mission" />
    <meta property="og:description" content="Meet the team behind the truly free resume builder. Learn our mission to make professional resume building accessible to everyone." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://freeresume-builder.pages.dev/about" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="About FreeResume Builder | Our Mission" />
    <meta name="twitter:description" content="Meet the team behind the truly free resume builder making professional resume building accessible to everyone." />
    <link rel="canonical" href="https://freeresume-builder.pages.dev/about" />
  </Helmet>
);

const HeroSection: React.FC = () => (
  <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
    <div className={LAYOUT_CLASSES.container}>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
        </div>
        
        <h1 className={TEXT_CLASSES.heroTitle}>
          Built by job seekers,
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            for job seekers
          </span>
        </h1>
        
        <p className={`${TEXT_CLASSES.sectionSubtitle} mb-8 leading-relaxed`}>
          We believe everyone deserves access to professional resume building tools, 
          regardless of their budget. That's why we built the only truly free resume 
          builder with no hidden costs, no credit card requirements, and no compromises on quality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/builder" className={BUTTON_CLASSES.primary}>
            Try Our Builder
            <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
          </a>
          <a href="#mission" className={BUTTON_CLASSES.secondary}>
            Learn Our Story
          </a>
        </div>
      </div>
    </div>
  </section>
);

const StatsSection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-white`}>
    <div className={LAYOUT_CLASSES.container}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
              {stat.number}
            </div>
            <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
            <div className="text-sm text-gray-600">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MissionSection: React.FC = () => (
  <section id="mission" className={`${LAYOUT_CLASSES.section} bg-gray-50`}>
    <div className={LAYOUT_CLASSES.container}>
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <h2 className={TEXT_CLASSES.sectionTitle}>
            Our Mission: Level the Playing Field
          </h2>
          <div className={TEXT_CLASSES.proseText}>
            <p className="text-lg text-gray-600 leading-relaxed">
              <strong>The problem was clear:</strong> Quality resume building tools cost $30-50+ per month, 
              creating a barrier for the people who need them most - recent graduates, career changers, 
              and workers in essential industries.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've seen talented electricians, nurses, and teachers struggle with expensive resume 
              services while software engineers had access to free tools. This inequality in career 
              resources perpetuates employment disparities.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              <strong>So we built something different.</strong> A completely free, professional-grade 
              resume builder that serves everyone - from trades workers to tech professionals, 
              from entry-level to executive.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
              <div className={LAYOUT_CLASSES.flexStart}>
                <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Our Goal</h3>
                  <p className="text-blue-800">
                    Make professional resume building accessible to every job seeker, 
                    regardless of their industry, experience level, or financial situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why We're Different</h3>
            <div className="space-y-6">
              {[
                { title: "Actually Free", description: "No freemium model. No credit card. No hidden fees. Ever." },
                { title: "Industry Inclusive", description: "Templates and guidance for all professions, not just tech." },
                { title: "Privacy Focused", description: "Your data stays on your device. We don't store or sell anything." },
                { title: "Results Driven", description: "ATS-optimized templates that actually help you get interviews." }
              ].map((item) => (
                <div key={item.title} className={LAYOUT_CLASSES.flexStart}>
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className={TEXT_CLASSES.description}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ValuesSection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-white`}>
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.textCenter}>
        <h2 className={TEXT_CLASSES.sectionTitle}>Our Core Values</h2>
        <p className={TEXT_CLASSES.sectionSubtitle}>
          These principles guide every decision we make and feature we build
        </p>
      </div>

      <div className={LAYOUT_CLASSES.gridLg3}>
        {values.map((value) => {
          const IconComponent = value.icon;
          return (
            <div key={value.title} className={`bg-gray-50 rounded-xl ${COMMON_CLASSES.cardPadding} hover:bg-gray-100 ${COMMON_CLASSES.transitionColors}`}>
              <div className={LAYOUT_CLASSES.iconWrapper}>
                <IconComponent className={`${COMMON_CLASSES.iconSize} text-blue-600`} aria-hidden="true" />
              </div>
              <h3 className={TEXT_CLASSES.cardTitle}>{value.title}</h3>
              <p className={TEXT_CLASSES.description}>{value.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const TeamSection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-gray-50`}>
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.textCenter}>
        <h2 className={TEXT_CLASSES.sectionTitle}>Meet Our Team</h2>
        <p className={`${TEXT_CLASSES.sectionSubtitle} max-w-2xl mx-auto`}>
          Passionate professionals from diverse backgrounds united by a common mission
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <div key={member.name} className={`${LAYOUT_CLASSES.card} overflow-hidden hover:shadow-lg transition-shadow`}>
            <img 
              src={member.image} 
              alt={`${member.name}, ${member.role} at FreeResume Builder - professional headshot`}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
              {member.linkedin && (
                <a 
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  aria-label={`Connect with ${member.name} on LinkedIn`}
                >
                  Connect on LinkedIn
                  <ExternalLink className="ml-1 w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-white`}>
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.textCenter}>
        <h2 className={TEXT_CLASSES.sectionTitle}>Why Users Choose FreeResume</h2>
        <p className={TEXT_CLASSES.sectionSubtitle}>
          Professional-grade features that rival paid services, completely free
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.title} className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className={TEXT_CLASSES.cardTitle}>{feature.title}</h3>
                <p className={TEXT_CLASSES.description}>{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const TestimonialsSection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-gray-50`}>
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.textCenter}>
        <h2 className={TEXT_CLASSES.sectionTitle}>Real Stories from Real Users</h2>
        <p className="text-xl text-gray-600">
          See how FreeResume has helped professionals across all industries
        </p>
      </div>

      <div className={LAYOUT_CLASSES.gridMd2}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className={`${LAYOUT_CLASSES.card} ${COMMON_CLASSES.cardPadding}`}>
            <StarRating rating={testimonial.rating} className="mb-4" />
            <Quote className="w-8 h-8 text-gray-300 mb-4" aria-hidden="true" />
            <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
            <div className={LAYOUT_CLASSES.flexStart}>
              <img 
                src={testimonial.image} 
                alt={`${testimonial.name}, ${testimonial.role} - customer testimonial photo`}
                className="w-12 h-12 rounded-full"
                loading="lazy"
              />
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-white`}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={LAYOUT_CLASSES.textCenter}>
        <h2 className={TEXT_CLASSES.sectionTitle}>Frequently Asked Questions</h2>
        <p className="text-xl text-gray-600">Common questions about our mission and service</p>
      </div>

      <div className="space-y-8">
        {[
          {
            question: "How is this actually free? What's the catch?",
            answer: "There's no catch. We built this as a passion project to solve a real problem we experienced. We're supported by optional donations and partnerships, but the core service will always be 100% free. No ads, no data selling, no premium upsells."
          },
          {
            question: "How do you make money if everything is free?",
            answer: "We operate on a minimal budget through optional user donations and partnerships with ethical career services. Our primary goal isn't profit - it's impact. We measure success by how many people land jobs, not by revenue."
          },
          {
            question: "Will this service stay free forever?",
            answer: "Yes. The core resume building functionality will always be free. If we ever add premium features (like advanced analytics), the basic service that helps you create professional resumes will never have a paywall."
          },
          {
            question: "Do you store my personal information?",
            answer: "No. Your resume data is processed entirely in your browser and never sent to our servers. We can't see your personal information, and we have no interest in collecting it. Your privacy is fundamental to our mission."
          },
          {
            question: "How do I know this will work for my industry?",
            answer: "Our team includes career experts from diverse industries. We've specifically designed templates and guidance for blue-collar workers, healthcare professionals, creative fields, and more - not just tech. Every template is tested with real recruiters and ATS systems."
          }
        ].map((faq) => (
          <div key={faq.question} className={`border border-gray-200 ${LAYOUT_CLASSES.rounded}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
            <p className={TEXT_CLASSES.description}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactCTASection: React.FC = () => (
  <section className={`${LAYOUT_CLASSES.section} bg-gradient-to-br from-blue-600 to-purple-700 text-white`}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">
        Questions? Suggestions? We'd Love to Hear From You
      </h2>
      <p className="text-xl mb-8 opacity-90">
        We're always looking to improve and better serve the job seeking community
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="mailto:team@freeresume-builder.com"
          className={BUTTON_CLASSES.white}
          aria-label="Send email to FreeResume team"
        >
          <Mail className="mr-2 w-4 h-4" aria-hidden="true" />
          Send Us an Email
        </a>
        <a href="/builder" className={BUTTON_CLASSES.outline}>
          Try Our Builder
          <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AboutPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead />
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactCTASection />
    </div>
  );
}