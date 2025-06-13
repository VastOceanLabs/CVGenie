import React, { useState, useRef } from 'react';
import { Plus, Minus, Sparkles, BookOpen, ArrowLeft, ArrowRight, Award, Calendar, Building, Lightbulb, Copy, ChevronDown, ChevronUp, GripVertical, Target, AlertCircle, CheckCircle, TrendingUp, Users, Shield, Zap, Star, X, ExternalLink } from 'lucide-react';

// Industry-specific certifications database
const certificationsByIndustry = {
  'Software Engineer': {
    technical: [
      'AWS Certified Solutions Architect',
      'AWS Certified Developer',
      'Microsoft Azure Fundamentals',
      'Google Cloud Professional',
      'Certified Kubernetes Administrator',
      'Docker Certified Associate',
      'MongoDB Certified Developer',
      'Oracle Certified Professional',
      'Salesforce Certified Administrator',
      'Cisco Certified Network Associate'
    ],
    professional: [
      'Certified ScrumMaster (CSM)',
      'Project Management Professional (PMP)',
      'Certified Agile Practitioner',
      'ITIL Foundation',
      'Certified Ethical Hacker (CEH)',
      'CompTIA Security+',
      'Six Sigma Green Belt'
    ],
    platforms: [
      'HubSpot Certified',
      'Google Analytics Certified',
      'Shopify Partner Certified',
      'Stripe Certified',
      'Tableau Desktop Certified'
    ]
  },
  'Electrician': {
    technical: [
      'Journeyman Electrician License',
      'Master Electrician License',
      'Electrical Contractor License',
      'Low Voltage Technician',
      'Fire Alarm Certification',
      'Solar Installation Certification',
      'Industrial Maintenance Certification',
      'Motor Control Certification'
    ],
    safety: [
      'OSHA 10-Hour Construction',
      'OSHA 30-Hour Construction',
      'NFPA 70E Arc Flash Training',
      'First Aid/CPR Certification',
      'Confined Space Entry',
      'Lockout/Tagout (LOTO)',
      'Aerial Lift Certification'
    ],
    specialized: [
      'Fiber Optic Installation',
      'Security System Installation',
      'Home Automation Systems',
      'Electric Vehicle Charging',
      'Renewable Energy Systems'
    ]
  },
  'Marketing Manager': {
    digital: [
      'Google Ads Certified',
      'Google Analytics Certified',
      'Facebook Blueprint Certified',
      'HubSpot Content Marketing',
      'Hootsuite Social Media',
      'Semrush SEO Toolkit',
      'Mailchimp Email Marketing',
      'Salesforce Marketing Cloud'
    ],
    professional: [
      'Digital Marketing Institute (DMI)',
      'American Marketing Association (AMA)',
      'Content Marketing Institute',
      'Project Management Professional (PMP)',
      'Certified ScrumMaster (CSM)'
    ],
    specialized: [
      'Adobe Certified Expert',
      'Shopify Partner Certified',
      'Amazon Advertising Certified',
      'LinkedIn Marketing Solutions'
    ]
  },
  'Nurse': {
    clinical: [
      'Basic Life Support (BLS)',
      'Advanced Cardiac Life Support (ACLS)',
      'Pediatric Advanced Life Support (PALS)',
      'Critical Care Registered Nurse (CCRN)',
      'Certified Emergency Nurse (CEN)',
      'Oncology Certified Nurse (OCN)',
      'Wound Ostomy Continence Nurse',
      'IV Therapy Certification'
    ],
    specialized: [
      'Certified Operating Room Nurse',
      'Neonatal Intensive Care',
      'Psychiatric Mental Health Nurse',
      'Infection Control Certification',
      'Case Management Certification',
      'Diabetes Education Certification'
    ],
    administrative: [
      'Certified Nurse Manager (CNM)',
      'Healthcare Quality Certification',
      'Joint Commission Standards',
      'HIPAA Compliance Training'
    ]
  },
  'Project Manager': {
    methodology: [
      'Project Management Professional (PMP)',
      'Certified ScrumMaster (CSM)',
      'Certified Scrum Product Owner',
      'SAFe Agilist Certification',
      'Prince2 Foundation',
      'Certified Associate in Project Management',
      'Lean Six Sigma Green Belt',
      'Lean Six Sigma Black Belt'
    ],
    technical: [
      'Microsoft Project Certified',
      'Jira Administrator',
      'Confluence Administrator',
      'Smartsheet Certified',
      'Asana Certified Pro'
    ],
    industry: [
      'Construction Project Management',
      'IT Project Management',
      'Healthcare Project Management',
      'Change Management Certification'
    ]
  },
  'Sales Representative': {
    methodology: [
      'Challenger Sale Certified',
      'SPIN Selling Certified',
      'Sandler Sales Training',
      'Miller Heiman Strategic Selling',
      'Solution Selling Certified',
      'Consultative Selling Program'
    ],
    platforms: [
      'Salesforce Certified Administrator',
      'HubSpot Sales Certified',
      'LinkedIn Sales Navigator',
      'Outreach Certified',
      'Gong Revenue Intelligence'
    ],
    industry: [
      'Pharmaceutical Sales Certification',
      'Real Estate License',
      'Insurance License',
      'Financial Services License'
    ]
  }
};

// Certification validation patterns
const certificationValidation = {
  hasExpirationDate: [
    'OSHA', 'CPR', 'First Aid', 'BLS', 'ACLS', 'PALS', 'CEN', 'CCRN',
    'AWS', 'Microsoft', 'Google', 'Cisco', 'CompTIA', 'Oracle'
  ],
  requiresRenewal: [
    'PMP', 'CSM', 'Six Sigma', 'ITIL', 'Prince2', 'Salesforce'
  ],
  hasCredentialID: [
    'AWS', 'Microsoft Azure', 'Google Cloud', 'Salesforce', 'Cisco',
    'Oracle', 'Adobe', 'VMware'
  ]
};

// ATS keywords for certifications
const certificationKeywords = {
  'Software Engineer': ['certified', 'aws', 'azure', 'cloud', 'kubernetes', 'docker', 'scrum', 'agile'],
  'Electrician': ['licensed', 'journeyman', 'master', 'osha', 'nfpa', 'electrical', 'safety'],
  'Marketing Manager': ['google ads', 'analytics', 'facebook', 'hubspot', 'digital marketing', 'certified'],
  'Nurse': ['bls', 'acls', 'pals', 'registered nurse', 'certified', 'healthcare', 'clinical'],
  'Project Manager': ['pmp', 'scrum', 'agile', 'six sigma', 'certified', 'project management'],
  'Sales Representative': ['sales', 'certified', 'crm', 'salesforce', 'revenue', 'quota']
};

export default function EnhancedCertificationsSection({ 
  resumeData = { certifications: [] }, 
  updateResumeData = () => {}, 
  addArrayItem = () => {}, 
  removeArrayItem = () => {}, 
  updateArrayItem = () => {},
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCertificationHelper, setShowCertificationHelper] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [atsAnalysis, setAtsAnalysis] = useState({});
  const [selectedIndustry, setSelectedIndustry] = useState('Software Engineer');
  const [searchTerm, setSearchTerm] = useState('');

  // Get user's job title for relevant suggestions
  const userJobTitle = resumeData?.personalInfo?.jobTitle || 'Software Engineer';

  // Validation function
  const validateCertification = (certification, index) => {
    const errors = {};
    if (!certification.name?.trim()) errors.name = 'Certification name is required';
    if (!certification.issuer?.trim()) errors.issuer = 'Issuing organization is required';
    if (!certification.dateObtained?.trim()) errors.dateObtained = 'Date obtained is required';
    
    // Check if this certification typically expires
    const hasExpiration = certificationValidation.hasExpirationDate.some(keyword => 
      certification.name?.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasExpiration && !certification.expirationDate?.trim()) {
      errors.expirationDate = 'Expiration date recommended for this certification';
    }
    
    setValidationErrors(prev => ({ ...prev, [index]: errors }));
    return Object.keys(errors).length === 0;
  };

  // ATS Analysis for certifications
  const analyzeCertificationATS = (certification, index) => {
    const certName = certification.name?.toLowerCase() || '';
    const issuer = certification.issuer?.toLowerCase() || '';
    const keywords = certificationKeywords[userJobTitle] || [];
    
    const foundKeywords = keywords.filter(keyword => 
      certName.includes(keyword) || issuer.includes(keyword)
    );
    
    const score = Math.min(100, 40 + (foundKeywords.length * 15) + 
      (certification.credentialId ? 15 : 0) + 
      (certification.verificationUrl ? 10 : 0) +
      (certification.expirationDate ? 10 : 0));

    const isExpiring = certification.expirationDate && 
      new Date(certification.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    setAtsAnalysis(prev => ({
      ...prev,
      [index]: {
        score: Math.round(score),
        foundKeywords,
        isRelevant: foundKeywords.length > 0,
        hasCredential: !!certification.credentialId,
        hasVerification: !!certification.verificationUrl,
        isExpiring,
        suggestions: keywords.filter(k => !foundKeywords.includes(k)).slice(0, 3)
      }
    }));
  };

  // Add new certification
  const addCertification = () => {
    const newCertification = {
      name: '',
      issuer: '',
      dateObtained: '',
      expirationDate: '',
      credentialId: '',
      verificationUrl: '',
      status: 'valid',
      description: ''
    };
    addArrayItem('certifications', newCertification);
    setExpandedIndex((resumeData?.certifications || []).length);
  };

  // Update certification
  const updateCertification = (index, updates) => {
    updateArrayItem('certifications', index, updates);
    
    // Validate and analyze after update
    const certification = { ...(resumeData?.certifications?.[index] || {}), ...updates };
    validateCertification(certification, index);
    
    if (certification.name && certification.issuer) {
      analyzeCertificationATS(certification, index);
    }
  };

  // Remove certification
  const removeCertification = (index) => {
    removeArrayItem('certifications', index);
    if (expandedIndex >= (resumeData?.certifications?.length - 1)) {
      setExpandedIndex(Math.max(0, expandedIndex - 1));
    }
  };

  // Add certification from suggestion
  const addSuggestionCertification = (certName, category) => {
    const newCertification = {
      name: certName,
      issuer: getDefaultIssuer(certName),
      dateObtained: '',
      expirationDate: '',
      credentialId: '',
      verificationUrl: '',
      status: 'valid',
      description: ''
    };
    addArrayItem('certifications', newCertification);
    setExpandedIndex((resumeData?.certifications || []).length);
  };

  // Get default issuer for common certifications
  const getDefaultIssuer = (certName) => {
    const issuers = {
      'AWS': 'Amazon Web Services',
      'Microsoft': 'Microsoft',
      'Google': 'Google',
      'PMP': 'Project Management Institute',
      'CSM': 'Scrum Alliance',
      'OSHA': 'Occupational Safety and Health Administration',
      'CompTIA': 'Computing Technology Industry Association',
      'Cisco': 'Cisco Systems',
      'Oracle': 'Oracle Corporation',
      'Salesforce': 'Salesforce',
      'Adobe': 'Adobe Systems'
    };
    
    for (const [key, value] of Object.entries(issuers)) {
      if (certName.includes(key)) return value;
    }
    return '';
  };

  // Filter suggestions based on search
  const getFilteredSuggestions = () => {
    const industryData = certificationsByIndustry[selectedIndustry] || {};
    const allSuggestions = [];
    
    Object.entries(industryData).forEach(([category, certs]) => {
      certs.forEach(cert => {
        allSuggestions.push({ name: cert, category });
      });
    });
    
    if (!searchTerm) return allSuggestions;
    
    return allSuggestions.filter(cert => 
      cert.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const certifications = resumeData?.certifications || [];
    const newCertifications = [...certifications];
    const draggedItem = newCertifications[draggedIndex];
    newCertifications.splice(draggedIndex, 1);
    newCertifications.splice(dropIndex, 0, draggedItem);
    
    updateResumeData('certifications', newCertifications);
    setDraggedIndex(null);
  };

  // Initialize ATS analysis
  React.useEffect(() => {
    (resumeData?.certifications || []).forEach((cert, index) => {
      if (cert.name && cert.issuer) {
        analyzeCertificationATS(cert, index);
      }
    });
  }, [resumeData?.certifications, userJobTitle]);

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Certifications & Licenses</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add professional certifications, licenses, and credentials to strengthen your qualifications
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCertificationHelper(!showCertificationHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Cert Helper</span>
          </button>
          <button
            onClick={() => setShowPhraseLibrary(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Phrase Library</span>
          </button>
        </div>
      </div>

      {/* ATS Analysis Panel */}
      {(resumeData?.certifications || []).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Certifications Impact Score
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-medium">✓ Relevant Certifications:</p>
              <p className="text-blue-600">
                {Object.values(atsAnalysis).filter(a => a?.isRelevant).length} of {(resumeData?.certifications || []).length}
              </p>
            </div>
            <div>
              <p className="text-green-700 font-medium">🔗 With Verification:</p>
              <p className="text-green-600">
                {Object.values(atsAnalysis).filter(a => a?.hasVerification || a?.hasCredential).length} verified
              </p>
            </div>
            <div>
              <p className="text-orange-700 font-medium">⚠ Expiring Soon:</p>
              <p className="text-orange-600">
                {Object.values(atsAnalysis).filter(a => a?.isExpiring).length} need renewal
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Certification Helper */}
      {showCertificationHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3">
            🏆 Certification Section Best Practices:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">What to Include:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Professional licenses and certifications</li>
                <li>• Industry-specific credentials</li>
                <li>• Safety and compliance training</li>
                <li>• Software and platform certifications</li>
                <li>• Continuing education completed</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">Pro Tips:</p>
              <ul className="text-green-700 space-y-1">
                <li>• List in reverse chronological order</li>
                <li>• Include certification numbers when relevant</li>
                <li>• Add expiration dates for time-sensitive certs</li>
                <li>• Include verification links when available</li>
                <li>• Prioritize industry-relevant certifications</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Button */}
      <button
        onClick={addCertification}
        className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-5 h-5 text-gray-500" />
        <span className="text-gray-600 font-medium">Add Certification</span>
      </button>

      {/* Certifications List */}
      <div className="space-y-4">
        {(resumeData?.certifications || []).map((cert, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Certification Header */}
            <div 
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <Award className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {cert.name || 'Certification Name'}
                      {cert.issuer && ` - ${cert.issuer}`}
                    </h4>
                    {validationErrors[index] && Object.keys(validationErrors[index]).length > 0 && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {atsAnalysis[index]?.score >= 80 && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {atsAnalysis[index]?.isExpiring && (
                      <Shield className="w-4 h-4 text-orange-500" title="Expiring soon" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {cert.dateObtained} 
                    {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                    {atsAnalysis[index] && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        atsAnalysis[index].score >= 80 ? 'bg-green-100 text-green-700' :
                        atsAnalysis[index].score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        Impact: {atsAnalysis[index].score}%
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCertification(index);
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                {expandedIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Certification Details */}
            {expandedIndex === index && (
              <div className="p-6 space-y-6">
                {/* ATS Analysis */}
                {atsAnalysis[index] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-blue-900 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Certification Impact Score: {atsAnalysis[index].score}%
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700 font-medium mb-1">✓ Strengths:</p>
                        <div className="text-blue-600">
                          {atsAnalysis[index].isRelevant && <p>• Industry-relevant certification</p>}
                          {atsAnalysis[index].hasCredential && <p>• Has credential ID</p>}
                          {atsAnalysis[index].hasVerification && <p>• Verification link provided</p>}
                        </div>
                      </div>
                      <div>
                        <p className="text-orange-700 font-medium mb-1">⚠ Recommendations:</p>
                        <div className="text-orange-600">
                          {!atsAnalysis[index].hasCredential && <p>• Add credential ID if available</p>}
                          {!atsAnalysis[index].hasVerification && <p>• Add verification URL</p>}
                          {atsAnalysis[index].isExpiring && <p>• Renewal needed soon</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.name || ''}
                      onChange={(e) => updateCertification(index, { name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                    {validationErrors[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuing Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.issuer || ''}
                      onChange={(e) => updateCertification(index, { issuer: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.issuer ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Amazon Web Services"
                    />
                    {validationErrors[index]?.issuer && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].issuer}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Obtained <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.dateObtained || ''}
                      onChange={(e) => updateCertification(index, { dateObtained: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[index]?.dateObtained ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., March 2023"
                    />
                    {validationErrors[index]?.dateObtained && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].dateObtained}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration Date (if applicable)
                    </label>
                    <input
                      type="text"
                      value={cert.expirationDate || ''}
                      onChange={(e) => updateCertification(index, { expirationDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., March 2026"
                    />
                    {validationErrors[index]?.expirationDate && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors[index].expirationDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={cert.credentialId || ''}
                      onChange={(e) => updateCertification(index, { credentialId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., ABC123XYZ789"
                    />
                    <p className="text-xs text-gray-500 mt-1">Include if provided by issuing organization</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification URL
                    </label>
                    <input
                      type="url"
                      value={cert.verificationUrl || ''}
                      onChange={(e) => updateCertification(index, { verificationUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://verify.example.com/credential/123"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link where employers can verify this certification</p>
                  </div>
                </div>

                {/* Certification Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={cert.status || 'valid'}
                    onChange={(e) => updateCertification(index, { status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="valid">Valid</option>
                    <option value="expired">Expired</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={cert.description || ''}
                    onChange={(e) => updateCertification(index, { description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of certification scope or key competencies..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: Add context about the certification's scope or requirements</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!resumeData?.certifications || resumeData.certifications.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No certifications added yet</h4>
          <p className="text-sm mb-4">Add your professional certifications and licenses to stand out</p>
          <button
            onClick={addCertification}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>
      )}

      {/* Certification Suggestions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-purple-900 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Suggested Certifications
          </h5>
          <div className="flex items-center space-x-2">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="text-sm border border-purple-300 rounded px-2 py-1 bg-white"
            >
              {Object.keys(certificationsByIndustry).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-purple-600 text-sm hover:text-purple-700"
            >
              {showSuggestions ? 'Hide' : 'Show'} ({filteredSuggestions.length})
            </button>
          </div>
        </div>
        
        {showSuggestions && (
          <div>
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg mb-3 text-sm"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestionCertification(suggestion.name, suggestion.category)}
                  className="text-left p-3 bg-white hover:bg-purple-50 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{suggestion.name}</div>
                  <div className="text-xs text-purple-600 capitalize">{suggestion.category}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certification Statistics */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Certifications Overview
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{(resumeData?.certifications || []).length}</div>
            <div className="text-xs text-gray-600">Total Certs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {(resumeData?.certifications || []).filter(c => c.status === 'valid').length}
            </div>
            <div className="text-xs text-gray-600">Valid</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.values(atsAnalysis).filter(a => a?.isRelevant).length}
            </div>
            <div className="text-xs text-gray-600">Relevant</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Object.values(atsAnalysis).filter(a => a?.hasVerification || a?.hasCredential).length}
            </div>
            <div className="text-xs text-gray-600">Verified</div>
          </div>
        </div>
      </div>

      {/* Tips Panel */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">🏆 Certification Best Practices</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Presentation Tips:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• List most relevant certifications first</li>
                  <li>• Include full official names</li>
                  <li>• Add credential IDs for verification</li>
                  <li>• Update expiration dates regularly</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Strategic Choices:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Prioritize industry-standard certifications</li>
                  <li>• Include safety/compliance requirements</li>
                  <li>• Show continuous learning commitment</li>
                  <li>• Match certifications to job requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </span>

        <button
          onClick={goToNextStep}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}