import React, { useState, useEffect } from 'react';
import { Shield, Heart, Stethoscope, Award, Star, Calendar, ExternalLink, Eye, EyeOff, Palette, Download, Target, CheckCircle, AlertCircle, Plus, Minus, ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, Lightbulb, BookOpen } from 'lucide-react';

// Sample healthcare professional data
const sampleHealthcareData = {
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'Boston, MA',
    linkedin: 'linkedin.com/in/sarahjohnson-rn',
    summary: 'Compassionate Registered Nurse with 8+ years of critical care experience in ICU and emergency settings. Proven expertise in patient assessment, medication administration, and emergency response. Committed to delivering exceptional patient care while maintaining the highest standards of clinical excellence and safety compliance.',
    jobTitle: 'ICU Registered Nurse',
    yearsExperience: '8'
  },
  certifications: [
    {
      name: 'Registered Nurse License',
      issuer: 'Massachusetts Board of Nursing',
      dateObtained: '2016-05-15',
      expirationDate: '2025-05-15',
      credentialId: 'RN-MA-123456',
      status: 'valid',
      description: 'Professional nursing practice license'
    },
    {
      name: 'Basic Life Support',
      issuer: 'American Heart Association',
      dateObtained: '2023-06-10',
      expirationDate: '2025-06-10',
      credentialId: 'BLS-2023-789012',
      status: 'valid',
      description: 'CPR and emergency response certification'
    },
    {
      name: 'Advanced Cardiac Life Support',
      issuer: 'American Heart Association',
      dateObtained: '2023-03-22',
      expirationDate: '2025-03-22',
      credentialId: 'ACLS-2023-345678',
      status: 'valid',
      description: 'Advanced cardiac emergency management'
    },
    {
      name: 'Critical Care Registered Nurse',
      issuer: 'AACN Certification Corporation',
      dateObtained: '2020-09-15',
      expirationDate: '2026-09-15',
      credentialId: 'CCRN-456789',
      status: 'valid',
      description: 'Critical care nursing expertise certification'
    }
  ],
  experience: [
    {
      title: 'Senior ICU Nurse',
      company: 'Massachusetts General Hospital',
      location: 'Boston, MA',
      startDate: 'January 2020',
      endDate: '',
      current: true,
      description: '• Provide comprehensive nursing care for critically ill patients in 36-bed medical ICU\n• Manage complex medication regimens including vasoactive drips and continuous infusions\n• Collaborate with interdisciplinary team to develop and implement patient care plans\n• Mentor newly graduated nurses and nursing students during clinical rotations\n• Achieve 98% patient satisfaction scores consistently above unit average\n• Participate in rapid response team and code blue emergencies'
    },
    {
      title: 'Staff Nurse - Emergency Department',
      company: 'Boston Medical Center',
      location: 'Boston, MA', 
      startDate: 'June 2016',
      endDate: 'December 2019',
      current: false,
      description: '• Delivered emergency nursing care in high-volume Level 1 trauma center\n• Triaged patients according to Emergency Severity Index protocols\n• Administered medications and performed procedures under physician supervision\n• Maintained accurate documentation in electronic health records (Epic)\n• Responded to medical emergencies and trauma activations\n• Achieved hospital recognition for excellence in patient care'
    }
  ],
  education: [
    {
      institution: 'Boston College',
      degree: 'Bachelor of Science in Nursing',
      field: 'Nursing',
      graduationDate: '2016-05',
      gpa: '3.8',
      honors: 'Magna Cum Laude',
      location: 'Boston, MA',
      current: false,
      type: 'Bachelor'
    }
  ],
  skills: [
    { name: 'Critical Care Nursing', category: 'technical', level: 'expert', years: '8+', featured: true },
    { name: 'Emergency Response', category: 'technical', level: 'advanced', years: '8+', featured: true },
    { name: 'Patient Assessment', category: 'technical', level: 'expert', years: '8+', featured: true },
    { name: 'Medication Administration', category: 'technical', level: 'expert', years: '8+', featured: false },
    { name: 'IV Therapy', category: 'technical', level: 'advanced', years: '8+', featured: false },
    { name: 'Ventilator Management', category: 'technical', level: 'advanced', years: '4+', featured: true },
    { name: 'Electronic Health Records', category: 'tools', level: 'advanced', years: '8+', featured: false },
    { name: 'Team Leadership', category: 'soft', level: 'advanced', years: '4+', featured: false },
    { name: 'Patient Education', category: 'soft', level: 'advanced', years: '8+', featured: false },
    { name: 'Critical Thinking', category: 'soft', level: 'expert', years: '8+', featured: true }
  ]
};

// Templates configuration
const templates = {
  professional: {
    id: 'professional',
    name: 'Professional',
    category: 'Corporate',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6' },
    layout: 'single-column',
    description: 'Clean, traditional design perfect for corporate roles',
    atsScore: 95
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare Professional',
    category: 'Healthcare',
    colors: { primary: '#0f766e', secondary: '#115e59', accent: '#14b8a6' },
    layout: 'healthcare',
    description: 'Designed for nurses and healthcare professionals with emphasis on certifications and clinical experience',
    atsScore: 95
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    category: 'Creative',
    colors: { primary: '#10b981', secondary: '#059669', accent: '#34d399' },
    layout: 'two-column',
    description: 'Contemporary design with striking color accents',
    atsScore: 88
  }
};

// Healthcare certifications database
const healthcareCertifications = {
  'Basic Life Support': {
    issuer: 'American Heart Association',
    category: 'Basic',
    duration: '2 years',
    required: true,
    description: 'Essential CPR and emergency response training'
  },
  'Advanced Cardiac Life Support': {
    issuer: 'American Heart Association',
    category: 'Advanced',
    duration: '2 years',
    required: false,
    description: 'Advanced cardiac emergency management'
  },
  'Pediatric Advanced Life Support': {
    issuer: 'American Heart Association',
    category: 'Specialty',
    duration: '2 years',
    required: false,
    description: 'Pediatric emergency care and resuscitation'
  },
  'Critical Care Registered Nurse': {
    issuer: 'AACN Certification Corporation',
    category: 'Specialty',
    duration: '3 years',
    required: false,
    description: 'Critical care nursing expertise certification'
  },
  'Certified Emergency Nurse': {
    issuer: 'Board of Certification for Emergency Nursing',
    category: 'Specialty',
    duration: '4 years',
    required: false,
    description: 'Emergency nursing competency certification'
  }
};

// Resume Preview Component
function HealthcareResumePreview({ resumeData, template }) {
  const isHealthcareTemplate = template.id === 'healthcare';
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
      <div className="h-full" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>
        {/* Header */}
        <div 
          className="px-6 py-4"
          style={{ 
            background: isHealthcareTemplate 
              ? `linear-gradient(135deg, ${template.colors.primary}12, ${template.colors.accent}08)` 
              : `linear-gradient(135deg, ${template.colors.primary}08, ${template.colors.secondary}08)` 
          }}
        >
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
              {isHealthcareTemplate && resumeData.certifications.some(cert => cert.name?.includes('Registered Nurse')) && (
                <span className="text-base font-normal ml-1" style={{ color: template.colors.primary }}>, RN</span>
              )}
            </h1>
            {resumeData.personalInfo.jobTitle && (
              <p className="text-base font-medium mb-2" style={{ color: template.colors.primary }}>
                {resumeData.personalInfo.jobTitle}
              </p>
            )}
            <div className="text-gray-600 space-y-1 text-xs">
              <div>{resumeData.personalInfo.email}</div>
              <div className="flex justify-center space-x-3">
                <span>{resumeData.personalInfo.phone}</span>
                <span>{resumeData.personalInfo.location}</span>
              </div>
              {resumeData.personalInfo.linkedin && (
                <div style={{ color: template.colors.accent }}>{resumeData.personalInfo.linkedin}</div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 text-xs">
          {/* Clinical Summary */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
              {isHealthcareTemplate ? 'Clinical Summary' : 'Professional Summary'}
            </h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>

          {/* Healthcare: Certifications & Licenses (Prominent placement) */}
          {isHealthcareTemplate && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
                Professional Certifications & Licenses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-xs">{cert.name}</h3>
                        <div className="text-gray-700 text-xs">{cert.issuer}</div>
                        {cert.credentialId && (
                          <div className="text-xs text-gray-600">ID: {cert.credentialId}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium" style={{ color: template.colors.primary }}>
                          {new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        {cert.expirationDate && (
                          <div className="text-xs text-gray-600">
                            Exp: {new Date(cert.expirationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                        )}
                        <div className="text-xs px-1 py-0.5 rounded-full mt-1 bg-green-100 text-green-700">
                          Current
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Experience */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
              {isHealthcareTemplate ? 'Clinical Experience' : 'Professional Experience'}
            </h2>
            <div className="space-y-3">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs">{exp.title}</h3>
                      <div className="font-medium text-xs" style={{ color: template.colors.primary }}>{exp.company}</div>
                      <div className="text-xs text-gray-600">{exp.location}</div>
                    </div>
                    <div className="text-xs text-gray-600 text-right">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs">{edu.degree} in {edu.field}</h3>
                    <div className="text-gray-700 text-xs">{edu.institution}</div>
                    {isHealthcareTemplate && edu.honors && (
                      <div className="text-xs font-medium" style={{ color: template.colors.accent }}>{edu.honors}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 text-right">
                    {new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {isHealthcareTemplate && edu.gpa && (
                      <div className="text-xs">GPA: {edu.gpa}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Skills */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b-2" style={{ borderColor: template.colors.primary }}>
              {isHealthcareTemplate ? 'Clinical Skills & Competencies' : 'Skills'}
            </h2>
            <div className="grid grid-cols-2 gap-1">
              {resumeData.skills.filter(skill => skill.featured).map((skill, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: template.colors.accent }}
                  ></div>
                  <span className="text-xs text-gray-700">
                    {skill.name}
                    {isHealthcareTemplate && skill.years && ` (${skill.years})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Healthcare Certifications Panel
function HealthcareCertificationsPanel({ resumeData, onAddCertification, onUpdateCertification, onRemoveCertification }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('ICU/Critical Care');
  const [atsAnalysis, setAtsAnalysis] = useState({ score: 0, critical: [], missing: [] });

  const nursingSpecialties = {
    'ICU/Critical Care': ['Critical Care Registered Nurse', 'Advanced Cardiac Life Support', 'Basic Life Support'],
    'Emergency/Trauma': ['Certified Emergency Nurse', 'Advanced Cardiac Life Support', 'Basic Life Support'],
    'Operating Room': ['Certified Perioperative Nurse', 'Basic Life Support'],
    'Pediatrics': ['Pediatric Advanced Life Support', 'Basic Life Support']
  };

  useEffect(() => {
    const userCerts = resumeData.certifications.map(cert => cert.name?.toLowerCase());
    const criticalCerts = Object.entries(healthcareCertifications)
      .filter(([name, data]) => data.required)
      .map(([name]) => name);
    
    const foundCritical = criticalCerts.filter(cert => 
      userCerts.some(userCert => userCert.includes(cert.toLowerCase()))
    );
    
    const missingCritical = criticalCerts.filter(cert => 
      !userCerts.some(userCert => userCert.includes(cert.toLowerCase()))
    );

    const score = Math.min(100, Math.round(
      (foundCritical.length / criticalCerts.length) * 60 + 
      Math.min(resumeData.certifications.length * 10, 40)
    ));

    setAtsAnalysis({ score, critical: foundCritical, missing: missingCritical });
  }, [resumeData.certifications]);

  const suggestedCerts = nursingSpecialties[selectedSpecialty] || [];
  const userCertNames = resumeData.certifications.map(cert => cert.name?.toLowerCase());
  const availableSuggestions = suggestedCerts.filter(cert => 
    !userCertNames.includes(cert.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* ATS Analysis */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-teal-900 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Healthcare Certification Score: {atsAnalysis.score}%
          </h4>
          <Heart className="w-5 h-5 text-teal-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-teal-700 font-medium mb-1">✓ Critical Certifications:</p>
            <p className="text-teal-600">
              {atsAnalysis.critical.length > 0 ? atsAnalysis.critical.join(', ') : 'Add required certifications'}
            </p>
          </div>
          <div>
            <p className="text-orange-700 font-medium mb-1">⚠ Missing Required:</p>
            <p className="text-orange-600">
              {atsAnalysis.missing.length > 0 ? atsAnalysis.missing.join(', ') : 'All required present'}
            </p>
          </div>
        </div>
      </div>

      {/* Specialty Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-3 flex items-center">
          <Stethoscope className="w-4 h-4 mr-2" />
          Select Your Nursing Specialty:
        </h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(nursingSpecialties).map(specialty => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSpecialty === specialty
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 hover:bg-blue-100'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Current Certifications */}
      <div>
        <h5 className="font-medium text-gray-900 mb-3">Current Certifications</h5>
        <div className="space-y-3">
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h6 className="font-medium text-gray-900">{cert.name}</h6>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-teal-600">
                    {new Date(cert.dateObtained).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Exp: {new Date(cert.expirationDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full mt-1 bg-green-100 text-green-700">
                    Current
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Certifications */}
      {availableSuggestions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h5 className="font-medium text-purple-900 mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Recommended for {selectedSpecialty}
          </h5>
          <div className="space-y-2">
            {availableSuggestions.map(certName => {
              const certData = healthcareCertifications[certName];
              return (
                <button
                  key={certName}
                  onClick={() => onAddCertification(certName)}
                  className="w-full text-left p-3 bg-white hover:bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{certName}</div>
                      <div className="text-sm text-gray-600">{certData?.issuer}</div>
                      <div className="text-xs text-purple-600 mt-1">{certData?.description}</div>
                    </div>
                    <div className="ml-2">
                      {certData?.required && (
                        <Star className="w-4 h-4 text-yellow-500" title="Required" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Demo Component
export default function HealthcareTemplateDemo() {
  const [resumeData, setResumeData] = useState(sampleHealthcareData);
  const [currentTemplate, setCurrentTemplate] = useState('healthcare');
  const [showPreview, setShowPreview] = useState(true);
  const [activePanel, setActivePanel] = useState('preview');

  const template = templates[currentTemplate];

  const addCertification = (certName) => {
    const certData = healthcareCertifications[certName];
    const newCert = {
      name: certName,
      issuer: certData?.issuer || '',
      dateObtained: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      credentialId: `${certName.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8)}`,
      status: 'valid',
      description: certData?.description || ''
    };
    
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Healthcare Resume Template</h1>
                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full">DEMO</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Template Selector */}
              <select
                value={currentTemplate}
                onChange={(e) => setCurrentTemplate(e.target.value)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {Object.entries(templates).map(([id, tmpl]) => (
                  <option key={id} value={id}>{tmpl.name}</option>
                ))}
              </select>

              {/* Preview toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
              </button>

              {/* Download button */}
              <button className="flex items-center space-x-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls Panel */}
          <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : ''}`}>
            {/* Template Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: template.colors.primary }}
                ></div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  ATS: {template.atsScore}%
                </span>
              </div>
              <p className="text-gray-600 mb-4">{template.description}</p>
              
              {currentTemplate === 'healthcare' && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <h4 className="font-medium text-teal-900 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Healthcare Features
                  </h4>
                  <ul className="text-sm text-teal-700 space-y-1">
                    <li>• Prominent certifications and licenses section</li>
                    <li>• RN credential display in header</li>
                    <li>• Clinical experience emphasis</li>
                    <li>• Healthcare-specific terminology</li>
                    <li>• Certification expiration tracking</li>
                    <li>• Specialty-based recommendations</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Panel Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 p-1">
                  <button
                    onClick={() => setActivePanel('preview')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activePanel === 'preview'
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Template Info
                  </button>
                  <button
                    onClick={() => setActivePanel('certifications')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activePanel === 'certifications'
                        ? 'bg-teal-100 text-teal-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Certifications
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activePanel === 'preview' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Sample Data Included</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <p className="text-gray-600">{resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Role:</span>
                        <p className="text-gray-600">{resumeData.personalInfo.jobTitle}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Experience:</span>
                        <p className="text-gray-600">{resumeData.personalInfo.yearsExperience} years</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Certifications:</span>
                        <p className="text-gray-600">{resumeData.certifications.length} active</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Key Healthcare Features:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• RN credentials prominently displayed</li>
                        <li>• Clinical summary instead of professional summary</li>
                        <li>• Certifications with expiration tracking</li>
                        <li>• Healthcare-specific color scheme</li>
                        <li>• Clinical skills categorization</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activePanel === 'certifications' && (
                  <HealthcareCertificationsPanel
                    resumeData={resumeData}
                    onAddCertification={addCertification}
                    onUpdateCertification={() => {}}
                    onRemoveCertification={() => {}}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${!showPreview ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Healthcare Template</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="transform scale-90 origin-top h-[600px] overflow-y-auto">
                  <HealthcareResumePreview 
                    resumeData={resumeData}
                    template={template}
                  />
                </div>
              </div>

              {/* Template Benefits */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3">Why This Template Works for Healthcare</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">95% ATS compatibility for hospital systems</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Certification tracking with expiration dates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Clinical experience emphasis over general work</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Healthcare-specific terminology and layout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}