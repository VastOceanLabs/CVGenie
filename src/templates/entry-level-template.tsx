import React from 'react';
import { GraduationCap, BookOpen, Award, Calendar, MapPin, Mail, Phone, Globe, Linkedin, Star, ChevronRight, Briefcase, Building, Zap, Code } from 'lucide-react';

interface EntryLevelTemplateProps {
  resumeData: {
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
    experience: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
      type?: string;
    }>;
    skills: Array<{
      name: string;
      category: 'technical' | 'soft' | 'tools' | 'certifications';
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      years?: string;
      featured: boolean;
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      dateObtained: string;
      description?: string;
    }>;
    projects?: Array<{
      title: string;
      description: string;
      technologies: string[];
      startDate: string;
      endDate: string;
      githubUrl?: string;
      liveUrl?: string;
    }>;
  };
  template?: {
    id: string;
    name: string;
    colors: { primary: string; secondary: string; accent: string };
  };
}

export default function EntryLevelTemplate({ resumeData, template }: EntryLevelTemplateProps) {
  const colors = template?.colors || { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' };
  
  // Demo data for entry-level candidate
  const demoData = {
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      location: 'Boston, MA',
      linkedin: 'linkedin.com/in/sarah-johnson',
      website: 'github.com/sarahjohnson',
      summary: 'Recent Computer Science graduate with strong foundation in software development and passion for creating user-friendly applications. Experienced in full-stack development through academic projects and internship. Eager to contribute to innovative technology solutions while continuing to learn and grow in a collaborative environment.',
      jobTitle: 'Software Developer',
      yearsExperience: 'Entry Level'
    },
    education: [
      {
        institution: 'Boston University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: 'May 2024',
        gpa: '3.7',
        coursework: 'Data Structures & Algorithms, Software Engineering, Database Systems, Web Development, Mobile App Development, Machine Learning Fundamentals',
        honors: 'Dean\'s List (Fall 2022, Spring 2023), CS Department Scholarship Recipient',
        location: 'Boston, MA',
        current: false,
        type: 'degree'
      }
    ],
    experience: [
      {
        title: 'Software Development Intern',
        company: 'TechStart Solutions',
        location: 'Cambridge, MA',
        startDate: 'June 2023',
        endDate: 'August 2023',
        current: false,
        description: '• Developed responsive web components using React and TypeScript, improving user interface consistency by 40%\n• Collaborated with senior developers to implement REST APIs using Node.js and Express\n• Participated in daily standups and sprint planning, contributing to 3 major feature releases\n• Wrote comprehensive unit tests achieving 85% code coverage using Jest framework'
      },
      {
        title: 'Teaching Assistant - Intro to Programming',
        company: 'Boston University CS Department',
        location: 'Boston, MA',
        startDate: 'September 2022',
        endDate: 'May 2023',
        current: false,
        description: '• Assisted 50+ students with programming concepts in Python and Java\n• Held weekly office hours and graded assignments, maintaining 95% student satisfaction rating\n• Created supplementary learning materials and practice problems\n• Mentored struggling students, helping improve class average by 12%'
      },
      {
        title: 'Volunteer Web Developer',
        company: 'Local Animal Shelter',
        location: 'Boston, MA',
        startDate: 'January 2022',
        endDate: 'Present',
        current: true,
        description: '• Redesigned shelter website using WordPress, increasing online adoption inquiries by 60%\n• Implemented donation tracking system and volunteer scheduling portal\n• Provide ongoing maintenance and content updates\n• Trained staff on content management and basic website updates'
      }
    ],
    skills: [
      { name: 'JavaScript', category: 'technical', level: 'intermediate', featured: true },
      { name: 'Python', category: 'technical', level: 'advanced', featured: true },
      { name: 'React', category: 'technical', level: 'intermediate', featured: true },
      { name: 'Node.js', category: 'technical', level: 'beginner', featured: false },
      { name: 'SQL', category: 'technical', level: 'intermediate', featured: true },
      { name: 'Git/GitHub', category: 'tools', level: 'intermediate', featured: true },
      { name: 'HTML/CSS', category: 'technical', level: 'advanced', featured: false },
      { name: 'MongoDB', category: 'technical', level: 'beginner', featured: false },
      { name: 'Problem Solving', category: 'soft', level: 'advanced', featured: true },
      { name: 'Team Collaboration', category: 'soft', level: 'advanced', featured: true },
      { name: 'Communication', category: 'soft', level: 'intermediate', featured: false },
      { name: 'Time Management', category: 'soft', level: 'advanced', featured: false },
      { name: 'VS Code', category: 'tools', level: 'advanced', featured: false },
      { name: 'Figma', category: 'tools', level: 'beginner', featured: false },
      { name: 'Jira', category: 'tools', level: 'beginner', featured: false }
    ],
    projects: [
      {
        title: 'Task Management Web App',
        description: 'Full-stack web application for personal productivity with user authentication, task categorization, and deadline tracking. Implemented drag-and-drop functionality and real-time updates.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'JWT'],
        startDate: 'September 2023',
        endDate: 'December 2023',
        githubUrl: 'github.com/sarahjohnson/task-manager',
        liveUrl: 'taskmanager-sarah.netlify.app'
      },
      {
        title: 'Weather Forecast Mobile App',
        description: 'React Native mobile application providing detailed weather forecasts with location-based services and offline data caching. Integrated with OpenWeather API.',
        technologies: ['React Native', 'Expo', 'REST APIs', 'AsyncStorage'],
        startDate: 'March 2023',
        endDate: 'May 2023',
        githubUrl: 'github.com/sarahjohnson/weather-app'
      },
      {
        title: 'Student Grade Tracker',
        description: 'Python desktop application for tracking academic performance with data visualization and GPA calculation. Designed for student self-assessment and goal setting.',
        technologies: ['Python', 'Tkinter', 'Pandas', 'Matplotlib'],
        startDate: 'October 2022',
        endDate: 'December 2022',
        githubUrl: 'github.com/sarahjohnson/grade-tracker'
      }
    ],
    certifications: [
      {
        name: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        dateObtained: 'March 2024',
        description: 'Foundational cloud computing certification'
      },
      {
        name: 'Google Analytics Certified',
        issuer: 'Google',
        dateObtained: 'February 2024',
        description: 'Web analytics and data interpretation'
      },
      {
        name: 'freeCodeCamp Responsive Web Design',
        issuer: 'freeCodeCamp',
        dateObtained: 'August 2023',
        description: 'HTML, CSS, and responsive design principles'
      }
    ]
  };
  
  // Use demo data if no real data is provided
  const currentData = resumeData || demoData;
  
  // Helper function to format dates
  const formatDate = (date: string) => {
    if (!date) return '';
    // Handle various date formats
    if (date.toLowerCase().includes('present') || date.toLowerCase().includes('current')) {
      return 'Present';
    }
    return date;
  };

  // Group skills by category for better organization
  const groupedSkills = (currentData?.skills || []).reduce((acc, skill) => {
    const category = skill.category || 'technical';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill as any);
    return acc;
  }, {} as Record<string, typeof currentData.skills>);

  // Sort education by date (most recent first)
  const sortedEducation = (currentData?.education || []).sort((a, b) => {
    if (a.current) return -1;
    if (b.current) return 1;
    return new Date(b.graduationDate || '').getTime() - new Date(a.graduationDate || '').getTime();
  });

  // Separate internships/part-time from full-time experience
  const relevantExperience = (currentData?.experience || []).filter(exp => exp.title && exp.company);

  return (
    <div className="max-w-4xl mx-auto bg-white" style={{ fontFamily: 'Georgia, Times, serif' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-8 border-b-2" style={{ borderColor: colors.primary }}>
        <div className="text-center">
          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide">
            {currentData?.personalInfo?.firstName || 'Your'} {currentData?.personalInfo?.lastName || 'Name'}
          </h1>
          
          {/* Professional Title / Objective */}
          {currentData?.personalInfo?.jobTitle && (
            <h2 className="text-xl text-gray-700 mb-3 font-medium">
              {currentData.personalInfo.jobTitle}
            </h2>
          )}
          
          {/* Contact Information */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 text-sm">
            {currentData?.personalInfo?.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{currentData.personalInfo.email}</span>
              </div>
            )}
            {currentData?.personalInfo?.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{currentData.personalInfo.phone}</span>
              </div>
            )}
            {currentData?.personalInfo?.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{currentData.personalInfo.location}</span>
              </div>
            )}
            {currentData?.personalInfo?.linkedin && (
              <div className="flex items-center space-x-1">
                <Linkedin className="w-4 h-4" />
                <span className="text-blue-600">{currentData.personalInfo.linkedin}</span>
              </div>
            )}
            {currentData?.personalInfo?.website && (
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span className="text-blue-600">{currentData.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Professional Summary / Objective */}
        {currentData?.personalInfo?.summary && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 flex items-center" style={{ borderColor: colors.primary }}>
              <Star className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
              OBJECTIVE
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {currentData.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Education Section - Prominent for entry-level */}
        {sortedEducation.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 flex items-center" style={{ borderColor: colors.primary }}>
              <GraduationCap className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
              EDUCATION
            </h2>
            <div className="space-y-4">
              {sortedEducation.map((edu, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <div className="text-gray-700 font-medium flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </div>
                    </div>
                    <div className="text-right text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {edu.current ? 'Expected ' : ''}{formatDate(edu.graduationDate)}
                      </div>
                      {edu.gpa && parseFloat(edu.gpa) >= 3.5 && (
                        <div className="font-medium text-green-700 mt-1">
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Education Details */}
                  <div className="ml-5 space-y-1 text-sm text-gray-600">
                    {edu.honors && (
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-2 text-yellow-600" />
                        <span className="font-medium">Honors: </span>{edu.honors}
                      </div>
                    )}
                    {edu.coursework && (
                      <div className="flex items-start">
                        <BookOpen className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                        <div>
                          <span className="font-medium">Relevant Coursework: </span>
                          {edu.coursework}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section - Prominent for entry-level */}
        {Object.keys(groupedSkills).length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 flex items-center" style={{ borderColor: colors.primary }}>
              <Zap className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
              TECHNICAL SKILLS & COMPETENCIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2 capitalize text-sm uppercase tracking-wide">
                    {category === 'soft' ? 'Soft Skills' : category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 transition-colors"
                      >
                        {skill.name}
                        {skill.level && skill.level !== 'intermediate' && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({skill.level})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section - Including internships, part-time, volunteer */}
        {relevantExperience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 flex items-center" style={{ borderColor: colors.primary }}>
              <Briefcase className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
              EXPERIENCE
            </h2>
            <div className="space-y-4">
              {relevantExperience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                      <div className="text-gray-700 font-medium flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </div>
                    </div>
                    <div className="text-right text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <div className="ml-5 text-gray-700 leading-relaxed">
                      {exp.description.split('\n').map((line, lineIndex) => (
                        <div key={lineIndex} className="flex items-start mb-1">
                          {line.trim().startsWith('•') ? (
                            <>
                              <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                              <span>{line.replace('•', '').trim()}</span>
                            </>
                          ) : line.trim() ? (
                            <span className="block">{line}</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section - Important for students */}
        {currentData?.projects && currentData.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 flex items-center" style={{ borderColor: colors.primary }}>
              <Code className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
              ACADEMIC & PERSONAL PROJECTS
            </h2>
            <div className="space-y-4">
              {currentData.projects.slice(0, 3).map((project, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <div className="text-sm text-gray-600">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium text-gray-800 text-sm">Technologies: </span>
                      <span className="text-gray-600 text-sm">{project.technologies.join(', ')}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 text-sm">
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="text-blue-600 hover:text-blue-700">
                        GitHub Repository
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} className="text-blue-600 hover:text-blue-700">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {currentData?.certifications && currentData.certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 flex items-center" style={{ borderColor: colors.primary }}>
              <Award className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
              CERTIFICATIONS & ACHIEVEMENTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentData.certifications.map((cert, index) => (
                <div key={index} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3">
                  <Award className="w-4 h-4 mt-1 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                    <div className="text-gray-700 text-sm">{cert.issuer}</div>
                    <div className="text-gray-600 text-xs">{formatDate(cert.dateObtained)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-50 text-center text-xs text-gray-500 border-t">
        References available upon request
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .max-w-4xl {
            max-width: none !important;
            margin: 0 !important;
          }
          
          .px-8 {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .py-8 {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          
          .space-y-6 > * + * {
            margin-top: 1rem !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 0.75rem !important;
          }
          
          .bg-gradient-to-r {
            background: #f8fafc !important;
          }
          
          .bg-gray-50 {
            background: #fafafa !important;
          }
          
          section {
            break-inside: avoid;
          }
          
          h2 {
            break-after: avoid;
          }
          
          .relative {
            break-inside: avoid;
          }
        }
        
        @page {
          margin: 0.5in;
          size: letter;
        }
      `}</style>
    </div>
  );
}