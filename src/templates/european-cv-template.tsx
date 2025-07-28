import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, Linkedin, Calendar, 
  Award, BookOpen, Camera, Download, Eye, EyeOff, 
  FileText, Briefcase, GraduationCap, Languages, 
  Star, Users, Target, Settings, Info, CheckCircle,
  Plus, X, Upload, AlertCircle
} from 'lucide-react';

// Sample European CV data with comprehensive sections
const sampleEuropeanData = {
  personalInfo: {
    firstName: 'Marie',
    lastName: 'Dubois',
    jobTitle: 'Senior Marketing Manager',
    email: 'marie.dubois@email.com',
    phone: '+33 1 45 67 89 12',
    address: '15 Rue de la Paix, 75001 Paris, France',
    dateOfBirth: '15 March 1990',
    nationality: 'French',
    maritalStatus: 'Single',
    photo: null, // Will be handled as optional
    linkedin: 'linkedin.com/in/marie-dubois',
    website: 'marie-dubois-portfolio.com',
    summary: 'Dynamic marketing professional with 8+ years of experience in digital marketing, brand management, and international campaigns. Proven track record of increasing brand awareness by 45% and driving revenue growth across European markets. Fluent in French, English, and German with strong cross-cultural communication skills.'
  },
  experience: [
    {
      title: 'Senior Marketing Manager',
      company: 'L\'Oréal Paris',
      location: 'Paris, France',
      startDate: 'January 2020',
      endDate: 'Present',
      current: true,
      description: '• Led digital marketing campaigns across 12 European markets, achieving 35% increase in brand engagement\n• Managed €2.5M annual marketing budget with 98% efficiency rate\n• Developed influencer partnerships resulting in 50M+ impressions\n• Coordinated with cross-functional teams of 15+ members across multiple countries'
    },
    {
      title: 'Marketing Specialist',
      company: 'Unilever',
      location: 'Amsterdam, Netherlands',
      startDate: 'June 2018',
      endDate: 'December 2019',
      current: false,
      description: '• Executed integrated marketing campaigns for consumer goods in EMEA region\n• Increased social media engagement by 60% through strategic content planning\n• Collaborated with agencies across 8 countries for consistent brand messaging\n• Analyzed market trends and consumer behavior to optimize campaign performance'
    }
  ],
  education: [
    {
      institution: 'ESSEC Business School',
      degree: 'Master of Science',
      field: 'Marketing Management',
      location: 'Cergy, France',
      graduationDate: 'June 2016',
      grade: 'Magna Cum Laude (16.5/20)',
      thesis: 'Digital Marketing Strategies in Luxury Goods Industry'
    },
    {
      institution: 'Université Paris Dauphine',
      degree: 'Bachelor of Business Administration',
      field: 'International Business',
      location: 'Paris, France',
      graduationDate: 'June 2014',
      grade: 'Distinction (15.8/20)',
      exchange: 'Erasmus Exchange - Stockholm School of Economics (Spring 2013)'
    }
  ],
  languages: [
    { name: 'French', level: 'Native', certification: 'Mother tongue' },
    { name: 'English', level: 'Fluent', certification: 'TOEFL 115/120 (2019)' },
    { name: 'German', level: 'Intermediate', certification: 'Goethe B2 (2018)' },
    { name: 'Spanish', level: 'Basic', certification: 'Self-taught' }
  ],
  skills: [
    { name: 'Digital Marketing', category: 'technical', level: 'expert' },
    { name: 'Brand Management', category: 'technical', level: 'advanced' },
    { name: 'Google Analytics', category: 'tools', level: 'advanced' },
    { name: 'Adobe Creative Suite', category: 'tools', level: 'intermediate' },
    { name: 'Team Leadership', category: 'soft', level: 'advanced' },
    { name: 'Cross-cultural Communication', category: 'soft', level: 'expert' }
  ],
  certifications: [
    {
      name: 'Google Ads Certified Professional',
      issuer: 'Google',
      dateObtained: 'March 2023',
      expirationDate: 'March 2024'
    },
    {
      name: 'HubSpot Content Marketing Certification',
      issuer: 'HubSpot Academy',
      dateObtained: 'January 2023'
    }
  ],
  additionalSections: {
    references: [
      {
        name: 'Dr. Jean-Pierre Martin',
        position: 'Marketing Director',
        company: 'L\'Oréal Paris',
        email: 'jp.martin@loreal.com',
        phone: '+33 1 47 56 89 12'
      }
    ],
    interests: ['Photography', 'Cultural Heritage Preservation', 'Sustainable Fashion', 'Marathon Running'],
    publications: [
      {
        title: 'The Future of Luxury Marketing in Digital Age',
        publication: 'European Marketing Journal',
        date: 'September 2022'
      }
    ]
  }
};

// European country options for nationality
const europeanCountries = [
  'Austrian', 'Belgian', 'Bulgarian', 'Croatian', 'Cypriot', 'Czech', 'Danish',
  'Dutch', 'Estonian', 'Finnish', 'French', 'German', 'Greek', 'Hungarian',
  'Irish', 'Italian', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Maltese',
  'Polish', 'Portuguese', 'Romanian', 'Slovak', 'Slovenian', 'Spanish', 'Swedish'
];

// Language proficiency levels (Common European Framework)
const languageLevels = {
  'Native': 'Mother tongue',
  'C2': 'Proficient (C2)',
  'C1': 'Advanced (C1)', 
  'B2': 'Upper Intermediate (B2)',
  'B1': 'Intermediate (B1)',
  'A2': 'Elementary (A2)',
  'A1': 'Beginner (A1)'
};

export default function EuropeanCVTemplate() {
  const [cvData, setCvData] = useState(sampleEuropeanData);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPhoto, setShowPhoto] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showPersonalDetails, setShowPersonalDetails] = useState(true);

  // Update function for nested data
  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateExperience = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: '', level: 'B1', certification: '' }]
    }));
  };

  const updateLanguage = (index, field, value) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // European CV Preview Component
  const EuropeanCVPreview = () => (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ minHeight: '842px' }}>
      {/* Header Section with Optional Photo */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8">
        <div className="flex items-start space-x-6">
          {/* Photo Section */}
          {showPhoto && (
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-blue-700 rounded-lg flex items-center justify-center border-2 border-blue-300">
                {cvData.personalInfo.photo ? (
                  <img 
                    src={cvData.personalInfo.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                    <span className="text-xs text-blue-300">Photo</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Personal Information */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-blue-200 mb-4">
              {cvData.personalInfo.jobTitle}
            </h2>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-300" />
                <span>{cvData.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-300" />
                <span>{cvData.personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-300" />
                <span>{cvData.personalInfo.address}</span>
              </div>
              {cvData.personalInfo.linkedin && (
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4 text-blue-300" />
                  <span>{cvData.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
            
            {/* Personal Details (European Style) */}
            {showPersonalDetails && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm border-t border-blue-600 pt-4">
                {cvData.personalInfo.dateOfBirth && (
                  <div>
                    <span className="text-blue-300">Born:</span> {cvData.personalInfo.dateOfBirth}
                  </div>
                )}
                {cvData.personalInfo.nationality && (
                  <div>
                    <span className="text-blue-300">Nationality:</span> {cvData.personalInfo.nationality}
                  </div>
                )}
                {cvData.personalInfo.maritalStatus && (
                  <div>
                    <span className="text-blue-300">Status:</span> {cvData.personalInfo.maritalStatus}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Professional Summary */}
        {cvData.personalInfo.summary && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
              Professional Profile
            </h3>
            <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Professional Experience
          </h3>
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                    <p className="text-blue-700 font-medium">{exp.company}</p>
                    <p className="text-gray-600 text-sm">{exp.location}</p>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-gray-700 whitespace-pre-line ml-4">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Education
          </h3>
          <div className="space-y-4">
            {cvData.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                    <p className="text-blue-700">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.location}</p>
                    {edu.grade && <p className="text-gray-600 text-sm">Grade: {edu.grade}</p>}
                    {edu.thesis && <p className="text-gray-600 text-sm italic">Thesis: {edu.thesis}</p>}
                    {edu.exchange && <p className="text-gray-600 text-sm">{edu.exchange}</p>}
                  </div>
                  <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages (Prominent in European CVs) */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Languages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvData.languages.map((lang, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  <p className="text-sm text-gray-600">{lang.certification}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
            Core Competencies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cvData.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        (skill.level === 'expert' && dot <= 5) ||
                        (skill.level === 'advanced' && dot <= 4) ||
                        (skill.level === 'intermediate' && dot <= 3) ||
                        (skill.level === 'basic' && dot <= 2)
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        {cvData.certifications && cvData.certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">
              Professional Certifications
            </h3>
            <div className="space-y-3">
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-gray-600">{cert.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-600">{cert.dateObtained}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Sections */}
        {cvData.additionalSections?.interests && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
              Interests & Activities
            </h3>
            <p className="text-gray-700">{cvData.additionalSections.interests.join(' • ')}</p>
          </section>
        )}

        {/* References */}
        {cvData.additionalSections?.references && (
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
              References
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.additionalSections.references.map((ref, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{ref.name}</h4>
                  <p className="text-gray-700">{ref.position}</p>
                  <p className="text-gray-600">{ref.company}</p>
                  <p className="text-sm text-gray-600 mt-1">{ref.email}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">European CV Template</h1>
                  <p className="text-sm text-gray-600">International format with European standards</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Template Options */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setShowPhoto(!showPhoto)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    showPhoto ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Camera className="w-4 h-4 mr-1 inline" />
                  Photo
                </button>
                <button
                  onClick={() => setShowPersonalDetails(!showPersonalDetails)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    showPersonalDetails ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <User className="w-4 h-4 mr-1 inline" />
                  Details
                </button>
              </div>

              {/* Download Button */}
              <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Section Navigation */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-900 mb-4">CV Sections</h3>
              <nav className="space-y-2">
                {[
                  { id: 'personal', label: 'Personal Information', icon: User },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'languages', label: 'Languages', icon: Languages },
                  { id: 'skills', label: 'Skills', icon: Target },
                  { id: 'additional', label: 'Additional', icon: Plus }
                ].map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 border border-blue-200 text-blue-900'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* European CV Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">European CV Standards</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Personal details (age, nationality) commonly included</li>
                    <li>• Photo is optional but often expected</li>
                    <li>• Language skills prominently featured</li>
                    <li>• References section is standard</li>
                    <li>• Length can be 2-3 pages (unlike US resumes)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Active Section Editor */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={cvData.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={cvData.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                    />
                  </div>

                  <input
                    type="text"
                    value={cvData.personalInfo.jobTitle}
                    onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Professional Title"
                  />

                  <input
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email Address"
                  />

                  <input
                    type="tel"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone Number (with country code)"
                  />

                  <input
                    type="text"
                    value={cvData.personalInfo.address}
                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Address"
                  />

                  {/* European-specific fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={cvData.personalInfo.dateOfBirth || ''}
                      onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Date of Birth"
                    />
                    <select
                      value={cvData.personalInfo.nationality || ''}
                      onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Nationality</option>
                      {europeanCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={cvData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Professional Profile Summary"
                  />
                </div>
              )}

              {activeSection === 'languages' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Languages</h4>
                    <button
                      onClick={addLanguage}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Language</span>
                    </button>
                  </div>

                  {cvData.languages.map((lang, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-medium text-gray-800">Language {index + 1}</h5>
                        <button
                          onClick={() => removeLanguage(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Language name"
                        />
                        <select
                          value={lang.level}
                          onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(languageLevels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <input
                        type="text"
                        value={lang.certification}
                        onChange={(e) => updateLanguage(index, 'certification', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Certification or note (optional)"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">CV Preview</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">ATS Score:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                    89%
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="transform scale-75 origin-top" style={{ width: '133.33%', marginBottom: '-25%' }}>
                  <EuropeanCVPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}