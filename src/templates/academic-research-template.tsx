import React, { useState } from 'react';
import { GraduationCap, BookOpen, Award, Users, FlaskConical, FileText, MapPin, Mail, Phone, Globe, Linkedin, Download, Eye, EyeOff } from 'lucide-react';

// Sample academic resume data
const sampleResumeData = {
  personalInfo: {
    firstName: 'Dr. Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@university.edu',
    phone: '(555) 123-4567',
    location: 'Boston, MA',
    linkedin: 'linkedin.com/in/dr-sarah-chen',
    website: 'sarahchen-research.com',
    summary: 'Accomplished computational biologist with 8+ years of research experience in machine learning applications for genomics. Published 15+ peer-reviewed papers in high-impact journals. Expertise in developing novel algorithms for large-scale genomic data analysis and mentoring graduate students in interdisciplinary research.',
    jobTitle: 'Assistant Professor of Computational Biology',
    yearsExperience: '8'
  },
  education: [
    {
      institution: 'Harvard University',
      degree: 'Ph.D.',
      field: 'Computational Biology',
      graduationDate: '2018',
      gpa: '3.9',
      location: 'Cambridge, MA',
      honors: 'Summa Cum Laude, Dean&apos;s Fellowship',
      thesis: 'Machine Learning Approaches for Predicting Gene Expression in Single-Cell RNA Sequencing Data'
    },
    {
      institution: 'MIT',
      degree: 'M.S.',
      field: 'Computer Science',
      graduationDate: '2014',
      gpa: '3.8',
      location: 'Cambridge, MA',
      honors: 'Graduate Research Fellowship'
    },
    {
      institution: 'Stanford University',
      degree: 'B.S.',
      field: 'Bioengineering',
      graduationDate: '2012',
      gpa: '3.7',
      location: 'Stanford, CA',
      honors: 'Phi Beta Kappa, Tau Beta Pi'
    }
  ],
  experience: [
    {
      title: 'Assistant Professor',
      company: 'Boston University School of Medicine',
      location: 'Boston, MA',
      startDate: 'September 2019',
      endDate: '',
      current: true,
      description: '• Lead independent research program in computational genomics with $2.1M in federal funding\n• Developed novel machine learning algorithms resulting in 3 Nature/Science publications\n• Mentor 6 graduate students and 12 undergraduate researchers\n• Teach graduate-level courses in Bioinformatics and Machine Learning (average rating: 4.8/5.0)\n• Serve on NIH study sections and editorial boards of 2 journals'
    },
    {
      title: 'Postdoctoral Research Fellow',
      company: 'Broad Institute of MIT and Harvard',
      location: 'Cambridge, MA',
      startDate: 'July 2018',
      endDate: 'August 2019',
      current: false,
      description: '• Conducted cutting-edge research in single-cell genomics under Dr. Aviv Regev\n• Developed computational methods for cell type identification published in Cell\n• Collaborated with 15+ international research groups on large-scale genomics projects\n• Presented research at 8 international conferences including ISMB and RECOMB'
    }
  ],
  publications: [
    {
      title: 'Deep learning reveals cell-type-specific gene regulatory networks in human brain development',
      authors: 'Chen, S., Martinez, R., Thompson, K., Davis, L.',
      journal: 'Nature Neuroscience',
      year: '2023',
      volume: '40',
      pages: '1234-1245',
      citations: 47,
      type: 'peer-reviewed'
    },
    {
      title: 'Machine learning approaches for predicting drug response in cancer cell lines',
      authors: 'Chen, S., Brown, A., Wilson, M.',
      journal: 'Cell',
      year: '2022',
      volume: '185',
      pages: '456-470',
      citations: 92,
      type: 'peer-reviewed'
    },
    {
      title: 'Computational methods for single-cell RNA sequencing analysis: A comprehensive review',
      authors: 'Chen, S., Rodriguez, P.',
      journal: 'Nature Reviews Genetics',
      year: '2021',
      volume: '22',
      pages: '789-805',
      citations: 156,
      type: 'review'
    }
  ],
  conferences: [
    {
      title: 'Novel approaches for cell type identification in single-cell data',
      conference: 'International Conference on Machine Learning (ICML)',
      location: 'Baltimore, MD',
      date: 'July 2023',
      type: 'Invited Talk'
    },
    {
      title: 'Deep learning for genomics: Applications and challenges',
      conference: 'American Society of Human Genetics (ASHG)',
      location: 'Los Angeles, CA',
      date: 'October 2022',
      type: 'Oral Presentation'
    }
  ],
  grants: [
    {
      title: 'Machine Learning for Precision Medicine in Neurological Disorders',
      agency: 'National Institutes of Health (NIH) - R01',
      amount: '$1,250,000',
      period: '2021-2026',
      role: 'Principal Investigator'
    },
    {
      title: 'Computational Methods for Single-Cell Analysis',
      agency: 'National Science Foundation (NSF) - CAREER',
      amount: '$875,000',
      period: '2020-2025',
      role: 'Principal Investigator'
    }
  ],
  awards: [
    {
      name: 'Early Career Investigator Award',
      organization: 'International Society for Computational Biology',
      year: '2023'
    },
    {
      name: 'Excellence in Teaching Award',
      organization: 'Boston University School of Medicine',
      year: '2022'
    }
  ],
  skills: [
    { name: 'Python', category: 'technical', level: 'expert' },
    { name: 'R/Bioconductor', category: 'technical', level: 'expert' },
    { name: 'Machine Learning', category: 'technical', level: 'expert' },
    { name: 'TensorFlow/PyTorch', category: 'technical', level: 'advanced' },
    { name: 'Single-cell RNA-seq', category: 'technical', level: 'expert' },
    { name: 'Grant Writing', category: 'soft', level: 'advanced' },
    { name: 'Scientific Writing', category: 'soft', level: 'expert' },
    { name: 'Mentoring', category: 'soft', level: 'advanced' }
  ]
};

// Academic template configuration
const academicTemplate = {
  id: 'academic',
  name: 'Academic/Research',
  category: 'Academic',
  colors: { 
    primary: '#1e40af', 
    secondary: '#1e3a8a', 
    accent: '#3b82f6' 
  },
  layout: 'academic',
  description: 'Professional template designed for academics, researchers, and PhD candidates',
  atsScore: 92
};

function AcademicResumeTemplate() {
  const [activeSection, setActiveSection] = useState('all');
  const [showPreview, setShowPreview] = useState(true);

  const sections = [
    { id: 'all', label: 'Full Resume', icon: FileText },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'research', label: 'Research', icon: FlaskConical },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'grants', label: 'Grants', icon: Award },
    { id: 'teaching', label: 'Teaching', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="w-8 h-8 mr-3 text-blue-600" />
                Academic/Research Resume Template
              </h1>
              <p className="text-gray-600 mt-2">
                Professional template for professors, researchers, PhD candidates, and academic professionals
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  92% ATS Score
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Academic Format
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Publication Ready
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resume Sections</h3>
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Template Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Publications section with citations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Research experience emphasis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Grants & funding display
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Conference presentations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Teaching experience section
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Academic honors & awards
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        {showPreview && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Resume Preview</h3>
                  <span className="text-sm text-gray-500">Academic Format • {academicTemplate.atsScore}% ATS Score</span>
                </div>
              </div>

              {/* Resume Content */}
              <div className="p-8 bg-white" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>
                {/* Header */}
                <div className="text-center border-b-2 border-blue-800 pb-6 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {sampleResumeData.personalInfo.firstName} {sampleResumeData.personalInfo.lastName}
                  </h1>
                  <h2 className="text-xl text-blue-800 mb-3 font-semibold">
                    {sampleResumeData.personalInfo.jobTitle}
                  </h2>
                  <div className="flex justify-center items-center space-x-6 text-gray-700">
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {sampleResumeData.personalInfo.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {sampleResumeData.personalInfo.phone}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {sampleResumeData.personalInfo.location}
                    </span>
                  </div>
                  <div className="flex justify-center items-center space-x-6 text-gray-700 mt-2">
                    <span className="flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {sampleResumeData.personalInfo.website}
                    </span>
                    <span className="flex items-center">
                      <Linkedin className="w-4 h-4 mr-1" />
                      {sampleResumeData.personalInfo.linkedin}
                    </span>
                  </div>
                </div>

                {/* Research Summary */}
                {(activeSection === 'all' || activeSection === 'research') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      RESEARCH SUMMARY
                    </h3>
                    <p className="text-gray-800 leading-relaxed">
                      {sampleResumeData.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Education */}
                {(activeSection === 'all' || activeSection === 'education') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      EDUCATION
                    </h3>
                    <div className="space-y-4">
                      {sampleResumeData.education.map((edu, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {edu.degree} in {edu.field}
                              </h4>
                              <p className="text-gray-700 italic">{edu.institution}, {edu.location}</p>
                              {edu.thesis && (
                                <p className="text-gray-600 text-sm mt-1">
                                  <span className="font-medium">Dissertation:</span> {edu.thesis}
                                </p>
                              )}
                              {edu.honors && (
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Honors:</span> {edu.honors}
                                </p>
                              )}
                            </div>
                            <span className="text-gray-600 font-medium">{edu.graduationDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Research Experience */}
                {(activeSection === 'all' || activeSection === 'research') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      RESEARCH EXPERIENCE
                    </h3>
                    <div className="space-y-4">
                      {sampleResumeData.experience.map((exp, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                              <p className="text-gray-700 italic">{exp.company}, {exp.location}</p>
                            </div>
                            <span className="text-gray-600 font-medium">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <div className="text-gray-700 text-sm">
                            {exp.description.split('\n').map((line, lineIndex) => (
                              <p key={lineIndex} className="mb-1">{line}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications */}
                {(activeSection === 'all' || activeSection === 'publications') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      PUBLICATIONS
                    </h3>
                    <div className="space-y-3">
                      {sampleResumeData.publications.map((pub, index) => (
                        <div key={index} className="text-sm">
                          <p className="text-gray-800">
                            <span className="font-medium">{pub.authors}</span> ({pub.year}). 
                            &quot;{pub.title}&quot; <span className="italic">{pub.journal}</span>, 
                            {pub.volume}({pub.pages}). 
                            <span className="text-gray-600 ml-2">Citations: {pub.citations}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grants & Funding */}
                {(activeSection === 'all' || activeSection === 'grants') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      GRANTS & FUNDING
                    </h3>
                    <div className="space-y-3">
                      {sampleResumeData.grants.map((grant, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">&quot;{grant.title}&quot;</h4>
                              <p className="text-gray-700">{grant.agency}</p>
                              <p className="text-gray-600 text-sm">Role: {grant.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">{grant.amount}</p>
                              <p className="text-gray-600 text-sm">{grant.period}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conference Presentations */}
                {(activeSection === 'all' || activeSection === 'teaching') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      SELECTED PRESENTATIONS
                    </h3>
                    <div className="space-y-3">
                      {sampleResumeData.conferences.map((conf, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">&quot;{conf.title}&quot;</h4>
                              <p className="text-gray-700 italic">{conf.conference}</p>
                              <p className="text-gray-600 text-sm">{conf.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 text-sm">{conf.date}</p>
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {conf.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards & Honors */}
                {(activeSection === 'all' || activeSection === 'grants') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      AWARDS & HONORS
                    </h3>
                    <div className="space-y-2">
                      {sampleResumeData.awards.map((award, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{award.name}</h4>
                            <p className="text-gray-700 text-sm">{award.organization}</p>
                          </div>
                          <span className="text-gray-600 font-medium">{award.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Skills */}
                {(activeSection === 'all') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 border-b border-gray-300 pb-1">
                      TECHNICAL SKILLS
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Programming & Software:</h4>
                        <p className="text-gray-700 text-sm">
                          {sampleResumeData.skills
                            .filter(skill => skill.category === 'technical')
                            .map(skill => skill.name)
                            .join(', ')}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Professional Skills:</h4>
                        <p className="text-gray-700 text-sm">
                          {sampleResumeData.skills
                            .filter(skill => skill.category === 'soft')
                            .map(skill => skill.name)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            How to Use This Academic Template
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Perfect For:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• PhD candidates seeking academic positions</li>
                <li>• Postdocs applying for faculty roles</li>
                <li>• Researchers in academia or industry</li>
                <li>• Professors seeking new positions</li>
                <li>• Graduate students applying for fellowships</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Key Customizations:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Add your publications in proper citation format</li>
                <li>• List grants with funding amounts and your role</li>
                <li>• Include conference presentations and talks</li>
                <li>• Highlight teaching experience and mentoring</li>
                <li>• Emphasize research impact and citations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicResumeTemplate;