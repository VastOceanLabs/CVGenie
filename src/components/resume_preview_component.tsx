import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, Calendar, Building, GraduationCap, Award, Code, Users, Wrench, Star } from 'lucide-react';

// TypeScript interfaces
interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  jobTitle?: string;
  yearsExperience?: string;
}

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field?: string;
  graduationDate: string;
  gpa?: string;
  coursework?: string;
  honors?: string;
  location?: string;
  current: boolean;
  type: string;
}

interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'certifications';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: string;
  featured: boolean;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  status: 'valid' | 'expired' | 'in-progress' | 'pending';
  description?: string;
}

interface Project {
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
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  projects?: Project[];
}

interface Template {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: 'single-column' | 'two-column' | 'creative' | 'minimal';
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: Template;
  scale?: number;
  className?: string;
  printMode?: boolean;
}

// Constants for consistent styling
const TEXT_STYLES = {
  title: 'text-2xl md:text-3xl font-bold text-gray-900 mb-1',
  titlePrint: 'print:text-2xl',
  subtitle: 'text-lg md:text-xl text-gray-600 mb-3',
  subtitlePrint: 'print:text-lg',
  body: 'text-sm leading-relaxed',
  bodyPrint: 'print:text-xs',
  small: 'text-xs',
  smallPrint: 'print:text-[10px]',
  sectionHeader: 'text-lg font-semibold text-gray-900 pb-1 border-b-2 flex-1',
  sectionHeaderPrint: 'print:text-base',
  jobTitle: 'font-semibold text-gray-900 text-sm',
  jobTitlePrint: 'print:text-xs'
};

// Helper function to safely format dates with fallback
const formatDate = (dateString: string): string => {
  if (!dateString?.trim()) return '';
  
  // First try parsing as-is for common formats like "January 2020"
  const directParse = new Date(dateString);
  if (!isNaN(directParse.getTime())) {
    return directParse.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Try ISO format parsing
  const isoAttempt = new Date(dateString + 'T00:00:00');
  if (!isNaN(isoAttempt.getTime())) {
    return isoAttempt.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Fallback: return original string if parsing fails
  return dateString;
};

// Helper function to get skill level color
const getSkillLevelColor = (level: string): string => {
  switch (level) {
    case 'expert': return 'bg-purple-100 text-purple-700';
    case 'advanced': return 'bg-green-100 text-green-700';
    case 'intermediate': return 'bg-blue-100 text-blue-700';
    case 'beginner': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// Helper function to get skill category icon with fallback
const getSkillCategoryIcon = (category: string) => {
  try {
    switch (category) {
      case 'technical': return <Code className="w-3 h-3" />;
      case 'soft': return <Users className="w-3 h-3" />;
      case 'tools': return <Wrench className="w-3 h-3" />;
      case 'certifications': return <Award className="w-3 h-3" />;
      default: return <Code className="w-3 h-3" />;
    }
  } catch (error) {
    // Fallback if icon import fails
    return <span className="w-3 h-3 inline-block">•</span>;
  }
};

// Helper function to prettify category names
const prettifyCategory = (category: string): string => {
  switch (category) {
    case 'technical': return 'Technical Skills';
    case 'soft': return 'Soft Skills';
    case 'tools': return 'Tools & Software';
    case 'certifications': return 'Certifications';
    default: return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

// Helper function to safely render name with fallbacks
const renderFullName = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return 'Your Name';
  if (!first) return last;
  if (!last) return first;
  return `${first} ${last}`;
};

// Helper function to create gradient background with fallback
const createGradientBackground = (template: Template, printMode: boolean): React.CSSProperties => {
  if (printMode) {
    return { background: '#f8f9fa' };
  }
  
  // Use rgba for better browser compatibility instead of 8-digit hex
  const primaryRgba = `${template.colors.primary}15`; // Fallback
  const secondaryRgba = `${template.colors.secondary}15`; // Fallback
  
  return {
    background: `linear-gradient(135deg, ${primaryRgba}, ${secondaryRgba})`
  };
};

// Contact Info Component
const ContactInfo: React.FC<{ personalInfo: PersonalInfo; template: Template }> = React.memo(({ personalInfo, template }) => (
  <div className="text-center">
    <h1 className={`${TEXT_STYLES.title} ${TEXT_STYLES.titlePrint}`}>
      {renderFullName(personalInfo.firstName, personalInfo.lastName)}
    </h1>
    
    {personalInfo.jobTitle && (
      <p className={`${TEXT_STYLES.subtitle} ${TEXT_STYLES.subtitlePrint}`}>
        {personalInfo.jobTitle}
      </p>
    )}
    
    <div className={`text-gray-600 space-y-2 ${TEXT_STYLES.body}`}>
      {/* Primary contact info */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
        {personalInfo.email && (
          <div className="flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{personalInfo.location}</span>
          </div>
        )}
      </div>
      
      {/* Professional links */}
      {(personalInfo.linkedin || personalInfo.website) && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
          {personalInfo.linkedin && (
            <div className="flex items-center space-x-1">
              <Linkedin className="w-3 h-3" />
              <span className="text-blue-600 hover:text-blue-700 break-all">
                {personalInfo.linkedin}
              </span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span className="text-blue-600 hover:text-blue-700 break-all">
                {personalInfo.website}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
));

// Section Header Component
const SectionHeader: React.FC<{ title: string; template: Template; icon?: React.ReactNode }> = React.memo(({ title, template, icon }) => (
  <div className="flex items-center space-x-2 mb-3">
    {icon && <div className="text-gray-600">{icon}</div>}
    <h2 
      className={`${TEXT_STYLES.sectionHeader} ${TEXT_STYLES.sectionHeaderPrint}`}
      style={{ borderColor: template.colors.primary }}
    >
      {title}
    </h2>
  </div>
));

// Professional Summary Component
const ProfessionalSummary: React.FC<{ summary: string; template: Template }> = React.memo(({ summary, template }) => (
  <div className="break-inside-avoid">
    <SectionHeader title="Professional Summary" template={template} icon={<Users className="w-4 h-4" />} />
    <p className={`text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>{summary}</p>
  </div>
));

// Experience Section Component
const ExperienceSection: React.FC<{ experience: Experience[]; template: Template }> = React.memo(({ experience, template }) => (
  <div className="break-inside-avoid">
    <SectionHeader title="Professional Experience" template={template} icon={<Building className="w-4 h-4" />} />
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={`exp-${index}-${exp.company}-${exp.title}`} className="break-inside-avoid">
          <div className="flex justify-between items-start flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className={`${TEXT_STYLES.jobTitle} ${TEXT_STYLES.jobTitlePrint}`}>
                {exp.title || 'Job Title'}
              </h3>
              <div className={`text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                <span className="font-medium">{exp.company || 'Company Name'}</span>
                {exp.location && <span className="text-gray-500"> • {exp.location}</span>}
              </div>
            </div>
            <div className={`${TEXT_STYLES.body} text-gray-600 ${TEXT_STYLES.bodyPrint} whitespace-nowrap ml-2`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                </span>
              </div>
            </div>
          </div>
          
          {exp.description && (
            <div className={`mt-2 text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
              {exp.description.split('\n').map((line, lineIndex) => {
                const trimmedLine = line.trim();
                const isBulletPoint = trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*');
                
                return (
                  <div 
                    key={`exp-${index}-line-${lineIndex}`} 
                    className={isBulletPoint ? 'ml-4' : ''}
                  >
                    {trimmedLine}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
));

// Education Section Component
const EducationSection: React.FC<{ education: Education[]; template: Template }> = React.memo(({ education, template }) => (
  <div className="break-inside-avoid">
    <SectionHeader title="Education" template={template} icon={<GraduationCap className="w-4 h-4" />} />
    <div className="space-y-3">
      {education.map((edu, index) => (
        <div key={`edu-${index}-${edu.institution}-${edu.degree}`} className="break-inside-avoid">
          <div className="flex justify-between items-start flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className={`${TEXT_STYLES.jobTitle} ${TEXT_STYLES.jobTitlePrint}`}>
                {edu.degree || 'Degree'} {edu.field && `in ${edu.field}`}
              </h3>
              <div className={`text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                <span className="font-medium">{edu.institution || 'Institution'}</span>
                {edu.location && <span className="text-gray-500"> • {edu.location}</span>}
              </div>
              {edu.gpa && (
                <div className={`text-gray-600 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                  GPA: {edu.gpa}
                </div>
              )}
              {edu.honors && (
                <div className={`text-gray-600 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                  {edu.honors}
                </div>
              )}
            </div>
            <div className={`${TEXT_STYLES.body} text-gray-600 ${TEXT_STYLES.bodyPrint} whitespace-nowrap ml-2`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {edu.current ? 'Expected ' : ''}{formatDate(edu.graduationDate)}
                </span>
              </div>
            </div>
          </div>
          
          {edu.coursework && (
            <div className={`mt-1 text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
              <span className="font-medium">Relevant Coursework:</span> {edu.coursework}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
));

// Skills Section Component
const SkillsSection: React.FC<{ skills: Skill[]; template: Template }> = React.memo(({ skills, template }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort categories to show technical first, then others
  const categoryOrder = ['technical', 'tools', 'soft', 'certifications'];
  const sortedCategories = categoryOrder.filter(cat => skillsByCategory[cat]?.length > 0);

  return (
    <div className="break-inside-avoid">
      <SectionHeader title="Skills & Expertise" template={template} icon={<Code className="w-4 h-4" />} />
      <div className="space-y-3">
        {sortedCategories.map(category => (
          <div key={`skills-${category}`} className="break-inside-avoid">
            <h4 className={`font-medium text-gray-800 ${TEXT_STYLES.body} mb-2 ${TEXT_STYLES.bodyPrint} flex items-center space-x-1`}>
              {getSkillCategoryIcon(category)}
              <span>{prettifyCategory(category)}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {skillsByCategory[category].map((skill, index) => (
                <div key={`skill-${category}-${index}-${skill.name}`} className="inline-flex items-center space-x-1">
                  <span 
                    className={`px-2 py-1 rounded ${TEXT_STYLES.small} ${TEXT_STYLES.smallPrint} ${getSkillLevelColor(skill.level)}`}
                  >
                    {skill.name}
                    {skill.featured && <Star className="w-2 h-2 inline ml-1" />}
                  </span>
                  {skill.years && (
                    <span className={`${TEXT_STYLES.small} text-gray-500 ${TEXT_STYLES.smallPrint}`}>
                      ({skill.years})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Certifications Section Component
const CertificationsSection: React.FC<{ certifications: Certification[]; template: Template }> = React.memo(({ certifications, template }) => (
  <div className="break-inside-avoid">
    <SectionHeader title="Certifications & Licenses" template={template} icon={<Award className="w-4 h-4" />} />
    <div className="space-y-3">
      {certifications.map((cert, index) => (
        <div key={`cert-${index}-${cert.name}-${cert.issuer}`} className="break-inside-avoid">
          <div className="flex justify-between items-start flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className={`${TEXT_STYLES.jobTitle} ${TEXT_STYLES.jobTitlePrint}`}>
                {cert.name || 'Certification'}
              </h3>
              <div className={`text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                <span className="font-medium">{cert.issuer || 'Issuer'}</span>
              </div>
              {cert.credentialId && (
                <div className={`text-gray-600 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                  Credential ID: {cert.credentialId}
                </div>
              )}
              {cert.description && (
                <div className={`text-gray-700 ${TEXT_STYLES.body} mt-1 ${TEXT_STYLES.bodyPrint}`}>
                  {cert.description}
                </div>
              )}
            </div>
            <div className={`${TEXT_STYLES.body} text-gray-600 ${TEXT_STYLES.bodyPrint} whitespace-nowrap ml-2`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDate(cert.dateObtained)}
                  {cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                </span>
              </div>
              {cert.status !== 'valid' && (
                <div className={`${TEXT_STYLES.small} mt-1 ${
                  cert.status === 'expired' ? 'text-red-600' : 
                  cert.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                </div>
              )}
            </div>
          </div>
          
          {cert.verificationUrl && (
            <div className={`mt-1 text-blue-600 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint} flex items-center space-x-1`}>
              <ExternalLink className="w-3 h-3" />
              <span className="break-all">{cert.verificationUrl}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
));

// Projects Section Component (Optional)
const ProjectsSection: React.FC<{ projects: Project[]; template: Template }> = React.memo(({ projects, template }) => (
  <div className="break-inside-avoid">
    <SectionHeader title="Notable Projects" template={template} icon={<Code className="w-4 h-4" />} />
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div key={`project-${index}-${project.title}`} className="break-inside-avoid">
          <div className="flex justify-between items-start flex-wrap">
            <div className="flex-1 min-w-0">
              <h3 className={`${TEXT_STYLES.jobTitle} ${TEXT_STYLES.jobTitlePrint}`}>
                {project.title || 'Project Title'}
              </h3>
              <div className={`text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
                <span className="font-medium">{project.role || 'Role'}</span>
                {project.teamSize && <span className="text-gray-500"> • Team of {project.teamSize}</span>}
              </div>
            </div>
            <div className={`${TEXT_STYLES.body} text-gray-600 ${TEXT_STYLES.bodyPrint} whitespace-nowrap ml-2`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </span>
              </div>
            </div>
          </div>
          
          {project.description && (
            <div className={`mt-2 text-gray-700 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
              {project.description}
            </div>
          )}
          
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={`project-${index}-tech-${techIndex}-${tech}`}
                  className={`px-2 py-1 bg-gray-100 text-gray-700 rounded ${TEXT_STYLES.small} ${TEXT_STYLES.smallPrint}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          
          {project.metrics && (
            <div className={`mt-1 text-gray-600 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint} font-medium`}>
              {project.metrics}
            </div>
          )}
          
          <div className={`mt-2 flex space-x-4 text-blue-600 ${TEXT_STYLES.body} ${TEXT_STYLES.bodyPrint}`}>
            {project.githubUrl && (
              <div className="flex items-center space-x-1">
                <Github className="w-3 h-3" />
                <span className="break-all">{project.githubUrl}</span>
              </div>
            )}
            {project.liveUrl && (
              <div className="flex items-center space-x-1">
                <ExternalLink className="w-3 h-3" />
                <span className="break-all">{project.liveUrl}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
));

// Main Resume Preview Component
const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  resumeData, 
  template, 
  scale = 1, 
  className = '',
  printMode = false
}) => {
  // Use safe destructuring with default empty arrays
  const { 
    personalInfo = {}, 
    experience = [], 
    education = [], 
    skills = [], 
    certifications = [], 
    projects = [] 
  } = resumeData || {};

  const hasAnyContent = personalInfo.summary || 
                       experience.length > 0 || 
                       education.length > 0 || 
                       skills.length > 0 || 
                       certifications.length > 0 ||
                       (projects && projects.length > 0);

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:rounded-none ${className}`}
      style={{ 
        transform: printMode ? 'none' : `scale(${scale})`,
        transformOrigin: 'top left',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Header with contact info */}
      <div 
        className="px-6 md:px-8 py-6 print:px-6 print:py-4"
        style={createGradientBackground(template, printMode)}
      >
        <ContactInfo personalInfo={personalInfo} template={template} />
      </div>

      {/* Main content */}
      <div className="px-6 md:px-8 py-6 space-y-6 print:px-6 print:py-4 print:space-y-4">
        {/* Professional Summary */}
        {personalInfo.summary && (
          <ProfessionalSummary summary={personalInfo.summary} template={template} />
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <ExperienceSection experience={experience} template={template} />
        )}

        {/* Education */}
        {education.length > 0 && (
          <EducationSection education={education} template={template} />
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <SkillsSection skills={skills} template={template} />
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <CertificationsSection certifications={certifications} template={template} />
        )}

        {/* Projects (if any) */}
        {projects && projects.length > 0 && (
          <ProjectsSection projects={projects} template={template} />
        )}

        {/* Empty state */}
        {!hasAnyContent && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Resume</h3>
            <p className="text-sm">Add your information using the form on the left to see your resume take shape</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;