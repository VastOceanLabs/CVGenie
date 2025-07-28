import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, Lightbulb, BookOpen, ArrowLeft, ArrowRight, Users, Target, AlertCircle, CheckCircle, Shield, GripVertical, X, UserCheck, ClipboardCheck } from 'lucide-react';

// TypeScript interfaces
interface Reference {
  id?: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  yearsKnown: string;
  quality: keyof typeof referenceQuality;
  canContact: boolean;
  notes: string;
  linkedinUrl: string;
  preferredContact: 'email' | 'phone' | 'either';
}

interface ReferenceSectionProps {
  resumeData?: { 
    references?: Reference[];
    personalInfo?: { jobTitle?: string };
  };
  updateResumeData?: (section: string, data: any) => void;
  addArrayItem?: (section: string, item: any) => void;
  removeArrayItem?: (section: string, index: number) => void;
  updateArrayItem?: (section: string, index: number, data: any) => void;
  setShowPhraseLibrary?: (show: boolean) => void;
  goToNextStep?: () => void;
  goToPrevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

// Reference relationship types
const relationshipTypes = [
  { value: 'supervisor', label: 'Direct Supervisor' },
  { value: 'manager', label: 'Manager' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'client', label: 'Client' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'professor', label: 'Professor' },
  { value: 'coworker', label: 'Coworker' },
  { value: 'director', label: 'Director' },
  { value: 'hr', label: 'HR Representative' },
  { value: 'other', label: 'Other Professional Contact' }
];

// Reference quality indicators
const referenceQuality = {
  excellent: { label: 'Excellent', color: 'bg-green-100 text-green-700', description: 'Strong relationship, will provide glowing reference' },
  good: { label: 'Good', color: 'bg-blue-100 text-blue-700', description: 'Positive relationship, reliable reference' },
  neutral: { label: 'Neutral', color: 'bg-gray-100 text-gray-700', description: 'Professional relationship, factual reference' },
  unknown: { label: 'Unknown', color: 'bg-yellow-100 text-yellow-700', description: 'Uncertain about reference quality' }
};

// Industry-specific reference tips
const industryReferenceTips = {
  'Software Engineer': [
    'Include technical lead or senior engineer who can speak to your coding skills',
    'Product managers who can discuss your collaboration and project delivery',
    'Consider including open-source project maintainers if applicable'
  ],
  'Nurse': [
    'Include charge nurse or nursing supervisor from each major role',
    'Doctor or physician you worked closely with',
    'Patients\' family members (if appropriate and with permission)'
  ],
  'Marketing Manager': [
    'Include CMO or VP of Marketing who can speak to strategic thinking',
    'Sales team members who benefited from your campaigns',
    'Clients or agency partners you worked with directly'
  ],
  'Project Manager': [
    'Include stakeholders from successful project outcomes',
    'Team members you managed or led',
    'Executive sponsors who can speak to business impact'
  ],
  'Sales Representative': [
    'Include sales manager who can quantify your performance',
    'Long-term clients who trust your relationship-building',
    'Team members from collaborative deals'
  ],
  'Electrician': [
    'Include master electrician or supervisor',
    'General contractor or construction manager',
    'Safety officer who can vouch for your compliance record'
  ]
};

interface ReferenceSectionProps {
  resumeData?: { 
    references?: Reference[];
    personalInfo?: { jobTitle?: string };
  };
  updateResumeData?: (section: string, data: any) => void;
  addArrayItem?: (section: string, item: any) => void;
  removeArrayItem?: (section: string, index: number) => void;
  updateArrayItem?: (section: string, index: number, data: any) => void;
  setShowPhraseLibrary?: (show: boolean) => void;
  goToNextStep?: () => void;
  goToPrevStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function ReferencesSection({ 
  resumeData = { references: [] }, 
  updateResumeData = () => {}, 
  addArrayItem = () => {}, 
  removeArrayItem = () => {}, 
  updateArrayItem = () => {},
  setShowPhraseLibrary = () => {},
  goToNextStep = () => {},
  goToPrevStep = () => {},
  currentStep = 0,
  totalSteps = 1
}: ReferenceSectionProps) {
  const [showHelper, setShowHelper] = useState(false);
  const [showAvailableUponRequest, setShowAvailableUponRequest] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, any>>({});
  const [atsAnalysis, setAtsAnalysis] = useState({ score: 0, hasReferences: false, quality: 'none' });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Get user's job title for industry-specific tips
  const userJobTitle = resumeData?.personalInfo?.jobTitle || 'Professional';
  const industryTips = industryReferenceTips[userJobTitle] || industryReferenceTips['Software Engineer'];

  // Validation function
  const validateReference = useCallback((reference: Reference, index: number) => {
    const errors: Record<string, string> = {};
    
    if (!reference.name?.trim()) errors.name = 'Reference name is required';
    if (!reference.title?.trim()) errors.title = 'Job title is required';
    if (!reference.company?.trim()) errors.company = 'Company name is required';
    if (!reference.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reference.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!reference.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\(\)\+\.]{10,}$/.test(reference.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!reference.relationship?.trim()) errors.relationship = 'Professional relationship is required';
    
    setValidationErrors(prev => ({ ...prev, [index]: errors }));
    return Object.keys(errors).length === 0;
  }, []);

  // ATS Analysis for references
  const analyzeReferencesATS = useCallback(() => {
    const references = resumeData?.references || [];
    let score = 0;
    let quality = 'none';
    
    if (references.length === 0) {
      score = showAvailableUponRequest ? 85 : 60; // "Available upon request" is better than nothing
      quality = showAvailableUponRequest ? 'statement' : 'none';
    } else if (references.length >= 3) {
      score = 95; // Ideal number of references
      quality = 'complete';
    } else if (references.length >= 2) {
      score = 88; // Good number
      quality = 'good';
    } else {
      score = 75; // Minimal but acceptable
      quality = 'minimal';
    }

    // Bonus points for quality indicators
    const hasDirectSupervisor = references.some(ref => 
      ref.relationship === 'supervisor' || ref.relationship === 'manager'
    );
    const hasVariedRelationships = new Set(references.map(ref => ref.relationship)).size >= 2;
    const hasRecentContacts = references.some(ref => {
      const years = Number.parseInt(ref.yearsKnown, 10);
      return !Number.isNaN(years) && years <= 2;
    });

    if (hasDirectSupervisor) score += 3;
    if (hasVariedRelationships) score += 2;
    if (hasRecentContacts) score += 2;

    setAtsAnalysis({
      score: Math.min(100, score),
      hasReferences: references.length > 0,
      quality
    });
  }, [resumeData?.references, showAvailableUponRequest]);

  // Add new reference with unique ID
  const addReference = useCallback(() => {
    const newReference: Reference = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      yearsKnown: '',
      quality: 'good',
      canContact: true,
      notes: '',
      linkedinUrl: '',
      preferredContact: 'email'
    };
    addArrayItem('references', newReference);
    setExpandedIndex((resumeData?.references || []).length);
  }, [addArrayItem, resumeData?.references]);

  // Remove reference
  const removeReference = useCallback((index: number) => {
    removeArrayItem('references', index);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  }, [removeArrayItem, expandedIndex]);

  // Update reference
  const updateReference = useCallback((index: number, field: string, value: string | boolean) => {
    updateArrayItem('references', index, { [field]: value });
    
    // Validate after update
    const reference = resumeData?.references?.[index];
    if (reference) {
      const updatedReference = { ...reference, [field]: value };
      setTimeout(() => validateReference(updatedReference, index), 0);
    }
  }, [updateArrayItem, resumeData?.references, validateReference]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const references = resumeData?.references || [];
    const newReferences = [...references];
    const draggedItem = newReferences[draggedIndex];
    newReferences.splice(draggedIndex, 1);
    newReferences.splice(dropIndex, 0, draggedItem);
    
    updateResumeData('references', newReferences);
    setDraggedIndex(null);
  }, [draggedIndex, resumeData?.references, updateResumeData]);

  // Toggle expanded reference with validation
  const toggleExpanded = useCallback((index: number) => {
    const newIndex = expandedIndex === index ? null : index;
    
    // Validate when closing
    if (expandedIndex === index && resumeData?.references?.[index]) {
      validateReference(resumeData.references[index], index);
    }
    
    setExpandedIndex(newIndex);
  }, [expandedIndex, resumeData?.references, validateReference]);

  // Run analysis when references change
  useEffect(() => {
    analyzeReferencesATS();
  }, [resumeData?.references, showAvailableUponRequest]);

  const references = resumeData?.references || [];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Professional References</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add 2-3 professional contacts who can speak positively about your work
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowHelper(!showHelper)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Reference Tips</span>
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-blue-900 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            References ATS Score: {atsAnalysis.score}%
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-700 font-medium mb-1">Status:</p>
            <p className="text-blue-600">
              {atsAnalysis.quality === 'complete' && '✓ Excellent - 3+ references'}
              {atsAnalysis.quality === 'good' && '✓ Good - 2+ references'}
              {atsAnalysis.quality === 'minimal' && '⚠ Minimal - consider adding more'}
              {atsAnalysis.quality === 'statement' && '✓ Statement provided'}
              {atsAnalysis.quality === 'none' && '⚠ No references listed'}
            </p>
          </div>
          <div>
            <p className="text-blue-700 font-medium mb-1">Recommendation:</p>
            <p className="text-blue-600">
              {references.length === 0 ? 'Add 2-3 professional references' :
               references.length < 2 ? 'Add 1-2 more references' :
               references.length >= 3 ? 'Excellent coverage' : 'Consider one more reference'}
            </p>
          </div>
          <div>
            <p className="text-blue-700 font-medium mb-1">Best Practice:</p>
            <p className="text-blue-600">Include supervisor + colleague</p>
          </div>
        </div>
      </div>

      {/* Reference Helper */}
      {showHelper && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-3 flex items-center">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Reference Best Practices for {userJobTitle}:
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800 mb-2">Who to Include:</p>
              <ul className="text-green-700 space-y-1">
                {industryTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800 mb-2">General Guidelines:</p>
              <ul className="text-green-700 space-y-1">
                <li>• Ask permission before listing someone</li>
                <li>• Provide them with your updated resume</li>
                <li>• Include direct supervisors when possible</li>
                <li>• Mix different types of relationships</li>
                <li>• Keep contact information current</li>
                <li>• Give references a heads up when applying</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Available Upon Request Option */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showAvailableUponRequest}
                onChange={(e) => setShowAvailableUponRequest(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900">Show "References available upon request"</span>
                <p className="text-sm text-gray-600">Alternative to listing specific references</p>
              </div>
            </label>
          </div>
          <Shield className="w-5 h-5 text-gray-400" />
        </div>
        
        {showAvailableUponRequest && (
          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> While this is acceptable, providing actual references is often preferred by employers 
              as it shows transparency and confidence in your professional relationships.
            </p>
          </div>
        )}
      </div>

      {/* Add Reference Button */}
      {!showAvailableUponRequest && (
        <button
          onClick={addReference}
          className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600 font-medium">Add Professional Reference</span>
        </button>
      )}

      {/* References List */}
      {!showAvailableUponRequest && (
        <div className="space-y-4">
          {references.map((reference, index) => {
            const qualityConfig = referenceQuality[reference.quality] ?? referenceQuality.good;
            const hasErrors = validationErrors[index] && Object.keys(validationErrors[index]).length > 0;
            
            return (
              <div 
                key={reference.id || `reference-${index}`}
                className={`border border-gray-200 rounded-lg overflow-hidden ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Reference Header */}
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-center space-x-3">
                    <GripVertical 
                      className="w-4 h-4 text-gray-400 cursor-move" 
                      role="button"
                      aria-label="Drag to reorder reference"
                      tabIndex={0}
                    />
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {reference.name || 'Reference Name'} 
                          {reference.title && ` - ${reference.title}`}
                        </h4>
                        {hasErrors && (
                          <AlertCircle className="w-4 h-4 text-red-500" aria-label="Has validation errors" />
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${qualityConfig.color}`}>
                          {qualityConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {reference.company} • {reference.relationship}
                        {reference.yearsKnown && ` • Known for ${reference.yearsKnown} years`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeReference(index);
                      }}
                      className="text-red-600 hover:text-red-700 p-1"
                      aria-label="Remove reference"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reference Details */}
                {expandedIndex === index && (
                  <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`name-${index}`}
                          type="text"
                          value={reference.name || ''}
                          onChange={(e) => updateReference(index, 'name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors[index]?.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., John Smith"
                          aria-required="true"
                          aria-invalid={!!validationErrors[index]?.name}
                          aria-describedby={validationErrors[index]?.name ? `name-error-${index}` : undefined}
                        />
                        {validationErrors[index]?.name && (
                          <p id={`name-error-${index}`} className="text-red-500 text-xs mt-1" role="alert">
                            {validationErrors[index].name}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`title-${index}`}
                          type="text"
                          value={reference.title || ''}
                          onChange={(e) => updateReference(index, 'title', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors[index]?.title ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Senior Manager"
                          aria-required="true"
                          aria-invalid={!!validationErrors[index]?.title}
                        />
                        {validationErrors[index]?.title && (
                          <p className="text-red-500 text-xs mt-1" role="alert">{validationErrors[index].title}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`company-${index}`}
                          type="text"
                          value={reference.company || ''}
                          onChange={(e) => updateReference(index, 'company', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors[index]?.company ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Tech Company Inc."
                          aria-required="true"
                          aria-invalid={!!validationErrors[index]?.company}
                        />
                        {validationErrors[index]?.company && (
                          <p className="text-red-500 text-xs mt-1" role="alert">{validationErrors[index].company}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`relationship-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Relationship <span className="text-red-500">*</span>
                        </label>
                        <select
                          id={`relationship-${index}`}
                          value={reference.relationship || ''}
                          onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors[index]?.relationship ? 'border-red-300' : 'border-gray-300'
                          }`}
                          aria-required="true"
                          aria-invalid={!!validationErrors[index]?.relationship}
                        >
                          <option value="">Select relationship</option>
                          {relationshipTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        {validationErrors[index]?.relationship && (
                          <p className="text-red-500 text-xs mt-1" role="alert">{validationErrors[index].relationship}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`email-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`email-${index}`}
                          type="email"
                          value={reference.email || ''}
                          onChange={(e) => updateReference(index, 'email', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors[index]?.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="john.smith@company.com"
                          aria-required="true"
                          aria-invalid={!!validationErrors[index]?.email}
                        />
                        {validationErrors[index]?.email && (
                          <p className="text-red-500 text-xs mt-1" role="alert">{validationErrors[index].email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`phone-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id={`phone-${index}`}
                          type="tel"
                          value={reference.phone || ''}
                          onChange={(e) => updateReference(index, 'phone', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors[index]?.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="(555) 123-4567"
                          aria-required="true"
                          aria-invalid={!!validationErrors[index]?.phone}
                        />
                        {validationErrors[index]?.phone && (
                          <p className="text-red-500 text-xs mt-1" role="alert">{validationErrors[index].phone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor={`linkedin-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn Profile (Optional)
                        </label>
                        <input
                          id={`linkedin-${index}`}
                          type="url"
                          value={reference.linkedinUrl || ''}
                          onChange={(e) => updateReference(index, 'linkedinUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://linkedin.com/in/john-smith"
                        />
                      </div>

                      <div>
                        <label htmlFor={`years-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Years Known
                        </label>
                        <select
                          id={`years-${index}`}
                          value={reference.yearsKnown || ''}
                          onChange={(e) => updateReference(index, 'yearsKnown', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select duration</option>
                          <option value="<1">Less than 1 year</option>
                          <option value="1-2">1-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5+">5+ years</option>
                        </select>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor={`quality-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Reference Quality
                        </label>
                        <select
                          id={`quality-${index}`}
                          value={reference.quality || 'good'}
                          onChange={(e) => updateReference(index, 'quality', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Object.entries(referenceQuality).map(([key, config]) => (
                            <option key={key} value={key}>{config.label} - {config.description}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor={`preferred-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Contact Method
                        </label>
                        <select
                          id={`preferred-${index}`}
                          value={reference.preferredContact || 'email'}
                          onChange={(e) => updateReference(index, 'preferredContact', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="either">Either Email or Phone</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`canContact-${index}`}
                          checked={reference.canContact !== false}
                          onChange={(e) => updateReference(index, 'canContact', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`canContact-${index}`} className="text-sm text-gray-700">
                          You may contact this reference immediately
                        </label>
                      </div>

                      <div>
                        <label htmlFor={`notes-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Private Notes (Not shown on resume)
                        </label>
                        <textarea
                          id={`notes-${index}`}
                          value={reference.notes || ''}
                          onChange={(e) => updateReference(index, 'notes', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Last contacted: mm/dd/yyyy, Key projects worked on together, etc."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {references.length === 0 && !showAvailableUponRequest && (
        <div className="text-center py-12 text-gray-500">
          <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No references added yet</h4>
          <p className="text-sm mb-4">Add 2-3 professional contacts who can speak positively about your work</p>
          <button
            onClick={addReference}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Reference</span>
          </button>
        </div>
      )}

      {/* Reference Statistics */}
      {(references.length > 0 || showAvailableUponRequest) && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h5 className="font-medium text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            References Summary
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {showAvailableUponRequest ? 'Statement' : references.length}
              </div>
              <div className="text-xs text-gray-600">
                {showAvailableUponRequest ? 'Available upon request' : 'References Listed'}
              </div>
            </div>
            {!showAvailableUponRequest && (
              <>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {references.filter(ref => ref.relationship === 'supervisor' || ref.relationship === 'manager').length}
                  </div>
                  <div className="text-xs text-gray-600">Supervisors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {references.filter(ref => ref.quality === 'excellent').length}
                  </div>
                  <div className="text-xs text-gray-600">Excellent Quality</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{atsAnalysis.score}%</div>
                  <div className="text-xs text-gray-600">ATS Score</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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