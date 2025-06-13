import React, { useState } from 'react';
import { 
  Shield, 
  Flag, 
  Award, 
  Users, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Building,
  User
} from 'lucide-react';

// Sample federal resume data
const sampleFederalData = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@email.gov',
    phone: '(555) 123-4567',
    address: '1234 Constitution Ave NW',
    city: 'Washington',
    state: 'DC',
    zipCode: '20001',
    citizenship: 'U.S. Citizen',
    veteranStatus: 'Non-Veteran',
    ssn: 'XXX-XX-1234' // Last 4 digits only
  },
  securityClearance: {
    level: 'Secret',
    status: 'Active',
    issuingAgency: 'Department of Defense',
    lastInvestigation: '2021',
    polygraph: 'None'
  },
  objective: 'Seeking a challenging GS-13 Program Analyst position with the Department of Health and Human Services to leverage 8+ years of federal experience in program management, policy analysis, and stakeholder coordination to support mission-critical initiatives.',
  experience: [
    {
      title: 'Program Analyst',
      agency: 'Department of Veterans Affairs',
      office: 'Office of Policy and Planning',
      location: 'Washington, DC',
      startDate: 'January 2019',
      endDate: 'Present',
      hoursPerWeek: '40',
      payPlan: 'GS',
      series: '0343',
      grade: '12',
      salary: '$86,335',
      supervisor: 'Dr. James Anderson, (555) 987-6543, james.anderson@va.gov',
      description: 'Lead comprehensive program evaluations and policy analysis for veterans\' healthcare initiatives serving 500,000+ beneficiaries annually. Collaborate with cross-functional teams of 15+ stakeholders across multiple VA medical centers.\n\n• Analyzed federal healthcare policies and prepared 25+ detailed reports for senior leadership, resulting in $2.3M cost savings through process improvements\n• Managed implementation of new patient care protocols across 12 VA facilities, ensuring 100% compliance with federal regulations\n• Coordinated with congressional staff and external agencies on 8 legislative initiatives, providing technical expertise and policy recommendations\n• Developed and maintained program databases tracking performance metrics for 15 different healthcare programs\n• Conducted comprehensive reviews of federal grant applications, evaluating $45M+ in proposed funding requests\n• Presented findings to executive leadership including the Under Secretary for Health and agency directors'
    },
    {
      title: 'Management Analyst',
      agency: 'Department of Health and Human Services',
      office: 'Centers for Disease Control and Prevention',
      location: 'Atlanta, GA',
      startDate: 'June 2016',
      endDate: 'December 2018',
      hoursPerWeek: '40',
      payPlan: 'GS',
      series: '0343',
      grade: '11',
      salary: '$72,188',
      supervisor: 'Maria Rodriguez, (404) 555-7890, maria.rodriguez@cdc.gov',
      description: 'Provided analytical support for public health programs and emergency preparedness initiatives affecting nationwide disease surveillance and prevention efforts.\n\n• Evaluated program effectiveness for 6 major CDC health initiatives with combined budget of $125M annually\n• Prepared comprehensive briefing materials for Congress and senior CDC officials on emerging health threats\n• Coordinated multi-state response efforts during 3 public health emergencies, ensuring federal coordination protocols\n• Maintained federal databases containing sensitive health surveillance data for 50 states and territories\n• Developed standard operating procedures adopted across 10 CDC program offices\n• Collaborated with state and local health departments on federal funding compliance requirements'
    }
  ],
  education: [
    {
      institution: 'Georgetown University',
      degree: 'Master of Public Administration',
      field: 'Public Policy and Administration',
      location: 'Washington, DC',
      graduationDate: 'May 2016',
      gpa: '3.78',
      coursework: 'Federal Budget Analysis, Public Program Evaluation, Administrative Law, Ethics in Government, Policy Analysis Methods',
      honors: 'Dean\'s List (3 semesters), Graduate Research Assistant'
    },
    {
      institution: 'University of Maryland',
      degree: 'Bachelor of Arts',
      field: 'Political Science',
      location: 'College Park, MD',
      graduationDate: 'May 2014',
      gpa: '3.65',
      coursework: 'American Government, Public Administration, Research Methods, Statistics, Constitutional Law',
      honors: 'Magna Cum Laude, Phi Beta Kappa Honor Society'
    }
  ],
  skills: [
    { name: 'Federal Acquisition Regulation (FAR)', level: 'Expert', years: '5+' },
    { name: 'Program Evaluation', level: 'Expert', years: '8+' },
    { name: 'Policy Analysis', level: 'Expert', years: '7+' },
    { name: 'Congressional Relations', level: 'Advanced', years: '4+' },
    { name: 'Federal Budget Analysis', level: 'Advanced', years: '6+' },
    { name: 'Grant Management', level: 'Advanced', years: '5+' },
    { name: 'Statistical Analysis (SPSS, SAS)', level: 'Intermediate', years: '4+' },
    { name: 'Database Management', level: 'Advanced', years: '6+' }
  ],
  certifications: [
    {
      name: 'Certified Government Financial Manager (CGFM)',
      issuer: 'Association of Government Accountants',
      date: 'September 2020',
      status: 'Active'
    },
    {
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      date: 'March 2019',
      status: 'Active'
    },
    {
      name: 'Federal Acquisition Certification (FAC-C)',
      issuer: 'Federal Acquisition Institute',
      date: 'August 2021',
      status: 'Active'
    }
  ],
  training: [
    'Executive Leadership Development Program - Federal Executive Institute (2022)',
    'Advanced Policy Analysis - Graduate School USA (2021)',
    'Ethics for Senior Federal Officials - Office of Government Ethics (2020)',
    'Congressional Operations and Procedures - Congressional Research Service (2019)'
  ],
  awards: [
    'Excellence in Public Service Award - Department of Veterans Affairs (2022)',
    'Outstanding Performance Award - Centers for Disease Control (2018)',
    'Team Achievement Award - HHS Secretary\'s Award (2017)'
  ],
  languages: [
    { name: 'Spanish', proficiency: 'Professional Working Proficiency' },
    { name: 'French', proficiency: 'Limited Working Proficiency' }
  ]
};

const FederalResumeTemplate = () => {
  const [activeSection, setActiveSection] = useState('preview');
  const [showPersonalDetails, setShowPersonalDetails] = useState(true);

  const data = sampleFederalData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Federal Resume Template</h1>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">USAJOBS Ready</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* ATS Score Display */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-green-100 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">ATS Score:</span>
                <span className="font-bold text-green-600">96%</span>
              </div>

              {/* View Toggle */}
              <button
                onClick={() => setActiveSection(activeSection === 'preview' ? 'customize' : 'preview')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{activeSection === 'preview' ? 'Customize' : 'Preview'}</span>
              </button>

              {/* Download Button */}
              <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Template Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8" style={{ fontFamily: 'Times, Georgia, serif', lineHeight: '1.4' }}>
            
            {/* Header Section */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {data.personalInfo.firstName} {data.personalInfo.lastName}
              </h1>
              <div className="text-gray-700 space-y-1">
                <div className="flex justify-center items-center space-x-4 text-sm">
                  <span>{data.personalInfo.address}</span>
                  <span>•</span>
                  <span>{data.personalInfo.city}, {data.personalInfo.state} {data.personalInfo.zipCode}</span>
                </div>
                <div className="flex justify-center items-center space-x-4 text-sm">
                  <span>{data.personalInfo.phone}</span>
                  <span>•</span>
                  <span>{data.personalInfo.email}</span>
                </div>
                <div className="flex justify-center items-center space-x-4 text-sm mt-2">
                  <span><strong>Citizenship:</strong> {data.personalInfo.citizenship}</span>
                  <span>•</span>
                  <span><strong>Veteran Status:</strong> {data.personalInfo.veteranStatus}</span>
                </div>
              </div>
            </div>

            {/* Security Clearance */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">
                SECURITY CLEARANCE
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Clearance Level:</strong> {data.securityClearance.level}<br/>
                    <strong>Status:</strong> {data.securityClearance.status}<br/>
                    <strong>Issuing Agency:</strong> {data.securityClearance.issuingAgency}
                  </div>
                  <div>
                    <strong>Last Investigation:</strong> {data.securityClearance.lastInvestigation}<br/>
                    <strong>Polygraph:</strong> {data.securityClearance.polygraph}
                  </div>
                </div>
              </div>
            </div>

            {/* Career Objective */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">
                CAREER OBJECTIVE
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.objective}</p>
            </div>

            {/* Professional Experience */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                      <div className="text-gray-700 text-sm space-y-1">
                        <div><strong>{exp.agency}</strong> - {exp.office}</div>
                        <div>{exp.location}</div>
                        <div className="flex flex-wrap gap-4">
                          <span><strong>Dates:</strong> {exp.startDate} - {exp.endDate}</span>
                          <span><strong>Hours/Week:</strong> {exp.hoursPerWeek}</span>
                          <span><strong>Pay Plan/Series/Grade:</strong> {exp.payPlan}-{exp.series}-{exp.grade}</span>
                          <span><strong>Salary:</strong> {exp.salary}</span>
                        </div>
                        <div><strong>Supervisor:</strong> {exp.supervisor}</div>
                      </div>
                    </div>
                    
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                EDUCATION
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-600 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <div className="text-gray-700">{edu.field}</div>
                        <div className="text-gray-700 text-sm">{edu.institution}, {edu.location}</div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>{edu.graduationDate}</div>
                        <div><strong>GPA:</strong> {edu.gpa}/4.0</div>
                      </div>
                    </div>
                    {edu.coursework && (
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Relevant Coursework:</strong> {edu.coursework}
                      </div>
                    )}
                    {edu.honors && (
                      <div className="text-sm text-gray-700">
                        <strong>Honors:</strong> {edu.honors}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Competencies */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                SKILLS & COMPETENCIES
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.skills.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">{skill.level}</div>
                      <div className="text-xs text-gray-600">{skill.years} experience</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Licenses */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                CERTIFICATIONS & LICENSES
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <div>
                      <div className="font-bold text-gray-900">{cert.name}</div>
                      <div className="text-sm text-gray-700">{cert.issuer}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{cert.date}</div>
                      <div className="text-xs text-green-600">{cert.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training & Professional Development */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                TRAINING & PROFESSIONAL DEVELOPMENT
              </h2>
              <ul className="space-y-2">
                {data.training.map((training, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{training}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Awards & Recognition */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                AWARDS & RECOGNITION
              </h2>
              <div className="space-y-3">
                {data.awards.map((award, index) => (
                  <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <Award className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-900">{award}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-1 border-b-2 border-blue-600">
                LANGUAGE SKILLS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{lang.name}</span>
                    <span className="text-sm text-blue-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
              This federal resume format complies with USAJOBS requirements and includes all mandatory federal employment information.
            </div>

          </div>
        </div>

        {/* Template Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Federal Resume Template Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">USAJOBS Compatible</div>
                <div className="text-sm text-blue-700">Meets all federal application requirements</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Detailed Format</div>
                <div className="text-sm text-blue-700">Comprehensive information as required</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Security Clearance</div>
                <div className="text-sm text-blue-700">Dedicated clearance information section</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">GS Pay Scale Ready</div>
                <div className="text-sm text-blue-700">Includes pay plan, series, and grade info</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">96% ATS Score</div>
                <div className="text-sm text-blue-700">Optimized for federal hiring systems</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Print Optimized</div>
                <div className="text-sm text-blue-700">Professional formatting for PDF/print</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Federal Resume Best Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">Required Information:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Complete address and contact information</li>
                <li>• Citizenship status and veteran preference</li>
                <li>• Detailed work experience with hours/week</li>
                <li>• Pay plan, series, grade, and salary for federal jobs</li>
                <li>• Supervisor contact information</li>
                <li>• Complete education with GPA if recent graduate</li>
                <li>• Security clearance level and status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">Writing Tips:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Use keywords from the job announcement</li>
                <li>• Provide specific examples and metrics</li>
                <li>• Include all relevant experience (paid and unpaid)</li>
                <li>• Be thorough - federal resumes are typically 3-5 pages</li>
                <li>• Address each qualification requirement</li>
                <li>• Use professional, formal language</li>
                <li>• Proofread carefully for accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FederalResumeTemplate;