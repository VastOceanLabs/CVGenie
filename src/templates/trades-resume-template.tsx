import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Award, Wrench, Shield, 
  Calendar, Building, CheckCircle, Star, Clock,
  Download, Edit3, Palette, Eye, Target, Zap
} from 'lucide-react';

// Sample data for trades worker
const defaultTradesData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Rodriguez',
    email: 'john.rodriguez@email.com',
    phone: '(555) 123-4567',
    location: 'Phoenix, AZ',
    linkedin: '',
    website: '',
    summary: 'Licensed Master Electrician with 12+ years of experience in residential and commercial electrical systems. Proven track record of completing complex installations on time and under budget while maintaining the highest safety standards. Experienced in troubleshooting, maintenance, and new construction projects.',
    jobTitle: 'Master Electrician',
    yearsExperience: '12'
  },
  experience: [
    {
      title: 'Master Electrician',
      company: 'Bright Future Electric Inc.',
      location: 'Phoenix, AZ',
      startDate: 'January 2019',
      endDate: '',
      current: true,
      description: '• Lead electrical installations for 50+ commercial and residential projects annually\n• Supervise team of 6 apprentice and journeyman electricians\n• Reduced project completion time by 20% through improved workflow processes\n• Maintained 100% safety record with zero workplace incidents\n• Completed $2.5M in electrical projects with 98% customer satisfaction rating'
    },
    {
      title: 'Journeyman Electrician',
      company: 'Southwest Electrical Services',
      location: 'Phoenix, AZ',
      startDate: 'March 2015',
      endDate: 'December 2018',
      current: false,
      description: '• Installed and maintained electrical systems in residential and light commercial buildings\n• Performed troubleshooting and repairs on complex electrical issues\n• Trained 3 apprentice electricians in safety protocols and proper techniques\n• Successfully completed 200+ service calls with 95% first-time resolution rate'
    },
    {
      title: 'Apprentice Electrician',
      company: 'Desert Electric Co.',
      location: 'Phoenix, AZ',
      startDate: 'June 2012',
      endDate: 'February 2015',
      current: false,
      description: '• Assisted journeyman electricians with installation and maintenance tasks\n• Learned proper use of electrical tools and testing equipment\n• Completed 8,000+ hours of hands-on training\n• Maintained detailed work logs and followed all safety protocols'
    }
  ],
  education: [
    {
      institution: 'Phoenix Technical College',
      degree: 'Certificate',
      field: 'Electrical Technology',
      graduationDate: '2012',
      gpa: '',
      coursework: 'Electrical Code, Motor Controls, Industrial Wiring, Safety Protocols',
      honors: '',
      location: 'Phoenix, AZ',
      current: false,
      type: 'certificate'
    }
  ],
  skills: [
    { name: 'Electrical Installation', category: 'technical', level: 'expert', years: '12', featured: true },
    { name: 'Troubleshooting', category: 'technical', level: 'expert', years: '12', featured: true },
    { name: 'Motor Controls', category: 'technical', level: 'advanced', years: '10', featured: true },
    { name: 'Conduit Bending', category: 'technical', level: 'expert', years: '10', featured: false },
    { name: 'Blueprint Reading', category: 'technical', level: 'advanced', years: '8', featured: true },
    { name: 'Safety Compliance', category: 'soft', level: 'expert', years: '12', featured: true },
    { name: 'Team Leadership', category: 'soft', level: 'advanced', years: '5', featured: false },
    { name: 'Customer Service', category: 'soft', level: 'advanced', years: '8', featured: false }
  ],
  certifications: [
    {
      name: 'Master Electrician License',
      issuer: 'Arizona State Board',
      dateObtained: 'January 2019',
      expirationDate: 'January 2025',
      credentialId: 'ME-12345-AZ',
      status: 'valid',
      description: ''
    },
    {
      name: 'OSHA 30-Hour Construction',
      issuer: 'OSHA Training Institute',
      dateObtained: 'March 2020',
      expirationDate: 'March 2025',
      credentialId: 'OSHA30-789456',
      status: 'valid',
      description: ''
    },
    {
      name: 'NFPA 70E Arc Flash Training',
      issuer: 'National Fire Protection Association',
      dateObtained: 'June 2022',
      expirationDate: 'June 2025',
      credentialId: '',
      status: 'valid',
      description: ''
    },
    {
      name: 'First Aid/CPR Certification',
      issuer: 'American Red Cross',
      dateObtained: 'September 2023',
      expirationDate: 'September 2025',
      credentialId: '',
      status: 'valid',
      description: ''
    }
  ],
  projects: [
    {
      title: 'Hospital Emergency Power System',
      description: 'Led installation of backup generator and emergency power distribution for 200-bed hospital',
      technologies: ['480V Systems', 'Emergency Generators', 'Transfer Switches'],
      role: 'Lead Electrician',
      startDate: 'January 2023',
      endDate: 'June 2023',
      status: 'completed',
      metrics: '$850K project value',
      type: 'commercial',
      teamSize: '8'
    },
    {
      title: 'Solar Installation Project',
      description: 'Designed and installed 50kW solar panel system for manufacturing facility',
      technologies: ['Solar Panels', 'Inverters', 'DC/AC Systems'],
      role: 'Project Supervisor',
      startDate: 'March 2022',
      endDate: 'May 2022',
      status: 'completed',
      metrics: '15% energy cost reduction',
      type: 'renewable',
      teamSize: '4'
    }
  ]
};

// Template colors for trades
const tradesColors = {
  primary: '#dc2626', // Red - traditional trades color
  secondary: '#1f2937', // Dark gray
  accent: '#f59e0b', // Orange/yellow for safety
  text: '#111827',
  lightText: '#6b7280'
};

export default function TradesResumeTemplate() {
  const [resumeData, setResumeData] = useState(defaultTradesData);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('preview');
  const [previewMode, setPreviewMode] = useState('desktop');

  // ATS Analysis for trades
  const calculateATS = () => {
    const requiredElements = [
      resumeData.personalInfo.summary.length > 100,
      resumeData.experience.length > 0,
      resumeData.certifications.length >= 2,
      resumeData.skills.some(s => s.category === 'technical'),
      resumeData.personalInfo.phone,
      resumeData.personalInfo.email,
      resumeData.personalInfo.location
    ];
    
    const score = Math.round((requiredElements.filter(Boolean).length / requiredElements.length) * 100);
    return Math.min(score, 88); // Cap at template's ATS rating
  };

  const atsScore = calculateATS();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header Controls */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <Wrench className="w-6 h-6 mr-2 text-red-600" />
                Trades & Blue-Collar Resume Template
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Optimized for electricians, plumbers, mechanics, and skilled trades workers
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* ATS Score */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">ATS Score:</span>
                <span className={`font-bold ${
                  atsScore >= 80 ? 'text-green-600' : atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {atsScore}%
                </span>
              </div>

              {/* Preview Mode Toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-2 text-sm font-medium ${
                    previewMode === 'desktop' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-2 text-sm font-medium ${
                    previewMode === 'mobile' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Mobile
                </button>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="max-w-6xl mx-auto">
        <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                  {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                </h1>
                <h2 className="text-xl mb-4" style={{ color: tradesColors.accent }}>
                  {resumeData.personalInfo.jobTitle}
                </h2>
                
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {resumeData.personalInfo.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {resumeData.personalInfo.email}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {resumeData.personalInfo.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8 space-y-8">
              
              {/* Professional Summary */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2" 
                    style={{ borderColor: tradesColors.primary }}>
                  PROFESSIONAL SUMMARY
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {resumeData.personalInfo.summary}
                </p>
              </section>

              {/* Licenses & Certifications */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 flex items-center" 
                    style={{ borderColor: tradesColors.primary }}>
                  <Award className="w-5 h-5 mr-2" style={{ color: tradesColors.primary }} />
                  LICENSES & CERTIFICATIONS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4" 
                         style={{ borderColor: tradesColors.accent }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                          <p className="text-gray-600 text-sm">{cert.issuer}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Obtained: {cert.dateObtained}</span>
                            {cert.expirationDate && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Expires: {cert.expirationDate}</span>
                              </>
                            )}
                          </div>
                          {cert.credentialId && (
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {cert.credentialId}
                            </p>
                          )}
                        </div>
                        <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                          cert.status === 'valid' ? 'bg-green-100 text-green-700' : 
                          cert.status === 'expired' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical Skills */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 flex items-center" 
                    style={{ borderColor: tradesColors.primary }}>
                  <Zap className="w-5 h-5 mr-2" style={{ color: tradesColors.primary }} />
                  TECHNICAL SKILLS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Core Competencies</h4>
                    <div className="space-y-2">
                      {resumeData.skills
                        .filter(skill => skill.category === 'technical' && skill.featured)
                        .map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700">{skill.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">{skill.years} yrs</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${
                                  i < (skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : 3)
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Additional Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills
                        .filter(skill => !skill.featured)
                        .map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Work Experience */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 flex items-center" 
                    style={{ borderColor: tradesColors.primary }}>
                  <Building className="w-5 h-5 mr-2" style={{ color: tradesColors.primary }} />
                  WORK EXPERIENCE
                </h3>
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-200 last:border-l-0">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2" 
                           style={{ borderColor: tradesColors.primary }}></div>
                      
                      <div className="pb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                            <p className="text-gray-700 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-600 md:text-right">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </div>
                            <div className="flex items-center mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {exp.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Major Projects */}
              {resumeData.projects && resumeData.projects.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 flex items-center" 
                      style={{ borderColor: tradesColors.primary }}>
                    <Wrench className="w-5 h-5 mr-2" style={{ color: tradesColors.primary }} />
                    MAJOR PROJECTS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg border-l-4" 
                           style={{ borderColor: tradesColors.accent }}>
                        <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                        <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                        
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span>Role: {project.role}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{project.startDate} - {project.endDate}</span>
                          </div>
                          {project.metrics && (
                            <div className="flex items-center">
                              <Target className="w-3 h-3 mr-1" />
                              <span>{project.metrics}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-white text-gray-600 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 flex items-center" 
                    style={{ borderColor: tradesColors.primary }}>
                  <Award className="w-5 h-5 mr-2" style={{ color: tradesColors.primary }} />
                  EDUCATION & TRAINING
                </h3>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-gray-700">{edu.institution}, {edu.location}</p>
                        {edu.coursework && (
                          <p className="text-sm text-gray-600 mt-1">
                            Relevant Coursework: {edu.coursework}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 md:text-right mt-2 md:mt-0">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {edu.graduationDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Note */}
              <div className="border-t pt-6 text-center">
                <p className="text-xs text-gray-500">
                  References available upon request • All certifications current and verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Features */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-medium text-gray-900">Safety Focused</h4>
              <p className="text-sm text-gray-600 mt-1">
                Emphasizes safety certifications and compliance training
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">ATS Optimized</h4>
              <p className="text-sm text-gray-600 mt-1">
                88% ATS compatibility with clean, parseable formatting
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Skills Showcase</h4>
              <p className="text-sm text-gray-600 mt-1">
                Highlights technical skills and hands-on experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}