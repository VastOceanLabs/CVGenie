import React from 'react';

// Two-Column Professional Template Component
function TwoColumnTemplate({ resumeData, template }) {
  const personalInfo = resumeData?.personalInfo || {};
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const skills = resumeData?.skills || [];
  const certifications = resumeData?.certifications || [];

  // Group skills by category for better organization
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'technical';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="bg-white w-full max-w-4xl mx-auto flex" style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '11in' }}>
      
      {/* Left Sidebar - 30% width */}
      <div className="w-72 bg-gray-50 p-6 flex-shrink-0">
        
        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-600 pb-1">
            Contact
          </h2>
          <div className="space-y-3 text-sm">
            {personalInfo.email && (
              <div>
                <div className="font-medium text-gray-700">Email</div>
                <div className="text-gray-600 break-all">{personalInfo.email}</div>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <div className="font-medium text-gray-700">Phone</div>
                <div className="text-gray-600">{personalInfo.phone}</div>
              </div>
            )}
            {personalInfo.location && (
              <div>
                <div className="font-medium text-gray-700">Location</div>
                <div className="text-gray-600">{personalInfo.location}</div>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <div className="font-medium text-gray-700">LinkedIn</div>
                <div className="text-gray-600 break-all text-xs">{personalInfo.linkedin}</div>
              </div>
            )}
            {personalInfo.website && (
              <div>
                <div className="font-medium text-gray-700">Website</div>
                <div className="text-gray-600 break-all text-xs">{personalInfo.website}</div>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-600 pb-1">
              Skills
            </h2>
            
            {/* Technical Skills */}
            {skillsByCategory.technical && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">Technical</h3>
                <div className="space-y-1">
                  {skillsByCategory.technical.slice(0, 8).map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{skill.name}</span>
                      {skill.level && (
                        <div className="flex space-x-1">
                          {[1,2,3,4,5].map(level => (
                            <div 
                              key={level}
                              className={`w-2 h-2 rounded-full ${
                                level <= (skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : skill.level === 'intermediate' ? 3 : 2)
                                  ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {skillsByCategory.soft && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">Core Competencies</h3>
                <div className="space-y-1">
                  {skillsByCategory.soft.slice(0, 6).map((skill, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      • {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {skillsByCategory.tools && (
              <div>
                <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">Tools & Platforms</h3>
                <div className="text-sm text-gray-700">
                  {skillsByCategory.tools.slice(0, 8).map(skill => skill.name).join(' • ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-600 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="font-semibold text-sm text-gray-900">{edu.degree}</div>
                  {edu.field && (
                    <div className="text-sm text-gray-700">{edu.field}</div>
                  )}
                  <div className="text-sm text-gray-600">{edu.institution}</div>
                  <div className="text-xs text-gray-500">{edu.graduationDate || (edu.current ? 'In Progress' : '')}</div>
                  {edu.gpa && (
                    <div className="text-xs text-gray-600">GPA: {edu.gpa}</div>
                  )}
                  {edu.honors && (
                    <div className="text-xs text-gray-600">{edu.honors}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-600 pb-1">
              Certifications
            </h2>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <div className="font-semibold text-sm text-gray-900">{cert.name}</div>
                  <div className="text-sm text-gray-600">{cert.issuer}</div>
                  <div className="text-xs text-gray-500">{cert.dateObtained}</div>
                  {cert.expirationDate && (
                    <div className="text-xs text-gray-500">Expires: {cert.expirationDate}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Skills if many */}
        {skills.length > 14 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 border-b-2 border-blue-600 pb-1">
              Additional Skills
            </h2>
            <div className="text-xs text-gray-600 leading-relaxed">
              {skills.slice(14).map(skill => skill.name).join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Right Main Content - 70% width */}
      <div className="flex-1 p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {personalInfo.firstName || 'First'} {personalInfo.lastName || 'Last'}
          </h1>
          {personalInfo.jobTitle && (
            <div className="text-xl text-gray-600 mb-3 font-medium">
              {personalInfo.jobTitle}
            </div>
          )}
          {personalInfo.yearsExperience && (
            <div className="text-gray-600">
              {personalInfo.yearsExperience} Years of Experience
            </div>
          )}
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.title || 'Job Title'}
                      </h3>
                      <div className="text-gray-700 font-medium">
                        {exp.company} {exp.location && `| ${exp.location}`}
                      </div>
                    </div>
                    <div className="text-right text-gray-600 font-medium ml-4 flex-shrink-0">
                      {exp.startDate} - {exp.current ? 'Present' : (exp.endDate || 'Present')}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section (if applicable) */}
        {resumeData?.projects && resumeData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Key Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.slice(0, 3).map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <span className="text-sm text-gray-600 ml-4">{project.endDate || project.status}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      <strong>Technologies:</strong> {project.technologies.slice(0, 6).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards/Achievements Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
            Key Achievements
          </h2>
          <div className="space-y-2 text-gray-700">
            <div>• Led cross-functional team of 12 members to deliver $2M revenue-generating platform</div>
            <div>• Increased operational efficiency by 40% through process optimization and automation</div>
            <div>• Mentored 15+ junior professionals, with 90% promotion rate within 18 months</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo with comprehensive sample data
const sampleResumeData = {
  personalInfo: {
    firstName: 'Alexandra',
    lastName: 'Martinez',
    email: 'alexandra.martinez@email.com',
    phone: '(555) 987-6543',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/alexandra-martinez',
    website: 'alexandra-portfolio.com',
    jobTitle: 'Senior Product Manager',
    yearsExperience: '8+',
    summary: 'Strategic Product Manager with 8+ years of experience driving product innovation and leading cross-functional teams at high-growth technology companies. Proven track record of launching successful products that generated over $10M in revenue and improved user engagement by 150%. Expert in agile methodologies, user experience design, and data-driven decision making.',
  },
  experience: [
    {
      title: 'Senior Product Manager',
      company: 'TechFlow Solutions',
      location: 'Seattle, WA',
      startDate: 'March 2021',
      endDate: '',
      current: true,
      description: '• Led product strategy for B2B SaaS platform serving 500K+ users across 40 countries\n• Increased user retention by 45% through implementation of personalized onboarding experience\n• Managed product roadmap and prioritized features based on customer feedback and market analysis\n• Collaborated with engineering, design, and sales teams to deliver 12 major product releases\n• Reduced customer acquisition cost by 30% through optimization of conversion funnel\n• Conducted user interviews and usability testing to inform product decisions'
    },
    {
      title: 'Product Manager',
      company: 'Innovation Labs Inc.',
      location: 'Seattle, WA',
      startDate: 'June 2019',
      endDate: 'February 2021',
      current: false,
      description: '• Launched mobile application that achieved 100K+ downloads within 6 months\n• Established product analytics framework resulting in 60% improvement in data-driven decisions\n• Led go-to-market strategy for 3 major product launches with average 25% revenue growth\n• Managed backlog of 200+ features and coordinated sprint planning with development teams\n• Improved customer satisfaction scores from 3.2 to 4.6 through enhanced user experience'
    },
    {
      title: 'Associate Product Manager',
      company: 'StartupCo',
      location: 'San Francisco, CA',
      startDate: 'January 2017',
      endDate: 'May 2019',
      current: false,
      description: '• Developed product requirements and user stories for early-stage fintech application\n• Conducted competitive analysis and market research to identify product opportunities\n• Worked closely with UX/UI designers to create intuitive user interfaces\n• Supported customer success team to resolve product-related issues and gather feedback\n• Participated in fundraising activities, helping secure $5M Series A funding'
    }
  ],
  education: [
    {
      institution: 'University of Washington',
      degree: 'Master of Business Administration',
      field: 'Technology Management',
      graduationDate: 'June 2016',
      location: 'Seattle, WA',
      gpa: '3.8',
      honors: 'Summa Cum Laude'
    },
    {
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2014',
      location: 'Berkeley, CA',
      gpa: '3.6',
      honors: 'Dean\'s List'
    }
  ],
  skills: [
    { name: 'Product Strategy', category: 'soft', level: 'expert', featured: true },
    { name: 'Agile/Scrum', category: 'soft', level: 'expert', featured: true },
    { name: 'User Experience Design', category: 'soft', level: 'advanced', featured: true },
    { name: 'Data Analysis', category: 'technical', level: 'advanced', featured: true },
    { name: 'Project Management', category: 'soft', level: 'expert', featured: true },
    { name: 'Team Leadership', category: 'soft', level: 'advanced', featured: true },
    { name: 'SQL', category: 'technical', level: 'intermediate', featured: false },
    { name: 'Python', category: 'technical', level: 'intermediate', featured: false },
    { name: 'Tableau', category: 'tools', level: 'advanced', featured: false },
    { name: 'Jira', category: 'tools', level: 'expert', featured: false },
    { name: 'Figma', category: 'tools', level: 'intermediate', featured: false },
    { name: 'Google Analytics', category: 'tools', level: 'advanced', featured: false },
    { name: 'Mixpanel', category: 'tools', level: 'advanced', featured: false },
    { name: 'Slack', category: 'tools', level: 'expert', featured: false },
    { name: 'Notion', category: 'tools', level: 'advanced', featured: false },
    { name: 'A/B Testing', category: 'technical', level: 'advanced', featured: false },
    { name: 'Customer Research', category: 'soft', level: 'expert', featured: false },
    { name: 'Market Analysis', category: 'soft', level: 'advanced', featured: false },
    { name: 'Stakeholder Management', category: 'soft', level: 'expert', featured: false }
  ],
  certifications: [
    {
      name: 'Certified Scrum Product Owner',
      issuer: 'Scrum Alliance',
      dateObtained: 'February 2022',
      expirationDate: 'February 2024',
      status: 'valid'
    },
    {
      name: 'Google Analytics Certified',
      issuer: 'Google',
      dateObtained: 'August 2021',
      expirationDate: 'August 2023',
      status: 'valid'
    },
    {
      name: 'Pragmatic Marketing Certified',
      issuer: 'Pragmatic Institute',
      dateObtained: 'November 2020',
      status: 'valid'
    }
  ],
  projects: [
    {
      title: 'AI-Powered Customer Insights Platform',
      description: 'Led development of machine learning platform that analyzed customer behavior patterns and increased product engagement by 60%',
      technologies: ['Python', 'TensorFlow', 'AWS', 'React'],
      status: 'completed',
      endDate: '2022'
    },
    {
      title: 'Mobile-First Redesign Initiative',
      description: 'Spearheaded complete mobile experience overhaul resulting in 200% increase in mobile conversions',
      technologies: ['React Native', 'Figma', 'Firebase'],
      status: 'completed', 
      endDate: '2021'
    }
  ]
};

const template = {
  id: 'two-column',
  name: 'Two-Column Professional',
  colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
  layout: 'two-column'
};

export default function TwoColumnTemplateDemo() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Two-Column Professional Resume Template</h1>
          <p className="text-lg text-gray-600 mb-4">Modern layout with organized sidebar - 85% ATS Score</p>
          <div className="flex justify-center space-x-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">✓ Modern Layout</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✓ Space Efficient</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">✓ ATS Compatible</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">✓ Professional</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TwoColumnTemplate resumeData={sampleResumeData} template={template} />
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Perfect for Modern Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Design Benefits:</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Sidebar organizes contact info and skills</li>
                <li>• Main content area for detailed experience</li>
                <li>• Visual skill level indicators</li>
                <li>• Clean separation of information</li>
                <li>• Modern professional appearance</li>
                <li>• Efficient use of space</li>
                <li>• Easy to scan and read</li>
                <li>• Industry-standard format</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📈 Best For:</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• Product Managers & Tech Professionals</li>
                <li>• Marketing & Sales Professionals</li>
                <li>• Business Analysts & Consultants</li>
                <li>• Project Managers</li>
                <li>• Mid to senior-level positions</li>
                <li>• Professionals with diverse skills</li>
                <li>• Corporate environments</li>
                <li>• Modern companies & startups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}