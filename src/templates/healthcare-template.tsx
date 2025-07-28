import React from 'react';

// TypeScript interfaces for proper typing (no PropTypes needed)
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary: string;
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

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
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

interface HealthcareTemplateProps {
  resumeData: ResumeData;
  template: TemplateConfig;
  className?: string;
}

// Utility function to get certification status
const getCertificationStatus = (cert: Certification): 'valid' | 'expired' | 'expiring-soon' => {
  if (!cert.expirationDate) return 'valid';
  
  const expDate = new Date(cert.expirationDate);
  const now = new Date();
  const monthsToExpiry = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  if (monthsToExpiry < 0) return 'expired';
  if (monthsToExpiry < 6) return 'expiring-soon';
  return 'valid';
};

// Utility function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

// Main Healthcare Template Component
const HealthcareTemplate: React.FC<HealthcareTemplateProps> = ({ 
  resumeData, 
  template,
  className = ""
}) => {
  const { personalInfo, experience, education, skills, certifications } = resumeData;
  const isHealthcareTemplate = template.id === 'healthcare';
  
  // Check if user has RN credential
  const hasRNCredential = certifications.some(cert => 
    cert.name?.toLowerCase().includes('registered nurse') || 
    cert.name?.toLowerCase().includes('rn')
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:rounded-none ${className}`}>
      <div className="h-full" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        
        {/* Header Section */}
        <div 
          className="px-8 py-6 print:px-6 print:py-4"
          style={{ 
            background: isHealthcareTemplate 
              ? `linear-gradient(135deg, ${template.colors.primary}12, ${template.colors.accent}08)` 
              : `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.secondary}08)` 
          }}
        >
          <div className="text-center">
            {/* Name with RN Credential */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1 print:text-xl">
              {personalInfo.firstName} {personalInfo.lastName}
              {isHealthcareTemplate && hasRNCredential && (
                <span 
                  className="text-lg font-normal ml-1 print:text-base" 
                  style={{ color: template.colors.primary }}
                >
                  , RN
                </span>
              )}
            </h1>
            
            {/* Job Title */}
            {personalInfo.jobTitle && (
              <p 
                className="text-lg font-medium mb-2 print:text-base" 
                style={{ color: template.colors.primary }}
              >
                {personalInfo.jobTitle}
              </p>
            )}
            
            {/* Contact Information */}
            <div className="text-gray-600 space-y-1 text-sm print:text-xs">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              
              <div className="flex justify-center space-x-4">
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
              
              {(personalInfo.linkedin || personalInfo.website) && (
                <div className="flex justify-center space-x-4">
                  {personalInfo.linkedin && (
                    <span style={{ color: template.colors.accent }}>
                      {personalInfo.linkedin}
                    </span>
                  )}
                  {personalInfo.website && (
                    <span style={{ color: template.colors.accent }}>
                      {personalInfo.website}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6 space-y-6 print:px-6 print:py-4 print:space-y-4">
          
          {/* Clinical/Professional Summary */}
          {personalInfo.summary && (
            <section>
              <h2 
                className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b-2 print:text-base"
                style={{ borderColor: template.colors.primary }}
              >
                {isHealthcareTemplate ? 'Clinical Summary' : 'Professional Summary'}
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm print:text-xs">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Healthcare: Certifications & Licenses (Prominent placement) */}
          {isHealthcareTemplate && certifications.length > 0 && (
            <section className="print:break-inside-avoid">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 print:text-base"
                style={{ borderColor: template.colors.primary }}
              >
                Professional Certifications &amp; Licenses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1 print:gap-2">
                {certifications.map((cert, index) => {
                  const status = getCertificationStatus(cert);
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 print:bg-transparent print:border print:border-gray-200 print:p-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm print:text-xs">
                            {cert.name}
                          </h3>
                          <div className="text-gray-700 text-sm print:text-xs">
                            {cert.issuer}
                          </div>
                          {cert.credentialId && (
                            <div className="text-xs text-gray-600 print:text-xs">
                              ID: {cert.credentialId}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-2">
                          <div 
                            className="text-sm font-medium print:text-xs" 
                            style={{ color: template.colors.primary }}
                          >
                            {formatDate(cert.dateObtained)}
                          </div>
                          {cert.expirationDate && (
                            <div className="text-xs text-gray-600">
                              Exp: {formatDate(cert.expirationDate)}
                            </div>
                          )}
                          <div className={`text-xs px-2 py-1 rounded-full mt-1 print:px-1 print:py-0.5 ${
                            status === 'valid' ? 'bg-green-100 text-green-700 print:bg-transparent print:text-green-800' :
                            status === 'expiring-soon' ? 'bg-yellow-100 text-yellow-700 print:bg-transparent print:text-yellow-800' :
                            'bg-red-100 text-red-700 print:bg-transparent print:text-red-800'
                          }`}>
                            {status === 'valid' ? 'Current' :
                             status === 'expiring-soon' ? 'Expires Soon' :
                             'Expired'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Clinical/Professional Experience */}
          {experience.length > 0 && (
            <section className="print:break-inside-avoid">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 print:text-base"
                style={{ borderColor: template.colors.primary }}
              >
                {isHealthcareTemplate ? 'Clinical Experience' : 'Professional Experience'}
              </h2>
              <div className="space-y-4 print:space-y-3">
                {experience.map((exp, index) => (
                  <div key={index} className="print:break-inside-avoid">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm print:text-xs">
                          {exp.title}
                        </h3>
                        <div 
                          className="font-medium text-sm print:text-xs" 
                          style={{ color: template.colors.primary }}
                        >
                          {exp.company}
                        </div>
                        {exp.location && (
                          <div className="text-sm text-gray-600 print:text-xs">
                            {exp.location}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 text-right ml-4 print:text-xs">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line print:text-xs">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="print:break-inside-avoid">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 print:text-base"
                style={{ borderColor: template.colors.primary }}
              >
                Education
              </h2>
              <div className="space-y-3 print:space-y-2">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm print:text-xs">
                          {edu.degree}
                          {edu.field && ` in ${edu.field}`}
                        </h3>
                        <div className="text-gray-700 text-sm print:text-xs">
                          {edu.institution}
                        </div>
                        {edu.location && (
                          <div className="text-sm text-gray-600 print:text-xs">
                            {edu.location}
                          </div>
                        )}
                        {isHealthcareTemplate && edu.honors && (
                          <div 
                            className="text-sm font-medium print:text-xs" 
                            style={{ color: template.colors.accent }}
                          >
                            {edu.honors}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 text-right ml-4 print:text-xs">
                        {edu.current ? 'In Progress' : formatDate(edu.graduationDate)}
                        {isHealthcareTemplate && edu.gpa && (
                          <div className="text-xs print:text-xs">
                            GPA: {edu.gpa}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Clinical Skills & Competencies / Skills */}
          {skills.length > 0 && (
            <section className="print:break-inside-avoid">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 print:text-base"
                style={{ borderColor: template.colors.primary }}
              >
                {isHealthcareTemplate ? 'Clinical Skills &amp; Competencies' : 'Skills'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 print:grid-cols-2 print:gap-1">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: template.colors.accent }}
                    />
                    <span className="text-sm text-gray-700 print:text-xs">
                      {skill.name}
                      {isHealthcareTemplate && skill.years && ` (${skill.years})`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Non-Healthcare: Certifications (if not healthcare template) */}
          {!isHealthcareTemplate && certifications.length > 0 && (
            <section className="print:break-inside-avoid">
              <h2 
                className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b-2 print:text-base"
                style={{ borderColor: template.colors.primary }}
              >
                Certifications
              </h2>
              <div className="space-y-3 print:space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm print:text-xs">
                          {cert.name}
                        </h3>
                        <div className="text-gray-700 text-sm print:text-xs">
                          {cert.issuer}
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 ml-4 print:text-xs">
                        {formatDate(cert.dateObtained)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              margin: 0.5in;
              size: letter;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .print\\:break-inside-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            
            .print\\:text-xs {
              font-size: 11px !important;
              line-height: 1.3 !important;
            }
            
            .print\\:text-base {
              font-size: 14px !important;
              line-height: 1.4 !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default HealthcareTemplate;

// Named export for backward compatibility
export { HealthcareTemplate };

// Type exports for other components to use
export type { 
  HealthcareTemplateProps, 
  ResumeData, 
  PersonalInfo, 
  Experience, 
  Education, 
  Skill, 
  Certification, 
  TemplateConfig 
};