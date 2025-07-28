import React from 'react';
// Lucide React icons - using supported import syntax
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Calendar, 
  Award, 
  Code, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Star 
} from 'lucide-react';

// TypeScript interfaces for better type safety
interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  summary?: string;
  jobTitle?: string;
  yearsExperience?: string;
}

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
  current: boolean;
}

// Enum for skill categories to prevent typos
enum SkillCategory {
  Technical = 'technical',
  Soft = 'soft',
  Tools = 'tools',
  Certifications = 'certifications'
}

// Enum for skill levels
enum SkillLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate', 
  Advanced = 'advanced',
  Expert = 'expert'
}

interface Skill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  years?: string;
  featured: boolean;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
  status: 'valid' | 'expired' | 'in-progress' | 'pending';
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
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects?: Project[];
}

interface TemplateConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: string;
}

interface TemplateProps {
  resumeData?: ResumeData;
  template?: TemplateConfig;
  visibleSections?: string[];
}

const ModernResumeTemplate: React.FC<TemplateProps> = ({ 
  resumeData = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      jobTitle: 'Software Engineer',
      yearsExperience: '5 years',
      summary: 'Experienced software engineer with 5+ years developing scalable web applications using modern technologies. Proven track record of delivering high-quality code and collaborating effectively with cross-functional teams.'
    },
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Company Inc.',
        location: 'San Francisco, CA',
        startDate: '2022-01-01',
        endDate: '',
        current: true,
        description: '• Led development of customer-facing web applications serving 100K+ users\n• Improved application performance by 40% through code optimization\n• Mentored junior developers and conducted code reviews'
      }
    ],
    education: [
      {
        institution: 'University of California',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2019-05-01',
        current: false
      }
    ],
    skills: [
      { name: 'JavaScript', category: 'technical' as SkillCategory, level: 'advanced' as SkillLevel, featured: true },
      { name: 'React', category: 'technical' as SkillCategory, level: 'advanced' as SkillLevel, featured: true },
      { name: 'Leadership', category: 'soft' as SkillCategory, level: 'intermediate' as SkillLevel, featured: false }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        dateObtained: '2023-06-01',
        status: 'valid' as const
      }
    ],
    projects: []
  },
  template,
  visibleSections = ['contact', 'skills', 'certifications', 'education', 'summary', 'experience', 'projects']
}) => {
  const colors = template?.colors || {
    primary: '#10b981',
    secondary: '#059669', 
    accent: '#34d399'
  };

  const {
    personalInfo,
    experience,
    education,
    skills,
    certifications,
    projects
  } = resumeData;

  // Improved date formatting with locale awareness
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr; // Fallback to original string if parsing fails
    }
  };

  // Helper function to get skill level with accessibility
  const getSkillLevel = (level: SkillLevel): number => {
    const levels = {
      [SkillLevel.Beginner]: 1,
      [SkillLevel.Intermediate]: 2,
      [SkillLevel.Advanced]: 3,
      [SkillLevel.Expert]: 4
    };
    return levels[level] || 2;
  };

  // Helper function to get skill level label for accessibility
  const getSkillLevelLabel = (level: SkillLevel): string => {
    const labels = {
      [SkillLevel.Beginner]: 'Beginner (1/4)',
      [SkillLevel.Intermediate]: 'Intermediate (2/4)',
      [SkillLevel.Advanced]: 'Advanced (3/4)',
      [SkillLevel.Expert]: 'Expert (4/4)'
    };
    return labels[level] || 'Intermediate (2/4)';
  };

  // Helper to check if section should be visible
  const isSectionVisible = (sectionName: string): boolean => {
    return visibleSections.includes(sectionName);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg print:shadow-none" style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '11in' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-full">
        {/* Left Sidebar - 1/3 width on desktop, full width on mobile */}
        <aside className="bg-gray-50 p-4 lg:p-6 space-y-6 print:bg-white">
          {/* Contact Information */}
          {isSectionVisible('contact') && (
            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
                Contact
              </h2>
              <address className="not-italic space-y-3 text-sm">
                {personalInfo.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} aria-hidden="true" />
                    <span className="text-gray-700 break-all">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} aria-hidden="true" />
                    <span className="text-gray-700">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} aria-hidden="true" />
                    <span className="text-gray-700">{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} aria-hidden="true" />
                    <a href={personalInfo.website} className="text-gray-700 break-all hover:underline">
                      {personalInfo.website}
                    </a>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} aria-hidden="true" />
                    <a href={personalInfo.linkedin} className="text-gray-700 break-all hover:underline">
                      {personalInfo.linkedin}
                    </a>
                  </div>
                )}
              </address>
            </section>
          )}

          {/* Skills */}
          {isSectionVisible('skills') && skills.length > 0 && (
            <section aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
                Skills
              </h2>
              <div className="space-y-4">
                {/* Technical Skills */}
                {skills.filter(skill => skill.category === SkillCategory.Technical).length > 0 && (
                  <div>
                    <h3 id="technical-skills" className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Code className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: colors.accent }} aria-hidden="true" />
                      Technical
                    </h3>
                    <ul className="space-y-2" aria-labelledby="technical-skills">
                      {skills.filter(skill => skill.category === SkillCategory.Technical).map((skill, index) => (
                        <li key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                            {skill.featured && (
                              <Star className="w-3 h-3 text-yellow-500" aria-label="Featured skill" />
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" 
                               aria-valuenow={getSkillLevel(skill.level)} 
                               aria-valuemax={4}
                               aria-label={`${skill.name} skill level: ${getSkillLevelLabel(skill.level)}`}
                               title={getSkillLevelLabel(skill.level)}>
                            <div 
                              className="h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${getSkillLevel(skill.level) * 25}%`,
                                backgroundColor: colors.accent 
                              }}
                            ></div>
                          </div>
                          {skill.years && (
                            <span className="text-xs text-gray-500">{skill.years} experience</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Soft Skills */}
                {skills.filter(skill => skill.category === SkillCategory.Soft).length > 0 && (
                  <div>
                    <h3 id="soft-skills" className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: colors.accent }} aria-hidden="true" />
                      Soft Skills
                    </h3>
                    <ul className="flex flex-wrap gap-1" aria-labelledby="soft-skills">
                      {skills.filter(skill => skill.category === SkillCategory.Soft).map((skill, index) => (
                        <li key={index}>
                          <span 
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: colors.accent }}
                          >
                            {skill.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tools */}
                {skills.filter(skill => skill.category === SkillCategory.Tools).length > 0 && (
                  <div>
                    <h3 id="tools-skills" className="font-semibold text-gray-800 mb-2">Tools & Software</h3>
                    <ul className="text-sm text-gray-700 space-y-1" aria-labelledby="tools-skills">
                      {skills.filter(skill => skill.category === SkillCategory.Tools).map((skill, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{skill.name}</span>
                          <span className="text-gray-500 capitalize">{skill.level}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Certifications */}
          {isSectionVisible('certifications') && certifications.length > 0 && (
            <section aria-labelledby="certifications-heading">
              <h2 id="certifications-heading" className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
                Certifications
              </h2>
              <ul className="space-y-3">
                {certifications.map((cert, index) => (
                  <li key={index} className="border-l-[3px] pl-3 break-inside-avoid" style={{ borderColor: colors.accent }}>
                    <div className="flex items-start space-x-2">
                      <Award className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{cert.name}</h3>
                        <p className="text-gray-600 text-xs">{cert.issuer}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" aria-hidden="true" />
                          <time className="text-xs text-gray-500" dateTime={cert.dateObtained}>
                            {formatDate(cert.dateObtained)}
                          </time>
                        </div>
                        {cert.credentialId && (
                          <p className="text-xs text-gray-500 mt-1">ID: {cert.credentialId}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {isSectionVisible('education') && education.length > 0 && (
            <section aria-labelledby="education-heading">
              <h2 id="education-heading" className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
                Education
              </h2>
              <ul className="space-y-4">
                {education.map((edu, index) => (
                  <li key={index} className="border-l-[3px] pl-3 break-inside-avoid" style={{ borderColor: colors.accent }}>
                    <div className="flex items-start space-x-2">
                      <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{edu.degree} in {edu.field}</h3>
                        <p className="text-gray-600 text-xs">{edu.institution}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" aria-hidden="true" />
                          <time className="text-xs text-gray-500" dateTime={edu.graduationDate}>
                            {edu.current ? 'In Progress' : formatDate(edu.graduationDate)}
                          </time>
                        </div>
                        {edu.gpa && (
                          <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>
                        )}
                        {edu.honors && (
                          <p className="text-xs font-medium mt-1" style={{ color: colors.accent }}>{edu.honors}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Main Content - 2/3 width on desktop, full width on mobile */}
        <main className="lg:col-span-2 p-4 lg:p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="border-b-4 pb-4" style={{ borderColor: colors.primary }}>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {personalInfo.firstName || 'Your Name'} {personalInfo.lastName || ''}
              </h1>
              {personalInfo.jobTitle && (
                <h2 className="text-lg lg:text-xl font-semibold mb-2" style={{ color: colors.primary }}>
                  {personalInfo.jobTitle}
                </h2>
              )}
              {personalInfo.yearsExperience && (
                <p className="text-gray-600 text-sm">
                  {personalInfo.yearsExperience} of professional experience
                </p>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          {isSectionVisible('summary') && personalInfo.summary && (
            <section aria-labelledby="summary-heading" className="mb-8 break-inside-avoid">
              <h2 id="summary-heading" className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.primary }}>
                <div className="w-6 h-6 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: colors.primary }} aria-hidden="true"></div>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {isSectionVisible('experience') && experience.length > 0 && (
            <section aria-labelledby="experience-heading" className="mb-8">
              <h2 id="experience-heading" className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.primary }}>
                <div className="w-6 h-6 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: colors.primary }} aria-hidden="true"></div>
                Professional Experience
              </h2>
              <ol className="space-y-6">
                {experience.map((exp, index) => (
                  <li key={index} className="relative break-inside-avoid">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors.accent }} aria-hidden="true"></div>
                    <div className="pl-4 lg:pl-6">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2">
                        <div className="mb-2 lg:mb-0">
                          <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Briefcase className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span className="font-semibold">{exp.company}</span>
                            {exp.location && (
                              <>
                                <span aria-hidden="true">•</span>
                                <span>{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="lg:text-right">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                            <time dateTime={exp.startDate}>
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </time>
                          </div>
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Projects */}
          {isSectionVisible('projects') && projects && projects.length > 0 && (
            <section aria-labelledby="projects-heading" className="mb-8">
              <h2 id="projects-heading" className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.primary }}>
                <div className="w-6 h-6 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: colors.primary }} aria-hidden="true"></div>
                Notable Projects
              </h2>
              <ul className="grid gap-4">
                {projects.map((project, index) => (
                  <li key={index} className="border rounded-lg p-4 break-inside-avoid" style={{ borderColor: colors.accent }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full text-white flex-shrink-0 ml-2 ${
                        project.status === 'completed' ? 'bg-green-500' :
                        project.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <ul className="flex flex-wrap gap-1 mb-2" aria-label="Technologies used">
                        {project.technologies.map((tech, techIndex) => (
                          <li key={techIndex}>
                            <span 
                              className="px-2 py-1 text-xs rounded"
                              style={{ backgroundColor: `${colors.accent}20`, color: colors.secondary }}
                            >
                              {tech}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 gap-1">
                      <span>Role: {project.role}</span>
                      <time dateTime={project.startDate}>
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>

      {/* Hidden ATS keywords for better parsing */}
      <div className="sr-only" aria-hidden="true">
        {skills.map(skill => skill.name).join(' ')} {personalInfo.jobTitle || ''} resume CV
      </div>

      {/* Print and accessibility optimizations */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .w-full {
            width: 100% !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          .min-h-full {
            min-height: auto !important;
          }
          .space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }
          .space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          .space-y-3 > * + * {
            margin-top: 0.75rem !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
          .page-break-before {
            page-break-before: always;
          }
        }

        @media print and (prefers-color-scheme: light) {
          .print-grayscale {
            filter: grayscale(1) !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .text-gray-600 {
            color: #000000 !important;
          }
          .text-gray-700 {
            color: #000000 !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernResumeTemplate;