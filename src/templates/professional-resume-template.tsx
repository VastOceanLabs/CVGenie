import React, { useState, useMemo, createContext, useContext } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Building, Award, Code, Users, Star, ChevronRight, Download, FileText, Palette, Eye } from 'lucide-react';

// Enums for better type safety and consistency
enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  TOOLS = 'tools',
  CERTIFICATIONS = 'certifications'
}

enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

enum CertificationStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  IN_PROGRESS = 'in-progress',
  PENDING = 'pending'
}

// Template configuration context
interface TemplateConfig {
  fontFamily: 'serif' | 'sans-serif';
  colorMode: 'color' | 'grayscale';
  skillDisplay: 'bars' | 'text' | 'cloud';
  showIcons: boolean;
  dateFormat: 'full' | 'short';
  exportFormat: 'pdf' | 'docx';
  language: 'en' | 'es' | 'fr';
}

const defaultTemplateConfig: TemplateConfig = {
  fontFamily: 'serif',
  colorMode: 'color',
  skillDisplay: 'text',
  showIcons: true,
  dateFormat: 'short',
  exportFormat: 'pdf',
  language: 'en'
};

const TemplateContext = createContext<{
  config: TemplateConfig;
  updateConfig: (updates: Partial<TemplateConfig>) => void;
}>({
  config: defaultTemplateConfig,
  updateConfig: () => {}
});

// Internationalization support
const translations = {
  en: {
    professionalSummary: 'Professional Summary',
    professionalExperience: 'Professional Experience',
    coreCompetencies: 'Core Competencies',
    technicalSkills: 'Technical Skills',
    toolsTechnologies: 'Tools & Technologies',
    leadershipSkills: 'Leadership & Soft Skills',
    education: 'Education',
    certifications: 'Certifications',
    keyProjects: 'Key Projects',
    awards: 'Awards & Recognition',
    publications: 'Publications',
    volunteer: 'Volunteer Experience',
    present: 'Present',
    expected: 'Expected',
    obtained: 'Obtained',
    expires: 'Expires',
    results: 'Results',
    honors: 'Honors',
    gpa: 'GPA'
  },
  es: {
    professionalSummary: 'Resumen Profesional',
    professionalExperience: 'Experiencia Profesional',
    coreCompetencies: 'Competencias Principales',
    technicalSkills: 'Habilidades Técnicas',
    toolsTechnologies: 'Herramientas y Tecnologías',
    leadershipSkills: 'Liderazgo y Habilidades Blandas',
    education: 'Educación',
    certifications: 'Certificaciones',
    keyProjects: 'Proyectos Clave',
    awards: 'Premios y Reconocimientos',
    publications: 'Publicaciones',
    volunteer: 'Experiencia Voluntaria',
    present: 'Presente',
    expected: 'Esperado',
    obtained: 'Obtenido',
    expires: 'Expira',
    results: 'Resultados',
    honors: 'Honores',
    gpa: 'Promedio'
  },
  fr: {
    professionalSummary: 'Résumé Professionnel',
    professionalExperience: 'Expérience Professionnelle',
    coreCompetencies: 'Compétences Principales',
    technicalSkills: 'Compétences Techniques',
    toolsTechnologies: 'Outils et Technologies',
    leadershipSkills: 'Leadership et Compétences Sociales',
    education: 'Éducation',
    certifications: 'Certifications',
    keyProjects: 'Projets Clés',
    awards: 'Prix et Reconnaissances',
    publications: 'Publications',
    volunteer: 'Expérience Bénévole',
    present: 'Présent',
    expected: 'Attendu',
    obtained: 'Obtenu',
    expires: 'Expire',
    results: 'Résultats',
    honors: 'Honneurs',
    gpa: 'Moyenne'
  }
};

interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
    jobTitle?: string;
    yearsExperience?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
    coursework?: string;
    honors?: string;
    location?: string;
    current: boolean;
    type: string;
  }>;
  skills: Array<{
    name: string;
    category: SkillCategory;
    level: SkillLevel;
    years?: string;
    featured: boolean;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    dateObtained: string;
    expirationDate?: string;
    credentialId?: string;
    verificationUrl?: string;
    status: CertificationStatus;
    description?: string;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    role: string;
    startDate: string;
    endDate: string;
    status: 'completed' | 'in-progress' | 'on-hold' | 'concept';
    githubUrl?: string;
    liveUrl?: string;
    metrics?: string;
    type: string;
    teamSize?: string;
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  publications?: Array<{
    title: string;
    publication: string;
    date: string;
    url?: string;
    coAuthors?: string[];
  }>;
  volunteer?: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
}

interface TemplateProps {
  resumeData: ResumeData;
  template?: {
    id: string;
    name: string;
    colors: { primary: string; secondary: string; accent: string };
    layout: string;
  };
  config?: Partial<TemplateConfig>;
}

// Default template configuration
const defaultTemplate = {
  id: 'professional',
  name: 'Professional',
  colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  layout: 'single-column'
};

// Default resume data with comprehensive examples
const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    website: 'sarahjohnson.dev',
    summary: 'Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality solutions that drive business growth, with expertise in full-stack development and cloud architecture. Passionate about mentoring junior developers and implementing best practices that improve team productivity by 40%.',
    jobTitle: 'Senior Software Engineer',
    yearsExperience: '8'
  },
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description: 'Led development of microservices architecture serving 2M+ users, improving system performance by 60%. Mentored team of 5 junior developers, resulting in 40% faster feature delivery and improved code quality. Architected and implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes. Collaborated with product managers and designers to deliver user-centric features that increased engagement by 35%. Technologies: React, Node.js, TypeScript, AWS, Docker, Kubernetes.'
    },
    {
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
      current: false,
      description: 'Developed and maintained React-based dashboard application used by 10,000+ daily active users. Optimized database queries and API performance, reducing page load times by 45%. Implemented automated testing suite achieving 90% code coverage and reducing bugs by 30%. Collaborated in agile environment, participating in sprint planning and code reviews.'
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2017',
      gpa: '3.7',
      coursework: 'Data Structures, Algorithms, Software Engineering, Database Systems',
      honors: 'Magna Cum Laude',
      location: 'Berkeley, CA',
      current: false,
      type: 'Bachelor'
    }
  ],
  skills: [
    { name: 'JavaScript', category: SkillCategory.TECHNICAL, level: SkillLevel.EXPERT, years: '8+', featured: true },
    { name: 'React', category: SkillCategory.TECHNICAL, level: SkillLevel.EXPERT, years: '6+', featured: true },
    { name: 'Node.js', category: SkillCategory.TECHNICAL, level: SkillLevel.ADVANCED, years: '5+', featured: true },
    { name: 'TypeScript', category: SkillCategory.TECHNICAL, level: SkillLevel.ADVANCED, years: '4+', featured: true },
    { name: 'AWS', category: SkillCategory.TOOLS, level: SkillLevel.ADVANCED, years: '4+', featured: true },
    { name: 'Docker', category: SkillCategory.TOOLS, level: SkillLevel.INTERMEDIATE, years: '3+', featured: false },
    { name: 'Team Leadership', category: SkillCategory.SOFT, level: SkillLevel.ADVANCED, years: '3+', featured: true },
    { name: 'Problem Solving', category: SkillCategory.SOFT, level: SkillLevel.EXPERT, years: '8+', featured: false }
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      dateObtained: 'Mar 2023',
      expirationDate: 'Mar 2026',
      credentialId: 'AWS-SA-12345',
      status: CertificationStatus.VALID,
      description: 'Professional-level certification demonstrating expertise in designing distributed systems on AWS'
    }
  ],
  projects: [
    {
      title: 'E-commerce Platform Redesign',
      description: 'Led complete redesign of e-commerce platform serving 100K+ users, implementing modern React architecture and improving conversion rates by 25%',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      role: 'Lead Developer',
      startDate: 'Jan 2023',
      endDate: 'Jun 2023',
      status: 'completed',
      liveUrl: 'https://platform.example.com',
      metrics: '25% increase in conversion rate, 40% faster page loads',
      type: 'Web Application',
      teamSize: '4'
    }
  ],
  awards: [
    {
      title: 'Employee of the Year',
      issuer: 'TechCorp Inc.',
      date: 'Dec 2023',
      description: 'Recognized for exceptional leadership and technical contributions'
    }
  ],
  publications: [
    {
      title: 'Scalable Microservices Architecture Patterns',
      publication: 'IEEE Software Engineering Journal',
      date: 'Sep 2023',
      url: 'https://ieee.org/article/12345',
      coAuthors: ['John Doe', 'Jane Smith']
    }
  ]
};

// Utility functions
const formatDate = (dateStr: string, format: 'short' | 'full', language: string): string => {
  if (!dateStr) return '';
  
  const monthMappings = {
    en: { short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    es: { short: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] },
    fr: { short: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] }
  };

  // If already in short format (MMM YYYY), return as-is
  if (/^[A-Za-z]{3}\s\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  // Convert full month names to short format
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  
  let result = dateStr;
  fullMonths.forEach((month, index) => {
    if (dateStr.includes(month)) {
      const shortMonths = monthMappings[language as keyof typeof monthMappings]?.short || monthMappings.en.short;
      result = dateStr.replace(month, shortMonths[index]);
    }
  });

  return result;
};

// Contact Item Component
interface ContactItemProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  href: string;
  text: string;
  showIcon: boolean;
  iconColor: string;
  isClickable?: boolean;
}

function ContactItem({ icon: Icon, href, text, showIcon, iconColor, isClickable = true }: ContactItemProps) {
  const content = (
    <div className="flex items-center space-x-2">
      {showIcon && <Icon className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} aria-hidden="true" />}
      <span className="text-sm lg:text-base">{text}</span>
    </div>
  );

  if (isClickable && href !== "#") {
    return (
      <a href={href} className="hover:underline transition-colors">
        {content}
      </a>
    );
  }

  return content;
}

// Template configuration component
function TemplateControls() {
  const { config, updateConfig } = useContext(TemplateContext);

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4 print:hidden">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <Palette className="w-4 h-4 mr-2" />
        Template Options
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {/* Font Family */}
        <div>
          <label className="block text-gray-700 mb-1">Font</label>
          <select 
            value={config.fontFamily}
            onChange={(e) => updateConfig({ fontFamily: e.target.value as 'serif' | 'sans-serif' })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="serif">Georgia (Serif)</option>
            <option value="sans-serif">Calibri (Sans-serif)</option>
          </select>
        </div>

        {/* Color Mode */}
        <div>
          <label className="block text-gray-700 mb-1">Print Mode</label>
          <select 
            value={config.colorMode}
            onChange={(e) => updateConfig({ colorMode: e.target.value as 'color' | 'grayscale' })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="color">Color</option>
            <option value="grayscale">Grayscale</option>
          </select>
        </div>

        {/* Skill Display */}
        <div>
          <label className="block text-gray-700 mb-1">Skills</label>
          <select 
            value={config.skillDisplay}
            onChange={(e) => updateConfig({ skillDisplay: e.target.value as 'bars' | 'text' | 'cloud' })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="text">Text List</option>
            <option value="cloud">Keyword Cloud</option>
            <option value="bars">Progress Bars</option>
          </select>
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-gray-700 mb-1">Export</label>
          <div className="flex space-x-2">
            <button 
              onClick={() => updateConfig({ exportFormat: 'pdf' })}
              className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${
                config.exportFormat === 'pdf' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>PDF</span>
            </button>
            <button 
              onClick={() => updateConfig({ exportFormat: 'docx' })}
              className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${
                config.exportFormat === 'docx' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Download className="w-3 h-3" />
              <span>DOCX</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModernProfessionalTemplate({ 
  resumeData = defaultResumeData, 
  template = defaultTemplate,
  config: initialConfig = {}
}: TemplateProps) {
  const [config, setConfig] = useState<TemplateConfig>({
    ...defaultTemplateConfig,
    ...initialConfig
  });

  const updateConfig = (updates: Partial<TemplateConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const contextValue = { config, updateConfig };
  const t = translations[config.language];

  // Memoized bullet point parser for performance
  const parseBulletPoints = useMemo(() => {
    return (description: string) => {
      if (!description) return [];
      
      // Split by newlines and clean up
      const lines = description.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      return lines.map(line => {
        // Remove various bullet formats
        return line.replace(/^[•\-\*]\s*/, '').trim();
      });
    };
  }, []);

  // Get font family CSS
  const getFontFamily = () => {
    return config.fontFamily === 'serif' 
      ? 'Georgia, Times, serif' 
      : 'Calibri, Arial, sans-serif';
  };

  // Get color with grayscale support
  const getColor = (color: string) => {
    if (config.colorMode === 'grayscale') {
      // Convert brand colors to appropriate grayscale
      if (color === template.colors.primary) return '#333333';
      if (color === template.colors.secondary) return '#444444';
      if (color === template.colors.accent) return '#555555';
    }
    return color;
  };

  // Group skills by category
  const groupedSkills = {
    [SkillCategory.TECHNICAL]: resumeData.skills.filter(skill => skill.category === SkillCategory.TECHNICAL),
    [SkillCategory.TOOLS]: resumeData.skills.filter(skill => skill.category === SkillCategory.TOOLS),
    [SkillCategory.SOFT]: resumeData.skills.filter(skill => skill.category === SkillCategory.SOFT),
    [SkillCategory.CERTIFICATIONS]: resumeData.skills.filter(skill => skill.category === SkillCategory.CERTIFICATIONS)
  };

  // Skill rendering based on display mode
  const renderSkills = (skills: typeof resumeData.skills, title: string) => {
    if (skills.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 print:text-base" id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
          {title}
        </h4>
        
        {config.skillDisplay === 'cloud' && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      skill.featured 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                {skill.name}
                {skill.years && (
                  <span className="text-xs opacity-75 ml-1">({skill.years})</span>
                )}
              </span>
            ))}
          </div>
        )}

        {config.skillDisplay === 'text' && (
          <ul className="space-y-2" role="list">
            {skills.map((skill, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {skill.featured && config.showIcons && (
                    <Star className="w-3 h-3 text-yellow-500" aria-hidden="true" />
                  )}
                  {skill.years && (
                    <span className="text-xs text-gray-500">({skill.years})</span>
                  )}
                </div>
                <span className="text-sm text-gray-600 capitalize">
                  {skill.level}
                </span>
              </li>
            ))}
          </ul>
        )}

        {config.skillDisplay === 'bars' && (
          <div className="space-y-3">
            {skills.map((skill, index) => {
              const levelPercentages = {
                [SkillLevel.BEGINNER]: 25,
                [SkillLevel.INTERMEDIATE]: 50,
                [SkillLevel.ADVANCED]: 75,
                [SkillLevel.EXPERT]: 100
              };
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    {skill.featured && config.showIcons && (
                      <Star className="w-3 h-3 text-yellow-500" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${levelPercentages[skill.level]}%`,
                          backgroundColor: getColor(template.colors.primary)
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right capitalize">
                      {skill.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <TemplateContext.Provider value={contextValue}>
      <div lang={config.language} className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none print:max-w-none" 
           style={{ fontFamily: getFontFamily(), lineHeight: '1.4' }}>
        
        {/* Template Controls */}
        <TemplateControls />
        
        {/* Header Section */}
        <header className="relative overflow-hidden" role="banner">
          <div className="absolute inset-0 bg-gradient-to-r opacity-5" 
               style={{ 
                 background: `linear-gradient(135deg, ${getColor(template.colors.primary)} 0%, ${getColor(template.colors.secondary)} 100%)` 
               }} />
          
          <div className="relative px-8 py-8 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              
              {/* Name and Title */}
              <div className="lg:flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2 print:text-4xl">
                  {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                </h1>
                {resumeData.personalInfo.jobTitle && (
                  <h2 className="text-xl lg:text-2xl font-medium mb-4 print:text-xl" 
                      style={{ color: getColor(template.colors.primary) }}>
                    {resumeData.personalInfo.jobTitle}
                    {resumeData.personalInfo.yearsExperience && (
                      <span className="text-gray-600 ml-2">
                        • {resumeData.personalInfo.yearsExperience} years experience
                      </span>
                    )}
                  </h2>
                )}
              </div>

              {/* Contact Information */}
              <address className="lg:ml-8 space-y-2 text-gray-700 not-italic">
                <ContactItem 
                  icon={Mail} 
                  href={`mailto:${resumeData.personalInfo.email}`}
                  text={resumeData.personalInfo.email}
                  showIcon={config.showIcons}
                  iconColor={getColor(template.colors.primary)}
                />
                
                <ContactItem 
                  icon={Phone} 
                  href={`tel:${resumeData.personalInfo.phone.replace(/[^\d+]/g, '')}`}
                  text={resumeData.personalInfo.phone}
                  showIcon={config.showIcons}
                  iconColor={getColor(template.colors.primary)}
                />
                
                {resumeData.personalInfo.location && (
                  <ContactItem 
                    icon={MapPin} 
                    href="#"
                    text={resumeData.personalInfo.location}
                    showIcon={config.showIcons}
                    iconColor={getColor(template.colors.primary)}
                    isClickable={false}
                  />
                )}
                
                {resumeData.personalInfo.linkedin && (
                  <ContactItem 
                    icon={Linkedin} 
                    href={`https://${resumeData.personalInfo.linkedin}`}
                    text={resumeData.personalInfo.linkedin}
                    showIcon={config.showIcons}
                    iconColor={getColor(template.colors.primary)}
                  />
                )}
                
                {resumeData.personalInfo.website && (
                  <ContactItem 
                    icon={Globe} 
                    href={`https://${resumeData.personalInfo.website}`}
                    text={resumeData.personalInfo.website}
                    showIcon={config.showIcons}
                    iconColor={getColor(template.colors.primary)}
                  />
                )}
              </address>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-8 py-6 space-y-8" role="main">
          
          {/* Professional Summary */}
          {resumeData.personalInfo.summary && (
            <section aria-labelledby="summary-heading" className="print:break-inside-avoid">
              <h2 id="summary-heading" className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.professionalSummary}
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {resumeData.personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience Section */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <section aria-labelledby="experience-heading" className="print:break-inside-avoid">
              <h2 id="experience-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.professionalExperience}
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <article key={index} className="print:break-inside-avoid">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                      <div className="lg:flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 print:text-base">
                          {exp.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-700 mt-1">
                          {config.showIcons && <Building className="w-4 h-4 flex-shrink-0" style={{ color: getColor(template.colors.primary) }} aria-hidden="true" />}
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="text-gray-400" aria-hidden="true">•</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600 mt-2 lg:mt-0">
                        {config.showIcons && <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: getColor(template.colors.primary) }} aria-hidden="true" />}
                        <time className="text-sm font-medium">
                          {formatDate(exp.startDate, config.dateFormat, config.language)} - {exp.current ? t.present : formatDate(exp.endDate, config.dateFormat, config.language)}
                        </time>
                      </div>
                    </div>
                    
                    {exp.description && (
                      <ul className="ml-6 space-y-1" role="list">
                        {parseBulletPoints(exp.description).map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start space-x-3">
                            <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
                                  style={{ backgroundColor: getColor(template.colors.accent) }}
                                  aria-hidden="true" />
                            <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <section aria-labelledby="skills-heading" className="print:break-inside-avoid">
              <h2 id="skills-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.coreCompetencies}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderSkills(groupedSkills[SkillCategory.TECHNICAL], t.technicalSkills)}
                {renderSkills(groupedSkills[SkillCategory.TOOLS], t.toolsTechnologies)}
                {renderSkills(groupedSkills[SkillCategory.SOFT], t.leadershipSkills)}
              </div>
            </section>
          )}

          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <section aria-labelledby="education-heading" className="print:break-inside-avoid">
              <h2 id="education-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.education}
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <article key={index} className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="lg:flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 print:text-base">
                        {edu.degree} in {edu.field}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-700 mt-1">
                        {config.showIcons && <Building className="w-4 h-4 flex-shrink-0" style={{ color: getColor(template.colors.primary) }} aria-hidden="true" />}
                        <span className="font-medium">{edu.institution}</span>
                        {edu.location && (
                          <>
                            <span className="text-gray-400" aria-hidden="true">•</span>
                            <span>{edu.location}</span>
                          </>
                        )}
                      </div>
                      {edu.honors && (
                        <p className="text-gray-600 mt-1 text-sm">
                          <span className="font-medium">{t.honors}:</span> {edu.honors}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-gray-600 mt-1 text-sm">
                          <span className="font-medium">{t.gpa}:</span> {edu.gpa}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600 mt-2 lg:mt-0">
                      {config.showIcons && <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: getColor(template.colors.primary) }} aria-hidden="true" />}
                      <time className="text-sm font-medium">
                        {edu.current ? `${t.expected} ` : ''}{formatDate(edu.graduationDate, config.dateFormat, config.language)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <section aria-labelledby="certifications-heading" className="print:break-inside-avoid">
              <h2 id="certifications-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.certifications}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {resumeData.certifications.map((cert, index) => (
                  <article key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    {config.showIcons && <Award className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: getColor(template.colors.primary) }} aria-hidden="true" />}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-gray-700 text-sm font-medium">{cert.issuer}</p>
                      <p className="text-gray-600 text-sm">
                        {t.obtained}: {formatDate(cert.dateObtained, config.dateFormat, config.language)}
                        {cert.expirationDate && ` • ${t.expires}: ${formatDate(cert.expirationDate, config.dateFormat, config.language)}`}
                      </p>
                      {cert.credentialId && (
                        <p className="text-gray-500 text-xs mt-1">
                          ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Optional Sections */}
          {resumeData.awards && resumeData.awards.length > 0 && (
            <section aria-labelledby="awards-heading" className="print:break-inside-avoid">
              <h2 id="awards-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.awards}
              </h2>
              <div className="space-y-4">
                {resumeData.awards.map((award, index) => (
                  <article key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{award.title}</h3>
                      <p className="text-gray-700 text-sm">{award.issuer}</p>
                      {award.description && (
                        <p className="text-gray-600 text-sm mt-1">{award.description}</p>
                      )}
                    </div>
                    <time className="text-sm text-gray-600">
                      {formatDate(award.date, config.dateFormat, config.language)}
                    </time>
                  </article>
                ))}
              </div>
            </section>
          )}

          {resumeData.publications && resumeData.publications.length > 0 && (
            <section aria-labelledby="publications-heading" className="print:break-inside-avoid">
              <h2 id="publications-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.publications}
              </h2>
              <div className="space-y-4">
                {resumeData.publications.map((pub, index) => (
                  <article key={index}>
                    <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                    <p className="text-gray-700 text-sm">
                      {pub.publication} • {formatDate(pub.date, config.dateFormat, config.language)}
                    </p>
                    {pub.coAuthors && pub.coAuthors.length > 0 && (
                      <p className="text-gray-600 text-sm">
                        Co-authors: {pub.coAuthors.join(', ')}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {resumeData.projects && resumeData.projects.length > 0 && (
            <section aria-labelledby="projects-heading" className="print:break-inside-avoid">
              <h2 id="projects-heading" className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 print:text-lg"
                  style={{ borderColor: getColor(template.colors.primary) }}>
                {t.keyProjects}
              </h2>
              <div className="space-y-6">
                {resumeData.projects.slice(0, 3).map((project, index) => (
                  <article key={index} className="border-l-4 pl-4" style={{ borderColor: getColor(template.colors.accent) }}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 print:text-base">
                        {project.title}
                      </h3>
                      <time className="text-sm text-gray-600 font-medium">
                        {formatDate(project.startDate, config.dateFormat, config.language)} - {formatDate(project.endDate, config.dateFormat, config.language)}
                      </time>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} 
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {project.metrics && (
                      <p className="text-gray-600 text-sm font-medium">
                        <span className="text-green-600">{t.results}:</span> {project.metrics}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 bg-gray-50 text-center text-xs text-gray-500 print:bg-white" role="contentinfo">
          <p>
            {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName} • 
            {resumeData.personalInfo.jobTitle} • 
            {resumeData.personalInfo.phone} • 
            {resumeData.personalInfo.email}
          </p>
        </footer>

        {/* Enhanced Print Styles */}
        <style>{`
          @media print {
            @page {
              margin: 0.5in;
              size: letter;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .print\\:hidden {
              display: none !important;
            }
            
            .print\\:break-inside-avoid {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print\\:text-4xl {
              font-size: 2.25rem !important;
            }
            
            .print\\:text-xl {
              font-size: 1.25rem !important;
            }
            
            .print\\:text-lg {
              font-size: 1.125rem !important;
            }
            
            .print\\:text-base {
              font-size: 1rem !important;
            }
            
            .print\\:bg-white {
              background-color: white !important;
            }
            
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            
            .print\\:max-w-none {
              max-width: none !important;
            }
            
            section {
              page-break-inside: avoid;
            }
            
            h1, h2, h3 {
              page-break-after: avoid;
            }
          }
        `}</style>
      </div>
    </TemplateContext.Provider>
  );
}