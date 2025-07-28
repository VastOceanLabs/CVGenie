import React, { useState } from 'react';
import { 
  Palette, 
  Globe, 
  Linkedin, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Award, 
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  Zap,
  Eye,
  Download,
  Printer,
  Smartphone,
  Monitor
} from 'lucide-react';

// TypeScript interfaces for prop validation
interface SkillLevelProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  featured: boolean;
}

interface ProjectCardProps {
  project: {
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
  };
}

// Sample data for demonstration
const sampleResumeData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@design.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexrivera',
    website: 'alexrivera.design',
    github: 'github.com/alexrivera',
    summary: 'Creative UI/UX Designer with 5+ years crafting user-centered digital experiences. Passionate about creating intuitive interfaces that bridge business goals with user needs. Led design systems for 3 startups, increasing user engagement by 40% and reducing development time by 30%.',
    jobTitle: 'Senior UI/UX Designer',
    yearsExperience: '5+'
  },
  experience: [
    {
      title: 'Senior UI/UX Designer',
      company: 'TechFlow Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      description: '• Led end-to-end design for B2B SaaS platform serving 50,000+ users\n• Created comprehensive design system reducing development time by 30%\n• Conducted user research and usability testing, improving conversion rates by 25%\n• Collaborated with engineering teams using Figma, resulting in 95% design-dev consistency'
    },
    {
      title: 'Product Designer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: 'Mar 2020',
      endDate: 'Dec 2021',
      current: false,
      description: '• Designed mobile-first interfaces for fintech startup (Series A, $10M raised)\n• Increased user onboarding completion by 60% through streamlined UX flows\n• Built interactive prototypes and conducted A/B tests with 10,000+ user cohorts\n• Managed design handoffs and collaborated with 8-person development team'
    },
    {
      title: 'Graphic Designer',
      company: 'Creative Agency Co.',
      location: 'Los Angeles, CA',
      startDate: 'Jun 2018',
      endDate: 'Feb 2020',
      current: false,
      description: '• Created brand identities and marketing materials for 25+ clients\n• Designed award-winning campaign that increased client revenue by 150%\n• Managed multiple projects simultaneously, consistently meeting tight deadlines\n• Collaborated with copywriters and account managers on integrated campaigns'
    }
  ],
  education: [
    {
      institution: 'California College of the Arts',
      degree: 'Bachelor of Fine Arts',
      field: 'Graphic Design',
      graduationDate: 'May 2018',
      location: 'Oakland, CA',
      honors: 'Magna Cum Laude, Design Excellence Award',
      current: false,
      type: 'bachelor'
    }
  ],
  skills: [
    { name: 'Figma', category: 'tools', level: 'expert', years: '5+', featured: true },
    { name: 'Adobe Creative Suite', category: 'tools', level: 'expert', years: '7+', featured: true },
    { name: 'Sketch', category: 'tools', level: 'advanced', years: '4+', featured: true },
    { name: 'Prototyping', category: 'technical', level: 'expert', years: '5+', featured: true },
    { name: 'User Research', category: 'technical', level: 'advanced', years: '4+', featured: true },
    { name: 'Design Systems', category: 'technical', level: 'expert', years: '3+', featured: true },
    { name: 'HTML/CSS', category: 'technical', level: 'intermediate', years: '3+', featured: false },
    { name: 'JavaScript', category: 'technical', level: 'beginner', years: '1+', featured: false },
    { name: 'Leadership', category: 'soft', level: 'advanced', years: '3+', featured: false },
    { name: 'Creative Problem Solving', category: 'soft', level: 'expert', years: '5+', featured: true }
  ],
  projects: [
    {
      title: 'EcoTracker Mobile App',
      description: 'Designed comprehensive sustainability tracking app with gamification elements. Led user research, created wireframes, and delivered high-fidelity designs.',
      technologies: ['Figma', 'Principle', 'Adobe Illustrator'],
      role: 'Lead Designer',
      startDate: 'Jan 2023',
      endDate: 'Mar 2023',
      status: 'completed',
      liveUrl: 'apps.apple.com/ecotracker',
      metrics: '4.8★ App Store rating, 25K+ downloads in first month',
      type: 'Mobile App',
      teamSize: '4'
    },
    {
      title: 'FinanceFlow Dashboard',
      description: 'Complete redesign of financial analytics dashboard, focusing on data visualization and user workflow optimization.',
      technologies: ['Figma', 'D3.js', 'After Effects'],
      role: 'Senior Designer',
      startDate: 'Sep 2022',
      endDate: 'Dec 2022',
      status: 'completed',
      githubUrl: 'github.com/alexrivera/financeflow',
      liveUrl: 'financeflow-demo.com',
      metrics: '40% increase in user engagement, 25% faster task completion',
      type: 'Web App',
      teamSize: '6'
    },
    {
      title: 'BrandCraft Identity System',
      description: 'Comprehensive brand identity and design system for creative agency, including logo, color palette, typography, and marketing collateral.',
      technologies: ['Adobe Illustrator', 'InDesign', 'Photoshop'],
      role: 'Brand Designer',
      startDate: 'May 2021',
      endDate: 'Jul 2021',
      status: 'completed',
      metrics: 'Featured in Design Awards 2021, 200% increase in client inquiries',
      type: 'Branding',
      teamSize: '2'
    }
  ],
  certifications: [
    {
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      dateObtained: 'Nov 2021',
      status: 'valid',
      credentialId: 'GUX-2021-AR-456',
      verificationUrl: 'coursera.org/verify/GUX-2021-AR-456'
    },
    {
      name: 'Adobe Certified Expert - Photoshop',
      issuer: 'Adobe',
      dateObtained: 'Mar 2020',
      status: 'valid',
      credentialId: 'ACE-PS-2020-789'
    }
  ]
};

// Template configuration
const creativeTemplate = {
  id: 'creative',
  name: 'Creative Professional',
  category: 'Design',
  colors: { 
    primary: '#8b5cf6', 
    secondary: '#7c3aed', 
    accent: '#a78bfa',
    success: '#10b981',
    warning: '#f59e0b'
  },
  layout: 'creative',
  description: 'Artistic design perfect for creative industries',
  atsScore: 75
};

function SkillLevel({ level, featured }: SkillLevelProps) {
  const getSkillColor = (level) => {
    switch(level) {
      case 'expert': return 'from-purple-500 to-pink-500';
      case 'advanced': return 'from-blue-500 to-purple-500';
      case 'intermediate': return 'from-green-500 to-blue-500';
      case 'beginner': return 'from-yellow-500 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getSkillWidth = (level) => {
    switch(level) {
      case 'expert': return '100%';
      case 'advanced': return '80%';
      case 'intermediate': return '60%';
      case 'beginner': return '40%';
      default: return '20%';
    }
  };

  return (
    <div className="relative">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getSkillColor(level)} transition-all duration-500`}
          style={{ width: getSkillWidth(level) }}
        />
      </div>
      {featured && <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500 fill-current" />}
    </div>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">{project.title}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{project.type}</span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {project.startDate} - {project.endDate}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {project.liveUrl && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Live project" />
          )}
          {project.githubUrl && (
            <Github className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{project.description}</p>
      
      <div className="space-y-3">
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Technologies</h5>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-md text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {project.metrics && (
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Impact</h5>
            <p className="text-sm text-green-700 font-medium">{project.metrics}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreativeProfessionalTemplate() {
  const [previewMode, setPreviewMode] = useState('desktop');
  
  const resumeData = sampleResumeData;
  const template = creativeTemplate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Creative Professional Template</h1>
                  <p className="text-sm text-gray-600">Perfect for designers, artists & creative professionals</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                template.atsScore >= 80 ? 'bg-green-100 text-green-800' :
                template.atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                ATS Score: {template.atsScore}%
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Preview Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="max-w-5xl mx-auto p-6">
        <div className={`${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            
            {/* Header Section - Creative Gradient */}
            <div className="relative">
              <div 
                className="h-32 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600"
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, #ec4899 100%)`
                }}
              />
              
              {/* Profile Section */}
              <div className="relative px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
                  {/* Avatar Placeholder */}
                  <div className="w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {resumeData.personalInfo.firstName[0]}{resumeData.personalInfo.lastName[0]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Name and Title */}
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                    </h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <h2 className="text-xl text-purple-600 font-semibold">{resumeData.personalInfo.jobTitle}</h2>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {resumeData.personalInfo.yearsExperience} Experience
                      </span>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span>{resumeData.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4 text-purple-500" />
                        <span>{resumeData.personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span>{resumeData.personalInfo.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                        <Globe className="w-4 h-4" />
                        <span>{resumeData.personalInfo.website}</span>
                      </div>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">{resumeData.personalInfo.linkedin}</span>
                      </div>
                      {resumeData.personalInfo.github && (
                        <div className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                          <Github className="w-4 h-4" />
                          <span className="text-sm">{resumeData.personalInfo.github}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="px-8 pb-8 space-y-8">
              
              {/* Professional Summary */}
              <section>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Professional Summary</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-transparent" />
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  {resumeData.personalInfo.summary}
                </p>
              </section>

              {/* Featured Projects */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Featured Projects</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resumeData.projects?.slice(0, 3).map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              </section>

              {/* Skills Section with Visual Bars */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Skills & Expertise</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Featured Skills */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      Core Skills
                    </h4>
                    <div className="space-y-4">
                      {resumeData.skills.filter(skill => skill.featured).map((skill, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{skill.name}</span>
                            <span className="text-sm text-gray-600 capitalize">{skill.level}</span>
                          </div>
                          <SkillLevel level={skill.level as any} featured={skill.featured} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Skills */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Additional Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.filter(skill => !skill.featured).map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Experience */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Experience</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-300 to-transparent" />
                </div>
                
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-md" />
                      {/* Timeline line */}
                      {index < resumeData.experience.length - 1 && (
                        <div className="absolute left-2 top-6 w-px h-full bg-gradient-to-b from-purple-300 to-transparent" />
                      )}
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{exp.title}</h4>
                            <div className="flex items-center space-x-2 text-purple-600">
                              <span className="font-semibold">{exp.company}</span>
                              <span>•</span>
                              <span>{exp.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2 md:mt-0">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                            {exp.current && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Education */}
                <section>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Education</h3>
                  </div>
                  
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                      <div className="text-purple-600 font-semibold">{edu.field}</div>
                      <div className="text-gray-600">{edu.institution}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">{edu.graduationDate}</span>
                        {edu.honors && (
                          <span className="text-sm font-medium text-purple-600">{edu.honors}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Certifications */}
                <section>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900">{cert.name}</h4>
                        <div className="text-green-600 font-semibold">{cert.issuer}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">{cert.dateObtained}</span>
                          {cert.credentialId && (
                            <span className="text-xs text-gray-400">ID: {cert.credentialId}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Creative Design</h3>
              <p className="text-gray-600 text-sm">Visual elements and modern layout that showcases creativity while maintaining professionalism</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Portfolio Focus</h3>
              <p className="text-gray-600 text-sm">Dedicated project showcase section to highlight your creative work and achievements</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ATS Compatible</h3>
              <p className="text-gray-600 text-sm">75% ATS score ensures your resume gets past applicant tracking systems</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-2">Perfect for Creative Professionals</h4>
            <p className="text-gray-700 mb-4">This template is specifically designed for designers, artists, and creative professionals who want to showcase their work while maintaining professional standards. It balances visual appeal with ATS compatibility.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">UI/UX Designers</span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Graphic Designers</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Product Designers</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Creative Directors</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">Brand Designers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}